import { Component, OnInit, OnDestroy } from '@angular/core';
import { ThemeService, ThemeType } from '../../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  currentTheme: ThemeType = 'light';
  private themeSubscription: Subscription;

  constructor(private themeService: ThemeService) { 
    this.themeSubscription = this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    // Cleanup subscription to prevent memory leaks
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  // Method to toggle theme - can be used if sidebar has its own theme toggle
  toggleTheme(): void {
    const newTheme: ThemeType = this.currentTheme === 'light' ? 'dark' : 'light';
    this.themeService.setTheme(newTheme);
  }
}