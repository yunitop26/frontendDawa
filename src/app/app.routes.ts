import { Routes } from '@angular/router';
import {MainComponent} from "./templates/main/main.component";
import {SecretaryComponent} from "./pages/secretary/secretary.component";
import { ViewDataGuessComponent } from './pages/view-data-guess/view-data-guess.component';
import { LoginComponent } from './pages/login/login.component';
import { loginGuard } from './services/auth/login.guard';
import { authGuard } from './services/auth/auth.guard';



export const routes: Routes = [
    { path: '', component: MainComponent, canActivate:[authGuard], children: [
            {path: '', redirectTo: 'secretary', pathMatch: 'full'},
            {path: 'secretary', component: SecretaryComponent},
            {path: 'view-data-guess', component: ViewDataGuessComponent},
            
        ]
    },
    {path: 'login', component: LoginComponent, canActivate:[loginGuard]},

];
