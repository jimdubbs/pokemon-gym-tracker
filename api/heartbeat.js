module.exports = function (server, PokeioCollection, pokemon, firebase) {
    var s2 = require('s2geometry-node');

    var db = firebase.database();
    var ref = db.ref("pokemon");
    var POGOProtos = require('node-pogo-protos');

    setTimeout(function () {

        console.log('first iteration');
        ref.child('gyms').once('value').then(function (snapshot) {
            var gyms = snapshot.val();
            console.log('we in the heartbeat');

            var gymKeys = Object.keys(gyms);

            numberOfGyms = gymKeys.length;
            //console.log(gymKeys);
            var startingIndex = 0;
            var interval = setInterval(function () {
                if (startingIndex > numberOfGyms) {
                    console.log('FINISHED THE INITIAL LOOP. BREAKING');
                    clearInterval(interval);
                }

                var gym = gyms[gymKeys[startingIndex]];
                if (gym) {


                    //var client = PokeioCollection[Math.floor(Math.random() * PokeioCollection.length )];

                    var lat = gym.gym_state.fort_data.latitude;
                    var long = gym.gym_state.fort_data.longitude;
                    var clientObj = getClient(lat, long);
                    
                    if (clientObj) {
                        var client = clientObj.client;
                        var cellIDs = getCellIDs(10, lat, long);
                        console.log('pulling gym: ' + gym.name + '  -  Client name: ' + clientObj.name);
                    
                        client.setPosition(lat, long);
                        client.getMapObjects(cellIDs, Array(cellIDs.length).fill(0))
                            .then(mapObjects => {

                                client.getGymDetails(gym.gym_state.fort_data.id, lat, long)
                                    .then(function (data) {
                                        console.log('got Gym details:' + data.gym_state.fort_data.id);
                                        var refTest = db.ref('pokemon/gyms');
                                        refTest.orderByChild("gym_state/fort_data/id").equalTo(gym.gym_state.fort_data.id).once("value", function (snapshot) {
                                            if (snapshot.val() !== null) {
                                                try {
                                                    //snapshot.update(data);
                                                    var id = Object.keys(snapshot.val())[0];
                                                    var gymRef = db.ref('pokemon/gyms/' + id);
                                                    data.gym_state.fort_data.team = getEnumKeyByValue(POGOProtos.Enums.TeamColor, data.gym_state.fort_data.owned_by_team);
                                                    data.lastUpdate = new Date();
                                                    gymRef.update(data);
                                                }
                                                catch (exception) { console.log(exception) }
                                            }
                                            else {
                                                console.log('we didnt find a db record for ' + gym.gym_state.fort_data.id);
                                            }
                                        });
                                    },function(error){
                                        console.log('promise was rejected');
                                        console.log(error);
                                    });
                            });

                    }
                    else {
                        console.log('didnt find a client for ' + gym.name);
                    }

                }
                startingIndex++;

            }, 13000)

        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
    }, 40000);

    setInterval(function () {
        console.log('first big interval');

        ref.child('gyms').once('value').then(function (snapshot) {
            var gyms = snapshot.val();
            console.log('we in the heartbeat');ß

            var gymKeys = Object.keys(gyms);

            numberOfGyms = gymKeys.length;
            //console.log(gymKeys);
            var startingIndex = 0;
            var loop = setInterval(function () {
                if (startingIndex > numberOfGyms) {
                    console.log('FINISHED INTERATION, STOPPING');
                    clearInterval(loop);
                }

                var gym = gyms[gymKeys[startingIndex]];
                if (gym) {


                    //var client = PokeioCollection[Math.floor(Math.random() * PokeioCollection.length )];

                    var lat = gym.gym_state.fort_data.latitude;
                    var long = gym.gym_state.fort_data.longitude;
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
                                        var refTest = db.ref('pokemon/gyms');
                                        refTest.orderByChild("gym_state/fort_data/id").equalTo(gym.gym_state.fort_data.id).once("value", function (snapshot) {
                                            if (snapshot.val() !== null) {
                                                try {
                                                    //snapshot.update(data);
                                                    
                                                    var id = Object.keys(snapshot.val())[0];
                                                    var gymRef = db.ref('pokemon/gyms/' + id);
                                                    data.gym_state.fort_data.team = getEnumKeyByValue(POGOProtos.Enums.TeamColor, gym.gym_state.fort_data.owned_by_team);
                                                    data.lastUpdate = new Date();
                                                    gymRef.update(data);
                                                }
                                                catch (exception) { console.log(exception) }
                                            }
                                        });
                                    });
                            });

                    }
                    else {
                        console.log('didnt find a client for ' + gym.name);
                    }


                }
                startingIndex++;

            }, 13000)

        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });

    }, 900000)






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