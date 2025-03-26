import { Component, Input, ViewEncapsulation, ChangeDetectionStrategy, ContentChild, TemplateRef } from '@angular/core';
import { scaleBand } from 'd3-scale';

import { BaseChartComponent } from '../common/base-chart.component';
import { calculateViewDimensions, ViewDimensions } from '../common/view-dimensions.helper';
import { ColorHelper } from '../common/color.helper';

@Component({
  selector: 'ngx-charts-heat-map',
  template: `
    <ngx-charts-chart
      [view]="[width, height]"
      [showLegend]="legend"
      [animations]="animations"
      [legendOptions]="legendOptions"
      (legendLabelClick)="onClick($event)"
    >
      <svg:g [attr.transform]="transform" class="heat-map chart">
        <svg:g
          ngx-charts-x-axis
          *ngIf="xAxis"
          [xScale]="xScale"
          [dims]="dims"
          [showLabel]="showXAxisLabel"
          [labelText]="xAxisLabel"
          [trimTicks]="trimXAxisTicks"
          [rotateTicks]="rotateXAxisTicks"
          [maxTickLength]="maxXAxisTickLength"
          [tickFormatting]="xAxisTickFormatting"
          [ticks]="xAxisTicks"
          (dimensionsChanged)="updateXAxisHeight($event)"
        ></svg:g>
        <svg:g
          ngx-charts-y-axis
          *ngIf="yAxis"
          [yScale]="yScale"
          [dims]="dims"
          [showLabel]="showYAxisLabel"
          [labelText]="yAxisLabel"
          [trimTicks]="trimYAxisTicks"
          [maxTickLength]="maxYAxisTickLength"
          [tickFormatting]="yAxisTickFormatting"
          [ticks]="yAxisTicks"
          (dimensionsChanged)="updateYAxisWidth($event)"
        ></svg:g>
        <svg:rect
          *ngFor="let rect of rects"
          [attr.x]="rect.x"
          [attr.y]="rect.y"
          [attr.rx]="rect.rx"
          [attr.width]="rect.width"
          [attr.height]="rect.height"
          [attr.fill]="rect.fill"
        />
        <svg:g
          ngx-charts-heat-map-cell-series
          [xScale]="xScale"
          [yScale]="yScale"
          [colors]="colors"
          [data]="results"
          [gradient]="gradient"
          [animations]="animations"
          [tooltipDisabled]="tooltipDisabled"
          [tooltipTemplate]="tooltipTemplate"
          [tooltipText]="tooltipText"
          [showDataLabel]="showDataLabel"
          (select)="onClick($event)"
          (activate)="onActivate($event, undefined)"
          (deactivate)="onDeactivate($event, undefined)"
        />
      </svg:g>
    </ngx-charts-chart>
  `,
  styleUrls: ['./heat-map.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeatMapComponent extends BaseChartComponent {
  @Input() legend: boolean;
  @Input() legendTitle: string = 'Legend';
  @Input() legendPosition: string = 'right';
  @Input() xAxis: boolean;
  @Input() yAxis: boolean;
  @Input() showXAxisLabel: boolean;
  @Input() showYAxisLabel: boolean;
  @Input() xAxisLabel: string;
  @Input() yAxisLabel: string;
  @Input() gradient: boolean;
  @Input() innerPadding: number | number[] = 8;
  @Input() trimXAxisTicks: boolean = true;
  @Input() trimYAxisTicks: boolean = true;
  @Input() rotateXAxisTicks: boolean = false;
  @Input() maxXAxisTickLength: number = 16;
  @Input() maxYAxisTickLength: number = 16;
  @Input() xAxisTickFormatting: any;
  @Input() yAxisTickFormatting: any;
  @Input() xAxisTicks: any[];
  @Input() yAxisTicks: any[];
  @Input() tooltipDisabled: boolean = false;
  @Input() tooltipText: any;
  @Input() min: number;
  
  // Add showDataLabel property to control the display of data values in heat map cells
  @Input() showDataLabel: boolean = false;
  @Input() max: number;
  @Input() scaleType: any = 'linear';

  @ContentChild('tooltipTemplate') tooltipTemplate: TemplateRef<any>;

  dims: ViewDimensions;
  xDomain: string[];
  yDomain: string[];
  valueDomain: any[];
  xScale: any;
  yScale: any;
  color: any;
  colors: ColorHelper;
  colorScale: any;
  transform: string;
  rects: any[];
  margin = [10, 20, 10, 20];
  xAxisHeight: number = 0;
  yAxisWidth: number = 0;
  legendOptions: any;
  scaleColors: any;

  update(): void {
    this.formatDates();

    this.xDomain = this.getXDomain();
    this.yDomain = this.getYDomain();
    this.valueDomain = this.getValueDomain();

    this.scaleColors = this.getScaleColors();

    this.dims = calculateViewDimensions({
      width: this.width,
      height: this.height,
      margins: this.margin,
      showXAxis: this.xAxis,
      showYAxis: this.yAxis,
      showXLabel: this.showXAxisLabel,
      showYLabel: this.showYAxisLabel,
      showLegend: this.legend,
      legendType: this.scaleType,
      legendPosition: this.legendPosition
    });

    if (this.scaleType === 'linear') {
      const min = this.min ? this.min : Math.min(0, ...this.valueDomain);
      const max = this.max ? this.max : Math.max(...this.valueDomain);
      this.valueDomain = [min, max];
    }

    this.xScale = this.getXScale();
    this.yScale = this.getYScale();

    this.setColors();
    this.legendOptions = this.getLegendOptions();

    this.transform = `translate(${this.dims.xOffset} , ${this.margin[0]})`;
  }

  getXDomain(): any[] {
    const domain = [];
    for (const group of this.results) {
      if (!domain.includes(group.name)) {
        domain.push(group.name);
      }
    }

    return domain;
  }

  getYDomain(): any[] {
    const domain = [];

    for (const group of this.results) {
      for (const d of group.series) {
        if (!domain.includes(d.name)) {
          domain.push(d.name);
        }
      }
    }

    return domain;
  }

  getValueDomain(): any[] {
    const domain = [];

    for (const group of this.results) {
      for (const d of group.series) {
        if (!domain.includes(d.value)) {
          domain.push(d.value);
        }
      }
    }

    return domain;
  }

  /**
   * Converts the input to gap paddingInner in fraction
   * Supports the following inputs:
   *    Numbers: 8
   *    Strings: "8", "8px", "8%"
   *    Arrays: [8,2], "[8,2]", "[8,2]px", "[8,2]%"
   *
   * @memberOf HeatMapComponent
   */
  getDimension(value: string | number | Array<string | number>, index = 0, N: number, L: number): number {
    if (typeof value === 'string') {
      value = value.replace('[', '').replace(']', '').replace('px', '').replace("'", '');

      if (value.includes(',')) {
        value = value.split(',');
      }
    }
    if (Array.isArray(value) && typeof index === 'number') {
      return this.getDimension(value[index], null, N, L);
    }
    if (typeof value === 'string' && value.includes('%')) {
      return +value.replace('%', '') / 100;
    }
    return N / (L / +value);
  }