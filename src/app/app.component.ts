import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { UsuarioModel } from './models/Usuario.model';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

  //Ver despues como mostrar correo y nombre de la persona en el menu
  //usuario: UsuarioModel = this.auth.usuarioParaTodo;
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Registro',
      url: 'registro',
      icon: 'add-circle'
    },
    {
      title: 'Iniciar sesión',
      url: '/inicio-sesion',
      icon: 'people'
    },
    {
      title: 'Servicios',
      url: '/servicios',
      icon: 'headset'
    },
    {
      title: 'Eviar PQRS',
      url: '/enviar-pqrs',
      icon: 'chatbox'
    },
    {
      title: 'Datos personales',
      url: '/datos-personales/actualiza',
      icon: 'person'
    },
    {
      title: 'Cerrar cuenta',
      url: '/cerrar-cuenta',
      icon: 'trash'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar, 
    private router: Router, 
    public auth: AuthService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  // autenticado: boolean;

  ngOnInit() {
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }

    // this.autenticado = this.auth.estaAutenticado();

    // if( this.autenticado ){
    //   this.usuario = this.auth.usuarioParaTodo;
    // }

    // console.log("Estoy conectado", this.usuario);
  }

  cerrarSesion(){
    this.auth.logout();
    this.router.navigateByUrl('/inicio-sesion');
  }
}
