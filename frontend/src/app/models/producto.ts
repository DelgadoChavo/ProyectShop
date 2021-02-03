export class Producto {

    constructor( _id = '', clave = "", clasificatoria = "", cantidad = 0, precioventa = 0, preciocompra = 0){
        this._id = _id;
        this.clave = clave;
        this.clasificatoria = clasificatoria;
        this.cantidad = cantidad;
        this.precioventa = precioventa;
        this.preciocompra = preciocompra;
    }
    _id: string;
    clave: string;
    clasificatoria: string;
    cantidad: number;
    precioventa: number;
    preciocompra: number;
}
