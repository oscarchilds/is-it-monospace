const express = require('express')
const app = express()
var path = require('path');
var http = require('http')
var server = http.Server(app)
var port = process.env.PORT || 3000

app.use(express.static('src/public'))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/src/index.html'))
})

server.listen(port, function() {
  console.log('server running')
})