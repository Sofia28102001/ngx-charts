import { Component, OnInit } from '@angular/core';
import { colorSets } from '../../../projects/swimlane/ngx-charts/src/lib/utils/color-sets';

@Component({
  selector: 'app-heat-map',
  templateUrl: './heat-map.component.html',
  styleUrls: ['./heat-map.component.scss']
})
export class HeatMapComponent implements OnInit {
  colorSets: any[];
  colorScheme: any;
  schemeType = 'ordinal';
  showDataLabel: boolean = false;
  selectedColorScheme: string;

  dims: ViewDimensions;

  ngOnInit() {
    this.colorSets = colorSets;
  }
}
