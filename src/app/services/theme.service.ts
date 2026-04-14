import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentThemeSubject = new BehaviorSubject<Theme>('dark');
  public currentTheme$ = this.currentThemeSubject.asObservable();

  constructor() {
    // წავიკითხოთ შენახული თემა localStorage-დან
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      this.setTheme(savedTheme);
    } else {
      // სისტემის პრეფერენციის შემოწმება
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark ? 'dark' : 'light');
    }
  }

  setTheme(theme: Theme) {
    this.currentThemeSubject.next(theme);
    localStorage.setItem('theme', theme);
    
    // დაამატე/წაშალე dark-theme კლასი body-ზე
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }

  toggleTheme() {
    const currentTheme = this.currentThemeSubject.value;
    this.setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  }

  getCurrentTheme(): Theme {
    return this.currentThemeSubject.value;
  }
}