import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
  ChangeDetectionStrategy,
  TemplateRef
} from '@angular/core';
import { formatLabel } from '../common/label.helper';
import { id } from '../utils/id';

@Component({
  selector: 'ngx-charts-heat-map-cell',
  template: `
    <svg:g [attr.transform]="transform" class="cell">
      <svg:rect
        #rect
        [attr.fill]="fill"
        [attr.width]="width"
        [attr.height]="height"
        class="cell"
        style="cursor: pointer"
      />
      <svg:text
        *ngIf="showDataLabel"
        [attr.text-anchor]="'middle'"
        [attr.transform]="textTransform"
        [style.font-size.px]="textFontSize"
        [style.fill]="textColor"
        class="heat-map-label data-label"
      >
        <svg:tspan x="0" dy="0">
          {{ formattedValue }}
        </svg:tspan>
      </svg:text>
    </svg:g>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeatCellComponent implements OnChanges {
  @Input() data: any;
  @Input() width: number;
  @Input() height: number;
  @Input() fill: string;
  @Input() animations: boolean = true;
  @Input() tooltipDisabled: boolean = false;
  @Input() tooltipText: any;
  @Input() tooltipTemplate: TemplateRef<any>;
  @Input() tooltipContext: any;
  
  // Add property to control the display of data values in heat map cells
  @Input() showDataLabel: boolean = false;
  
  fill: string;
  stroke: string;
  transform: string;
  textTransform: string;
  textFontSize: number;
  textColor: string;
  formattedValue: string;
  startOpacity: number;
  gradientId: string;
  gradientUrl: string;
  gradientStops: any[];

  constructor(
    private cd: ChangeDetectorRef,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data) {
      this.update();
    }
    
    // Update data label properties if showDataLabel changes
    if (changes.showDataLabel && !changes.showDataLabel.firstChange) {
      this.setDataLabelProperties();
      this.cd.markForCheck();
    }
  }

  update(): void {
    this.transform = `translate(${this.x} , ${this.y})`;
    
    // Set up the data label properties
    this.setDataLabelProperties();
    
    this.startOpacity = 0.3;
    this.gradientId = 'grad' + id().toString();
    this.gradientUrl = `url(#${this.gradientId})`;
    this.gradientStops = this.getGradientStops();
  }

  setDataLabelProperties(): void {
    // Center the text in the cell
    const x = this.width / 2;
    const y = this.height / 2;
    this.textTransform = `translate(${x}, ${y + 5})`; // +5 for better vertical centering
    
    // Safely format the value with null checks
    if (this.data && typeof this.data.value !== 'undefined') {
      this.formattedValue = this.data.value.toLocaleString();
    } else {
      this.formattedValue = '';
    }
    
    // Calculate font size based on cell dimensions
    const minDimension = Math.min(this.width, this.height);
    this.textFontSize = Math.max(8, Math.min(12, minDimension / 3));
    
    // Determine text color based on background color contrast
    let colorValue = 0;
    if (this.data && typeof this.data.value !== 'undefined') {
      const rgb = this.fill.match(/\d+/g);
      colorValue = rgb ? (parseInt(rgb[0], 10) + parseInt(rgb[1], 10) + parseInt(rgb[2], 10)) / 3 : 0;
      this.textColor = colorValue < 128 ? '#fff' : '#000';
    } else {
      this.textColor = '#000'; // Default to black text
    }
  }

  getGradientStops(): any[] {
    // Implementation for gradient stops
  }
}