﻿#pragma warning disable 1591
//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.34003
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Signum.Web.Extensions.Chart.Views
{
    using System;
    using System.Collections.Generic;
    
    #line 4 "..\..\Chart\Views\ChartRequestView.cshtml"
    using System.Configuration;
    
    #line default
    #line hidden
    using System.IO;
    using System.Linq;
    using System.Net;
    using System.Text;
    using System.Web;
    using System.Web.Helpers;
    using System.Web.Mvc;
    using System.Web.Mvc.Ajax;
    using System.Web.Mvc.Html;
    using System.Web.Routing;
    using System.Web.Security;
    using System.Web.UI;
    using System.Web.WebPages;
    
    #line 3 "..\..\Chart\Views\ChartRequestView.cshtml"
    using Signum.Engine.DynamicQuery;
    
    #line default
    #line hidden
    
    #line 6 "..\..\Chart\Views\ChartRequestView.cshtml"
    using Signum.Entities;
    
    #line default
    #line hidden
    
    #line 7 "..\..\Chart\Views\ChartRequestView.cshtml"
    using Signum.Entities.Chart;
    
    #line default
    #line hidden
    
    #line 2 "..\..\Chart\Views\ChartRequestView.cshtml"
    using Signum.Entities.DynamicQuery;
    
    #line default
    #line hidden
    
    #line 5 "..\..\Chart\Views\ChartRequestView.cshtml"
    using Signum.Entities.Reflection;
    
    #line default
    #line hidden
    using Signum.Utilities;
    
    #line 1 "..\..\Chart\Views\ChartRequestView.cshtml"
    using Signum.Web;
    
    #line default
    #line hidden
    
    #line 8 "..\..\Chart\Views\ChartRequestView.cshtml"
    using Signum.Web.Chart;
    
    #line default
    #line hidden
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("RazorGenerator", "2.0.0.0")]
    [System.Web.WebPages.PageVirtualPathAttribute("~/Chart/Views/ChartRequestView.cshtml")]
    public partial class ChartRequestView : System.Web.Mvc.WebViewPage<TypeContext<ChartRequest>>
    {
        public ChartRequestView()
        {
        }
        public override void Execute()
        {
            
            #line 10 "..\..\Chart\Views\ChartRequestView.cshtml"
Write(Html.ScriptCss("~/Chart/Content/SF_Chart.css"));

            
            #line default
            #line hidden
WriteLiteral("\r\n");

            
            #line 11 "..\..\Chart\Views\ChartRequestView.cshtml"
Write(Html.ScriptsJs("~/Chart/Scripts/SF_Chart.js",
                "~/Chart/Scripts/SF_Chart_Utils.js",
                "~/scripts/d3.v3.min.js",
                "~/scripts/colorbrewer.js"));

            
            #line default
            #line hidden
WriteLiteral("\r\n");

            
            #line 15 "..\..\Chart\Views\ChartRequestView.cshtml"
   
    QueryDescription queryDescription =  (QueryDescription)ViewData[ViewDataKeys.QueryDescription];
    if (queryDescription == null)
    {
        queryDescription = DynamicQueryManager.Current.QueryDescription(Model.Value.QueryName);
        ViewData[ViewDataKeys.QueryDescription] = queryDescription;
    }
    
    List<FilterOption> filterOptions = (List<FilterOption>)ViewData[ViewDataKeys.FilterOptions];

    var entityColumn = queryDescription.Columns.SingleEx(a => a.IsEntity);
    Type entitiesType = entityColumn.Type.CleanType();

            
            #line default
            #line hidden
WriteLiteral("\r\n<div");

WriteAttribute("id", Tuple.Create(" id=\"", 1073), Tuple.Create("\"", 1110)
            
            #line 28 "..\..\Chart\Views\ChartRequestView.cshtml"
, Tuple.Create(Tuple.Create("", 1078), Tuple.Create<System.Object, System.Int32>(Model.Compose("sfChartControl")
            
            #line default
            #line hidden
, 1078), false)
);

WriteLiteral(" \r\n    class=\"sf-search-control sf-chart-control\"");

WriteLiteral(" \r\n    data-subtokens-url=\"");

            
            #line 30 "..\..\Chart\Views\ChartRequestView.cshtml"
                   Write(Url.Action("NewSubTokensCombo", "Chart"));

            
            #line default
            #line hidden
WriteLiteral("\"");

WriteLiteral(" \r\n    data-add-filter-url=\"");

            
            #line 31 "..\..\Chart\Views\ChartRequestView.cshtml"
                    Write(Url.Action("AddFilter", "Chart"));

            
            #line default
            #line hidden
WriteLiteral("\"");

WriteLiteral(" \r\n    data-prefix=\"");

            
            #line 32 "..\..\Chart\Views\ChartRequestView.cshtml"
            Write(Model.ControlID);

            
            #line default
            #line hidden
WriteLiteral("\"");

WriteLiteral("\r\n    data-fullscreen-url=\"");

            
            #line 33 "..\..\Chart\Views\ChartRequestView.cshtml"
                     Write(Url.Action<ChartController>(cc => cc.FullScreen(Model.ControlID)));

            
            #line default
            #line hidden
WriteLiteral("\"");

WriteLiteral("\r\n    >\r\n");

WriteLiteral("    ");

            
            #line 35 "..\..\Chart\Views\ChartRequestView.cshtml"
Write(Html.HiddenRuntimeInfo(Model));

            
            #line default
            #line hidden
WriteLiteral("\r\n");

WriteLiteral("    ");

            
            #line 36 "..\..\Chart\Views\ChartRequestView.cshtml"
Write(Html.Hidden(Model.Compose("sfOrders"), Model.Value.Orders.IsNullOrEmpty() ? "" :
        (Model.Value.Orders.ToString(oo => (oo.OrderType == OrderType.Ascending ? "" : "-") + oo.Token.FullKey(), ";") + ";")));

            
            #line default
            #line hidden
WriteLiteral("\r\n    <div>\r\n        <div");

WriteLiteral(" class=\"sf-fields-list\"");

WriteLiteral(">\r\n            <div");

WriteLiteral(" class=\"ui-widget sf-filters\"");

WriteLiteral(">\r\n                <div");

WriteLiteral(" class=\"ui-widget-header ui-corner-top sf-filters-body\"");

WriteLiteral(">\r\n");

WriteLiteral("                    ");

            
            #line 42 "..\..\Chart\Views\ChartRequestView.cshtml"
               Write(Html.QueryTokenBuilder(null, Model, queryDescription, canAggregate: Model.Value.GroupResults));

            
            #line default
            #line hidden
WriteLiteral("\r\n");

WriteLiteral("                    ");

            
            #line 43 "..\..\Chart\Views\ChartRequestView.cshtml"
               Write(Html.Href(
                            Model.Compose("btnAddFilter"),
                            SearchMessage.FilterBuilder_AddFilter.NiceToString(),
                            "",
                            JavascriptMessage.selectToken.NiceToString(),
                            "sf-query-button sf-add-filter sf-disabled",
                            new Dictionary<string, object> 
                            { 
                                { "data-icon", "ui-icon-arrowthick-1-s" },
                                { "data-url", Url.SignumAction("AddFilter") }
                            }));

            
            #line default
            #line hidden
WriteLiteral("\r\n                </div>\r\n");

            
            #line 55 "..\..\Chart\Views\ChartRequestView.cshtml"
                
            
            #line default
            #line hidden
            
            #line 55 "..\..\Chart\Views\ChartRequestView.cshtml"
                   
                    Html.RenderPartial(Navigator.Manager.FilterBuilderView); 
                
            
            #line default
            #line hidden
WriteLiteral("\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div");

WriteAttribute("id", Tuple.Create(" id=\"", 2812), Tuple.Create("\"", 2858)
            
            #line 61 "..\..\Chart\Views\ChartRequestView.cshtml"
, Tuple.Create(Tuple.Create("", 2817), Tuple.Create<System.Object, System.Int32>(Model.Compose("sfChartBuilderContainer")
            
            #line default
            #line hidden
, 2817), false)
);

WriteLiteral(">\r\n");

WriteLiteral("        ");

            
            #line 62 "..\..\Chart\Views\ChartRequestView.cshtml"
   Write(Html.Partial(ChartClient.ChartBuilderView, Model.Value));

            
            #line default
            #line hidden
WriteLiteral("\r\n    </div>\r\n    <script");

WriteLiteral(" type=\"text/javascript\"");

WriteLiteral(">\r\n        var findOptions = ");

            
            #line 65 "..\..\Chart\Views\ChartRequestView.cshtml"
                      Write(MvcHtmlString.Create(Model.Value.ToJS().ToString()));

            
            #line default
            #line hidden
WriteLiteral("\r\n        require(\"");

            
            #line 66 "..\..\Chart\Views\ChartRequestView.cshtml"
            Write(ChartClient.Module);

            
            #line default
            #line hidden
WriteLiteral("\", function (Chart) { new Chart.ChartBuilder($(\'#");

            
            #line 66 "..\..\Chart\Views\ChartRequestView.cshtml"
                                                                                Write(Model.Compose("sfChartBuilderContainer"));

            
            #line default
            #line hidden
WriteLiteral("\'), $.extend({ prefix: \'");

            
            #line 66 "..\..\Chart\Views\ChartRequestView.cshtml"
                                                                                                                                                 Write(Model.ControlID);

            
            #line default
            #line hidden
WriteLiteral("\' }, findOptions)); }); \r\n    </script>\r\n    <div");

WriteLiteral(" class=\"sf-query-button-bar\"");

WriteLiteral(">\r\n        <button");

WriteLiteral(" type=\"submit\"");

WriteLiteral(" class=\"sf-query-button sf-chart-draw\"");

WriteLiteral(" data-icon=\"ui-icon-refresh\"");

WriteAttribute("id", Tuple.Create(" id=\"", 3400), Tuple.Create("\"", 3429)
            
            #line 69 "..\..\Chart\Views\ChartRequestView.cshtml"
                    , Tuple.Create(Tuple.Create("", 3405), Tuple.Create<System.Object, System.Int32>(Model.Compose("qbDraw")
            
            #line default
            #line hidden
, 3405), false)
);

WriteLiteral(" data-url=\"");

            
            #line 69 "..\..\Chart\Views\ChartRequestView.cshtml"
                                                                                                                                    Write(Url.Action<ChartController>(cc => cc.Draw(Model.ControlID)));

            
            #line default
            #line hidden
WriteLiteral("\"");

WriteLiteral(">");

            
            #line 69 "..\..\Chart\Views\ChartRequestView.cshtml"
                                                                                                                                                                                                   Write(ChartMessage.Chart_Draw.NiceToString());

            
            #line default
            #line hidden
WriteLiteral("</button>\r\n        <button");

WriteLiteral(" class=\"sf-query-button sf-chart-script-edit\"");

WriteLiteral(" data-icon=\"ui-icon-script\"");

WriteAttribute("id", Tuple.Create(" id=\"", 3642), Tuple.Create("\"", 3671)
            
            #line 70 "..\..\Chart\Views\ChartRequestView.cshtml"
            , Tuple.Create(Tuple.Create("", 3647), Tuple.Create<System.Object, System.Int32>(Model.Compose("qbEdit")
            
            #line default
            #line hidden
, 3647), false)
);

WriteLiteral(">");

            
            #line 70 "..\..\Chart\Views\ChartRequestView.cshtml"
                                                                                                                 Write(ChartMessage.UserChart_Edit.NiceToString());

            
            #line default
            #line hidden
WriteLiteral("</button>\r\n");

WriteLiteral("        ");

            
            #line 71 "..\..\Chart\Views\ChartRequestView.cshtml"
   Write(UserChartClient.GetChartMenu(this.ViewContext, Url, queryDescription.QueryName, entitiesType, Model.ControlID, (Lite<UserChartDN>)ViewData["UserChart"]).ToString(Html));

            
            #line default
            #line hidden
WriteLiteral("\r\n");

WriteLiteral("        ");

            
            #line 72 "..\..\Chart\Views\ChartRequestView.cshtml"
   Write(Html.Href(Model.Compose("sfFullScreen"),
            "Full Screen",
            "",
            "Full Screen",
            "sf-query-button sf-query-fullscreen", 
            new Dictionary<string, object> 
            { 
                { "data-icon", "ui-icon-extlink" },
                { "data-text", false }
            }));

            
            #line default
            #line hidden
WriteLiteral("\r\n    </div>\r\n    <div");

WriteLiteral(" class=\"clearall\"");

WriteLiteral(">\r\n    </div>\r\n    <div");

WriteAttribute("id", Tuple.Create(" id=\"", 4312), Tuple.Create("\"", 4345)
            
            #line 85 "..\..\Chart\Views\ChartRequestView.cshtml"
, Tuple.Create(Tuple.Create("", 4317), Tuple.Create<System.Object, System.Int32>(Model.Compose("divResults")
            
            #line default
            #line hidden
, 4317), false)
);

WriteLiteral(" class=\"ui-widget ui-corner-all sf-search-results-container\"");

WriteLiteral(">\r\n");

            
            #line 86 "..\..\Chart\Views\ChartRequestView.cshtml"
        
            
            #line default
            #line hidden
            
            #line 86 "..\..\Chart\Views\ChartRequestView.cshtml"
           Html.RenderPartial(ChartClient.ChartResultsView); 
            
            #line default
            #line hidden
WriteLiteral("\r\n    </div>\r\n</div>\r\n");

        }
    }
}
#pragma warning restore 1591
