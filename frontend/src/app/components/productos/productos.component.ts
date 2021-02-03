import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Producto } from 'src/app/models/producto';

import { ProductoService } from '../../services/producto.service';

declare var M: any;
@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
  providers: [ProductoService]
})
export class ProductosComponent implements OnInit {

  constructor(private productoService: ProductoService) { }

  ngOnInit(): void {
    this.getProductos();
  }
  addProducto(form: NgForm){
    if(form.value._id){
      this.productoService.putProducto(form.value)
        .subscribe(res => {
          this.resetForm(form);
          M.toast({html: 'Producto Actualizado'});
          this.getProductos();
        })
    }else{
      this.productoService.postProductos(form.value)
      .subscribe(res =>{
        this.resetForm(form);
        M.toast({html: 'Producto Guardado'});
        this.getProductos();
      });
    } 
  }
  deleteProducto(_id: string){
      if(confirm('¿Seguro que desea el producto?')){
      this.productoService.deleteProducto(_id)
        .subscribe(res => {
          this.getProductos();
          M.toast({html: 'Producto eliminado'});
        });
    }
  }
  getProductos(){
    this.productoService.getProductos()
    .subscribe(res => {
      this.productoService.productos = res as Producto[];
      console.log(res);
    });
  }
  editProducto(producto: Producto){
    this.productoService.selectedProducto = producto;
  }
  resetForm(form?: NgForm){
    if (form){
      form.reset();
      this.productoService.selectedProducto = new Producto();
    }
  }
}
