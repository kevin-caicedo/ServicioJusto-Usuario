import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsuarioModel } from '../../models/Usuario.model';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.page.html',
  styleUrls: ['./datos-personales.page.scss'],
})
export class DatosPersonalesPage implements OnInit {

  usuario: UsuarioModel;
  usuarioArray: UsuarioModel[] = [];

  constructor( private auth: AuthService, 
                private route: ActivatedRoute) { 
    
    this.usuario = new UsuarioModel();
  }

  ngOnInit() {

    this.traeDato();
  }

  traeDato(){

    this.auth.getTodosUsuario().subscribe(resp=>{
      this.usuarioArray = resp;
      
      for(let item of this.usuarioArray){
        if( this.auth.leerLocalId() == item.typeId ){
          this.usuario.id = item.id;
          this.usuario.nombre = item.nombre;
          this.usuario.apellido = item.apellido;
          this.usuario.celular = item.celular;
          this.usuario.direccion = item.direccion;
          this.usuario.fechaNacimiento = item.fechaNacimiento;
          this.usuario.typeId = item.typeId;
          break;
        }
      }
    });
  }

  actualizar( form: NgForm ){
    console.log(form);

    if( form.invalid ){
      return;
    }

    Swal.fire({
      title: 'Espere',
      text: 'Guardando información',
      icon: 'info',
      allowOutsideClick: false
    });
    console.log(this.usuario.id);

    let peticion: Observable<any>;

    if(this.usuario.id){
      peticion = this.auth.actualizarUsuario( this.usuario );
      this.auth.cambiaContrasena( this.usuario ).subscribe();
    }
    
    

    peticion.subscribe( resp=> {
      Swal.fire({
        title: this.usuario.nombre,
        text: 'Se actualizó correctamente',
        icon: 'success'
      })
    });




  }

}
