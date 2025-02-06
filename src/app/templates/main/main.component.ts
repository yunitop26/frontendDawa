import {Component, HostListener} from '@angular/core';
import {AuthService} from "../../services/auth/auth.service";
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {NgClass, NgIf} from "@angular/common";
import {ClickOutsideDirective} from "../../shared/directivas/click-outside.directive";

@Component({
  selector: 'app-main',
  imports: [
    RouterOutlet,
    NgClass,
    RouterLinkActive,
    RouterLink,
    NgIf,
    ClickOutsideDirective
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  isDarkMode = false;
  isDropdownOpen = false;
  isSidebarVisible: boolean = false;
  isOpen = false;
  protected initialUserLS: string = '';
  protected usernameLS: string = '';

  isLargeScreen: boolean = false;

  constructor(private authService:AuthService) {
    this.checkScreenSize(); // Evaluar el tamaño de pantalla al cargar el componente
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('isDarkMode', JSON.stringify(this.isDarkMode));
  }

  async ngOnInit() {
    this.getInfoUser();
    const storedDarkMode = localStorage.getItem('isDarkMode');
    if (storedDarkMode) {
      this.isDarkMode = JSON.parse(storedDarkMode);
      if (this.isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(event: Event) {
    if (!(event.target as HTMLElement).closest('#dropdown-account')) {
      this.isDropdownOpen = false;
    }
  }

  // Alternar visibilidad del Sidebar
  toggleSidebar(): void {
    if (!this.isLargeScreen) {
      // Solo permite alternar si estamos en pantallas pequeñas
      this.isSidebarVisible = !this.isSidebarVisible;
    }
  }

  // Detectar cambios de tamaño de pantalla y ajusta la visibilidad
  @HostListener('window:resize', [])
  onResize(): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    this.isLargeScreen = window.innerWidth >= 1024; // lg en Tailwind es 1024px
    if (this.isLargeScreen) {
      this.isSidebarVisible = false; // Reseteamos `isSidebarVisible` para evitar conflictos
    }
  }

  logout() {
    this.authService.logout();
    window.location.href = '/';
  }

  getInfoUser() {
    //Tomar el usuario del local storage
    this.usernameLS = localStorage.getItem('username') ?? '??';
    this.initialUserLS = this.usernameLS.slice(0, 2).toUpperCase();
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

}
