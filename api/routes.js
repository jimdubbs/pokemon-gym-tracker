module.exports = function (server, Pokeio, gymLocations, pokemon,pokeCred) {

    server.get('/api/getGyms', function (req, res, next) {
        console.log('returning gym list');
        console.log(gymLocations);
        res.json(gymLocations);
        // test().then(function (data) {
        //     console.log('SENDING DATA BACK');
        //     console.log(data);
        //     res.json(gymLocations);
        // });


    });

    server.post('/api/getGymDetails', function (req, res, next) {
        console.log('trying to get gym details');
        var gym = req.body.gym;
        console.log(gym);
        getGymData(gym.coords.latitude,gym.coords.longitude)
        .then(function(data){
            res.json(data);
        });



    });

    function getGymData(lat, long) {

        var Q = require('q');
        var deferred = Q.defer();

        var location = {
            type: 'coords',
            coords: { latitude: lat, longitude: long, altitude: 18 }
        };

        Pokeio.SetLocation(location, function (err, loc) {
            Pokeio.Heartbeat(function (err, heartbeat) {
                if (err) {
                    console.log(err);
                }
                heartbeat.cells.forEach(function (ele, ind, arr) {
                    if (heartbeat.cells[ind].Fort.length !== 0) {

                        heartbeat.cells[ind].Fort.forEach(function (ele, i, a) {
                            if(lat == 47.520086){

                                }
                            if (heartbeat.cells[ind].Fort[i].Team !== null) {
                                
                                // console.log('lat: ' + lat + '     ' + heartbeat.cells[ind].Fort[i].Latitude);
                                // console.log('long: ' + long + '     ' + heartbeat.cells[ind].Fort[i].Longitude);
                                if (lat == heartbeat.cells[ind].Fort[i].Latitude &&
                                    long == heartbeat.cells[ind].Fort[i].Longitude) {
                                    console.log('we found a gym');


                                    var data = {
                                        fortId: heartbeat.cells[ind].Fort[i].FortId,
                                        team: getTeamName(heartbeat.cells[ind].Fort[i].Team),
                                        guardPokemon: getPokemon(heartbeat.cells[ind].Fort[i].GuardPokemonId),
                                        gymXP: heartbeat.cells[ind].Fort[i].GymPoints.low,
                                        location: {lat: lat, long: long},
                                        theme: 'dark-red'
                                    }
                                    //gymLocations[gymIndex].data = data
                                    deferred.resolve(data);
                                }

                            }
                        });
                    }
                });
                deferred.resolve({res: 'dank'});
            });
        });

        return deferred.promise;
    }

    function test() {

        var Q = require('q');


        var proms = [];
        gymLocations.forEach(function (element, index, array) {

            // getGymData(gymLocations[index].coords.latitude, gymLocations[index].coords.longitude, index)
            //     .then(function(data){

            //     });

            proms.push(getGymData(gymLocations[index].coords.latitude, gymLocations[index].coords.longitude, index));


        });
        console.log('haven executed yet');

        return Q.allSettled(proms);
    }


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
}