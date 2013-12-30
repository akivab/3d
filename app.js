// Dependencies
var express = require('express'),
    exphbs  = require('express3-handlebars'),
    path = require('path'),
    app = express();

// Basic config
app.use(express.static(path.join('public')));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.bodyParser());
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
  { filepath: "/uploads/movie2.mov", username: "Andy", location: "New York", timestamp: "3 hrs" },
  { filepath: "/uploads/movie2.mov", username: "Akiva", location: "San Francisco", timestamp: "4 hrs" },
]

function getPerspectives() {
  return MOCK_PERSPECTIVES;
}

var perspectives = getPerspectives();

app.get('/', function(req, res){
  res.render('home', {
    perspective: getPerspectives(),
  });
});

app.listen(3000);