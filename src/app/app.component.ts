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

  public selectedIndex = 0;
  public appPages;
  visible: boolean = false;

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

    if( this.auth.leerToken() ){
      this.visible = true;
      this.appPages = [
        {
          title: 'Servicios',
          url: '/servicios',
          icon: 'headset'
        },
        {
          title: 'Mis pedidos',
          url: '/mis-pedidos',
          icon: 'reader'
        },
        {
          title: 'Enviar PQRS',
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

    }else{
      this.visible = false;
      this.appPages = [
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
        }
      ];

    }

   


    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }

  cerrarSesion(){
    this.auth.logout();
    setTimeout(() => location.reload(), 1000);
    this.router.navigateByUrl('/inicio-sesion');
  }
}
