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

var pokeCred = [
    {
        username: 'PokemonData01',
        password: 'ThisIsIt',
        provider: 'google',
        location: {
            type: 'coords',
            coords: { latitude: 47.476944, longitude: -53.056799, altitude: 18 }
        }

    },
    {
        username: 'PokemonData02',
        password: 'ThisIsIt',
        provider: 'google',
        location: {
            type: 'coords',
            coords: { latitude: 47.476944, longitude: -53.056799, altitude: 18 }
        }

    }
]

var PokeIOCollection = [];

var gymLocations = [
    {
        name: 'Manuels River',
        coords: { latitude: 47.520086, longitude: -52.946079, altitude: 18 },
        isLoading: true
    },
    {
        name: 'Library',
        coords: { latitude: 47.518831, longitude: -52.955872, altitude: 18 },
        isLoading: true
    },
    {
        name: 'Pool',
        coords: { latitude: 47.506592, longitude: -52.975728, altitude: 18 },
        isLoading: true
    },
    {
        name: 'Marina',
        coords: { latitude: 47.513599, longitude: -52.9998, altitude: 18 },
        isLoading: true
    },
    {
        name: 'All Saints',
        coords: { latitude: 47.509513, longitude: -52.983357, altitude: 18 },
        isLoading: true
    },
    {
        name: 'Neds Field',
        coords: { latitude: 47.486, longitude: -53.011315, altitude: 18 },
        isLoading: true
    },
    {
        name: 'Bistro',
        coords: { latitude: 47.476944, longitude: -53.056799, altitude: 18 },
        isLoading: true
    }
]
// var gymLocations = [
//     {
//         name: 'Manuels River',
//         coords: { latitude: 47.520086, longitude: -52.946079, altitude: 18 }
//     },
//     {
//         name: 'Library',
//         coords: { latitude: 47.518831, longitude: -52.955872, altitude: 18 }
//     }
// ]
const pogobuf = require('pogobuf');
pokeCred.forEach(function (element, i, array) {

    var login = new pogobuf.GoogleLogin(),
        client = new pogobuf.Client();

    login.login(pokeCred[i].username, pokeCred[i].password)
        .then(token => {
            client.setAuthInfo('google', token);
            client.setPosition(47.520086, -52.946079);
            return client.init();
        }).then(() => {
            console.log('INIT!');
            PokeIOCollection.push(client);

        }).catch(console.error);
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

var firebase = require("firebase");
firebase.initializeApp({
  serviceAccount: {
    projectId: "poke-gym-tracker",
    clientEmail: "jimdubbs@poke-gym-tracker.iam.gserviceaccount.com",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCnDMu1EXjula9H\nKUy2u0W1GfUIIga0PI+fQOwqzZ7hJgq5uzYRj38hyknuIn1B1LoZ2S9bsoHXcl5O\n/mo4JMB9jSmhpcO468fKKwggEJAFydflbmgyIitE1IzW/nihVNse4jzhInLiZPjI\nsdKuKaVxp+LbdhHSmJ/8CLIziosFHb9hYL6ockjSURaOt8cmyCh7RAVTPHyA2vLt\nA09sz3vYBgzcKDZ/PpGWlSpbQSsLjAQOAHwcKz3HrzIUP9sT8T/QOQXwSUauLiqS\n6OXYvA5G2WCvZP344XyD7Z71Bx0fJbwirbPbcNzh920ViEpySKMIzxh0oLACnVX0\nb6DaZS/3AgMBAAECggEAF6Dxt3zvNCAsGM64sSgwJfuz8yCM/jWKwyX1weAv1v0A\ni2D1tuorO2ZXqr1qJkOmxz03O6s2PnlI6beG4sYgDCJJfznpQ2Dmc6w+i/qLxKXW\nSfeh+WVn5WaDPW3lNjzAec/aeKXcxjUuE4VDnar6YeczaYN75eP8zTOVsUCphWGC\nXTwTt8CiZ6K5Tue9BrR65hv5OuelgpyhjcsyFLDEdHbt1giyzgT98J8sy6qPPfFb\n64tePM9pgK/4FHwytS2h7PbZGatj/Sqca31i4luBTnar5TsfIuEWGOstmsV4t+Kd\nxVkLMQ+SzjufhjnaTqfLfDOX/xKvkqyhmx7px/UNQQKBgQD3WNrpV/tkB2GsXhyv\nEeK1NXLdAvR2jqny6ZlI5so+NgD9UUhpyU7LMruTUc2osYIEZXUp+TOzDxx578JA\nGrTM7CcrZP4k51lobkb1/jXMJ911M9enS7Li2NVrdQdmC4gWRfK4t9vo1Cr842CB\n+hfLrsLqBU6dUmMLS/3S5ovoUQKBgQCs5NStm3WsnUhP6OLJeW6aI8Uimbcxknh3\nMS5Em3t173jRi7AcgEG9giQ5c2djaHAgVKqktBInr/i2JEMU8WJAjuF3/v2mpjpJ\nPNRadVQsFZhhysgmg6Q3oat9gx4NM3KhuIfuixC7Vge1df9WrXydlEmYBRc7sCq1\nX3gFU3zJxwKBgQDa1kuATe5GFt3MwctA/WMGDg7dCWM+jYRBPXn37PEcT21ashKO\nPaQv1WfttF9vk/VDbHxXsXqTPphkLcNAMiCqeXlCRG0yO1l4MrEnrUztnoupyT9Q\nbYIMf+l61CTCnQs/IY3Y7hpriWOrMITPGnT5KVqb8CwYtq6YbRhaAs3fsQKBgEgZ\nfV+QjvgW9wrr8XdXfnolJJaTR8QScs4x4juWI1xBKz8nY5/fFIs09GpI5/qamPfC\nlw7sUQ3f4nYClT7skq6dZwUlfx26AGB+T4gRmbJwpwVRDTqSdy8D6oIC5ctXgxxR\n2c3ujGGzNK/Fr1+0JV2Jc09EADZR9t2AHIsMD+QNAoGAEOXwxjOIz3o49Si6oj5l\nXn2ZWC5jo7X1RBKJKyIe7lJvw/RIPsv5bSfKAPF1E+U0CDpDtAFVoP3qT8Da0epf\nRy4/tt4hQsghjtVO7RzWoOFtgPF6Y9lb+q6ajkLIecyDzzEHO4SSI6JE0KTey7/p\nifoM3R4cEwzfVasSUmHXFpo=\n-----END PRIVATE KEY-----\n"
  },
  databaseURL: "https://poke-gym-tracker.firebaseio.com"
});

require('./api/routes.js')(app, PokeIOCollection, gymLocations, pokemon, firebase);
require('./api/heartbeat.js')(app, PokeIOCollection, gymLocations, pokemon, firebase);
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});




