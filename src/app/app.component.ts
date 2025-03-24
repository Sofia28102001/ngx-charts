import { Component } from '@angular/core';
import { ThemeService, ThemeType } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  theme: ThemeType = 'light';
  strokeColor: string = '#000000';

  constructor(private themeService: ThemeService) {
    this.themeService.theme$.subscribe(theme => this.theme = theme);
  }

  changeTheme(theme: ThemeType) {
    this.theme = theme;
    if (theme === 'light') {
      this.strokeColor = '#000000';
    } else {
      this.strokeColor = '#ffffff';
    }
    
    // Update theme in the service
    this.themeService.setTheme(theme);
  }
}