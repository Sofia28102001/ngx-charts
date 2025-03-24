import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ThemeService } from './services/theme.service';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let themeServiceSpy: jasmine.SpyObj<ThemeService>;

  beforeEach(async () => {
    themeServiceSpy = jasmine.createSpyObj('ThemeService', ['setTheme']);
    // Mock the theme$ observable
    themeServiceSpy.theme$ = of('light');

    await TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: ThemeService, useValue: themeServiceSpy }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should change theme and update theme service', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    
    app.changeTheme('dark');
    
    expect(app.theme).toBe('dark');
    expect(app.strokeColor).toBe('#ffffff');
    expect(themeServiceSpy.setTheme).toHaveBeenCalledWith('dark');
  });
});