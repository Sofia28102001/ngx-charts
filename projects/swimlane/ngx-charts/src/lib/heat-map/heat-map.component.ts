import { Component, Input, ViewEncapsulation, ChangeDetectionStrategy, ContentChild, TemplateRef } from '@angular/core';
import { scaleBand } from 'd3-scale';

import { BaseChartComponent } from '../common/base-chart.component';
import { ViewDimensions } from '../common/types/view-dimension.interface';
import { ColorHelper } from '../common/color.helper';
import { calculateViewDimensions } from '../common/view-dimensions.helper';
import { LegendPosition } from '../common/types/legend.model';

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
          (select)="onClick($event)"
          [showDataLabel]="showDataLabel"
        />
      </svg:g>
    </ngx-charts-chart>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./heat-map.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeatMapComponent extends BaseChartComponent {
  // Add showDataLabel input
  @Input() showDataLabel: boolean = false;

  @Input() legend: boolean;
  @Input() legendTitle: string = 'Legend';
  @Input() legendPosition: LegendPosition = LegendPosition.Right;
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
  @Input() rotateXAxisTicks: boolean = true;
  @Input() maxXAxisTickLength: number = 16;
  @Input() maxYAxisTickLength: number = 16;
  @Input() xAxisTickFormatting: any;
  @Input() yAxisTickFormatting: any;
  @Input() xAxisTicks: any[];
  @Input() yAxisTicks: any[];
  @Input() tooltipDisabled: boolean = false;
  @Input() tooltipText: any;
  @Input() min: number;
  @Input() max: number;

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
  scaleType: string = 'linear';

  update(): void {
    super.update();

    this.formatDates();

    this.xDomain = this.getXDomain();
    this.yDomain = this.getYDomain();
    this.valueDomain = this.getValueDomain();

    this.scaleType = this.getScaleType(this.valueDomain);

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
      let min = this.min;
      let max = this.max;
      if (!this.min) {
        min = Math.min(0, ...this.valueDomain);
      }
      if (!this.max) {
        max = Math.max(...this.valueDomain);
      }
      this.valueDomain = [min, max];
    }

    this.xScale = this.getXScale();
    this.yScale = this.getYScale();

    this.setColors();
    this.legendOptions = this.getLegendOptions();

    this.transform = `translate(${this.dims.xOffset} , ${this.margin[0]})`;
    this.rects = this.getRects();
  }

  getXDomain(): string[] {
    const domain = [];
    for (const group of this.results) {
      if (!domain.includes(group.name)) {
        domain.push(group.name);
      }
    }

    return domain;
  }

  getYDomain(): string[] {
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

  getScaleType(valueDomain: any[]): string {
    return valueDomain.length > 0 && typeof valueDomain[0] === 'number' ? 'linear' : 'ordinal';
  }

  getXScale(): any {
    return scaleBand().domain(this.xDomain).range([0, this.dims.width]);
  }

  getYScale(): any {
    return scaleBand().domain(this.yDomain).range([this.dims.height, 0]);
  }

  setColors(): void {
    this.colors = new ColorHelper(this.scheme, 'ordinal', this.xDomain);
  }

  getLegendOptions(): any {
    return {
      scaleType: this.scaleType,
      colors: this.colors,
      domain: this.xDomain,
      title: this.legendTitle,
      position: this.legendPosition
    };
  }

  getRects(): any[] {
    const rects = [];
    for (const group of this.results) {
      for (const d of group.series) {
        rects.push({
          x: this.xScale(group.name),
          y: this.yScale(d.name),
          width: this.xScale.bandwidth(),
          height: this.yScale.bandwidth(),
          fill: this.colors.getColor(d.value),
          data: d
        });
      }
    }
    return rects;
  }
}