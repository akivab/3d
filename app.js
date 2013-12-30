// Dependencies
var express = require('express'),
    exphbs  = require('express3-handlebars'),
    fs = require('fs'),
    path = require('path'),
    sys = require('sys'),
    app = express();

// Basic config
app.use(express.static(path.join('public')));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.bodyParser());
app.use(express.multipart());
app.use(express.methodOverride());

// View config
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Logging config
app.locals.pretty = true;
app.use(express.logger('dev'));
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

app.get('/', function(req, res){
  res.render('home');
});

app.post('/upload', function(req, res) {
  console.log('body:');
  console.log(req.body);
  console.log('files:');
  console.log(req.files);
  // console.log(req.rawBody);
  var folderName = 'public/uploads';
  
  var timestamp = req.body.timestamp;
  var lat = req.body.lat;
  var lng = req.body.long;

  var fileName = 'movie-' + timestamp.replace(/\./g, '') + '.mov';


  fs.mkdir(folderName, function(err){});
  fs.readFile(req.files.video.path, function (err, data) {
    var newPath = __dirname + '/' + folderName + '/' + fileName;
    fs.writeFile(newPath, data, function (err) {});
  });
  res.send('done.');
});

app.listen(3000);