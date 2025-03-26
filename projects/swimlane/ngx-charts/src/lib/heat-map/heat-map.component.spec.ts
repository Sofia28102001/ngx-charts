import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ChartCommonModule } from '../common/chart-common.module';
import { HeatMapModule } from './heat-map.module';
import { ColorHelper } from '../common/color.helper';

// Create a test component
@Component({
  selector: 'test-component',
  template: `
    <ngx-charts-heat-map
      [scheme]="colorScheme"
      [results]="data"
      [showDataLabel]="showDataLabel">
    </ngx-charts-heat-map>
  `
})

class TestComponent {
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  
  showDataLabel: boolean = true;

  data = [
    {
      "name": "Series A",
      "series": [
        { "name": "Item 1", "value": 10 },
        { "name": "Item 2", "value": 20 },
        { "name": "Item 3", "value": 30 }
      ]
    }
  ];
}

describe('HeatMapComponent', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [NoopAnimationsModule, ChartCommonModule, HeatMapModule]
    });
    
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the heat map component', () => {
    expect(fixture.nativeElement).toBeTruthy();
  });

  it('should display data labels when showDataLabel is true', () => {
    const labels = fixture.nativeElement.querySelectorAll('.heat-map-label');
    expect(labels.length).toBeGreaterThan(0);
  });
});