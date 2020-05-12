import { Component, OnInit } from '@angular/core';
import { PeticionModel } from '../../models/peticion.model';
import { PeticionesService } from 'src/app/services/peticiones.service';
import { ServiciosService } from '../../services/servicios.service';
import { ServicioModel } from '../../models/servicio.model';
import { AlertController } from '@ionic/angular';
import { PqrsModel } from '../../models/pqrs.model';
import { PqrsService } from '../../services/pqrs.service';
import { AuthService } from '../../services/auth.service';
import { UsuarioModel } from '../../models/Usuario.model';
import { AfiliadoModel } from '../../models/afiliado.model';

@Component({
  selector: 'app-mis-pedidos',
  templateUrl: './mis-pedidos.page.html',
  styleUrls: ['./mis-pedidos.page.scss'],
})
export class MisPedidosPage implements OnInit {

  peticionArray: PeticionModel[] = [];
  servicioArray: ServicioModel[] = [];
  usuarioArray: UsuarioModel[] = [];
  afiliadoArray: AfiliadoModel[] = [];
  nombreAfiliado: string;
  apellidoAfiliado: string;
  pqrsEnvio: PqrsModel = new PqrsModel();

  constructor(  private _peticion: PeticionesService,
                private _servicio: ServiciosService,
                public alertController: AlertController,
                private _pqrs: PqrsService,
                private _auth: AuthService ) { }

  ngOnInit() {

    this._peticion.getPeticiones().subscribe( resp=>{
      this.peticionArray = resp;

      for( let item of this.peticionArray ){
        if( item.typeIdUsuario == localStorage.getItem('localId')){

          this._servicio.getServicio( item.idServicio ).subscribe( (serv:ServicioModel)=>{
            serv.idPeticion = item.id;

            this._peticion.getAfiliados().subscribe( resp=>{
              this.afiliadoArray = resp;
              for( let obj of this.afiliadoArray ){
                if( item.typeIdAfiliado == obj.typeIdAfiliado ){
                  serv.nombreAfiliado = obj.Nombre;
                  serv.apellidoAfiliado = obj.Apellido
                  this.servicioArray.push(serv);
                }
              }
            })  
          });
        }
      }
    });
  }

  numero: string;

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

            this._auth.getTodosUsuario().subscribe(resp=>{
              this.usuarioArray = resp;

              for( let item of this.usuarioArray ){
                if( this._auth.leerLocalId() == item.typeId){
                  this.numero = item.celular;
                }
              }

            this.pqrsEnvio.idPeticion = servicio.idPeticion;
            this.pqrsEnvio.mensaje = blah.mensaje;
            this.pqrsEnvio.quien = 'usuario';
            this.pqrsEnvio.numero = this.numero
            this._pqrs.crearPqrs( this.pqrsEnvio ).subscribe();
            });
          }
        }
      ]
    });

    await alert.present();
  }




}
