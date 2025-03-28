import { TestBed } from '@angular/core/testing';
import { HeatMapComponent } from './heat-map.component';

describe('<ngx-charts-heat-map>', () => {
  let component: HeatMapComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeatMapComponent]
    });
    component = TestBed.createComponent(HeatMapComponent).componentInstance;
  });

  it('should show data labels when showDataLabel is true', () => {
    component.showDataLabel = true;
    component.data = [{ name: 'A', series: [{ name: 'B', value: 10 }] }];
    component.ngOnInit();
    expect(component.dataLabelFormatting).toBeDefined();
  });
});