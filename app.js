var express = require('express');
var app = express();
var server = require('http').createServer(app);
var path = require('path');
var cookieParser = require('cookie-parser')
var compress = require('compression');

var bodyParser = require('body-parser')
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use(cookieParser());
app.use(compress());
//app.use(express.static(path.join(__dirname + '/scripts')));
app.use(express.static(path.join(__dirname + '/public')));

function unknownMethodHandler(req, res) {

    if (req.method.toLowerCase() === 'options') {
        var allowHeaders = ['Accept', 'Accept-Version', 'Content-Type', 'Api-Version', 'Authorization'];

        if (res.methods.indexOf('OPTIONS') === -1) res.methods.push('OPTIONS');

        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Headers', allowHeaders.join(', '));
        res.header('Access-Control-Allow-Methods', res.methods.join(', '));
        res.header('Access-Control-Allow-Origin', req.headers.origin);

        return res.send(204);
    }
    else
        return res.send('error');
}

app.on('MethodNotAllowed', unknownMethodHandler);

// app.use(function myDefaultHeaders(req, res, next) {
//     res.once('header', function () {
//         // any other headers you want to set
//         res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key,X-Requested-With');
//         //res.header("Access-Control-Allow-Origin", "*");
//     });
//     next();
// });

var cors = require('cors')
app.use(cors());



var Pokeio = require('pokemon-go-node-api');
var location = {
    type: 'coords',
    coords: { latitude: 47.476944, longitude: -53.056799, altitude: 18 }
};

// var gymLocations = [
//     {
//         name: 'Manuels River',
//         coords: { latitude: 47.520086, longitude: -52.946079, altitude: 18 }
//     },
//     {
//         name: 'Library',
//         coords: { latitude: 47.518831, longitude: -52.955872, altitude: 18 }
//     },
//     {
//         name: 'Pool',
//         coords: { latitude: 47.506592, longitude: -52.975728, altitude: 18 }
//     },
//     {
//         name: 'Marina',
//         coords: { latitude: 47.513599, longitude: -52.9998, altitude: 18 }
//     },
//     {
//         name: 'All Saints',
//         coords: { latitude: 47.509513, longitude: -52.983357, altitude: 18 }
//     },
//     {
//         name: 'Neds Field',
//         coords: { latitude: 47.486, longitude: -53.011315, altitude: 18 }
//     },
//     {
//         name: 'Bistro',
//         coords: { latitude: 47.476944, longitude: -53.056799, altitude: 18 }
//     },
// ]
var gymLocations = [
    {
        name: 'Manuels River',
        coords: { latitude: 47.520086, longitude: -52.946079, altitude: 18 }
    },
    {
        name: 'Library',
        coords: { latitude: 47.518831, longitude: -52.955872, altitude: 18 }
    }
]

var username = process.env.PGO_USERNAME || 'jimdubbs';
var password = process.env.PGO_PASSWORD || 'Pantera316';
var provider = process.env.PGO_PROVIDER || 'ptc';

Pokeio.init(username, password, location, provider, function (err) {
    if (err) throw err;

    console.log('[i] Current location: ' + Pokeio.playerInfo.locationName);
    console.log('[i] lat/long/alt: : ' + Pokeio.playerInfo.latitude + ' ' + Pokeio.playerInfo.longitude + ' ' + Pokeio.playerInfo.altitude);

    Pokeio.GetProfile(function (err, profile) {
        if (err) throw err;

        console.log('[i] Username: ' + profile.username);
        console.log('[i] Poke Storage: ' + profile.poke_storage);
        console.log('[i] Item Storage: ' + profile.item_storage);

        var poke = 0;
        if (profile.currency[0].amount) {
            poke = profile.currency[0].amount;
        }

        console.log('[i] Pokecoin: ' + poke);
        console.log('[i] Stardust: ' + profile.currency[1].amount);

        // Pokeio.Heartbeat(function (err, heartbeat) {
        //     if (err) {
        //         console.log(err);
        //     }

        //     //console.log(heartbeat);
        //     //console.log(heartbeat.cells);
        //     var gyms = [];
        //     heartbeat.cells.forEach(function (element, index, array) {


        //         if (heartbeat.cells[index].Fort.length !== 0) {
        //             //console.log(heartbeat.cells[index]);

        //             heartbeat.cells[index].Fort.forEach(function (ele, i, a) {
        //                 if (heartbeat.cells[index].Fort[i].Team !== null) {
        //                     gyms.push(heartbeat.cells[index].Fort[i]);
        //                 }
        //             });
        //         }
        //     });

        //     console.log(gyms);
        // });

    });
});


 var fs = require("fs");
 console.log("\n *STARTING* \n");
// Get content from file
 var contents = fs.readFileSync('./api/pokemons.json');
// Define to JSON type
 var pokemon = JSON.parse(contents).pokemon;


app.set('port', process.env.PORT || 8090);

server.listen(app.get('port'), function () {
    console.log('Example app listening on port ' + app.get('port'));

});

require('./api/routes.js')(app, Pokeio, gymLocations,pokemon);

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});




