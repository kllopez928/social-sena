var express = require('express');
var usuarioController = require('../controllers/usuarioController');
var auth = require('../middlewares/auth');
var multiparty = require('connect-multiparty');
var path = multiparty({uploadDir:'./uploads/portadas'});
var app = express.Router();


app.post('/create_usuario',usuarioController.create_usuario);
app.post('/login_usuario',usuarioController.login_usuario);
app.get('/get_usuario/:id',auth.auth,usuarioController.get_usuario);
app.put('/update_usuario/:id',auth.auth,usuarioController.update_usuario);
app.put('/update_password/:id',auth.auth,usuarioController.update_password);
app.post('/validate_usuario',usuarioController.validate_usuario);
app.get('/validate_code/:code/:email',usuarioController.validate_code);
app.post('/reset_password/:email',usuarioController.reset_password);
app.get('/obtener_usuario_username/:username',auth.auth,usuarioController.obtener_usuario_username);
app.post('/actualizar_portada_usuario',[auth.auth,path],usuarioController.actualizar_portada_usuario);
app.get('/obtener_portada_img/:img',usuarioController.obtener_portada_img);
app.post('/actualizar_avatar_usuario',[auth.auth,path],usuarioController.actualizar_avatar_usuario);


//Invitacion de amista
app.post('/send_invitacion_amistad',auth.auth,usuarioController.send_invitacion_amistad);
app.get('/get_usuario_random',auth.auth,usuarioController.get_usuario_random);
app.get('/get_invitaciones_usuario/:tipo',auth.auth,usuarioController.get_invitaciones_usuario);
app.get('/aceptar_denegar_invitacion/:tipo/:id',auth.auth,usuarioController.aceptar_denegar_invitacion);
app.get('/obtener_usuarios/:filtro',auth.auth,usuarioController.obtener_usuarios);



module.exports = app;