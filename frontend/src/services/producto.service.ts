import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../app/models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  selectedProducto: Producto;

  productos: Producto[];
  readonly URL_API = 'http://localhost:3000/api/productos';

  constructor( private http: HttpClient) { 

    getProductos(){
      return this.http.get(this.URL_API);
    }

    postProductos(Producto: Producto){
      return this.http.post(this.URL_API, Producto)
    }

    putProducto(producto: Producto){
      return this.http.put(this.URL_API + ´/${producto_id}´, producto);
    }
    deleteProducto(_id: String){
      return this.http.delete(this.URL_API + ´/${_id}´);
    }
  }
}
