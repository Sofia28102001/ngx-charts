import { Component } from '@angular/core';
import { multi, single } from './data';

@Component({
  selector: 'app-heat-map',
  template: `
    <ngx-charts-heat-map
      [results]="single"
      [gradient]="gradient"
      [xAxis]="showXAxis"
      [yAxis]="showYAxis"
      [legend]="showLegend"
      [showXAxisLabel]="showXAxisLabel"
      [showYAxisLabel]="showYAxisLabel"
      [showDataLabel]="showDataLabels"
      (select)="onSelect($event)"
    >
    </ngx-charts-heat-map>
    
    <div class="chart-controls">
      <label><input type="checkbox" [checked]="showDataLabels" (change)="showDataLabels = !showDataLabels" /> Show Data Labels</label>
    </div>
  `
})
export class HeatMapComponent {
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Country';
  yAxisLabel: string = 'Products';
  showDataLabels: boolean = false;
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
}
