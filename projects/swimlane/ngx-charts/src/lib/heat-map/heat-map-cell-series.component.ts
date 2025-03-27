import {
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { ColorHelper } from '../common/color.helper';

@Component({
  selector: 'ngx-charts-heat-map-cell-series',
  template: `
    <svg:g ngx-charts-heat-map-cell
      *ngFor="let cell of data"
      [data]="cell"
      [label]="cell.label"
      [gradient]="gradient"
      [animations]="animations"
      [tooltipDisabled]="tooltipDisabled"
      [tooltipText]="tooltipText"
      [showDataLabel]="showDataLabel"
    />
  `
})
export class HeatMapCellSeriesComponent implements OnChanges {
  @Input() colors: ColorHelper;
  @Input() tooltipDisabled: boolean = false;
  @Input() tooltipText: any;
  @Input() showDataLabel: boolean = false;
  @Input() tooltipTemplate: TemplateRef<any>;
  @Input() animations: boolean = true;
  @Input() gradient: boolean;

  ngOnChanges(changes: SimpleChanges): void {
    // Handle changes if necessary
  }
}
