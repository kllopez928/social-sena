var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Usuario_invitacionSchema = Schema({
    usuario_origen: {type: Schema.ObjectId, ref: 'usuario', required: true}, //ID QUE ENVIA INVITACION
    usuario_destinatario: {type: Schema.ObjectId, ref: 'usuario', required: true}, //ID RECEPTOR DE INVITACION
    createdAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model('usuario_invitacion',Usuario_invitacionSchema);