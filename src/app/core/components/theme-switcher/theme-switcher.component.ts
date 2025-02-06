import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  templateUrl: './theme-switcher.component.html',
  styleUrls: ['./theme-switcher.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ThemeSwitcherComponent implements OnInit {
  isDarkMode = false;

  ngOnInit() {
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
    this.updateBodyClass();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.updateBodyClass();
  }

  private updateBodyClass() {
    document.body.classList.toggle('dark-mode', this.isDarkMode);
  }
}
