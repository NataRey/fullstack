import { Component, signal, inject } from '@angular/core';
import {ReactiveFormsModule, FormControl, FormGroup, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-recover',
  imports: [ReactiveFormsModule],
  templateUrl: './recover.html',
  styleUrl: './recover.css',
})
export class Recover {
  private http = inject(HttpClient);
  recoverForm = new FormGroup({
    email: new FormControl('',[Validators.required, Validators.email]),
  });
  mensaje = signal<string>('');
  handleRecover(){
    if(this.recoverForm.valid){
      const email = this.recoverForm.value.email;
      this.http.post<any>('http://localhost:3000/users/forgotPassword', {email}).subscribe({
        next:(res)=>{
          this.mensaje.set(res.message || 'Revisa tu correo para ver  el nuevo password');
        },
        error:(err)=>{
            this.mensaje.set('Ocurrio un error al enviar el correo');
            console.log(err);
          }
      });
    }else {
      this.mensaje.set('Por favor ingrese uin correo electronico valido');
    }
  }
}
