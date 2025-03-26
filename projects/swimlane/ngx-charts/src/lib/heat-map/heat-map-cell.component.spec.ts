import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeatMapCellComponent } from './heat-map-cell.component';
import { SimpleChanges } from '@angular/core';

describe('HeatMapCellComponent', () => {
  let component: HeatMapCellComponent;
  let fixture: ComponentFixture<HeatMapCellComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeatMapCellComponent]
    });
    fixture = TestBed.createComponent(HeatMapCellComponent);
    component = fixture.componentInstance;
    component.tooltipText = jest.fn();
    component.tooltipDisabled = false;
    component.gradient = false;
    component.showDataLabel = false;
    fixture.detectChanges();
  });

  it('should not display a data label by default', () => {
    const textElement = fixture.nativeElement.querySelector('.cell-data-label');
    expect(textElement).toBeNull();
  });

  it('should display a data label when showDataLabel is true', () => {
    component.showDataLabel = true;
    component.data = { name: 'test', value: 123 };
    fixture.detectChanges();
    const textElement = fixture.nativeElement.querySelector('.cell-data-label');
    expect(textElement).not.toBeNull();
    expect(textElement.textContent.trim()).toBe('123');
  });

  it('should position data label in the center of the cell', () => {
    component.showDataLabel = true;
    component.data = { name: 'test', value: 123 };
    component.x = 10;
    component.y = 20;
    component.width = 100;
    component.height = 50;
    component.updateLabelPosition();
    fixture.detectChanges();
    expect(component.textX).toBe(60);
    expect(component.textY).toBe(45);
  });

  it('should format decimal values for data labels', () => {
    component.data = { name: 'test', value: 123.456 };
    expect(component.formattedLabel).toBe('123.5');
  });
});