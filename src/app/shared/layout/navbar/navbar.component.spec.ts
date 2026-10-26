import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { NavbarComponent } from './navbar.component';
import { NavbarUserMenuComponent } from './components';
import { NavigationItem } from '../../../core/models/navigation.model';

@Component({
  selector: 'navbar-user-menu',
  standalone: true,
  template: '<div class="mock-user-menu">User Menu</div>',
})
class MockNavbarUserMenuComponent {
  @Input() isLoggedIn: boolean = false;
}

describe('NavbarComponent (Dumb Component)', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  const mockLinks: NavigationItem[] = [
    {
      id: '1',
      label: 'Home',
      path: '/',
      order: 1,
      isActive: true,
      children: [],
    },
    {
      id: '2',
      label: 'Novels',
      path: '/novels',
      order: 2,
      isActive: true,
      children: [
        {
          id: '2-1',
          label: 'Action',
          path: '/novels?genre=action',
          order: 1,
          isActive: true,
        },
        {
          id: '2-2',
          label: 'Fantasy',
          path: '/novels?genre=fantasy',
          order: 2,
          isActive: true,
        },
      ],
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
      ],
    })
      .overrideComponent(NavbarComponent, {
        remove: { imports: [NavbarUserMenuComponent] },
        add: { imports: [MockNavbarUserMenuComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe recibir arrLinks como input y renderizar enlaces principales', () => {
    fixture.componentRef.setInput('arrLinks', mockLinks);
    fixture.detectChanges();

    const desktopLinks = fixture.nativeElement.querySelectorAll('.navbar__links .navbar__link');
    const texts = Array.from(desktopLinks).map((el: any) => el.textContent.trim());

    expect(texts).toContain('Home');
    expect(texts).toContain('Novels');
  });

  it('debe renderizar hijos de nivel 2 cuando el ítem tiene children', () => {
    fixture.componentRef.setInput('arrLinks', mockLinks);
    fixture.detectChanges();

    const dropdownLinks = fixture.nativeElement.querySelectorAll('.group-hover\\:block a');
    const texts = Array.from(dropdownLinks).map((el: any) => el.textContent.trim());

    expect(texts).toContain('Action');
    expect(texts).toContain('Fantasy');
  });

  it('debe emitir onSearchClick cuando se presiona el botón de búsqueda', () => {
    spyOn(component.onSearchClick, 'emit');

    const searchButton = fixture.nativeElement.querySelector('.navbar__button--search');
    searchButton.click();

    expect(component.onSearchClick.emit).toHaveBeenCalled();
  });

  it('debe alternar boMenuOpen y emitir onToggleMenu al presionar burger button', () => {
    spyOn(component.onToggleMenu, 'emit');

    const burgerButton = fixture.nativeElement.querySelector('.navbar__button--burger');
    burgerButton.click();

    expect(component.boMenuOpen()).toBe(true);
    expect(component.onToggleMenu.emit).toHaveBeenCalled();

    burgerButton.click();
    expect(component.boMenuOpen()).toBe(false);
  });

  it('debe cerrar el menú móvil al llamar a closeMenu', () => {
    component.toggleMenuOpen();
    expect(component.boMenuOpen()).toBe(true);

    component.closeMenu();
    expect(component.boMenuOpen()).toBe(false);
    expect(component.openSubmenuId()).toBeNull();
  });

  it('debe alternar el submenú móvil con toggleSubmenu', () => {
    component.toggleSubmenu('novels-sub');
    expect(component.isSubmenuOpen('novels-sub')).toBe(true);

    component.toggleSubmenu('novels-sub');
    expect(component.isSubmenuOpen('novels-sub')).toBe(false);
  });
});
