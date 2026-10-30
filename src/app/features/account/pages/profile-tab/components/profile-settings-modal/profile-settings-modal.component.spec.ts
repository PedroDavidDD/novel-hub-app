import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileSettingsModalComponent } from './profile-settings-modal.component';
import { User, UserRole } from '../../../../../../core/models/user.model';

describe('ProfileSettingsModalComponent', () => {
  let fixture: ComponentFixture<ProfileSettingsModalComponent>;
  let component: ProfileSettingsModalComponent;

  const mockUser: User = {
    id: '123',
    name: 'Juan Perez',
    username: 'juanperez',
    email: 'juan@example.com',
    role: UserRole.USER_COMMON,
    roleDisplayName: 'Member',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileSettingsModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileSettingsModalComponent);
    component = fixture.componentInstance;
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe renderizar el botón CANCEL a la derecha de SAVE CHANGES y centrado', () => {
    fixture.componentRef.setInput('show', true);
    fixture.componentRef.setInput('user', mockUser);
    fixture.detectChanges();

    const actionContainer = fixture.nativeElement.querySelector('.flex.items-center.justify-center.gap-4');
    expect(actionContainer).toBeTruthy();

    const buttons = actionContainer.querySelectorAll('button');
    expect(buttons.length).toBe(2);

    expect(buttons[0].textContent.trim()).toBe('SAVE CHANGES');
    expect(buttons[1].textContent.trim()).toBe('CANCEL');
  });

  it('debe emitir onClose al hacer clic en CANCEL', () => {
    fixture.componentRef.setInput('show', true);
    fixture.componentRef.setInput('user', mockUser);
    fixture.detectChanges();

    let closed = false;
    component.onClose.subscribe(() => {
      closed = true;
    });

    const actionContainer = fixture.nativeElement.querySelector('.flex.items-center.justify-center.gap-4');
    const buttons = actionContainer.querySelectorAll('button');
    const cancelBtn = buttons[1];

    cancelBtn.click();
    fixture.detectChanges();

    expect(closed).toBe(true);
  });
});
