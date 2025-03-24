import { TestBed } from '@angular/core/testing';
import { ThemeService, ThemeType } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default theme if no saved preference', () => {
    service.theme$.subscribe(theme => {
      expect(theme).toBe('light');
    });
  });

  it('should load theme from localStorage if available', () => {
    localStorage.setItem('selectedTheme', 'dark');
    
    // Re-create service to trigger constructor logic
    service = TestBed.inject(ThemeService);
    
    service.theme$.subscribe(theme => {
      expect(theme).toBe('dark');
    });
  });

  it('should update theme and save to localStorage when setTheme is called', () => {
    service.setTheme('dark');
    
    service.theme$.subscribe(theme => {
      expect(theme).toBe('dark');
    });
    expect(localStorage.getItem('selectedTheme')).toBe('dark');
  });
});