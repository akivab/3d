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

var MOCK_PERSPECTIVES = [
  { filepath: "/uploads/movie1.mov", username: "Danny", location: "Tel Aviv", timestamp: "2 hrs" },
  { filepath: "/uploads/movie2.mov", username: "Andy", location: "New York", timestamp: "3 hrs" }
]

function getPerspectives() {
  return MOCK_PERSPECTIVES;
}

app.get('/', function(req, res){
  var currPerspectives = getPerspectives();
  console.log(currPerspectives);
  res.render('home', {
    perspectives: currPerspectives,
    numPerspectives: currPerspectives.length
  });
});

app.post('/upload', function(req, res) {
  console.log('body:', req.body, 'files:', req.files);

  var folderName = 'public/uploads';
  var timestamp = req.body.timestamp;
  var fileName = 'movie-' + timestamp.replace(/\./g, '') + '.mov';


  fs.mkdir(folderName, function(err){});
  fs.readFile(req.files.video.path, function (err, data) {
    var newPath = [__dirname, folderName, fileName].join('/');
    fs.writeFile(newPath, data, function (err) {
      if (err) {
        console.log(err);
      }
    });
  });

  res.writeHead(200, {"Content-Type": "application/json"});
  res.write('');
  res.end();
});

app.listen(3000);