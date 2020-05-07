import { Component, OnInit } from '@angular/core';
import { PeticionModel } from '../../models/peticion.model';
import { PeticionesService } from 'src/app/services/peticiones.service';
import { ServiciosService } from '../../services/servicios.service';
import { ServicioModel } from '../../models/servicio.model';
import { AlertController } from '@ionic/angular';
import { PqrsModel } from '../../models/pqrs.model';
import { PqrsService } from '../../services/pqrs.service';

@Component({
  selector: 'app-mis-pedidos',
  templateUrl: './mis-pedidos.page.html',
  styleUrls: ['./mis-pedidos.page.scss'],
})
export class MisPedidosPage implements OnInit {

  peticionArray: PeticionModel[] = [];
  servicioArray: ServicioModel[] = [];
  nombreAfiliado: string;
  apellidoAfiliado: string;
  pqrsEnvio: PqrsModel = new PqrsModel();

  constructor(  private _peticion: PeticionesService,
                private _servicio: ServiciosService,
                public alertController: AlertController,
                private _pqrs: PqrsService ) { }

  ngOnInit() {

    this._peticion.getPeticiones().subscribe( resp=>{
      this.peticionArray = resp;

      for( let item of this.peticionArray ){
        if( item.typeIdUsuario == localStorage.getItem('localId')){

          this._servicio.getServicio( item.idServicio ).subscribe( (resp:ServicioModel)=>{
            resp.idPeticion = item.id;
            this.servicioArray.push(resp);
          });

          this._peticion.getAfiliados().subscribe( resp=>{
            for(let datos of resp){
              if( item.typeIdAfiliado == datos.typeIdAfiliado ){
                this.nombreAfiliado = datos.Nombre;
                this.apellidoAfiliado = datos.Apellido;
              }
            }
          })

        }
      }
    });

  }

  async mefue( servicio: ServicioModel ) {
    const alert = await this.alertController.create({
      header: 'Escribe tu mensaje!',
      inputs: [
        {
          name: 'mensaje',
          type: 'textarea',
          placeholder: 'Escribe el mensaje para el usuario'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Ok',
          handler: ( blah ) => {
            this.pqrsEnvio.idPeticion = servicio.idPeticion;
            this.pqrsEnvio.mensaje = blah.mensaje;
            this.pqrsEnvio.quien = 'usuario';
            this._pqrs.crearPqrs( this.pqrsEnvio ).subscribe();
          }
        }
      ]
    });

    await alert.present();
  }




}
