import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UsuarioModel } from '../../models/Usuario.model';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cerrar-cuenta',
  templateUrl: './cerrar-cuenta.page.html',
  styleUrls: ['./cerrar-cuenta.page.scss'],
})
export class CerrarCuentaPage implements OnInit {

  usuario: UsuarioModel = new UsuarioModel();
  usuarioArray: UsuarioModel[] = [];
  idToken: string;

  constructor( private auth: AuthService, private router: Router ) { }

  ngOnInit() {
    this.traeDato();

  }

  traeDato(){

    this.auth.getTodosUsuario().subscribe(resp=>{
      this.usuarioArray = resp;

      for(let item of this.usuarioArray){
        if( this.auth.leerLocalId() == item.typeId ){
          this.usuario.id = item.id;
          break;
        }
      }
    });


    this.idToken = this.auth.leerToken();
    this.usuario.nombre = this.idToken;
  }

  cerrarCuenta(){

    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar tu cuenta`,
      icon: "question",
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp=>{

      if( resp.value ){

        if( !localStorage.getItem('idPeticion') && !localStorage.getItem('idPeticion2') && !localStorage.getItem('idPeticion3') ){

          this.auth.eliminarCuentaCorreo( this.usuario ).subscribe( );

          this.auth.eliminarCuentaDatos( this.usuario.id ).subscribe();

          localStorage.removeItem('token');
          localStorage.removeItem('expira');
          localStorage.removeItem('localId');
          localStorage.removeItem('idUsuario');

          setTimeout(() => location.reload(), 2500);

          setTimeout(() => this.router.navigate(['registro']), 1500);
        }else{
          Swal.fire(
            'Atención!',
            'No puede eliminar su cuenta hasta que termine el servicio en desarrollo!',
            'warning'
          );
        }
      }
    });
  }

}
