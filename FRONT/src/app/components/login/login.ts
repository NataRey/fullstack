import { Component, inject } from '@angular/core';
import { Credential } from '../../interfaces/credential';
import { ReactiveFormsModule, FormControl, FormGroup, Validators} from '@angular/forms';
import { LoginService } from '../../services/login-service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  router = inject(Router);
  loginService : LoginService = inject(LoginService);

  credentialsForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  handleSubmit(){
    // console.log("works");
    // console.log(this.credentialsForm);
    if(this.credentialsForm.valid){
      const username = this.credentialsForm.value.username;
      const password = this.credentialsForm.value.password;
      if(typeof username === 'string' && typeof password === 'string'){
        const credential: Credential ={
        username,
        password,
      };
      // console.log(credential);
      this.loginService.login(credential).subscribe((response:any)=>{
        //console.log("response: " , response);
        if(response.result === 'fine'){
          localStorage.setItem('token', response.data);
          const decoded: any = this.loginService.decodeToken(response.data);
          console.log("Token decodificado" ,decoded);
          if(decoded.rol === 'admin'){
            this.router.navigateByUrl('/admin');
          }else{
            this.router.navigateByUrl('/shop');
          }
          
        }else{
          console.log('no funciono');
        }
      });
      }
    }else{
      console.log("Error formulario invalido");
    }
  }
}
