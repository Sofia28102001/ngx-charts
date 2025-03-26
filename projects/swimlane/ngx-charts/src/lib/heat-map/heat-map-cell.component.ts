import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { formatLabel } from '../common/label.helper';
import { PlacementTypes } from '../common/tooltip/position';
import { StyleTypes } from '../common/tooltip/style.type';
import { ViewDimensions } from '../common/types/view-dimension.interface';
import { ColorHelper } from '../common/color.helper';
import { id } from '../utils/id';
import { DataItem } from '../models/chart-data.model';
import { trimLabel } from '../common/trim-label.helper';

@Component({
  selector: 'g[ngx-charts-heat-map-cell]',
  template: `
    <svg:rect
      [attr.x]="x"
      [attr.y]="y"
      [attr.width]="width"
      [attr.height]="height"
      [attr.fill]="fill"
      [style.cursor]="'pointer'"
      (click)="onClick()"
    ></svg:rect>
    <svg:text
      *ngIf="showDataLabel"
      class="cell-data-label"
      [attr.x]="textX"
      [attr.y]="textY"
      [attr.text-anchor]="'middle'"
      [attr.dominant-baseline]="'central'"
      [attr.fill]="textFontColor">
      {{ formattedLabel }}
    </svg:text>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeatMapCellComponent implements OnChanges {
  @Input() x: number;
  @Input() y: number;
  @Input() width: number;
  @Input() height: number;
  @Input() fill: string;
  @Input() data: any;
  @Input() tooltipDisabled: boolean = false;
  @Input() tooltipText: any;
  @Input() gradient: boolean = false;
  @Input() showDataLabel: boolean = false;

  @Output() select = new EventEmitter();

  // Dims
  textX: number;
  textY: number;
  textFontColor: string;

  ngOnChanges(changes: SimpleChanges): void {
    this.update();
    this.updateLabelPosition();
    this.checkToHideBar();
  }

  updateLabelPosition(): void {
    if (!this.showDataLabel) {
      return;
    }
    this.textX = this.x + this.width / 2;
    this.textY = this.y + this.height / 2;
    this.textFontColor = this.getTextColor(this.fill);
  }

  getTextColor(backgroundColor: string): string {
    const rgb = this.hexToRgb(backgroundColor);
    if (!rgb) {
      return '#000000';
    }
    const brightness = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    return brightness > 0.7 ? '#000000' : '#FFFFFF';
  }

  hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    if (!hex || typeof hex !== 'string') {
      return null;
    }
    hex = hex.replace('#', '');
    if (!/^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(hex)) {
      return null;
    }
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    return {
      r: parseInt(hex.substring(0, 2), 16),
      g: parseInt(hex.substring(2, 4), 16),
      b: parseInt(hex.substring(4, 6), 16)
    };
  }

  get formattedLabel(): string {
    if (!this.data || this.data.value === undefined || this.data.value === null) {
      return '';
    }
    const value = this.data.value;
    const formatted = typeof value === 'number' && !Number.isInteger(value) ? value.toFixed(1) : value.toString();
    return trimLabel(formatted, 8);
  }
}