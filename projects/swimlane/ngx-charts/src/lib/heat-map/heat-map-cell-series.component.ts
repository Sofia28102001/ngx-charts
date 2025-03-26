import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { formatLabel } from '../common/label.helper';
import { PlacementTypes } from '../common/tooltip/position';
import { StyleTypes } from '../common/tooltip/style.type';
import { DataItem } from '../models/chart-data.model';

@Component({
  selector: 'ngx-charts-heat-map-cell-series',
  template: `
    <svg:g
      class="heat-map-cell-series-group"
      [attr.transform]="transform"
      [attr.id]="cells[0]?.data?.series"
    >
      <svg:g
        ngx-charts-heat-map-cell
        *ngFor="let c of cells; trackBy: trackBy"
        [attr.transform]="c.transform"
        [data]="c.data"
        [width]="c.width"
        [height]="c.height"
        [tooltipDisabled]="tooltipDisabled"
        [tooltipTemplate]="tooltipTemplate"
        [tooltipText]="tooltipText"
        [showDataLabel]="showDataLabel"
        (select)="onSelect(c.data)"
      ></svg:g>
    </svg:g>
  `,
  styles: []
})
export class HeatCellSeriesComponent implements OnChanges {
  @Input() cells: DataItem[];
  @Input() tooltipDisabled: boolean = false;
  @Input() tooltipText: any;
  @Input() tooltipTemplate: TemplateRef<any>;
  @Input() showDataLabel: boolean = false;

  @Output() select = new EventEmitter();

  ngOnChanges(changes: SimpleChanges): void {
    // Handle changes if necessary
  }
}