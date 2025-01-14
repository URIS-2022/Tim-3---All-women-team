import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ajaxPostRaw, ajaxGet, saveFile } from '@framework/Services';
import { EntitySettings } from '@framework/Navigator'
import * as Navigator from '@framework/Navigator'
import * as Finder from '@framework/Finder'
import { QueryRequest } from '@framework/FindOptions'
import { Lite } from '@framework/Signum.Entities'
import { ExcelReportEntity, ExcelMessage, ExcelPermission } from './Signum.Entities.Excel'
import * as AuthClient from '../Authorization/AuthClient'
import * as ChartClient from '../Chart/ChartClient'
import { ChartPermission } from '../Chart/Signum.Entities.Chart'
import ExcelMenu from './ExcelMenu'

export function start(options: { routes: JSX.Element[], plainExcel: boolean, excelReport: boolean }) {

  if (options.excelReport) {
    Navigator.addSettings(new EntitySettings(ExcelReportEntity, e => import('./Templates/ExcelReport')));
  }

  Finder.ButtonBarQuery.onButtonBarElements.push(ctx => {

    if (!ctx.searchControl.props.showBarExtension ||
      !(ctx.searchControl.props.showBarExtensionOption?.showExcelMenu ?? ctx.searchControl.props.largeToolbarButtons))
      return undefined;

    if (!(options.plainExcel && AuthClient.isPermissionAuthorized(ExcelPermission.PlainExcel)) &&
      !(options.excelReport && Navigator.isViewable(ExcelReportEntity)))
      return undefined;

    return { button: <ExcelMenu searchControl={ctx.searchControl} plainExcel={options.plainExcel} excelReport={options.excelReport && Navigator.isViewable(ExcelReportEntity)} /> };
  });

  if (options.plainExcel) {
    ChartClient.ButtonBarChart.onButtonBarElements.push(ctx => {
      if (!AuthClient.isPermissionAuthorized(ChartPermission.ViewCharting) || !AuthClient.isPermissionAuthorized(ExcelPermission.PlainExcel))
        return undefined;

      return (
        <button
          className="sf-query-button sf-chart-script-edit btn btn-light"
          onClick={() => { API.generatePlainExcel(ChartClient.API.getRequest(ctx.chartRequest)); }}>
          <FontAwesomeIcon icon={["far", "file-excel"]} /> &nbsp; {ExcelMessage.ExcelReport.niceToString()}
        </button>
      );
    });
  }
}

export namespace API {

  export function generatePlainExcel(request: QueryRequest, overrideFileName?: string): void {
    ajaxPostRaw({ url: "~/api/excel/plain" }, request)
      .then(response => saveFile(response, overrideFileName));
  }

  export function forQuery(queryKey: string): Promise<Lite<ExcelReportEntity>[]> {
    return ajaxGet({ url: "~/api/excel/reportsFor/" + queryKey });
  }


  export function generateExcelReport(queryRequest: QueryRequest, excelReport: Lite<ExcelReportEntity>): void {
    ajaxPostRaw({ url: "~/api/excel/excelReport" }, { queryRequest, excelReport })
      .then(response => saveFile(response));
  }
}

declare module '@framework/SearchControl/SearchControlLoaded' {

  export interface ShowBarExtensionOption {
    showExcelMenu?: boolean;
  }
}
