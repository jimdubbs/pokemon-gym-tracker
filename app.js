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
    //manuels 2 gyms
    {
        name: 'manuels',
        username: 'pineapple20',
        password: 'ThisIsIt',
        provider: 'ptc',
        location: {
            type: 'coords',
            coords: { latitude: 47.51859189633616, longitude: -52.956225872039795, altitude: 18 }
        },
        latRange: [47.51859189633616, 47.52062066135589],
        longRange: [-52.956225872039795, -52.945518493652344],
        gyms: []

    },//holyrood
    {
        name: 'holyrood',
        username: 'ManDogCat20',
        password: 'ThisIsIt',
        provider: 'ptc',
        location: {
            type: 'coords',
            coords: { latitude: 47.38196286171234, longitude: -53.1423282623291, altitude: 18 }
        },
        latRange: [47.38196286171234, 47.3863504837041],
        longRange: [-53.1423282623291, -53.12207221984863],
        gyms: []
    },//pool/allsaints
    {
        name: 'pool-allsaints',
        username: 'SkateboardHero20',
        password: 'ThisIsIt',
        provider: 'ptc',
        location: {
            type: 'coords',
            coords: { latitude: 47.5060407920686, longitude: -52.985172271728516, altitude: 18 }
        },
        latRange: [47.5060407920686, 47.51128769270282],
        longRange: [-52.985172271728516, -52.9740571975708],
        gyms: []

    },//marina
    {
        name:'marina',
        username: 'jimdubbs03',
        password: 'P@ssw0rd',
        provider: 'ptc',
        location: {
            type: 'coords',
            coords: { latitude: 47.50931654292719, longitude: -53.00251007080078, altitude: 18 }
        },
        latRange: [47.50931654292719,47.51453413094881],
        longRange: [-53.00251007080078,-52.99431324005127],
        gyms: []

    },//neds
    {
        name: 'neds',
        username: 'FeelsBadMan10',
        password: 'ThisIsIt',
        provider: 'ptc',
        location: {
            type: 'coords',
            coords: { latitude: 47.48374286308429, longitude: -53.0145263671875, altitude: 18 }
        },
        latRange: [47.48374286308429,47.4902389458637],
        longRange: [-53.0145263671875,-53.009634017944336],
        gyms: []


    },//bistro
    {
        name:'bistro',
        username: 'FeelsBadMan12',
        password: 'ThisIsIt',
        provider: 'ptc',
        location: {
            type: 'coords',
            coords: { latitude: 47.47373616399221, longitude: -53.059115409851074, altitude: 18 }
        },
        latRange: [47.474983479729254,47.47895728825277],
        longRange: [-53.05842876434326,-53.054137229919434],
        gyms: []


    },//topsail chruch
    {
        name: 'topsail-church',
        username: 'FeelsBadMan13',
        password: 'ThisIsIt',
        provider: 'ptc',
        location: {
            type: 'coords',
            coords: { latitude: 47.47373616399221, longitude: -53.059115409851074, altitude: 18 }
        },
        latRange: [47.53796339956123,47.540295611028995],
        longRange: [-52.93792247772217,-52.933502197265625],
        gyms: []


    },
    {
        name: 'Paradise-Rec',
        username: 'FeelsBadMan14',
        password: 'ThisIsIt',
        provider: 'ptc',
        location: {
            type: 'coords',
            coords: { latitude: 47.47373616399221, longitude: -53.059115409851074, altitude: 18 }
        },
        latRange: [47.523286918933046,47.52458377240933],
        longRange: [-52.87040591239929,-52.86794900894165],
        gyms: []


    },
    {
        name: 'Holy-Family-Church',
        username: 'jimdubbs04',
        password: 'P@ssw0rd',
        provider: 'ptc',
        location: {
            type: 'coords',
            coords: { latitude: 47.53571800479104, longitude: -52.89920210838318, altitude: 18 }
        },
        latRange: [47.53571800479104,47.5369131462348],
        longRange: [-52.89920210838318,-52.897281646728516],
        gyms: []


    }]

var PokeIOCollection = [];

const pogobuf = require('pogobuf');
pokeCred.forEach(function (element, i, array) {

    var 
        client = new pogobuf.Client(pokeCred[i].provider,pokeCred[i].username, pokeCred[i].password);

        client.init()
            .then(function(data){
                console.log('all good');
                PokeIOCollection.push({ client: client, latRange: pokeCred[i].latRange, longRange: pokeCred[i].longRange , name: pokeCred[i].name, gyms: [],
                    latitude: pokeCred[i].location.coords.latitude,longitude: pokeCred[i].location.coords.longitude});
            }).catch(console.error);


    // login.login(pokeCred[i].username, pokeCred[i].password)
        // .then(token => {
        //     client.setAuthInfo('ptc', token);
        //     client.setPosition(pokeCred[i].latRange[0], pokeCred[i].longRange[0]);
        //     return client.init();
        // }).then(() => {
        //     console.log('INIT!');
        //     PokeIOCollection.push({ client: client, latRange: pokeCred[i].latRange, longRange: pokeCred[i].longRange , name: pokeCred[i].name});

        // }).catch(console.error);
});

var holyroodLat = [47.38196286171234, 47.3863504837041];
var holyroodLong = [-53.1423282623291, -53.12207221984863];

var manuelsLat = [47.51859189633616, 47.52062066135589,];
var manuelsLong = [-52.956225872039795, -52.945518493652344];

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

require('./api/routes.js')(app, PokeIOCollection, pokemon, firebase);
require('./api/heartbeatNew.js')(app, PokeIOCollection,  pokemon, firebase);
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});




