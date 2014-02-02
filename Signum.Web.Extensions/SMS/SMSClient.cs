﻿#region usings
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Mvc;
using Signum.Engine.Operations;
using Signum.Utilities;
using Signum.Entities;
using System.Web;
using Signum.Entities.Basics;
using System.Reflection;
using System.Web.UI;
using System.IO;
using System.Web.Routing;
using Signum.Entities.SMS;
using Signum.Web.Operations;
using Signum.Web.Extensions.SMS.Models;
using System.Linq.Expressions;
using Newtonsoft.Json.Linq;
using Signum.Engine.DynamicQuery;
#endregion


namespace Signum.Web.SMS
{
    public static class SMSClient
    {
        public static string ViewPrefix = "~/SMS/Views/{0}.cshtml";
        public static string Module = "Extensions/Signum.Web.Extensions/SMS/Scripts/SMS";

        public static void Start()
        {
            if (Navigator.Manager.NotDefined(MethodInfo.GetCurrentMethod()))
            {
               
                Navigator.RegisterArea(typeof(SMSClient));
                Navigator.AddSettings(new List<EntitySettings>
                {
                    new EmbeddedEntitySettings<SMSConfigurationDN> { PartialViewName = e => ViewPrefix.Formato("SMSConfiguration") },

                    new EntitySettings<SMSMessageDN> { PartialViewName = e => ViewPrefix.Formato("SMSMessage") },
                    new EntitySettings<SMSTemplateDN> { PartialViewName = e => ViewPrefix.Formato("SMSTemplate") },
                    new EmbeddedEntitySettings<SMSTemplateMessageDN> { PartialViewName = e => ViewPrefix.Formato("SMSTemplateMessage") },

                    new EntitySettings<SMSSendPackageDN> { PartialViewName = e => ViewPrefix.Formato("SMSSendPackage") },
                    new EntitySettings<SMSUpdatePackageDN> { PartialViewName = e => ViewPrefix.Formato("SMSUpdatePackage") },

                    new EmbeddedEntitySettings<MultipleSMSModel> { PartialViewName = e => ViewPrefix.Formato("MultipleSMS") },
                });

                OperationClient.AddSettings(new List<OperationSettings> 
                {
                    new EntityOperationSettings(SMSMessageOperation.CreateSMSWithTemplateFromEntity)
                    {
                        OnClick = ctx => new JsOperationFunction(Module, "createSmsWithTemplateFromEntity",
                            ctx.Url.Action("CreateSMSMessageFromTemplate", "SMS"), 
                            SmsTemplateFindOptions(ctx.Entity.GetType()).ToJS(ctx.Prefix, "New"))
                    },

                    new ContextualOperationSettings(SMSProviderOperation.SendSMSMessagesFromTemplate)
                    {
                        OnClick = ctx =>  new JsOperationFunction(Module, "sendMultipleSMSMessagesFromTemplate",
                            ctx.Url.Action("SendMultipleMessagesFromTemplate", "SMS"), 
                            SmsTemplateFindOptions(DynamicQueryManager.Current.GetQuery(ctx.QueryName).EntityImplementations.Types.Single()).ToJS(ctx.Prefix, "New"))
                    },

                    new ContextualOperationSettings(SMSProviderOperation.SendSMSMessage)
                    {
                        OnClick = ctx => new JsOperationFunction(Module, "sentMultipleSms", ctx.Prefix, 
                            ctx.Url.Action("SendMultipleSMSMessagesModel", "SMS"),
                            ctx.Url.Action("SendMultipleMessages", "SMS"))
                    },
                });
            }
        }

        private static FindOptions SmsTemplateFindOptions(Type type)
        {
            return new FindOptions(typeof(SMSTemplateDN))
            {
                FilterOptions = new List<FilterOption> 
                                { 
                                    { new FilterOption("IsActive", true) { Frozen = true } },
                                    { new FilterOption("AssociatedType", type.ToTypeDN().ToLite()) }
                                }
            };
        }
    }
}
