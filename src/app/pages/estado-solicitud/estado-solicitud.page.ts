import { Component, OnInit } from '@angular/core';
import { PeticionModel } from '../../models/peticion.model';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PeticionesService } from '../../services/peticiones.service';
import { AfiliadoModel } from '../../models/afiliado.model';

@Component({
  selector: 'app-estado-solicitud',
  templateUrl: './estado-solicitud.page.html',
  styleUrls: ['./estado-solicitud.page.scss'],
})
export class EstadoSolicitudPage implements OnInit {

  peticion: PeticionModel = new PeticionModel();
  afiliadoArray: AfiliadoModel[] = [];
  afiliado: AfiliadoModel = new AfiliadoModel();
  

  constructor( private activatedRoute: ActivatedRoute, private router: Router,
                private _peticiones: PeticionesService ) { }

  ngOnInit() {

    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.peticion.id = id;

    this._peticiones.getPeticion( this.peticion.id ).subscribe( (resp: PeticionModel)=>{
      this.peticion = resp;
      this.peticion.id = id;

      this._peticiones.getAfiliados().subscribe( resp=>{
        
        this.afiliadoArray = resp;

        for( let item of this.afiliadoArray ){
          if( item.typeIdAfiliado == this.peticion.typeIdAfiliado ){

            this.afiliado.id = item.id;
            this.afiliado.Apellido = item.Apellido;
            this.afiliado.Calificacion = item.Calificacion;
            this.afiliado.FechaNacimiento = item.FechaNacimiento;
            this.afiliado.Nombre = item.Nombre;
            this.afiliado.Telefono = item.Telefono;
            this.afiliado.fotoPerfil = item.fotoPerfil;
            this.afiliado.typeIdAfiliado = item.typeIdAfiliado;

          }
        }
        

        

      });
    });

    

  }

  cancelar(){
    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea cancelar el servicio`,
      icon: "question",
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp=>{

      if( resp.value ){
        this._peticiones.cancelarPeticion( this.peticion.id ).subscribe();
        this.router.navigate(['servicios']);
      }

    });

  }

  calificar(){
    console.log("Calificando usuario");
  }

}
