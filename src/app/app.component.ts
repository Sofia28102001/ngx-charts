import { Component, OnInit, OnDestroy } from '@angular/core';
import { ThemeService } from './theme-service/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  theme: string = 'light';
  strokeColor: string = '#000000';
  private themeSubscription: Subscription;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // Subscribe to theme changes
    this.themeSubscription = this.themeService.theme$.subscribe(theme => {
      this.theme = theme;
      this.updateThemeStyles(theme);
    });
  }

  changeTheme(theme: string) {
    this.themeService.setTheme(theme);
  }

  updateThemeStyles(theme: string): void {
    this.strokeColor = theme === 'light' ? '#000000' : '#ffffff';
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }
}