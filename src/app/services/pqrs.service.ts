import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PqrsModel } from '../models/pqrs.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PqrsService {

  private url = 'https://proyecto-serviciojusto.firebaseio.com';

  constructor( private http: HttpClient ) { }

  crearPqrs( pqrs: PqrsModel ){

    return this.http.post(`${ this.url }/Pqrs.json`, pqrs)
      .pipe(
        map( (resp: any) =>{
          pqrs.id = resp.name;
          return pqrs
        } )
      );

  }
}
