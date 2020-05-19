import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, delay } from 'rxjs/operators';
import { ServicioModel } from '../models/servicio.model';

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {

  private url = 'https://proyecto-serviciojusto.firebaseio.com';

  constructor( private http: HttpClient ) { }

  getServicios(){
    return this.http.get(`${ this.url }/Servicio.json`)
      .pipe(
        map( this.crearArregloServicio )
      );
  }

  private crearArregloServicio( servicioObj: object){
    
    const servicioArray: ServicioModel[] = [];

    if( servicioObj === null ){
      return [];
    }

    Object.keys( servicioObj ).forEach( key =>{

      const servicio: ServicioModel = servicioObj[key];
      servicio.id = key;

      servicioArray.push( servicio );
    });

    return servicioArray;
  }

  getServicio( id: string){
    return this.http.get(`${ this.url }/Servicio/${ id }.json`);
  }

  servicios: ServicioModel[] = [];

  buscando( termino: string ){
  
    this.getServicios().subscribe( resp=> this.servicios = resp );

    let servicioArr: ServicioModel[] = [];
    termino = termino.toLowerCase();

    for( let servicio of this.servicios ){

      let nombre = servicio.nombreServicio.toLowerCase();

      if( nombre.indexOf( termino ) >= 0 ){
        servicioArr.push( servicio )
      }
    }

    return servicioArr;
  }

}
