import {
  Component,
  Input,
  OnChanges,
  ElementRef,
  TemplateRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { select } from 'd3-selection';
import { transition } from 'd3-transition';
import { formatLabel, trimLabel } from '../common/label.helper';

@Component({
  selector: 'g[ngx-charts-heat-map-cell]',
  template: `
    <svg:rect
      [attr.x]="x"
      [attr.y]="y"
      [attr.width]="width"
      [attr.height]="height"
      [attr.fill]="fill"
      [attr.stroke]="stroke"
      [attr.stroke-width]="strokeWidth"
      [attr.stroke-dasharray]="strokeDasharray"
      (click)="onClick()"
    />
    <svg:text
      *ngIf="showDataLabel"
      [style.font-size.px]="textFontSize"
      [style.textAnchor]="'middle'"
      [attr.transform]="textTransform"
      [style.fill]="textColor"
      class="cell-data-label"
    >
      <svg:tspan x="0" dy="0">
        {{formattedLabel}}
      </svg:tspan>
    </svg:text>
    <svg:title *ngIf="tooltipDisabled !== true">{{ tooltipText }}</svg:title>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeatMapCellComponent implements OnChanges {
  @Input() gradient: boolean;
  @Input() animations: boolean = true;
  @Input() tooltipDisabled: boolean = false;
  @Input() tooltipText: string;
  @Input() showDataLabel: boolean = false;

  // Additional properties for label rendering
  textFontSize: number = 12;
  textColor: string;
  textTransform: string;
  formattedLabel: string;

  constructor(protected element: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    // Existing logic for handling changes
    if (this.showDataLabel) {
      const value = this.data?.value;
      this.formattedLabel = value !== undefined ? formatLabel(value) : '';
      
      // Ensure label fits in cell
      if (this.formattedLabel.length > 7) {
        this.formattedLabel = trimLabel(this.formattedLabel, 7);
      }
      
      this.textFontSize = Math.min(12, this.height / 2);
      this.textTransform = `translate(${this.x + this.width / 2}, ${this.y + this.height / 2 + this.textFontSize / 3})`;
      this.textColor = this.getTextColor();
    }
  }

  private getTextColor(): string {
    if (!this.fill) return '#000000';
    
    // Convert hex to RGB
    const hex = this.fill.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // YIQ formula to determine contrast
    return (r * 299 + g * 587 + b * 114) / 1000 >= 128 ? '#000000' : '#ffffff';
  }
}
