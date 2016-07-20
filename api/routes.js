module.exports = function (server, Pokeio, gymLocations,pokemon) {

    server.get('/api/getGymDetails', function (req, res, next) {
        console.log('trying to get gym details');
        test().then(function (data) {
            console.log('SENDING DATA BACK');
            res.json(gymLocations);
        });


    });

    function getGymData(lat, long, gymIndex) {

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
                            if (heartbeat.cells[ind].Fort[i].Team !== null) {

                                if (lat == heartbeat.cells[ind].Fort[i].Latitude &&
                                    long== heartbeat.cells[ind].Fort[i].Longitude) {
                                    console.log('we found a gym');
                                    

                                    var data = {
                                        fortId: heartbeat.cells[ind].Fort[i].FortId,
                                        team: getTeamName(heartbeat.cells[ind].Fort[i].Team),
                                        guardPokemon: getPokemon(heartbeat.cells[ind].Fort[i].GuardPokemonId),
                                        gymXP: heartbeat.cells[ind].Fort[i].GymPoints.low
                                    }
                                    gymLocations[gymIndex].data = data
                                    deferred.resolve(gymLocations[gymIndex].data);
                                }

                            }
                        });
                    }
                });

            });
        });

        return deferred.promise;
    }

    function test() {

        var Q = require('q');

        var proms = [];
        gymLocations.forEach(function (element, index, array) {

                proms.push(getGymData(gymLocations[index].coords.latitude,gymLocations[index].coords.longitude,index));

        });

        return Q.all(proms);
    }


    function getTeamName(teamId){
        switch (teamId){
            case 1: 
            return 'Mystic';
            case 2: 
            return 'Valor'
            case 3: 
            return 'Instinct'
        }
    }

    function getPokemon(id){
        //console.log(pokemon);
        var result = pokemon.filter(function(poke){
            return poke.id = id;
        })

        return result[0];
    }
}