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
  calificacionAfiliado: number;
  hora = 120;

  constructor( private activatedRoute: ActivatedRoute, private router: Router,
                private _peticiones: PeticionesService, public alertController: AlertController,
                private _service: ServiciosService,
                private _auth: AuthService,
                private _pqrs: PqrsService ) { }

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
            this.afiliado.Cedula = item.Cedula;
            this.afiliado.Direccion = item.Direccion;
            this.afiliado.FechaNacimiento = item.FechaNacimiento;
            this.afiliado.Habilidad = item.Habilidad;
            this.afiliado.Nombre = item.Nombre;
            this.afiliado.Telefono = item.Telefono;
            this.afiliado.estado = item.estado;
            
            this.afiliado.fotoPerfil = item.fotoPerfil;
            this.afiliado.typeIdAfiliado = item.typeIdAfiliado;
            this.afiliado.typeIdUsuario = item.typeIdUsuario;
            this.pqrsEnvio.nombreAfiliado = item.Nombre + " " + item.Apellido;
            
            this.calificacionAfiliado = this.afiliado.Calificacion.valor
          }
        }
      });

      this._service.getServicio( this.peticion.idServicio ).subscribe( (resp: ServicioModel)=>{
        this.servicio = resp;
        this.servicio.idPeticion = id;

      });

      if(this.peticion.estado === 'finalizado'){
        if( this.peticion.id ===  localStorage.getItem('idPeticion')){
          localStorage.removeItem('idPeticion');
        }else if( this.peticion.id ===  localStorage.getItem('idPeticion2') ){
          localStorage.removeItem('idPeticion2');
        }else if( this.peticion.id ===  localStorage.getItem('idPeticion3') ){
          localStorage.removeItem('idPeticion3');
        }
      }
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

  recargar(){
    this.ngOnInit();
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
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then( aceptar=>{

      this._peticiones.getPeticion( this.peticion.id ).subscribe(resp=>{

        if( aceptar.value ){

          if( resp['estado'] === 'solicitado'){
            this._peticiones.cancelarPeticion( this.peticion.id ).subscribe();
            
            this.router.navigate(['servicios']);

            setTimeout(() => location.reload(), 1000);
            if( this.peticion.id ===  localStorage.getItem('idPeticion')){
              localStorage.removeItem('idPeticion');
              return;
            }else if( this.peticion.id ===  localStorage.getItem('idPeticion2') ){
              localStorage.removeItem('idPeticion2');
              return;
            }else if( this.peticion.id ===  localStorage.getItem('idPeticion3') ){
              localStorage.removeItem('idPeticion3');
              return;
            }
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

            delete this.afiliado.typeIdUsuario;

            let calificacion: number;

            if( this.afiliado.Calificacion.contador == 0){
  
              calificacion = (valor + this.afiliado.Calificacion.valor) / 2;
        
              this.afiliado.Calificacion = { contador: 2, valor: calificacion }
      
              this._auth.calificandoAfiliado( this.afiliado ).subscribe();
            }else{
        
              calificacion = (this.afiliado.Calificacion.valor * this.afiliado.Calificacion.contador + valor)/
                                  (this.afiliado.Calificacion.contador + 1)
        
              this.afiliado.Calificacion = { contador: this.afiliado.Calificacion.contador + 1, valor: calificacion }
        
              this._auth.calificandoAfiliado( this.afiliado ).subscribe();   
            }

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

            this.salir();
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
    if( this.peticion.id ===  localStorage.getItem('idPeticion')){
      localStorage.removeItem('idPeticion');
    }else if( this.peticion.id ===  localStorage.getItem('idPeticion2') ){
      localStorage.removeItem('idPeticion2');
    }else if( this.peticion.id ===  localStorage.getItem('idPeticion3') ){
      localStorage.removeItem('idPeticion3');
    }
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
          placeholder: 'Escribe el mensaje para el administrador'
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
