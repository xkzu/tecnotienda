import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateProductComponent } from './create-product.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateProductRoutingModule } from './create-product-routing.module'; // Importar el archivo de rutas

@NgModule({
  declarations: [CreateProductComponent],
  imports: [
    CommonModule,
    CreateProductRoutingModule, // Asegúrate de importar el módulo de rutas
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CreateProductModule { }
