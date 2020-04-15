import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
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
      url: '/datos-personales',
      icon: 'person'
    },
    {
      title: 'Cerrar cuenta',
      url: '/folder/Spam',
      icon: 'trash'
    }
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

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

  ngOnInit() {
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }

  cerrarSesion(){
    this.auth.logout();
    this.router.navigateByUrl('/inicio-sesion');
  }
}
