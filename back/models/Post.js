var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = Schema({
    /* titulo: {type: String, required: true}, */
    extracto: {type: String, required: true},
    contenido: {type: String, required: true},
    media: {type: String, required: false},
    tipo: {type: String, required: true}, //TEXTO,MEDIA,GRUPO
    privacidad: {type: String, required: true}, 
    usuario: {type: Schema.ObjectId, ref: 'usuario', required: true},
    /* grupo: {type: Schema.ObjectId, ref: 'grupo', required: false}, */
    createdAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model('post',PostSchema);