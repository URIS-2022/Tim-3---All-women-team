import * as React from 'react'
import * as d3 from 'd3'
import { translate, rotate } from './ChartUtils';


export class Rule<T extends string> {

  private sizes: { [key: string]: number } = {};
  private starts: { [key: string]: number } = {};
  private ends: { [key: string]: number } = {};

  totalSize: number;

  static create<O extends { [key: string]: number | string }>(object: O, totalSize?: number): Rule<Extract<keyof O, string>> {
    return new Rule(object, totalSize)
  }

  private constructor(object: { [key: string]: number | string }, totalSize?: number) {

    let fixed = 0;
    let proportional = 0;
    for (const p in object) {
      const value = object[p];
      if (typeof value === 'number')
        fixed += value;
      else if (Rule.isStar(value))
        proportional += Rule.getStar(value);
      else
        throw new Error("values should be numbers or *");
    }

    if (!totalSize) {
      if (proportional)
        throw new Error("totalSize is mandatory if * is used");

      totalSize = fixed;
    }

    this.totalSize = totalSize;

    const remaining = totalSize - fixed;
    const star = proportional <= 0 ? 0 : remaining / proportional;

    for (const p in object) {
      const value = object[p];
      if (typeof value === 'number')
        this.sizes[p] = value;
      else if (Rule.isStar(value))
        this.sizes[p] = Rule.getStar(value) * star;
    }

    let acum = 0;

    for (const p in this.sizes) {
      this.starts[p] = acum;
      acum += this.sizes[p];
      this.ends[p] = acum;
    }
  }

  static isStar(val: string) {
    return typeof val === 'string' && val[val.length - 1] == '*';
  }

  static getStar(val: string) {
    if (val === '*')
      return 1;

    return parseFloat(val.substring(0, val.length - 1));
  }


  size(name: T) {
    return this.sizes[name];
  }

  start(name: T) {
    return this.starts[name];
  }

  end(name: T) {
    return this.ends[name];
  }

  middle(name: T) {
    return this.starts[name] + this.sizes[name] / 2;
  }

  debugX(width = 10000) {

    const keys = Object.keys(this.sizes);

    //paint x-axis rule

    return (
      <>
        <g className="x-rule-tick">
          {keys.map(d => <line key={d} className="x-rule-tick"
            x1={this.ends[d]}
            x2={this.ends[d]}
            y1={0}
            y2={width}
            strokeWidth={2}
            stroke="Pink" />)}
        </g>
        <g className="x-axis-rule-label">
          {keys.map((d, i) => <text key={d} className="x-axis-rule-label"
            transform={translate(this.starts[d] + this.sizes[d] / 2 - 5, 10 + 100 * (i % 3)) + rotate(90)}
            fill="DeepPink">
            {d}
          </text>)}
        </g>

      </>
    );
  }

  debugY(height = 10000) {

    const keys = Object.keys(this.sizes);

    return (
      <>
        <g className="y-rule-tick">
          {keys.map(d => <line key={d} className="y-rule-tick"
            x1={0}
            x2={height}
            y1={this.ends[d]}
            y2={this.ends[d]}
            strokeWidth={2}
            stroke="Violet" />)}
        </g>
        <g className="y-axis-rule-label">
          {keys.map((d, i) => <text key={d} className="y-axis-rule-label"
            transform={translate(100 * (i % 3), this.starts[d] + this.sizes[d] / 2 + 4)}
            fill="DarkViolet">
            {d}
          </text>)}
        </g>
      </>
    );
  }
}
