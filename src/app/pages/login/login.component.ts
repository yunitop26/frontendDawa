import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';


@Component({
  selector: 'app-login',
  imports: [
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string=""
  password: string=""

  constructor (private route:Router, private authService: AuthService){}
  login (){
    this.authService.login({username: this.username, password:this.password})
    .subscribe({
      next: (Response)=> {
        console.log('login existoso:', Response);
        console.log(this.authService.getToken);
        this.route.navigate(['/secretary']); //Redirige al dashboard
      }
    })
  }
}
