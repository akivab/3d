// Dependencies
var express = require('express'),
    exphbs  = require('express3-handlebars'),
    fs = require('fs'),
    path = require('path'),
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

var FOLDER_NAME = 'public/uploads';
var META_FILE_NAME = [FOLDER_NAME, '.meta'].join('/');

function GetPerspectives() {
  try {
    var fileData = fs.readFileSync(META_FILE_NAME);
    return JSON.parse(fileData);
  } catch (e) {
    console.log(e);
    return;
  } 
}

function WriteMeta(user, timestamp, fileName) {
  var data;
  try {
    data = fs.readFileSync(META_FILE_NAME);
  } catch (e) {
    console.log('No .meta file. Creating.');
  }
  var json;
  var url = '/uploads';
  var info = {
    username: user,
    location: 'Tel Aviv',
    timestamp: timestamp,
    filepath: [url, fileName].join('/')
  };

  if (data) {
    json = JSON.parse(data);
    json.push(info);
  } else {
    json = [info];
  }

  fs.writeFileSync(META_FILE_NAME, JSON.stringify(json));
}

app.get('/', function(req, res){
  var currPerspectives = GetPerspectives();
  console.log(currPerspectives);
  res.render('home', {
    perspectives: currPerspectives,
    numPerspectives: currPerspectives.length
  });
});

app.post('/upload', function(req, res) {
  console.log('body:', req.body, 'files:', req.files);

  var timestamp = req.body.timestamp || '0';
  var fileName = 'movie-' + timestamp.replace(/\./g, '') + '.mov';

  WriteMeta(req.body.user, timestamp, fileName);

  try {
    fs.mkdirSync(FOLDER_NAME);
  } catch (e) {
    console.log('Could not mkdir', FOLDER_NAME);
  }
  var data = fs.readFileSync(req.files.video.path);
  var newPath = [__dirname, FOLDER_NAME, fileName].join('/');
  fs.writeFile(newPath, data);

  res.writeHead(200, {"Content-Type": "application/json"});
  res.write('');
  res.end();
});

app.listen(3000);
