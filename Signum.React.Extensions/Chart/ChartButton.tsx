import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FilterOptionParsed, FilterGroupOptionParsed, isFilterGroupOptionParsed } from '@framework/FindOptions'
import * as AppContext from '@framework/AppContext'
import * as Navigator from '@framework/Navigator'
import { default as SearchControlLoaded } from '@framework/SearchControl/SearchControlLoaded'
import { ChartMessage, ChartRequestModel } from './Signum.Entities.Chart'
import * as ChartClient from './ChartClient'
import { Button } from 'react-bootstrap'
import * as Finder from '@framework//Finder';

export interface ChartButtonProps {
  searchControl: SearchControlLoaded;
}

export default class ChartButton extends React.Component<ChartButtonProps> {

  handleOnMouseUp = (e: React.MouseEvent<any>) => {
    e.preventDefault();

    if (e.button == 2)
      return;

    e.persist();

    const sc = this.props.searchControl;

    Finder.getQueryDescription(sc.props.findOptions.queryKey).then(qd => {

      const fo = Finder.toFindOptions(sc.props.findOptions, qd, false);

      const path = ChartClient.Encoder.chartPath({
        queryName: fo.queryName,
        orderOptions: [],
        filterOptions: fo.filterOptions
      })

      if (sc.props.avoidChangeUrl || e.ctrlKey || e.button == 1)
        window.open(AppContext.toAbsoluteUrl(path));
      else
        AppContext.pushOrOpenInTab(path, e);
    });
  }

  render() {
    var label = this.props.searchControl.props.largeToolbarButtons == true ? " " + ChartMessage.Chart.niceToString() : undefined;
    return (
      <Button variant="light" onMouseUp={this.handleOnMouseUp} title={ChartMessage.Chart.niceToString()}><FontAwesomeIcon icon="chart-bar" />&nbsp;{label}</Button>
    );
  }

}



