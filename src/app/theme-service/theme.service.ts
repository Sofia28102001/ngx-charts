import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // BehaviorSubject to maintain the current theme state
  private themeSubject: BehaviorSubject<string> = new BehaviorSubject<string>('light');
  
  // Observable that components can subscribe to
  public theme$: Observable<string> = this.themeSubject.asObservable();

  constructor() {
    // Initialize theme from localStorage if available
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.themeSubject.next(savedTheme);
    }
  }

  // Method to change the current theme
  setTheme(theme: string): void {
    // Save theme to localStorage for persistence
    localStorage.setItem('theme', theme);
    this.themeSubject.next(theme);
  }
}