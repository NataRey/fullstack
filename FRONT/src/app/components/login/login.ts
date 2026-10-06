import { Component, inject } from '@angular/core';
import { Credential } from '../../interfaces/credential';
import { ReactiveFormsModule, FormControl, FormGroup, Validators} from '@angular/forms';
import { LoginService } from '../../services/login-service';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

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
        console.log("response: " , response);
      })

      }
      
    }

  }

}
