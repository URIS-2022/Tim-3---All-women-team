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

namespace Signum.Web.Extensions.ReportSpreadsheet.Views
{
    using System;
    using System.Collections.Generic;
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
    
    #line 1 "..\..\ReportSpreadsheet\Views\ExcelReport.cshtml"
    using Signum.Engine;
    
    #line default
    #line hidden
    using Signum.Entities;
    
    #line 3 "..\..\ReportSpreadsheet\Views\ExcelReport.cshtml"
    using Signum.Entities.Basics;
    
    #line default
    #line hidden
    
    #line 4 "..\..\ReportSpreadsheet\Views\ExcelReport.cshtml"
    using Signum.Entities.Files;
    
    #line default
    #line hidden
    
    #line 2 "..\..\ReportSpreadsheet\Views\ExcelReport.cshtml"
    using Signum.Entities.Reports;
    
    #line default
    #line hidden
    using Signum.Utilities;
    using Signum.Web;
    
    #line 5 "..\..\ReportSpreadsheet\Views\ExcelReport.cshtml"
    using Signum.Web.Files;
    
    #line default
    #line hidden
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("RazorGenerator", "2.0.0.0")]
    [System.Web.WebPages.PageVirtualPathAttribute("~/ReportSpreadsheet/Views/ExcelReport.cshtml")]
    public partial class ExcelReport : System.Web.Mvc.WebViewPage<dynamic>
    {
        public ExcelReport()
        {
        }
        public override void Execute()
        {
WriteLiteral("\r\n");

            
            #line 7 "..\..\ReportSpreadsheet\Views\ExcelReport.cshtml"
 using (var e = Html.TypeContext<ExcelReportDN>())
{
    
            
            #line default
            #line hidden
            
            #line 9 "..\..\ReportSpreadsheet\Views\ExcelReport.cshtml"
Write(Html.EntityLine(e, f => f.Query, el => { el.ReadOnly = true; }));

            
            #line default
            #line hidden
            
            #line 9 "..\..\ReportSpreadsheet\Views\ExcelReport.cshtml"
                                                                    
    
            
            #line default
            #line hidden
            
            #line 10 "..\..\ReportSpreadsheet\Views\ExcelReport.cshtml"
Write(Html.ValueLine(e, f => f.DisplayName));

            
            #line default
            #line hidden
            
            #line 10 "..\..\ReportSpreadsheet\Views\ExcelReport.cshtml"
                                          
    
            
            #line default
            #line hidden
            
            #line 11 "..\..\ReportSpreadsheet\Views\ExcelReport.cshtml"
Write(Html.FileLine(e, f => f.File, fl => fl.AsyncUpload = false));

            
            #line default
            #line hidden
            
            #line 11 "..\..\ReportSpreadsheet\Views\ExcelReport.cshtml"
                                                                
    
            
            #line default
            #line hidden
            
            #line 12 "..\..\ReportSpreadsheet\Views\ExcelReport.cshtml"
Write(Html.FileLine(e, f => f.File));

            
            #line default
            #line hidden
            
            #line 12 "..\..\ReportSpreadsheet\Views\ExcelReport.cshtml"
                                  
}
            
            #line default
            #line hidden
        }
    }
}
#pragma warning restore 1591
