import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { ThemeService } from '../theme-service/theme.service';
import { BehaviorSubject } from 'rxjs';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let themeService: jasmine.SpyObj<ThemeService>;
  let themeSubject: BehaviorSubject<string>;

  beforeEach(async () => {
    themeSubject = new BehaviorSubject<string>('light');
    
    const themeServiceSpy = jasmine.createSpyObj('ThemeService', ['setTheme']);
    // Mock the theme$ observable
    Object.defineProperty(themeServiceSpy, 'theme$', {
      get: () => themeSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      declarations: [SidebarComponent],
      providers: [
        { provide: ThemeService, useValue: themeServiceSpy }
      ]
    }).compileComponents();

    themeService = TestBed.inject(ThemeService) as jasmine.SpyObj<ThemeService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update currentTheme when theme changes', () => {
    expect(component.currentTheme).toBe('light');
    
    themeSubject.next('dark');
    expect(component.currentTheme).toBe('dark');
  });
});