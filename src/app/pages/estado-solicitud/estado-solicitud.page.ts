import { Component, OnInit } from '@angular/core';
import { PeticionModel } from '../../models/peticion.model';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PeticionesService } from '../../services/peticiones.service';
import { AfiliadoModel } from '../../models/afiliado.model';
import { AlertController } from '@ionic/angular';
import { ServiciosService } from '../../services/servicios.service';
import { ServicioModel } from '../../models/servicio.model';
import { UsuarioModel } from '../../models/Usuario.model';
import { AuthService } from '../../services/auth.service';
import { PqrsModel } from '../../models/pqrs.model';
import { PqrsService } from '../../services/pqrs.service';

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
  usuario: UsuarioModel[] = []
  pqrsEnvio: PqrsModel = new PqrsModel();
  direccion: string;
  hora = 120;

  constructor( private activatedRoute: ActivatedRoute, private router: Router,
                private _peticiones: PeticionesService, public alertController: AlertController,
                private _service: ServiciosService,
                private _auth: AuthService,
                private _pqrs: PqrsService ) { }

  ngOnInit() {

    const id = this.activatedRoute.snapshot.paramMap.get('id');
    localStorage.setItem('idPeticion', id);
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
            this.afiliado.Calificacion = item.Calificacion['valor'];
            this.afiliado.FechaNacimiento = item.FechaNacimiento;
            this.afiliado.Nombre = item.Nombre;
            this.afiliado.Telefono = item.Telefono;
            this.afiliado.fotoPerfil = item.fotoPerfil;
            this.afiliado.typeIdAfiliado = item.typeIdAfiliado;
            this.afiliado.Telefono = item.Telefono;
            this.afiliado.typeIdUsuario = item.typeIdUsuario;
            this.pqrsEnvio.nombreAfiliado = item.Nombre + " " + item.Apellido;

          }
        }
      });

      this._service.getServicio( this.peticion.idServicio ).subscribe( (resp: ServicioModel)=>{
        this.servicio = resp;
        this.servicio.idPeticion = id;

      });

    });

    this._auth.getTodosUsuario().subscribe(resp=>{
      this.usuario = resp

      for( let item of this.usuario ){
        if( item.typeId == localStorage.getItem('localId')){
          this.direccion = item.direccion;
          this.pqrsEnvio.nombreUsuario = item.nombre + " " + item.apellido
        }
      }
    })
  }

  doRefresh(event) {
    this.ngOnInit();

    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  terminarServicio(){
    this._peticiones.getPeticion( this.peticion.id ).subscribe(resp=>{

      if( resp['estado'] === "finalizado" ){
        localStorage.removeItem('idPeticion');
      };
      location.reload();
    })
  }

  cancelar(){
    Swal.fire({
      title: '¿Está seguro?',
      text: `¿Está seguro que desea cancelar el servicio?`,
      icon: "question",
      showConfirmButton: true,
      showCancelButton: true
    }).then( aceptar=>{

      this._peticiones.getPeticion( this.peticion.id ).subscribe(resp=>{

        if( aceptar.value ){

          if( resp['estado'] === 'solicitado'){
            this._peticiones.cancelarPeticion( this.peticion.id ).subscribe();
            localStorage.removeItem('idPeticion');
            this.router.navigate(['servicios']);
          }else{
            Swal.fire(
              `Tu servicio está en ejecución`,
              'No se puede cancelar el servicio',
              'error'
            );
            this.router.navigate(['estado-solicitud', localStorage.getItem('idPeticion')]);
          }
        }else{
          this.router.navigate(['estado-solicitud', localStorage.getItem('idPeticion')]);
        }
        
      });
     

    });

  }

  async presentAlertRadio() {
    const alert = await this.alertController.create({
      header: `Calificando a ${ this.afiliado.Nombre } `,
      inputs: [
        {
          name: 'radio1',
          type: 'radio',
          label: 'Pésimo',
          value: 1
        },
        {
          name: 'radio2',
          type: 'radio',
          label: 'Malo',
          value: 2
        },
        {
          name: 'radio3',
          type: 'radio',
          label: 'Regular',
          value: 3
        },
        {
          name: 'radio4',
          type: 'radio',
          label: 'Bueno',
          value: 4
        },
        {
          name: 'radio5',
          type: 'radio',
          label: 'Excelente',
          value: 5,
          checked: true
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

  Usuario: UsuarioModel = new UsuarioModel();
  usuarioArray: UsuarioModel[] = []
  peticionCalificacion: PeticionModel = new PeticionModel();
  calificacion: number;

  salir(){
    this.router.navigate(['servicios']);
    localStorage.removeItem('idPeticion');
    this._peticiones.getPeticion( this.peticion.id ).subscribe((resp:PeticionModel)=>{
      this.peticionCalificacion = resp;

      if( resp['calificacionUsuario'] ){

        const calificacionUsuario = resp['calificacionUsuario'];
        const typeUsuario: string = resp['typeIdUsuario'];

        this._auth.getTodosUsuario().subscribe((resp)=>{
          
          this.usuarioArray = resp;

         for( let item of this.usuarioArray){
           if( item.typeId == typeUsuario ){

             this.Usuario.id = item.id;
             this.Usuario.calificacion = calificacionUsuario;
             this.Usuario.nombre = item.nombre;
             this.Usuario.apellido = item.apellido;
             this.Usuario.celular = item.celular;
             this.Usuario.direccion = item.direccion;
             this.Usuario.fechaNacimiento = item.fechaNacimiento;
             this.Usuario.typeId = item.typeId;

             if( item.calificacion.contador == 0 ){
               this.calificacion = ( this.peticionCalificacion.calificacionUsuario + item.calificacion.valor )/2;
               this.Usuario.calificacion = { contador: 2, valor: this.calificacion };

             }else{

              this.calificacion = (item.calificacion.valor * item.calificacion.contador + this.peticionCalificacion.calificacionUsuario)/
                                  (item.calificacion.contador + 1)

              this.Usuario.calificacion = { contador: item.calificacion.contador + 1, valor: this.calificacion }

             }
             this._auth.actualizarUsuario( this.Usuario ).subscribe();
             
            }
          }
        });
      } 
    });
    setTimeout(() => location.reload(), 1000);
  }

  /**
   * Método que sirve para comentar como le va con el servicio con el usuario
   */
  async meva(  ) {
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
            this.pqrsEnvio.idPeticion = this.servicio.idPeticion;
            this.pqrsEnvio.mensaje = blah.mensaje;
            this.pqrsEnvio.quien = 'usuario';
            this._pqrs.crearPqrs( this.pqrsEnvio ).subscribe();
          }
        }
      ]
    });

    await alert.present();
  }

  async pagoTarjeta() {
    const alert = await this.alertController.create({
      header: 'Pagando!',
      inputs: [
        {
          name: 'numeroTarjeta',
          type: 'number',
          placeholder: 'Número de Tarjeta',
          min: 0,
          max: 16
        },
        {
          name: 'nombreTitular',
          type: 'textarea',
          placeholder: 'Nombre del titular'
        },
        {
          name: 'fechaVencimiento',
          type: 'text',
          placeholder: 'Fecha vencimiento: mm/yy',
          min: 0,
          max: 6
        },
        {
          name: 'codigoSeguridad',
          type: 'number',
          placeholder: 'Codigo de seguridad',
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
            document.getElementById("ocultarPago").style.display='none';
          }
        }
      ]
    });

    await alert.present();
  }




}
