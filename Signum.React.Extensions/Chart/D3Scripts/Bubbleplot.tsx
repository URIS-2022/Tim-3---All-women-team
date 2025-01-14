import * as React from 'react'
import * as d3 from 'd3'
import * as ChartClient from '../ChartClient';
import * as ChartUtils from './Components/ChartUtils';
import { translate, scale, rotate, skewX, skewY, matrix, scaleFor } from './Components/ChartUtils';
import { ChartRow } from '../ChartClient';
import { XScaleTicks, YScaleTicks } from './Components/Ticks';
import { XAxis, YAxis } from './Components/Axis';
import TextEllipsis from './Components/TextEllipsis';
import { Rule } from './Components/Rule';
import InitialMessage from './Components/InitialMessage';
import { KeyCodes } from '@framework/Components';


export default function renderBubbleplot({ data, width, height, parameters, loading, onDrillDown, initialLoad, memo, dashboardFilter, chartRequest }: ChartClient.ChartScriptProps): React.ReactElement<any> {

  var xRule = Rule.create({
    _1: 5,
    title: 15,
    _2: 5,
    labels: parseInt(parameters["UnitMargin"]),
    _3: 5,
    ticks: 4,
    content: '*',
    _margin: parameters["RightMargin"],
    _4: 5,
  }, width);
  //xRule.debugX(chart)

  var yRule = Rule.create({
    _1: 5,
    _topMargin: parameters["TopMargin"],
    content: '*',
    ticks: 4,
    _2: 5,
    labels: 10,
    _3: 10,
    title: 15,
    _4: 5,
  }, height);
  //yRule.debugY(chart);

  if (data == null || data.rows.length == 0)
    return (
      <svg direction="ltr" width={width} height={height}>
        <InitialMessage data={data} x={xRule.middle("content")} y={yRule.middle("content")} loading={loading} />
        <XAxis xRule={xRule} yRule={yRule} />
        <YAxis xRule={xRule} yRule={yRule} />
      </svg>
    );

  var colorKeyColumn = data.columns.c0!;
  var horizontalColumn = data.columns.c1! as ChartClient.ChartColumn<number>;
  var verticalColumn = data.columns.c2 as ChartClient.ChartColumn<number>;
  var sizeColumn = data.columns.c3 as ChartClient.ChartColumn<number>;

  var x = scaleFor(horizontalColumn, data.rows.map(r => horizontalColumn.getValue(r)), 0, xRule.size('content'), parameters["HorizontalScale"]);

  var y = scaleFor(verticalColumn, data.rows.map(r => verticalColumn.getValue(r)), 0, yRule.size('content'), parameters["VerticalScale"]);


  var orderRows = data.rows.orderBy(r => colorKeyColumn.getValueKey(r));
  var color: (r: ChartRow) => string;
  if (parameters["ColorScale"] == "Ordinal") {
    var categoryColor = ChartUtils.colorCategory(parameters, []/*orderRows.map(r => colorKeyColumn.getValueKey(r))*/, memo);
    color = r => colorKeyColumn.getValueColor(r) ?? categoryColor(colorKeyColumn.getValueKey(r));
  } else {
    var scaleFunc = scaleFor(colorKeyColumn, data.rows.map(r => colorKeyColumn.getValue(r) as number), 0, 1, parameters["ColorScale"]);
    var colorInterpolate = parameters["ColorInterpolate"];
    var colorInterpolation = ChartUtils.getColorInterpolation(colorInterpolate)!;
    color = r => colorInterpolation(scaleFunc(colorKeyColumn.getValue(r) as number)!)
  }
  var sizeList = data.rows.map(r => sizeColumn.getValue(r));

  var sizeTemp = scaleFor(sizeColumn, sizeList, 0, 1, parameters["SizeScale"]);

  var totalSizeTemp = d3.sum(data.rows, r => sizeTemp(sizeColumn.getValue(r)));

  var sizeScale = scaleFor(sizeColumn, sizeList, 0, (xRule.size('content') * yRule.size('content')) / (totalSizeTemp * 3), parameters["SizeScale"]);

  var keyColumns: ChartClient.ChartColumn<any>[] = data.columns.entity ? [data.columns.entity] :
    [colorKeyColumn, horizontalColumn, verticalColumn].filter(a => a.token && a.token.queryTokenType != "Aggregate")

  var detector = dashboardFilter?.getActiveDetector(chartRequest);

  return (
    <svg direction="ltr" width={width} height={height}>
      <g opacity={dashboardFilter ? .5 : undefined}>
        <XScaleTicks xRule={xRule} yRule={yRule} valueColumn={horizontalColumn} x={x} />
        <YScaleTicks xRule={xRule} yRule={yRule} valueColumn={verticalColumn} y={y} />
      </g>
      <g className="panel" transform={translate(xRule.start('content'), yRule.end('content'))}>
        {orderRows.map(r => {
          const active = detector?.(r);

          return (
            <g key={keyColumns.map(c => c.getValueKey(r)).join("/")}
              className="shape-serie sf-transition hover-group"
              opacity={active == false ? .5 : undefined}
              transform={translate(x(horizontalColumn.getValue(r))!, -y(verticalColumn.getValue(r))!) + (initialLoad ? scale(0, 0) : scale(1, 1))}
              cursor="pointer"
              onClick={e => onDrillDown(r, e)}
            >
              <circle className="shape sf-transition hover-target"
                stroke={active == true ? "black" : colorKeyColumn.getValueColor(r) ?? color(r)}
                strokeWidth={3} fill={colorKeyColumn.getValueColor(r) ?? color(r)}
                fillOpacity={parseFloat(parameters["FillOpacity"])}
                shapeRendering="initial"
                r={Math.sqrt(sizeScale(sizeColumn.getValue(r))! / Math.PI)} />

              {
                parameters["ShowLabel"] == 'Yes' &&
                <TextEllipsis maxWidth={Math.sqrt(sizeScale(sizeColumn.getValue(r))! / Math.PI) * 2}
                  padding={0} etcText=""
                  className="number-label"
                  fill={parameters["LabelColor"] ?? colorKeyColumn.getValueColor(r) ?? color(r)}
                  dominantBaseline="middle"
                  textAnchor="middle"
                  fontWeight="bold">
                  {sizeColumn.getValueNiceName(r)}
                </TextEllipsis>
              }

              <title>
                {colorKeyColumn.getValueNiceName(r) +
                  ("\n" + horizontalColumn.title + ": " + horizontalColumn.getValueNiceName(r)) +
                  ("\n" + verticalColumn.title + ": " + verticalColumn.getValueNiceName(r)) +
                  ("\n" + sizeColumn.title + ": " + sizeColumn.getValueNiceName(r))}
              </title>

            </g>
          );
        })}
      </g>

      <InitialMessage data={data} x={xRule.middle("content")} y={yRule.middle("content")} loading={loading} />
      <g opacity={dashboardFilter ? .5 : undefined}>
        <XAxis xRule={xRule} yRule={yRule} />
        <YAxis xRule={xRule} yRule={yRule} />
      </g>
    </svg>
  );
}
