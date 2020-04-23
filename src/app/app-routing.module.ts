import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'registro',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'inicio-sesion',
    loadChildren: () => import('./pages/inicio-sesion/inicio-sesion.module').then( m => m.InicioSesionPageModule)
  },
  {
    path: 'datos-personales/:id',
    loadChildren: () => import('./pages/datos-personales/datos-personales.module').then( m => m.DatosPersonalesPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'servicios',
    loadChildren: () => import('./pages/servicios/servicios.module').then( m => m.ServiciosPageModule)
  },
  {
    path: 'servicio-especifico/:id',
    loadChildren: () => import('./pages/servicio-especifico/servicio-especifico.module').then( m => m.ServicioEspecificoPageModule)
  },
  {
    path: 'estado-solicitud/:id',
    loadChildren: () => import('./pages/estado-solicitud/estado-solicitud.module').then( m => m.EstadoSolicitudPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'enviar-pqrs',
    loadChildren: () => import('./pages/enviar-pqrs/enviar-pqrs.module').then( m => m.EnviarPqrsPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'buscar/:termino',
    loadChildren: () => import('./pages/buscar/buscar.module').then( m => m.BuscarPageModule)
  },
  {
    path: 'cerrar-cuenta',
    loadChildren: () => import('./pages/cerrar-cuenta/cerrar-cuenta.module').then( m => m.CerrarCuentaPageModule), canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
