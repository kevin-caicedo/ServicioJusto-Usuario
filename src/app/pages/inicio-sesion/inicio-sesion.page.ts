import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsuarioModel } from '../../models/Usuario.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.page.html',
  styleUrls: ['./inicio-sesion.page.scss'],
})
export class InicioSesionPage implements OnInit {

   usuario: UsuarioModel = new UsuarioModel();

   recordarme = false;

  constructor(  private auth: AuthService,
                private router: Router ) { }

  ngOnInit(  ) {

    if(localStorage.getItem('email')){
      this.usuario.email = localStorage.getItem('email');
      this.recordarme = true;
    }

  }

  login( form: NgForm ){

    if( form.invalid ){ return; }

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();

    this.auth.login( this.usuario )
      .subscribe(resp=>{
  
        Swal.close();

        if( this.recordarme ){
          localStorage.setItem('email', this.usuario.email);
        }else{
          localStorage.removeItem('email');
        }

        this.router.navigateByUrl('/servicios');

      }, (err)=>{
        Swal.fire({
          icon: 'error',
          title: 'Error al autenticar',
          text: err.error.error.message
        });
      });

  }

  recuperar(){

    if( !this.usuario.email ){
      Swal.fire({
        icon: 'warning',
        title: 'Email',
        text: 'Tienes que diligenciar el campo CORREO electrónico para recuperar contraseña',
      });
      return;
    }

    this.auth.recuperarContrasena( this.usuario.email ).subscribe( resp=>{
      Swal.fire({
        icon: 'success',
        title: 'Recupera tu contraseña',
        text: 'Ya te llegó el correo para restablecer contraseña, ¡¡revísalo!!',
      })
    }, (err)=>{
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'CORREO NO ENCONTRADO'
      });
    })
  }

}
