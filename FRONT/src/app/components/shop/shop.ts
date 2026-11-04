import { Component, OnInit, inject, signal} from '@angular/core';
import { Router } from '@angular/router';
import { ProductosService } from '../../services/productos-service';
import { Productos } from '../../interfaces/productos';

@Component({
  selector: 'app-shop',
  imports: [],
  templateUrl: './shop.html',
  styleUrl: './shop.css',
})
export class Shop implements OnInit{
  private router = inject(Router);
  private productosService = inject(ProductosService);

  productosEcologicos = signal<Productos[]>([]);
  productosSombrillas = signal<Productos[]>([]);

  imagenBaseUrl = 'http://localhost:3000/imagenes/';

  ngOnInit(): void {
    this.cargarSecciones();
  }

  cargarSecciones(): void {
    this.productosService.getAll().subscribe({
      next: (todos)=>{
        this.productosEcologicos.set(
          todos.filter(prod => prod.categoria === 'ecologicos')
        );

        this.productosSombrillas.set(
          todos.filter(prod => prod.categoria === 'sombrillas')
        );
      },
      error: (err)=> console.log('Error al cargar productos', err)
    });
  }
  
  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}