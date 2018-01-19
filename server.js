var express = require('express');
var app = express();
app.set('port', (process.env.PORT || 7000));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/AZ_Suggestions_Rep_Territory/dashboard-dynamic.html');
});

app.use('/', express.static(__dirname + '/'));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
//http://localhost:9000