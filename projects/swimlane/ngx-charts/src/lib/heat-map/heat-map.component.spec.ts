import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeatMapComponent } from './heat-map.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('<ngx-charts-heat-map>', () => {
  let component: HeatMapComponent;
  let fixture: ComponentFixture<HeatMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeatMapComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(HeatMapComponent);
    component = fixture.componentInstance;
  });

  it('should display data labels when showDataLabel is true', () => {
    component.showDataLabel = true;
    fixture.detectChanges();
    
    const labels = fixture.nativeElement.querySelectorAll('.heat-map-label');
    expect(labels.length).toBeGreaterThan(0);
    
    // Verify the label text matches the cell values
    const firstCellValue = component.results[0].series[0].value;
    expect(labels[0].textContent).toContain(firstCellValue.toLocaleString());
  });
  
  it('should not display data labels when showDataLabel is false', () => {
    component.showDataLabel = false;
    fixture.detectChanges();
    
    const labels = fixture.nativeElement.querySelectorAll('.heat-map-label');
    expect(labels.length).toBe(0);
  });
});
