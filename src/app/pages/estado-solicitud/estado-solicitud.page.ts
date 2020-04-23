import { Component, OnInit } from '@angular/core';
import { PeticionModel } from '../../models/peticion.model';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PeticionesService } from '../../services/peticiones.service';
import { AfiliadoModel } from '../../models/afiliado.model';
import { AlertController } from '@ionic/angular';
import { ServiciosService } from '../../services/servicios.service';
import { ServicioModel } from '../../models/servicio.model';

@Component({
  selector: 'app-estado-solicitud',
  templateUrl: './estado-solicitud.page.html',
  styleUrls: ['./estado-solicitud.page.scss'],
})
export class EstadoSolicitudPage implements OnInit {

  peticion: PeticionModel = new PeticionModel();
  afiliadoArray: AfiliadoModel[] = [];
  afiliado: AfiliadoModel = new AfiliadoModel();
  servicio: ServicioModel = new ServicioModel();
  hora = 120;

  constructor( private activatedRoute: ActivatedRoute, private router: Router,
                private _peticiones: PeticionesService, public alertController: AlertController,
                private _service: ServiciosService ) { }

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

      this._service.getServicio( this.peticion.idServicio ).subscribe( (resp: ServicioModel)=>{
        this.servicio = resp;

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

  async presentAlertRadio() {
    const alert = await this.alertController.create({
      header: `Calificando a ${ this.afiliado.Nombre } `,
      inputs: [
        {
          name: 'radio1',
          type: 'radio',
          label: '1',
          value: 1,
          checked: true
        },
        {
          name: 'radio2',
          type: 'radio',
          label: '2',
          value: 2
        },
        {
          name: 'radio3',
          type: 'radio',
          label: '3',
          value: 3
        },
        {
          name: 'radio4',
          type: 'radio',
          label: '4',
          value: 4
        },
        {
          name: 'radio5',
          type: 'radio',
          label: '5',
          value: 5
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ok',
          handler: ( valor ) => {
            this.peticion.calificacionAfiliado = valor;
            this._peticiones.calificaAfiliado( this.peticion ).subscribe((resp: PeticionModel)=>{
              this.peticion.calificacionAfiliado = resp.calificacionAfiliado;
              const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                onOpen: (toast) => {
                  toast.addEventListener('mouseenter', Swal.stopTimer)
                  toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
              })
              
              Toast.fire({
                icon: 'success',
                title: 'Tu calificacion ha sido guardada'
              })
            });

            //Ocultar botón
            document.getElementById("ocultar").style.display='none';
          }
        }
      ]
    });

    await alert.present();
  }

  salir(){
    this.router.navigate(['servicios']);
  }

}
