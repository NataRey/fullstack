import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {

  constructor(private router: Router){}

  logout(){
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
