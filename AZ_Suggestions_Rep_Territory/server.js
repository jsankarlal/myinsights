var express = require('express');
var app = express();
app.set('port', (process.env.PORT || 9000 || 9001));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/dashboard.html');
});

app.use('/', express.static(__dirname + '/'));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
//http://localhost:8000