module.exports = function (server, PokeioCollection, pokemon, firebase) {
    var s2 = require('s2geometry-node');

    var db = firebase.database();
    var ref = db.ref("pokemon");
    var POGOProtos = require('node-pogo-protos');

    setTimeout(function () {
        var manuelsClient = getClientByName('manuels');
        var holyroodClient = getClientByName('holyrood');
        var poolAllSaintsClient = getClientByName('pool-allsaints');
        var marinaClient = getClientByName('marina');
        var nedsClient = getClientByName('neds');
        var bistroClient = getClientByName('bistro');
        var topsailChurchClient = getClientByName('topsail-church');
        var paradiseRecClient = getClientByName('Paradise-Rec');
        var holyFamilyChurchClient = getClientByName('Holy-Family-Church');


        ref.child('gyms').once('value').then(function (snapshot) {
            var gyms = snapshot.val();

            var gymKeys = Object.keys(gyms);

            numberOfGyms = gymKeys.length;

            for (startingIndex = 0; startingIndex < numberOfGyms; startingIndex++) {
                var gym = gyms[gymKeys[startingIndex]];
                if (gym) {

                    try {


                        if (gym.gym_state.fort_data.latitude >= manuelsClient.latRange[0] && gym.gym_state.fort_data.latitude <= manuelsClient.latRange[1] &&
                            gym.gym_state.fort_data.longitude >= manuelsClient.longRange[0] && gym.gym_state.fort_data.longitude <= manuelsClient.longRange[1]) {
                            manuelsClient.gyms.push(gym);
                        }

                        if (gym.gym_state.fort_data.latitude >= holyroodClient.latRange[0] && gym.gym_state.fort_data.latitude <= holyroodClient.latRange[1] &&
                            gym.gym_state.fort_data.longitude >= holyroodClient.longRange[0] && gym.gym_state.fort_data.longitude <= holyroodClient.longRange[1]) {
                            holyroodClient.gyms.push(gym);
                        }

                        if (gym.gym_state.fort_data.latitude >= poolAllSaintsClient.latRange[0] && gym.gym_state.fort_data.latitude <= poolAllSaintsClient.latRange[1] &&
                            gym.gym_state.fort_data.longitude >= poolAllSaintsClient.longRange[0] && gym.gym_state.fort_data.longitude <= poolAllSaintsClient.longRange[1]) {
                            poolAllSaintsClient.gyms.push(gym);
                        }

                        if (gym.gym_state.fort_data.latitude >= marinaClient.latRange[0] && gym.gym_state.fort_data.latitude <= marinaClient.latRange[1] &&
                            gym.gym_state.fort_data.longitude >= marinaClient.longRange[0] && gym.gym_state.fort_data.longitude <= marinaClient.longRange[1]) {
                            marinaClient.gyms.push(gym);
                        }

                        if (gym.gym_state.fort_data.latitude >= nedsClient.latRange[0] && gym.gym_state.fort_data.latitude <= nedsClient.latRange[1] &&
                            gym.gym_state.fort_data.longitude >= nedsClient.longRange[0] && gym.gym_state.fort_data.longitude <= nedsClient.longRange[1]) {
                            nedsClient.gyms.push(gym);
                        }

                        if (gym.gym_state.fort_data.latitude >= bistroClient.latRange[0] && gym.gym_state.fort_data.latitude <= bistroClient.latRange[1] &&
                            gym.gym_state.fort_data.longitude >= bistroClient.longRange[0] && gym.gym_state.fort_data.longitude <= bistroClient.longRange[1]) {
                            bistroClient.gyms.push(gym);
                        }

                        if (gym.gym_state.fort_data.latitude >= topsailChurchClient.latRange[0] && gym.gym_state.fort_data.latitude <= topsailChurchClient.latRange[1] &&
                            gym.gym_state.fort_data.longitude >= topsailChurchClient.longRange[0] && gym.gym_state.fort_data.longitude <= topsailChurchClient.longRange[1]) {
                            topsailChurchClient.gyms.push(gym);
                        }

                        if (gym.gym_state.fort_data.latitude >= paradiseRecClient.latRange[0] && gym.gym_state.fort_data.latitude <= paradiseRecClient.latRange[1] &&
                            gym.gym_state.fort_data.longitude >= paradiseRecClient.longRange[0] && gym.gym_state.fort_data.longitude <= paradiseRecClient.longRange[1]) {
                            paradiseRecClient.gyms.push(gym);
                        }

                        if (gym.gym_state.fort_data.latitude >= holyFamilyChurchClient.latRange[0] && gym.gym_state.fort_data.latitude <= holyFamilyChurchClient.latRange[1] &&
                            gym.gym_state.fort_data.longitude >= holyFamilyChurchClient.longRange[0] && gym.gym_state.fort_data.longitude <= holyFamilyChurchClient.longRange[1]) {
                            holyFamilyChurchClient.gyms.push(gym);
                        }
                    }
                    catch (exception) {
                        console.log(exception);
                    }



                }
            }


            //testing

            setInterval(function () {
                console.log('manuels heartbeat');
                var client = manuelsClient.client;
                var cellIDs = getCellIDs(10, manuelsClient.latitude, manuelsClient.longitude);
                client.setPosition(manuelsClient.latitude, manuelsClient.longitude);
                client.getMapObjects(cellIDs, Array(cellIDs.length).fill(0))
                    .then(mapObjects => {
                        console.log('heartbeat finished');
                        client.batchStart();
                        manuelsClient.gyms.forEach(function (gym) {
                            client.getGymDetails(gym.gym_state.fort_data.id, gym.gym_state.fort_data.latitude, gym.gym_state.fort_data.longitude)
                        });

                        return client.batchCall();
                    })
                    .then(function (data) {
                        data.forEach(function (gym) {
                            var refTest = db.ref('pokemon/gyms');
                            refTest.orderByChild("gym_state/fort_data/id").equalTo(gym.gym_state.fort_data.id).once("value", function (snapshot) {
                                if (snapshot.val() !== null) {
                                    try {
                                        //snapshot.update(data);

                                        var id = Object.keys(snapshot.val())[0];
                                        var gymRef = db.ref('pokemon/gyms/' + id);
                                        gym.gym_state.fort_data.team = getEnumKeyByValue(POGOProtos.Enums.TeamColor, gym.gym_state.fort_data.owned_by_team);
                                        gym.lastUpdate = new Date();
                                        gymRef.update(gym);
                                    }
                                    catch (exception) { console.log(exception) }
                                }
                            });
                        });
                    });
            }, 20000)


        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });




    }, 10000);



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

    function getClientByName(name) {
        var result = PokeioCollection.filter(function (poke) {
            return poke.name == name;
        });


        if (result.length == 1) {
            return result[0];
        }
        else {
            return null;
        }
    }

}