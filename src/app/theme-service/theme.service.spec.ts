import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

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

  it('should initialize with light theme by default', (done) => {
    service.theme$.subscribe(theme => {
      expect(theme).toBe('light');
      done();
    });
  });

  it('should initialize with theme from localStorage if available', (done) => {
    localStorage.setItem('theme', 'dark');
    
    // Create a new instance of the service to test initialization
    const newService = new ThemeService();
    
    newService.theme$.subscribe(theme => {
      expect(theme).toBe('dark');
      done();
    });
  });

  it('should update theme when setTheme is called', (done) => {
    service.setTheme('dark');
    service.theme$.subscribe(theme => {
      expect(theme).toBe('dark');
      done();
    });
  });
});