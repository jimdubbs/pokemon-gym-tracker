module.exports = function (server, PokeioCollection, gymLocations, pokemon, firebase) {
    var s2 = require('s2geometry-node');

    var db = firebase.database();
    var ref = db.ref("pokemon");
    var POGOProtos = require('node-pogo-protos');

    server.get('/api/getGyms', function (req, res, next) {
        console.log('returning gym list');

        ref.child('gyms').once('value').then(function (snapshot) {
            var gyms = snapshot.val();

            for (var gym in gyms) {
                if (gyms.hasOwnProperty(gym)) {

                    gyms[gym].gym_state.fort_data.guardPokemon = getPokemon(gyms[gym].gym_state.fort_data.guard_pokemon_id);
                    
                    gyms[gym].gym_state.memberships.forEach(function(g){
                         g.pokemon_data.pokemon = getPokemon(g.pokemon_data.pokemon_id);
                    });

                }
            }


            res.json(gyms);
            // ...
        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });


    });

    server.post('/api/getGymDetails', function (req, res, next) {
        console.log('trying to get gym details');
        var gym = req.body.gym;
        console.log(gym);
        getGymData(gym.coords.latitude, gym.coords.longitude)
            .then(function (data) {
                res.json(data);
            });

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
        var client = PokeioCollection[0];
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
                    console.log(gyms.gym_state.fort_data.id);
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

                res.json(gyms);
            }, function (data) {
                console.log('was rejected');

                console.log(data);
                res.json({})
            })
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

}