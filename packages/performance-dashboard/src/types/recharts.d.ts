// Type declarations for Recharts compatibility with React 18
declare module 'recharts' {
  import React, { ComponentType, ReactNode } from 'react';

  export interface ResponsiveContainerProps {
    width?: string | number;
    height?: string | number;
    aspect?: number;
    minWidth?: number;
    minHeight?: number;
    debounce?: number;
    children: ReactNode;
  }

  export interface CategoricalChartProps {
    data?: Record<string, unknown>[];
    width?: number;
    height?: number;
    margin?: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
    children?: ReactNode;
    ref?: React.Ref<unknown>;
    onClick?: (data: unknown) => void;
  }

  export interface XAxisProps {
    dataKey?: string;
    type?: 'number' | 'category';
    scale?: 'auto' | 'linear' | 'pow' | 'sqrt' | 'log' | 'identity' | 'time' | 'band' | 'point' | 'ordinal' | 'quantile' | 'quantize' | 'threshold' | 'utcTime' | 'sequential';
    domain?: [string | number, string | number] | [string | number, string | number][];
    name?: string;
    unit?: string;
    tick?: boolean | ComponentType<unknown> | { fontSize?: number; fill?: string };
    tickCount?: number;
    tickFormatter?: (value: unknown, index: number) => string;
    ticks?: unknown[];
    padding?: { left?: number; right?: number } | [number, number];
    allowDataOverflow?: boolean;
    allowDecimals?: boolean;
    allowDuplicatedCategory?: boolean;
    angle?: number;
    axisLine?: boolean | { stroke?: string; strokeWidth?: number; strokeDasharray?: string };
    hide?: boolean;
    interval?: 'preserveStart' | 'preserveEnd' | 'preserveStartEnd' | number | 'equidistantPreserveStart';
    label?: string | ComponentType<unknown> | { value?: string; angle?: number; position?: 'insideStart' | 'insideEnd' | 'middle' | 'outsideStart' | 'outsideEnd' };
    mirror?: boolean;
    orientation?: 'top' | 'bottom';
    reversed?: boolean;
    scale?: string;
    tickLine?: boolean | { stroke?: string; strokeWidth?: number; strokeDasharray?: string };
    tickMargin?: number;
    tickSize?: number;
    type?: 'number' | 'category';
    stroke?: string;
  }

  export interface YAxisProps {
    dataKey?: string;
    type?: 'number' | 'category';
    scale?: 'auto' | 'linear' | 'pow' | 'sqrt' | 'log' | 'identity' | 'time' | 'band' | 'point' | 'ordinal' | 'quantile' | 'quantize' | 'threshold' | 'utcTime' | 'sequential';
    domain?: [string | number, string | number] | [string | number, string | number][];
    name?: string;
    unit?: string;
    tick?: boolean | ComponentType<unknown> | { fontSize?: number; fill?: string };
    tickCount?: number;
    tickFormatter?: (value: unknown, index: number) => string;
    ticks?: unknown[];
    padding?: { top?: number; bottom?: number } | [number, number];
    allowDataOverflow?: boolean;
    allowDecimals?: boolean;
    allowDuplicatedCategory?: boolean;
    angle?: number;
    axisLine?: boolean | { stroke?: string; strokeWidth?: number; strokeDasharray?: string };
    hide?: boolean;
    interval?: 'preserveStart' | 'preserveEnd' | 'preserveStartEnd' | number | 'equidistantPreserveStart';
    label?: string | ComponentType<unknown> | { value?: string; angle?: number; position?: 'insideStart' | 'insideEnd' | 'middle' | 'outsideStart' | 'outsideEnd' };
    mirror?: boolean;
    orientation?: 'left' | 'right';
    reversed?: boolean;
    scale?: string;
    tickLine?: boolean | { stroke?: string; strokeWidth?: number; strokeDasharray?: string };
    tickMargin?: number;
    tickSize?: number;
    type?: 'number' | 'category';
    stroke?: string;
  }

  export interface TooltipProps {
    active?: boolean;
    allowEscapeViewBox?: { x?: boolean; y?: boolean };
    animationDuration?: number;
    animationEasing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
    content?: ComponentType<unknown> | ReactNode;
    coordinate?: { x?: number; y?: number };
    cursor?: boolean | ComponentType<unknown> | { stroke?: string; strokeWidth?: number; strokeDasharray?: string };
    formatter?: (value: unknown, name: string, props: unknown) => [ReactNode, string];
    isAnimationActive?: boolean;
    itemStyle?: Record<string, unknown>;
    label?: string | ComponentType<unknown>;
    labelFormatter?: (label: unknown, payload: unknown[]) => ReactNode;
    labelStyle?: Record<string, unknown>;
    offset?: number;
    position?: { x?: number; y?: number };
    separator?: string;
    trigger?: 'hover' | 'click';
    useTranslate3d?: boolean;
    viewBox?: { x?: number; y?: number; width?: number; height?: number };
    wrapperStyle?: Record<string, unknown>;
  }

  export interface LineProps {
    type?: 'basis' | 'basisClosed' | 'basisOpen' | 'bumpX' | 'bumpY' | 'bundle' | 'cardinal' | 'cardinalClosed' | 'cardinalOpen' | 'catmullRom' | 'catmullRomClosed' | 'catmullRomOpen' | 'linear' | 'linearClosed' | 'monotone' | 'monotoneX' | 'monotoneY' | 'natural' | 'radial' | 'step' | 'stepAfter' | 'stepBefore';
    dataKey?: string;
    dot?: boolean | ComponentType<unknown> | { r?: number; strokeWidth?: number; stroke?: string; fill?: string; strokeDasharray?: string };
    activeDot?: boolean | ComponentType<unknown> | { r?: number; strokeWidth?: number; stroke?: string; fill?: string; strokeDasharray?: string };
    stroke?: string;
    strokeWidth?: number;
    strokeDasharray?: string;
    connectNulls?: boolean;
    isAnimationActive?: boolean;
    animationBegin?: number;
    animationDuration?: number;
    animationEasing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
    name?: string;
    unit?: string;
    legendType?: 'line' | 'plainline' | 'square' | 'rect' | 'circle' | 'cross' | 'diamond' | 'star' | 'triangle' | 'wye';
    hide?: boolean;
    points?: unknown[];
    label?: string | ComponentType<unknown> | { value?: string; angle?: number; position?: 'top' | 'left' | 'right' | 'bottom' | 'inside' | 'outside' | 'insideLeft' | 'insideRight' | 'insideTop' | 'insideBottom' | 'insideTopLeft' | 'insideTopRight' | 'insideBottomLeft' | 'insideBottomRight' | 'outsideTop' | 'outsideLeft' | 'outsideRight' | 'outsideBottom' | 'outsideTopLeft' | 'outsideTopRight' | 'outsideBottomLeft' | 'outsideBottomRight' };
    dot?: boolean | ComponentType<unknown> | { r?: number; strokeWidth?: number; stroke?: string; fill?: string; strokeDasharray?: string };
    activeDot?: boolean | ComponentType<unknown> | { r?: number; strokeWidth?: number; stroke?: string; fill?: string; strokeDasharray?: string };
  }

  export interface AreaProps {
    type?: 'basis' | 'basisClosed' | 'basisOpen' | 'bumpX' | 'bumpY' | 'bundle' | 'cardinal' | 'cardinalClosed' | 'cardinalOpen' | 'catmullRom' | 'catmullRomClosed' | 'catmullRomOpen' | 'linear' | 'linearClosed' | 'monotone' | 'monotoneX' | 'monotoneY' | 'natural' | 'radial' | 'step' | 'stepAfter' | 'stepBefore';
    dataKey?: string;
    stackId?: string;
    dot?: boolean | ComponentType<unknown> | { r?: number; strokeWidth?: number; stroke?: string; fill?: string; strokeDasharray?: string };
    activeDot?: boolean | ComponentType<unknown> | { r?: number; strokeWidth?: number; stroke?: string; fill?: string; strokeDasharray?: string };
    stroke?: string;
    strokeWidth?: number;
    strokeDasharray?: string;
    fill?: string;
    fillOpacity?: number;
    connectNulls?: boolean;
    isAnimationActive?: boolean;
    animationBegin?: number;
    animationDuration?: number;
    animationEasing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
    name?: string;
    unit?: string;
    legendType?: 'line' | 'plainline' | 'square' | 'rect' | 'circle' | 'cross' | 'diamond' | 'star' | 'triangle' | 'wye';
    hide?: boolean;
    points?: unknown[];
    label?: string | ComponentType<unknown> | { value?: string; angle?: number; position?: 'top' | 'left' | 'right' | 'bottom' | 'inside' | 'outside' | 'insideLeft' | 'insideRight' | 'insideTop' | 'insideBottom' | 'insideTopLeft' | 'insideTopRight' | 'insideBottomLeft' | 'insideBottomRight' | 'outsideTop' | 'outsideLeft' | 'outsideRight' | 'outsideBottom' | 'outsideTopLeft' | 'outsideTopRight' | 'outsideBottomLeft' | 'outsideBottomRight' };
  }

  export interface BarProps {
    dataKey?: string;
    stackId?: string;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    strokeDasharray?: string;
    isAnimationActive?: boolean;
    animationBegin?: number;
    animationDuration?: number;
    animationEasing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
    name?: string;
    unit?: string;
    legendType?: 'line' | 'plainline' | 'square' | 'rect' | 'circle' | 'cross' | 'diamond' | 'star' | 'triangle' | 'wye';
    hide?: boolean;
    label?: string | ComponentType<unknown> | { value?: string; angle?: number; position?: 'top' | 'left' | 'right' | 'bottom' | 'inside' | 'outside' | 'insideLeft' | 'insideRight' | 'insideTop' | 'insideBottom' | 'insideTopLeft' | 'insideTopRight' | 'insideBottomLeft' | 'insideBottomRight' | 'outsideTop' | 'outsideLeft' | 'outsideRight' | 'outsideBottom' | 'outsideTopLeft' | 'outsideTopRight' | 'outsideBottomLeft' | 'outsideBottomRight' };
    maxBarSize?: number;
    minPointSize?: number;
    shape?: ComponentType<unknown> | 'rect' | 'round';
    radius?: number | [number, number, number, number];
    children?: ReactNode;
  }

  export interface PieProps {
    dataKey?: string;
    nameKey?: string;
    valueKey?: string;
    cx?: string | number;
    cy?: string | number;
    innerRadius?: string | number;
    outerRadius?: string | number;
    startAngle?: number;
    endAngle?: number;
    minAngle?: number;
    paddingAngle?: number;
    cornerRadius?: string | number;
    data?: Record<string, unknown>[];
    isAnimationActive?: boolean;
    animationBegin?: number;
    animationDuration?: number;
    animationEasing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
    name?: string;
    unit?: string;
    legendType?: 'line' | 'plainline' | 'square' | 'rect' | 'circle' | 'cross' | 'diamond' | 'star' | 'triangle' | 'wye';
    hide?: boolean;
    label?: string | ComponentType<unknown> | { value?: string; angle?: number; position?: 'top' | 'left' | 'right' | 'bottom' | 'inside' | 'outside' | 'insideLeft' | 'insideRight' | 'insideTop' | 'insideBottom' | 'insideTopLeft' | 'insideTopRight' | 'insideBottomLeft' | 'insideBottomRight' | 'outsideTop' | 'outsideLeft' | 'outsideRight' | 'outsideBottom' | 'outsideTopLeft' | 'outsideTopRight' | 'outsideBottomLeft' | 'outsideBottomRight' } | ((props: { name: string; percent: number }) => string);
    labelLine?: boolean | ComponentType<unknown> | { stroke?: string; strokeWidth?: number; strokeDasharray?: string };
    midAngle?: number;
    outerRadius?: number;
    percent?: number;
    value?: number;
    index?: number;
    children?: ReactNode;
    fill?: string;
  }

  export interface CellProps {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    strokeDasharray?: string;
  }

  export interface ReferenceLineProps {
    x?: string | number;
    y?: string | number;
    stroke?: string;
    strokeWidth?: number;
    strokeDasharray?: string;
    label?: string | ComponentType<unknown> | { value?: string; angle?: number; position?: 'top' | 'left' | 'right' | 'bottom' | 'inside' | 'outside' | 'insideLeft' | 'insideRight' | 'insideTop' | 'insideBottom' | 'insideTopLeft' | 'insideTopRight' | 'insideBottomLeft' | 'insideBottomRight' | 'outsideTop' | 'outsideLeft' | 'outsideRight' | 'outsideBottom' | 'outsideTopLeft' | 'outsideTopRight' | 'outsideBottomLeft' | 'outsideBottomRight' };
    segment?: unknown[];
    isFront?: boolean;
    alwaysShow?: boolean;
    ifOverflow?: 'discard' | 'hidden' | 'visible';
  }

  export interface ScatterProps {
    dataKey?: string;
    xAxisId?: string | number;
    yAxisId?: string | number;
    zAxisId?: string | number;
    data?: Record<string, unknown>[];
    shape?: ComponentType<unknown> | 'circle' | 'cross' | 'diamond' | 'square' | 'star' | 'triangle' | 'wye';
    dot?: boolean | ComponentType<unknown> | { r?: number; strokeWidth?: number; stroke?: string; fill?: string; strokeDasharray?: string };
    activeDot?: boolean | ComponentType<unknown> | { r?: number; strokeWidth?: number; stroke?: string; fill?: string; strokeDasharray?: string };
    stroke?: string;
    strokeWidth?: number;
    strokeDasharray?: string;
    fill?: string;
    fillOpacity?: number;
    isAnimationActive?: boolean;
    animationBegin?: number;
    animationDuration?: number;
    animationEasing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
    name?: string;
    unit?: string;
    legendType?: 'line' | 'plainline' | 'square' | 'rect' | 'circle' | 'cross' | 'diamond' | 'star' | 'triangle' | 'wye';
    hide?: boolean;
    label?: string | ComponentType<unknown> | { value?: string; angle?: number; position?: 'top' | 'left' | 'right' | 'bottom' | 'inside' | 'outside' | 'insideLeft' | 'insideRight' | 'insideTop' | 'insideBottom' | 'insideTopLeft' | 'insideTopRight' | 'insideBottomLeft' | 'insideBottomRight' | 'outsideTop' | 'outsideLeft' | 'outsideRight' | 'outsideBottom' | 'outsideTopLeft' | 'outsideTopRight' | 'outsideBottomLeft' | 'outsideBottomRight' };
    onClick?: (data: unknown) => void;
  }

  export interface BrushProps {
    dataKey?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    data?: Record<string, unknown>[];
    startIndex?: number;
    endIndex?: number;
    tickFormatter?: (value: unknown, index: number) => string;
    onChange?: (newIndex: { startIndex?: number; endIndex?: number }) => void;
    onDragEnd?: (newIndex: { startIndex?: number; endIndex?: number }) => void;
    gap?: number;
    padding?: { top?: number; right?: number; bottom?: number; left?: number };
    leaveTimeOut?: number;
    alwaysShowText?: boolean;
    stroke?: string;
    fill?: string;
    strokeWidth?: number;
    strokeDasharray?: string;
    fillOpacity?: number;
  }

  export interface LegendProps {
    width?: number;
    height?: number;
    content?: ComponentType<unknown> | ReactNode;
    wrapperStyle?: Record<string, unknown>;
    iconType?: 'line' | 'plainline' | 'square' | 'rect' | 'circle' | 'cross' | 'diamond' | 'star' | 'triangle' | 'wye';
    layout?: 'horizontal' | 'vertical';
    align?: 'left' | 'center' | 'right';
    verticalAlign?: 'top' | 'middle' | 'bottom';
    iconSize?: number;
    payload?: unknown[];
    formatter?: (value: unknown, entry: unknown, index: number) => ReactNode;
    onClick?: (data: unknown, index: number) => void;
    onMouseEnter?: (data: unknown, index: number, event: unknown) => void;
    onMouseLeave?: (data: unknown, index: number, event: unknown) => void;
  }

  export interface CartesianGridProps {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    horizontal?: boolean | ComponentType<unknown>;
    vertical?: boolean | ComponentType<unknown>;
    horizontalPoints?: number[];
    verticalPoints?: number[];
    horizontalCoordinatesGenerator?: (props: unknown) => number[];
    verticalCoordinatesGenerator?: (props: unknown) => number[];
    stroke?: string;
    strokeWidth?: number;
    strokeDasharray?: string;
    fill?: string;
    fillOpacity?: number;
  }

  // Export all components as React components
  export const ResponsiveContainer: ComponentType<ResponsiveContainerProps>;
  export const LineChart: ComponentType<CategoricalChartProps>;
  export const AreaChart: ComponentType<CategoricalChartProps>;
  export const BarChart: ComponentType<CategoricalChartProps>;
  export const PieChart: ComponentType<CategoricalChartProps>;
  export const ComposedChart: ComponentType<CategoricalChartProps>;
  export const XAxis: ComponentType<XAxisProps>;
  export const YAxis: ComponentType<YAxisProps>;
  export const Tooltip: ComponentType<TooltipProps>;
  export const Line: ComponentType<LineProps>;
  export const Area: ComponentType<AreaProps>;
  export const Bar: ComponentType<BarProps>;
  export const Pie: ComponentType<PieProps>;
  export const Cell: ComponentType<CellProps>;
  export const ReferenceLine: ComponentType<ReferenceLineProps>;
  export const Scatter: ComponentType<ScatterProps>;
  export const Brush: ComponentType<BrushProps>;
  export const Legend: ComponentType<LegendProps>;
  export const CartesianGrid: ComponentType<CartesianGridProps>;
}
