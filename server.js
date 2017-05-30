let express = require('express'),
    app = express();
let db = require('./models'); // index.js
let controllers = require('./controllers'); // will default to index.js

// connects to CSS and app.js files
app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile( __dirname + '/views/index.html');
})

app.get('/api', controllers.api.index);

app.get('/api/albums', controllers.albums.index);


console.log('john and younji pair programming');

app.listen(3000, function () {
  console.log('we connected it to localhost 3000');
});
