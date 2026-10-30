import { Component, inject, signal , OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { UserService } from '../../services/user-service';
import { CrudProductos } from './crud-productos/crud-productos';
@Component({
  selector: 'app-admin',
  imports: [CrudProductos],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit{

  private router = inject(Router);
  private userService = inject(UserService);
  adminName = signal<string>('Administrador');
  adminImage =signal<string>('http://localhost:3000/imagenes/usuarios/default-user.svg');
  ngOnInit(): void {
    this.loadAdminData();
  }
  //  constructor(private router: Router){}
  loadAdminData():void{
    const token = localStorage.getItem('token');
    if(token){
      try{
        const decoded: any = jwtDecode(token);
        console.log("Token decodificado en Admin: ", decoded);
        if(decoded.name){
          this.adminName.set(decoded.name);
        }
        if(decoded.imagen){
          const imageUrl = `http://localhost:3000/${decoded.imagen}`;
          this.adminImage.set(imageUrl);
        }
        if(decoded.id){
          this.userService.getUserById(decoded.id).subscribe({
            next:(response)=>{
              if (response.result === 'fine' && response.data){
                this.adminName.set(response.data.name);
                if(response.data.imagen){
                  this.adminImage.set(`http://localhost:3000/${response.data.imagen}`);
                }
              }
            },
            error:(err)=> console.log('Error al obtener datos del admin', err)
          });
        }
      }catch(error){
        console.log("Error al decodificar el token: ", error);
      }
    }
  }

  logout(){
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}


