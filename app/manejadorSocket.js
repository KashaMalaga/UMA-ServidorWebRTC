module.exports = function(io, streams) {

var mqtt = require('mqtt')
var open = require('open');
 var Client = require('ftp');
  var fs = require('fs');
  var direccion = '0.0.0.0';
  var completa = '';	
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  console.log('addr: '+add);
  direccion=add;
open('http://'+direccion+':3000/');
})

   var c = new Client();
  var propiedades = {
   // host: "ftp.drivehq.com",
   // user: "kashamalaga",
   // password: ""
     host: "149.62.170.12",
    user: "kasha",
    password: "MICONTRASEÑA"
};
 c.on('ready', function() {
    c.put(completa, '/httpdocs/tfg.txt', function(err) {
      if (err) throw err;
      c.end();
    });
  });
  
  io.sockets.on('connection', function(client) {
	//nueva versioncliente  = mqtt.connect('ws://150.214.109.137:8002');
	 cliente = mqtt.createClient(8002, '150.214.109.137');
	//cliente = mqtt.createClient(8883, 'giraffplus.xlab.si');
	cliente.subscribe('UMA_Giraff_7/NavigationCommand'); // Nos suscribimos al topic NavigationCommand
   
  
    client.emit('id', client.id); // le enviamos devuelta que ya estas conectado 

	
	cliente.on('message', function (topic, message) {
	//console.log(message); // mostrar mensajes del Topic de mosquito
	});

	//	cliente.end();

    client.on('message', function (details) {
      var otherClient = io.sockets.sockets[details.to];

      if (!otherClient) {
        return;
      }
        delete details.to;
        details.from = client.id;
        otherClient.emit('message', details);
    });
      
    client.on('readyToStream', function(options) {
		 streams.addStream(client.id, options.name); 
       console.log('-- Cliente con id:' + client.id + ' conectado');

     
    });
    
	client.on('mensaje', function(options) {
      //console.log(options.name + ' mensaje recibido!');
	  console.log(options.name);
	  
	 cliente.publish('UMA_Giraff_7/NavigationCommand', options.name,0); // publico comando en mosquito con el topic Test
															//Motion X X
    });
    client.on('update', function(options) {
      streams.update(client.id, options.name);
	  	completa="http://"+ direccion + ":3000/" + client.id;
	console.log('-- Creado servidor con la siguiente id: ' + "http://"+ direccion + ":3000/" + client.id  + ' WEEE');
	console.log(' Subiendo credenciales al FTP' );
   c.connect(propiedades);
    });

    function leave() {
      console.log('-- Cliente con id: ' + client.id + ' se marcho!');
      streams.removeStream(client.id);
    }

    client.on('disconnect', leave);
    client.on('leave', leave);
  });
};