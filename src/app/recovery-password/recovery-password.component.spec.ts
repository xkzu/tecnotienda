import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecoveryPasswordComponent } from './recovery-password.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

class MockRouter {
  navigate(path: string[]) {
    return path;
  }
}

describe('RecoveryPasswordComponent', () => {
  let component: RecoveryPasswordComponent;
  let fixture: ComponentFixture<RecoveryPasswordComponent>;
  let httpMock: HttpTestingController;
  let router: MockRouter;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecoveryPasswordComponent],
      imports: [HttpClientTestingModule, FormsModule], // Asegúrate de incluir FormsModule
      providers: [{ provide: Router, useClass: MockRouter }],
    }).compileComponents();

    fixture = TestBed.createComponent(RecoveryPasswordComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router) as unknown as MockRouter;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the recoveryPassword endpoint on recoveryPassword', () => {
    const email = 'test@example.com';
    const password = 'newpassword';
    component.email = email;
    component.password = password;

    spyOn(window, 'alert');
    spyOn(router, 'navigate');

    component.recoveryPassword();

    const req = httpMock.expectOne(
      `http://localhost:8095/usuarios/recuperar/password/${email}/${password}`
    );
    expect(req.request.method).toBe('PUT');
    req.flush({});

    expect(window.alert).toHaveBeenCalledWith(
      'La contraseña ha sido actualizada correctamente.'
    );
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should handle errors on recoveryPassword', () => {
    const email = 'test@example.com';
    const password = 'newpassword';
    component.email = email;
    component.password = password;

    spyOn(window, 'alert');

    component.recoveryPassword();

    const req = httpMock.expectOne(
      `http://localhost:8095/usuarios/recuperar/password/${email}/${password}`
    );
    expect(req.request.method).toBe('PUT');
    req.error(new ErrorEvent('Network error'));

    expect(window.alert).toHaveBeenCalledWith(
      'Ocurrió un error al actualizar la contraseña. Por favor, inténtalo nuevamente.'
    );
  });

  afterEach(() => {
    httpMock.verify();
  });
});
