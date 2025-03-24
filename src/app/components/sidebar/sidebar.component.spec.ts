import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { ThemeService } from '../../services/theme.service';
import { BehaviorSubject } from 'rxjs';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let themeService: jasmine.SpyObj<ThemeService>;
  let themeSubject: BehaviorSubject<'light' | 'dark'>;

  beforeEach(async () => {
    themeSubject = new BehaviorSubject<'light' | 'dark'>('light');
    themeService = jasmine.createSpyObj('ThemeService', ['setTheme']);
    // Set up the mock theme$ observable
    Object.defineProperty(themeService, 'theme$', {
      get: () => themeSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      declarations: [ SidebarComponent ],
      providers: [
        { provide: ThemeService, useValue: themeService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update theme when service emits new theme', () => {
    expect(component.currentTheme).toBe('light');
    
    themeSubject.next('dark');
    expect(component.currentTheme).toBe('dark');
  });

  it('should toggle theme when toggleTheme is called', () => {
    component.toggleTheme();
    expect(themeService.setTheme).toHaveBeenCalledWith('dark');
  });
});