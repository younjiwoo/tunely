let express = require('express'),
    app = express();

// connects to CSS and app.js files
app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile( __dirname + '/views/index.html');
})

console.log('john and younji pair programming');

app.listen(3000, function () {
  console.log('we connected it to localhost 3000');
});
