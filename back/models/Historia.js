var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HistoriaSchema = Schema({
    imagen: {type: String, required: true},
    usuario: {type: Schema.ObjectId, ref: 'usuario', required: true},
    exp: { type: Date, required:true}, 
    createdAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model('historia',HistoriaSchema);