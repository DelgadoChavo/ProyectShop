const mongoose = require('mongoose');
const {Schema} = mongoose;

const EsquemaProductos = new Schema({
    clave:{ type: String, require: true},
    producto:{ type: String, require: true},
    clasificacion:{ type: String, require: true},
    stock:{ type: Number, require: true},
    precioventa:{ type: Number, require: true},
    preciocompra:{ type: Number, require: true}
},
  {
    versionKey: false,
    timestamps: true,
  });

module.exports = mongoose.model('productos', EsquemaProductos);