import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ProfileTabComponent } from './profile-tab.component';
import { AuthService } from '../../../auth/services/auth.service';
import { ModalAlertService } from '../../../../shared/services/modal-alert.service';
import { User, UserRole } from '../../../../core/models/user.model';

describe('ProfileTabComponent', () => {
  let component: ProfileTabComponent;
  let fixture: ComponentFixture<ProfileTabComponent>;

  const mockUser: User = {
    id: 'user-123',
    name: 'autorde ninfas',
    username: 'autordeninfas',
    email: 'autordeninfas@gmail.com',
    role: UserRole.USER_COMMON,
    isActive: true,
    permissions: [],
  };

  const userSignal = signal<User | null>(mockUser);

  const authServiceMock = {
    user: userSignal,
    _user: userSignal,
    updateUserData: jasmine.createSpy('updateUserData'),
    logout: jasmine.createSpy('logout'),
  };

  const modalAlertMock = {
    alert: jasmine.createSpy('alert').and.returnValue(Promise.resolve(true)),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileTabComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: ModalAlertService, useValue: modalAlertMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe renderizar el nombre de usuario y email provenientes del servicio', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('autorde ninfas');
    expect(compiled.textContent).toContain('autordeninfas@gmail.com');
  });

  it('debe alternar isModalOpen al invocar openSettingsModal y closeSettingsModal', () => {
    expect(component.isModalOpen()).toBe(false);

    component.openSettingsModal();
    expect(component.isModalOpen()).toBe(true);

    component.closeSettingsModal();
    expect(component.isModalOpen()).toBe(false);
  });

  it('debe formatear con "-" campos nulos usando formatDash', () => {
    expect(component.formatDash(null)).toBe('-');
    expect(component.formatDash(undefined)).toBe('-');
    expect(component.formatDash('   ')).toBe('-');
    expect(component.formatDash('Valido')).toBe('Valido');
  });

  it('debe formatear fecha con helper formatDate en formato "dd/mm/aaaa hh:mm:ss"', () => {
    expect(component.formatDate(null)).toBe('-');
    expect(component.formatDate(new Date(2026, 9, 25, 14, 30, 0))).toBe('25/10/2026 14:30:00');
  });

  it('debe renderizar la etiqueta "Role" y el rol o displayName del usuario', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Role');
    expect(compiled.textContent).not.toContain('Rank');
  });
});
