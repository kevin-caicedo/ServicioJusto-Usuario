import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService,
    private router: Router){
  
  }

  canActivate( ): boolean {
    
    if(this.auth.estaAutenticado()){
      return true;
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Nos has iniciado sesión',
      })
      this.router.navigateByUrl('/inicio-sesion');
      setTimeout(() => location.reload(), 3000);
      localStorage.removeItem('token');
      localStorage.removeItem('expira');
      localStorage.removeItem('localId');
      return false;
    }
  }
}
