var app = require('express').createServer(), io = require('socket.io').listen(app), express = require('express'); 
var fs = require("fs");
var mongoose = require('mongoose');
mongoose.connect('mongodb://46.4.106.212/psm',function(err){if(err) throw err;});
app.listen(8333); 


app.get('/', function (req, res) { 
res.sendfile(__dirname + '/public/index.html'); 
}); 
app.get("*.css", function(req, res) {
    var path = __dirname + req.url;
    console.log(path); 
	res.sendfile(__dirname + '/public/'+req.url); 
});
app.get("*.js", function(req, res) {
    var path = __dirname + req.url;
    console.log(path); 
	res.sendfile(__dirname + '/public/'+req.url); 
});
app.get("*.png", function(req, res) {
    var path = __dirname;
    console.log(path); 
	res.sendfile(__dirname + '/public/'+req.url); 
});
app.get("*.txt", function(req, res) {
    var path = __dirname + req.url;
    console.log(path); 
	res.sendfile(__dirname + '/public/'+req.url); 
});
var allClients = 0; 
var totalClick = 0; 
var clientId = 1; 

var commentaireArticleSchema = new mongoose.Schema({
  msgTxt : String,
message : String
});
var CommentaireArticleModel = mongoose.model('commentaires', commentaireArticleSchema);
io.sockets.on('connection', function (client) { 
var my_timer; 
var my_client = { 
"id": clientId, 
"obj": client 
}; 
clientId += 1; 
allClients += 1; 



my_client.obj.send(JSON.stringify({ 
"initClick": totalClick 
}));


my_timer = setInterval(function () { 
my_client.obj.send(JSON.stringify({ 
"clients": allClients 
})); 
}, 1000); 
client.on('message', function(data) { 
console.log(data); 
var obj = JSON.parse(data);
console.log(obj.pseudo);
console.log(obj.messageIt);
my_client.obj.broadcast.send(JSON.stringify({ 
"msgTxt": obj.messageIt ,"message":  obj.pseudo
})); 

var monCommentaire = new CommentaireArticleModel();
monCommentaire.msgTxt = obj.pseudo;
monCommentaire.message=obj.messageIt;

// On le sauvegarde dans MongoDB !
monCommentaire.save(function (err) {
  if (err) { throw err; }
  console.log('Commentaire ajouté avec succès !');
  // On se déconnecte de MongoDB maintenant

});






});




client.on('clickIt', function(data) { 
console.log("yoooooooooo"); 
totalClick++;
my_client.obj.broadcast.send(JSON.stringify({ 
click: totalClick
})); 
});
my_client.obj.broadcast.send(JSON.stringify({ 
click: totalClick
})); 




client.on('disconnect', function() { 
clearTimeout(my_timer); 
allClients -= 1; 
console.log('disconnect'); 
}); 
});