import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-servicio-especifico',
  templateUrl: './servicio-especifico.page.html',
  styleUrls: ['./servicio-especifico.page.scss'],
})
export class ServicioEspecificoPage implements OnInit {

  nombreServicio: string;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.nombreServicio = this.activatedRoute.snapshot.paramMap.get('id');
  }

}
