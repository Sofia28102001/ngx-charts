import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeatMapCellComponent } from './heat-map-cell.component';

describe('<g ngx-charts-heat-map-cell>', () => {
  let component: HeatMapCellComponent;
  let fixture: ComponentFixture<HeatMapCellComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeatMapCellComponent]
    });
    fixture = TestBed.createComponent(HeatMapCellComponent);
    component = fixture.componentInstance;
  });

  it('should show data label when showDataLabel is true', () => {
    component.data = {
      name: 'Test',
      value: 73
    };
    component.x = 0;
    component.y = 0;
    component.width = 100;
    component.height = 100;
    component.fill = '#ff0000';
    component.showDataLabel = true;
    
    component.ngOnChanges();
    expect(component.formattedLabel).toEqual('73');
  });
});
