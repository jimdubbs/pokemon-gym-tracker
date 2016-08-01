module.exports = function (server, PokeioCollection, pokemon, firebase) {
    var s2 = require('s2geometry-node');

    var db = firebase.database();
    var ref = db.ref("pokemon");
    var POGOProtos = require('node-pogo-protos');

    server.get('/api/getGyms', function (req, res, next) {
        console.log('returning gym list');

        ref.child('gyms').once('value').then(function (snapshot) {
            var gyms = snapshot.val();

            try {


                for (var gym in gyms) {
                    if (gyms.hasOwnProperty(gym)) {

                        gyms[gym].gym_state.fort_data.guardPokemon = getPokemon(gyms[gym].gym_state.fort_data.guard_pokemon_id);

                        gyms[gym].gym_state.memberships.forEach(function (g) {
                            g.pokemon_data.pokemon = getPokemon(g.pokemon_data.pokemon_id);
                        });

                    }
                }
            }
            catch (ex) {
                console.log(ex);
            }

            res.json(gyms);
            // ...
        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });


    });

    server.post('/api/updateGymDetails', function (req, res, next) {
        console.log('trying to update gym details');
        var gym = req.body.gym;
        console.log(gym);

        var lat = gym.gym_state.fort_data.latitude;
        var long = gym.gym_state.fort_data.longitude;

        console.log(lat);
        console.log(long);
        var clientObj = getClient(lat, long);

        if (clientObj) {
            var client = clientObj.client;
            var cellIDs = getCellIDs(10, lat, long);
            console.log('pulling gym: ' + gym.name + '  -  Client name: ' + clientObj.name);

            client.setPosition(lat, long);
            client.getMapObjects(cellIDs, Array(cellIDs.length).fill(0))
                .then(mapObjects => {
                    console.log('heartbeat done');

                    client.getGymDetails(gym.gym_state.fort_data.id, lat, long)
                        .then(function (data) {
                            console.log('got Gym details:' + data.gym_state.fort_data.id);
                            var refTest = db.ref('pokemon/gyms');
                            refTest.orderByChild("gym_state/fort_data/id").equalTo(gym.gym_state.fort_data.id).once("value", function (snapshot) {
                                if (snapshot.val() !== null) {
                                    console.log('we found a db record for ' + gym.gym_state.fort_data.id);
                                    try {
                                        //snapshot.update(data);
                                        console.log(Object.keys(snapshot.val())[0]);
                                        var id = Object.keys(snapshot.val())[0];
                                        var gymRef = db.ref('pokemon/gyms/' + id);
                                        data.gym_state.fort_data.team = getEnumKeyByValue(POGOProtos.Enums.TeamColor, data.gym_state.fort_data.owned_by_team);
                                        data.lastUpdate = new Date();
                                        gymRef.update(data);

                                        res.json(data)
                                    }
                                    catch (exception) { console.log(exception) }
                                }
                                else {
                                    console.log('we didnt find a db record for ' + gym.gym_state.fort_data.id);
                                }
                            });
                        }, function (error) {
                            console.log('promise was rejected');
                            console.log(error);
                        });
                });

        }
        else {
            console.log('didnt find a client for ' + gym.name);
        }

    });

    server.get('/api/getPokemon/:id', function (req, res, next) {
        console.log('trying to get pokemon');
        var id = req.params.id;
        var pokemon = getPokemon(id);
        console.log(pokemon);
        res.json(pokemon);

    });

    server.post('/api/heartbeat', function (req, res, next) {
        console.log('heartbeat!');
        var lat = req.body.lat;
        var long = req.body.long;

        var location = {
            type: 'coords',
            coords: { latitude: lat, longitude: long, altitude: 18 }
        };

        //var client = PokeioCollection[Math.floor(Math.random() * PokeioCollection.length)];
        var client = PokeioCollection[2];
        var cellIDs = getCellIDs(10, lat, long);
        client.setPosition(lat, long);
        client.getMapObjects(cellIDs, Array(cellIDs.length).fill(0))
            .then(mapObjects => {
                client.batchStart();

                mapObjects.map_cells.map(cell => cell.forts)
                    .reduce((a, b) => a.concat(b))
                    .filter(fort => fort.type === 0)
                    .forEach(fort => client.getGymDetails(fort.id, fort.latitude, fort.longitude));

                return client.batchCall();
            })
            .then(gyms => {

                var gymRef = ref.child('gyms');
                if (Array.isArray(gyms)) {
                    console.log('is array');
                    gyms.forEach(function (gym) {
                        var refTest = db.ref('pokemon/gyms');
                        refTest.orderByChild("gym_state/fort_data/id").equalTo(gym.gym_state.fort_data.id).once("value", function (snapshot) {
                            if (snapshot.val() == null) {
                                console.log('pushing new gym');

                                gym.gym_state.fort_data.team = getEnumKeyByValue(POGOProtos.Enums.TeamColor, gym.gym_state.fort_data.owned_by_team)
                                gymRef.push(gym);
                            }
                        });

                    });
                }
                else {
                    console.log('just an obj');
                    console.log(gyms);
                    if (gyms.gym_state) {
                        var refTest = db.ref('pokemon/gyms');
                        refTest.orderByChild("gym_state/fort_data/id").equalTo(gyms.gym_state.fort_data.id).once("value", function (snapshot) {
                            console.log('snapshot val:');
                            console.log(snapshot.val());
                            if (snapshot.val() == null) {
                                console.log('pushing new gym');
                                gyms.gym_state.fort_data.team = getEnumKeyByValue(POGOProtos.Enums.TeamColor, gyms.gym_state.fort_data.owned_by_team)
                                gymRef.push(gyms);
                            }
                        });
                    }
                }

                res.json(gyms);
            }, function (data) {
                console.log('was rejected');

                console.log(data);
                res.json({})
            })
            .catch(console.error);


    });


    server.post('/api/pokeHeartbeat', function (req, res, next) {
        console.log('heartbeat!');
        var lat = req.body.lat;
        var long = req.body.long;

        var location = {
            type: 'coords',
            coords: { latitude: lat, longitude: long, altitude: 18 }
        };

        //var client = PokeioCollection[Math.floor(Math.random() * PokeioCollection.length)];
        var client = PokeioCollection[2];
        var cellIDs = getCellIDs(10, lat, long);
        client.setPosition(lat, long);
        client.getMapObjects(cellIDs, Array(cellIDs.length).fill(0))
            .then(mapObjects => {
                var pokemons = [];
                if (mapObjects.map_cells) {
                    mapObjects.map_cells.forEach(function (cell) {
                        if (cell.wild_pokemons.length > 0) {
                            console.log('we found one');
                            console.log(cell.wild_pokemons);
                            cell.wild_pokemons.forEach(function (poke) {
                                console.log(poke);
                                poke.pokemon_data.pokemon = getPokemon(poke.pokemon_data.pokemon_id);
                                pokemons.push(poke);
                            })
                        }
                    });
                }
                res.json(pokemons);
                // mapObjects.map_cells.map(cell => cell.forts)
                //     .reduce((a, b) => a.concat(b))
                //     .filter(fort => fort.type === 0)
                //     .forEach(fort => client.getGymDetails(fort.id, fort.latitude, fort.longitude));

                //return client.batchCall();
            })
            // .then(gyms => {


            // })
            .catch(console.error);


    });


    function getTeamName(teamId) {
        switch (teamId) {
            case 1:
                return 'Mystic';
            case 2:
                return 'Valor'
            case 3:
                return 'Instinct'
        }
    }

    function getPokemon(id) {

        var result = pokemon.filter(function (poke) {

            return poke.id == id;
        })

        return result[0];
    }

    function getCellIDs(radius, lat, lng) {
        var cell = new s2.S2CellId(new s2.S2LatLng(lat, lng)),
            parentCell = cell.parent(15),
            prevCell = parentCell.prev(),
            nextCell = parentCell.next(),
            cellIDs = [parentCell.id()];

        for (var i = 0; i < radius; i++) {
            cellIDs.unshift(prevCell.id());
            cellIDs.push(nextCell.id());
            prevCell = prevCell.prev();
            nextCell = nextCell.next();
        }

        return cellIDs;
    }

    function getEnumKeyByValue(enumObj, val) {
        for (var key of Object.keys(enumObj)) {
            if (enumObj[key] === val) return key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
        }
        return null;
    }

    function getClient(lat, long) {
        var result = PokeioCollection.filter(function (poke) {

            return lat >= poke.latRange[0] && lat <= poke.latRange[1] &&
                long >= poke.longRange[0] && long <= poke.longRange[1];
        });


        if (result.length == 1) {
            return result[0];
        }
        else {
            return null;
        }
    }

}