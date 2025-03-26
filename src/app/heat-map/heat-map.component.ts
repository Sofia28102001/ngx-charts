import { Component } from '@angular/core';
import { single, multi, days, hours } from './data';

@Component({
  selector: 'app-heat-map',
  templateUrl: './heat-map.component.html',
  styleUrls: ['./heat-map.component.scss']
})
export class HeatMapComponent {
  single: any[];
  multi: any[];
  showDataLabels: boolean = false;
  view: any[] = [700, 300];

  // options
  xAxis: boolean = true;
  yAxis: boolean = true;
  legend: boolean = true;
  legendTitle: string = 'Legend';
  legendPosition: string = 'right';
  gradient: boolean = true;
  tooltipDisabled: boolean = false;
  tooltipText: any;

  constructor() {
    this.single = single;
    this.multi = multi;
  }

  toggleDataLabels(): void {
    this.showDataLabels = !this.showDataLabels;
  }

  select(data): void {
    console.log('Item clicked', data);
  }

  setColorScheme(name): void {
    // Set color scheme logic here
  }
}