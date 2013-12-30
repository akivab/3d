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

app.get('/', function(req, res){
  res.render('home');
});

app.listen(3000);