module.exports = function (server, PokeioCollection, gymLocations, pokemon, firebase) {
    var s2 = require('s2geometry-node');

    var db = firebase.database();
    var ref = db.ref("pokemon");
    var POGOProtos = require('node-pogo-protos');


    ref.child('gyms').once('value').then(function (snapshot) {
        var gyms = snapshot.val();
        console.log('we in the heartbeat');

        var gymKeys = Object.keys(gyms);

        numberOfGyms = gymKeys.length;
        //console.log(gymKeys);
        var startingIndex = 0;
        setInterval(function () {
            if (startingIndex > numberOfGyms) {
                startingIndex = 0;
            }

            var gym = gyms[gymKeys[startingIndex]];
            if (gym) {


                var client = PokeioCollection[Math.floor(Math.random() * PokeioCollection.length)];

                var lat = gym.gym_state.fort_data.latitude;
                var long = gym.gym_state.fort_data.longitude;
                var cellIDs = getCellIDs(10, lat, long);
                console.log('pulling gym: ' + gym.gym_state.fort_data.id);
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
                                            console.log(Object.keys(snapshot.val())[0]);
                                            var id = Object.keys(snapshot.val())[0];
                                            var gymRef = db.ref('pokemon/gyms/' + id);
                                            data.gym_state.fort_data.team = getEnumKeyByValue(POGOProtos.Enums.TeamColor, gym.gym_state.fort_data.owned_by_team)
                                            gymRef.update(data);
                                        }
                                        catch (exception) { console.log(exception) }
                                    }
                                });
                            });
                    });

            }
            startingIndex++;

        }, 10000)
        //console.log(gym[1]);
        // for (var gym in gyms) {
        //     if (gyms.hasOwnProperty(gym)) {

        //         var client = PokeioCollection[Math.floor(Math.random() * PokeioCollection.length)];
        //         //client.setPosition(gyms[gym].gym_state.fort_data.latitude, gyms[gym].gym_state.fort_data.longitude);
        //         client.getGymDetails(gyms[gym].gym_state.fort_data.id, gyms[gym].gym_state.fort_data.latitude, gyms[gym].gym_state.fort_data.longitude)
        //             .then(function(data){
        //                console.log(data); 
        //             });


        //     }
        // }


        // PokeioCollection[0].batchCall()
        //     .then(function(gyms){
        //        console.log('client 1 batch'); 
        //        console.log(gyms);
        //     });

        // PokeioCollection[1].batchCall()
        //     .then(function(gyms){
        //        console.log('client 2 batch'); 
        //        console.log(gyms);
        //     });

        // ...
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
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