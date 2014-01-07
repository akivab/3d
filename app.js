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

function getPerspectives() {
  try {
    var fileData = fs.readFileSync(META_FILE_NAME);
    var arr = JSON.parse(fileData);
    return arr;
  } catch (e) {
    console.log('Found an error:', e);
    return;
  }
}

function writeMeta(user, starttime, duration, fileName) {
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
    duration: duration,
    starttime: starttime,
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

function generateId() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
  };

  function guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
  }

  return guid();
}

app.get('/', function(req, res){
  var currPerspectives = getPerspectives();
  console.log('Current perspectives:', currPerspectives.length);
  if (!currPerspectives)
    currPerspectives = [];
  if (req.query.start && req.query.end) {
    var start = parseInt(req.query.start);
    var end = parseInt(req.query.end);
    currPerspectives = currPerspectives.slice(start, end);
  } else {
    currPerspectives = currPerspectives.slice(currPerspectives.length - 3);
  }
  res.render('home', {
    perspectives: currPerspectives,
    numPerspectives: currPerspectives.length
  });
});

app.post('/upload', function(req, res) {
  console.log('body:', req.body, 'files:', req.files);

  var fileName = 'movie-' + generateId() + '.mov';

  var duration = req.body.endtime - req.body.starttime;
  writeMeta(req.body.user, req.body.starttime, duration, fileName);

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
