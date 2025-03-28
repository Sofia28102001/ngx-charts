import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-heat-map',
  templateUrl: './heat-map.component.html',
  styleUrls: ['./heat-map.component.scss']
})
export class HeatMapComponent implements OnInit {
  showYAxis = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  showDataLabels = false; // New property for data labels
  xAxisLabel = 'Country';
  yAxisLabel = 'Products';

  // Additional properties and methods...
}