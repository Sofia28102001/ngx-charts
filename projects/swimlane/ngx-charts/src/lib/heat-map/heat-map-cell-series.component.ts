import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { HeatMapCellComponent } from './heat-map-cell.component';

@Component({
  selector: 'ngx-charts-heat-map-cell-series',
  template: `
    <svg:g *ngFor="let cell of data">
      <ngx-charts-heat-map-cell
        [x]="xScale(cell.name)"
        [y]="yScale(cell.series)"
        [width]="xScale.bandwidth()"
        [height]="yScale.bandwidth()"
        [fill]="colors.getColor(cell.value)"
        [data]="cell"
        [tooltipDisabled]="tooltipDisabled"
        [tooltipText]="tooltipText"
        [showDataLabel]="showDataLabel"
        [dataLabelFormatting]="dataLabelFormatting"
        (select)="select.emit(cell)"
        (activate)="activate.emit(cell)"
        (deactivate)="deactivate.emit(cell)"
      />
    </svg:g>
  `,
  styleUrls: ['./heat-map-cell-series.component.scss']
})
export class HeatMapCellSeriesComponent implements OnChanges {
  @Input() data: any[];
  @Input() xScale: any;
  @Input() yScale: any;
  @Input() colors: any;
  @Input() tooltipDisabled: boolean = false;
  @Input() tooltipText: any;
  @Input() showDataLabel: boolean = false;
  @Input() dataLabelFormatting: any;

  @Output() select = new EventEmitter();
  @Output() activate = new EventEmitter();
  @Output() deactivate = new EventEmitter();

  ngOnChanges() {
    // Handle changes
  }
}