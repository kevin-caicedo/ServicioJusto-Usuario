import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from '../../models/Usuario.model';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})

export class RegistroPage implements OnInit {

  usuario: UsuarioModel;
  fechaMaxima: Date;

  constructor( private auth: AuthService, 
                private router: Router ) { }

  ngOnInit() {
    this.usuario = new UsuarioModel();
  }

  onSubmit( form: NgForm ){

    if( form.invalid ){ return; }

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();

    this.auth.nuevoUsuario( this.usuario )
      .subscribe( resp=>{
        
        this.auth.verificarCorreo().subscribe( );

        if( localStorage.getItem('idServicio') ){

          this.router.navigateByUrl(`/servicio-especifico/${ localStorage.getItem('idServicio') }`);
          localStorage.removeItem('idServicio');
          setTimeout(() => location.reload(), 2500);
          return;
        }
        this.router.navigateByUrl('/servicios');
        Swal.close();

        Swal.fire(
          'Bienvenido!',
          'Ok para continuar!',
          'success'
        );

        setTimeout(() => location.reload(), 2500);

        }, (err)=>{
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'Error al autenticar',
          text: err.error.error.message
        });
      });

  }
}