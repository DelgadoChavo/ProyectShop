const Producto = require('../models/productos');

const productosControl = {};

productosControl.getProductos = async (req, res, next) => {
    const productos = await Producto.find();
    res.json(productos);
}
 
productosControl.createProducto = async (req, res, next) =>{
    const productos = new Producto({
        clave: req.body.clave,
        producto: req.body.producto,
        clasificacion: req.body.clasificacion,
        stock: req.body.cantidad,
        precioventa: req.body.precioventa,
        preciocompra: req.body.preciocompra
    });
    await productos.save();
    res.json({
        estatus: 'Empleado Guardado'
    });
};

productosControl.getProducto = async(req, res, next) =>{
    const producto = await Producto.findById(req.params.id);
    res.json(producto);
}

productosControl.editProducto = async (req, res, next) =>{
    const { id } = req.params;
    const producto = {
        clave: req.body.clave,
        producto: req.body.producto,
        clasificacion: req.body.clasificacion,
        stock: req.body.cantidad,
        precioventa: req.body.precioventa,
        preciocompra: req.body.preciocompra
    };
    await Producto.findByIdAndUpdate(id, {$set: producto}, {new: true} );
    re.json({estatus: 'empleado modificado'});
};
productosControl.deleteProducto = async (req, res) =>{
    const { id } = req.params;
    await Producto.findByIdAndRemove(req.params.id);
    res.json({estatus: 'Producto Eliminado'});
}

module.exports = productosControl;