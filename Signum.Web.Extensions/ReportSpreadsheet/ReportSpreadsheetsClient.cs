#region usings
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Reflection;
using System.Web.Mvc;
using Signum.Utilities;
using System.Web.UI;
using Signum.Entities.Reports;
using Signum.Entities.Basics;
using Signum.Entities;
using Signum.Engine.Reports;
using System.Web.Routing;
using Signum.Web.Files;
using Signum.Engine;
using Signum.Entities.DynamicQuery;
using Signum.Engine.Basics;
using Signum.Entities.Files;
using Signum.Entities.UserQueries;
#endregion

namespace Signum.Web.Reports
{
    public class ReportSpreadsheetClient
    {
        public static string ViewPrefix = "~/ReportSpreadsheet/Views/{0}.cshtml";
        public static string Module = "Extensions/Signum.Web.Extensions/ReportSpreadsheet/Scripts/Report";

        public static bool ToExcelPlain { get; private set; }
        public static bool ExcelReport { get; private set; }

        public static void Start(bool toExcelPlain, bool excelReport)
        {
            if (Navigator.Manager.NotDefined(MethodInfo.GetCurrentMethod()))
            {
                ToExcelPlain = toExcelPlain;
                ExcelReport = excelReport;

                Navigator.RegisterArea(typeof(ReportSpreadsheetClient));

                if (excelReport)
                {
                    if (!Navigator.Manager.EntitySettings.ContainsKey(typeof(EmbeddedFileDN)))
                        throw new InvalidOperationException("Call EmbeddedFileDN first");

                    if (!Navigator.Manager.EntitySettings.ContainsKey(typeof(QueryDN)))
                        Navigator.Manager.EntitySettings.Add(typeof(QueryDN), new EntitySettings<QueryDN>());

                    
                    Navigator.AddSettings(new List<EntitySettings>{
                        new EntitySettings<ExcelReportDN> 
                        { 
                            PartialViewName = _ => ViewPrefix.Formato("ExcelReport"),
                        }
                    });
                }

                if (toExcelPlain || excelReport)
                    ButtonBarQueryHelper.RegisterGlobalButtons(ButtonBarQueryHelper_GetButtonBarForQueryName); 
            }
        }

        static ToolBarButton[] ButtonBarQueryHelper_GetButtonBarForQueryName(QueryButtonContext ctx)
        {
            if (ctx.Prefix.HasText())
                return null;

            Lite<UserQueryDN> currentUserQuery = null;
            string url = (ctx.ControllerContext.RouteData.Route as Route).TryCC(r => r.Url);
            if (url.HasText() && url.Contains("UQ"))
                currentUserQuery = Lite.Create<UserQueryDN>(int.Parse(ctx.ControllerContext.RouteData.Values["lite"].ToString()));

            ToolBarButton plain = new ToolBarButton
            {
                Id = TypeContextUtilities.Compose(ctx.Prefix, "qbToExcelPlain"),
                AltText = ExcelMessage.ExcelReport.NiceToString(),
                Text = ExcelMessage.ExcelReport.NiceToString(),
                OnClick = new JsFunction(Module, "toPlainExcel", ctx.Prefix, ctx.Url.Action("ToExcelPlain", "Report")),
                DivCssClass = ToolBarButton.DefaultQueryCssClass
            };

            if (ExcelReport) 
            {
                var items = new List<ToolBarButton>();
                
                if (ToExcelPlain)
                    items.Add(plain);

                List<Lite<ExcelReportDN>> reports = ReportSpreadsheetsLogic.GetExcelReports(ctx.QueryName);

                if (reports.Count > 0)
                {
                    if (items.Count > 0)
                        items.Add(new ToolBarSeparator());

                    foreach (Lite<ExcelReportDN> report in reports)
                    {
                        items.Add(new ToolBarButton
                        {
                            AltText = report.ToString(),
                            Text = report.ToString(),
                            OnClick = new JsFunction(Module, "toExcelReport", ctx.Prefix, ctx.Url.Action("ExcelReport", "Report"), report.Key()),
                            DivCssClass = ToolBarButton.DefaultQueryCssClass
                        });
                    }
                }

                items.Add(new ToolBarSeparator());

                var current =  QueryLogic.GetQuery(ctx.QueryName).ToLite().Key(); 

                items.Add(new ToolBarButton
                {
                    Id = TypeContextUtilities.Compose(ctx.Prefix, "qbReportAdminister"),
                    AltText = ExcelMessage.Administer.NiceToString(),
                    Text = ExcelMessage.Administer.NiceToString(),
                    OnClick = new JsFunction(Module, "administerExcelReports", ctx.Prefix, Navigator.ResolveWebQueryName(typeof(ExcelReportDN)),current),
                    DivCssClass = ToolBarButton.DefaultQueryCssClass
                });

                items.Add(new ToolBarButton
                {
                    Id = TypeContextUtilities.Compose(ctx.Prefix, "qbCreateAdminister"),
                    AltText = ExcelMessage.CreateNew.NiceToString(),
                    Text = ExcelMessage.CreateNew.NiceToString(),
                    OnClick = new JsFunction(Module, "createExcelReports", ctx.Prefix, ctx.Url.Action("Create", "Report"),current),
                    DivCssClass = ToolBarButton.DefaultQueryCssClass
                });

                return new ToolBarButton[]
                {
                    new ToolBarMenu
                    { 
                        Id = TypeContextUtilities.Compose(ctx.Prefix, "tmExcel"),
                        AltText = "Excel", 
                        Text = "Excel",
                        DivCssClass = ToolBarButton.DefaultQueryCssClass,
                        Items = items
                    }
                };
            }
            else
            {
                if (ToExcelPlain)
                    return new ToolBarButton[] { plain };
            }

            return null;
        }
    }
}
