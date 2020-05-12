import { Component, OnInit } from '@angular/core';
import { PqrsModel } from '../../models/pqrs.model';
import { PqrsService } from '../../services/pqrs.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { UsuarioModel } from '../../models/Usuario.model';

@Component({
  selector: 'app-enviar-pqrs',
  templateUrl: './enviar-pqrs.page.html',
  styleUrls: ['./enviar-pqrs.page.scss'],
})
export class EnviarPqrsPage implements OnInit {

  pqrs: PqrsModel = new PqrsModel();
  usuario: UsuarioModel = new UsuarioModel();
  usuarioArray: UsuarioModel[] = [];

  constructor( private pqrsService: PqrsService, private auth: AuthService ) { }

  ngOnInit() {

    this.traeDato();
  }

  traeDato(){

    this.auth.getTodosUsuario().subscribe(resp=>{
      this.usuarioArray = resp;

    for(let obj of this.usuarioArray){
      if(this.auth.leerLocalId() == obj.typeId){
        this.pqrs.nombre = obj.nombre;
        this.pqrs.apellido = obj.apellido;
      }
    }
    
    });


  }
  
  nuevoPqrs( form: NgForm ){

    if( form.invalid ){
      console.log('Formulario inválido');
      return;
    }
  
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();

    this.pqrsService.crearPqrs( this.pqrs )
      .subscribe( resp=>{
        Swal.close();

        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          onOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
        
        Toast.fire({
          icon: 'success',
          title: `${this.pqrs.tipo} enviada!!`
        })

        this.pqrs.tipo = "";
        this.pqrs.mensaje = "";

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
