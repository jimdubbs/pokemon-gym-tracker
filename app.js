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

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.set('port', process.env.PORT || 8090);
server.listen(app.get('port'), function () {
    console.log('Example app listening on port ' + app.get('port'));
});
