import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CerrarCuentaPage } from './cerrar-cuenta.page';

describe('CerrarCuentaPage', () => {
  let component: CerrarCuentaPage;
  let fixture: ComponentFixture<CerrarCuentaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CerrarCuentaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CerrarCuentaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
