module.exports = function (server, PokeioCollection, gymLocations, pokemon, firebase) {
    var s2 = require('s2geometry-node');

    var db = firebase.database();
    var ref = db.ref("pokemon");
    var POGOProtos = require('node-pogo-protos');

    // setTimeout(function () {
    //     console.log('INTERVAL');
    //     ref.child('gyms').once('value').then(function (snapshot) {
    //         var gyms = snapshot.val();
    //         //PokeioCollection[0].batchStart();
    //         //PokeioCollection[1].batchStart();
    //         for (var gym in gyms) {
    //             if (gyms.hasOwnProperty(gym)) {

    //                 var client = PokeioCollection[Math.floor(Math.random() * PokeioCollection.length)];
    //                 //client.setPosition(gyms[gym].gym_state.fort_data.latitude, gyms[gym].gym_state.fort_data.longitude);
    //                 client.getGymDetails(gyms[gym].gym_state.fort_data.id, gyms[gym].gym_state.fort_data.latitude, gyms[gym].gym_state.fort_data.longitude)
    //                     .then(function(data){
    //                        console.log(data); 
    //                     });
                    

    //             }
    //         }
            
            
    //         // PokeioCollection[0].batchCall()
    //         //     .then(function(gyms){
    //         //        console.log('client 1 batch'); 
    //         //        console.log(gyms);
    //         //     });
             
    //         // PokeioCollection[1].batchCall()
    //         //     .then(function(gyms){
    //         //        console.log('client 2 batch'); 
    //         //        console.log(gyms);
    //         //     });
            
    //         // ...
    //     }, function (errorObject) {
    //         console.log("The read failed: " + errorObject.code);
    //     });
    // }, 1000);





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