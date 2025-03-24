import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ThemeType = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Default theme is light
  private themeSubject = new BehaviorSubject<ThemeType>('light');
  
  // Observable that components can subscribe to
  public theme$: Observable<ThemeType> = this.themeSubject.asObservable();
  
  constructor() {
    // Check if there's a saved theme preference
    const savedTheme = localStorage.getItem('selectedTheme') as ThemeType;
    if (savedTheme) {
      this.setTheme(savedTheme);
    }
  }

  /**
   * Set the current theme and notify all subscribers
   * @param theme The theme to set ('light' or 'dark')
   */
  public setTheme(theme: ThemeType): void {
    this.themeSubject.next(theme);
    // Save theme preference to localStorage
    localStorage.setItem('selectedTheme', theme);
    // Add theme class to body for global styling
    document.body.className = theme;
  }
}