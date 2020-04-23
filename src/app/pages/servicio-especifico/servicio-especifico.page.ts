import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiciosService } from '../../services/servicios.service';
import { ServicioModel } from '../../models/servicio.model';
import Swal from 'sweetalert2';
import { PeticionModel } from '../../models/peticion.model';
import { AuthService } from '../../services/auth.service';
import { UsuarioModel } from '../../models/Usuario.model';
import { PeticionesService } from 'src/app/services/peticiones.service';

@Component({
  selector: 'app-servicio-especifico',
  templateUrl: './servicio-especifico.page.html',
  styleUrls: ['./servicio-especifico.page.scss'],
})
export class ServicioEspecificoPage implements OnInit {

  servicio = new ServicioModel();
  peticion: PeticionModel = new PeticionModel();
  usuarioArray: UsuarioModel[] = [];

  constructor(private activatedRoute: ActivatedRoute, private servicioService: ServiciosService, 
    private router: Router, private auth: AuthService, private _peticion: PeticionesService) { }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    this.servicioService.getServicio( id )
        .subscribe((resp: ServicioModel) => {
          this.servicio = resp;
          this.servicio.id = id;
          this.peticion.idServicio = this.servicio.id;
        });

    this.traeUsuario();

  }

  traeUsuario(){

    this.auth.getTodosUsuario().subscribe( resp=>{
      this.usuarioArray = resp;

      for(let item of this.usuarioArray){
        if( this.auth.leerLocalId() == item.typeId ){
          this.peticion.typeIdUsuario = item.typeId;
        }
      }
    });
    
  }

  confirmacion(){

    this.peticion.codigo = Math.floor(Math.random()*1000000);

    if(!this.peticion.direccion){
      Swal.fire({
        icon: 'warning',
        title: 'Direccion',
        text: 'Tienes que diligenciar el campo DIRECCIÓN para realizar tu solicitud',
      });
      return;
    }

    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea comenzar el servicio`,
      icon: "question",
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp=>{

      if( resp.value ){
        
        this._peticion.agregarPeticion( this.peticion ).subscribe( resp =>{
          this.peticion = resp;
          console.log(this.peticion.id);
          this.router.navigate(['estado-solicitud', this.peticion.id]);
        });
      }
    });

   
    
  }

}
