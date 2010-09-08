﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Signum.Entities.Authorization;
using Signum.Engine.ControlPanel;
using Signum.Web.ControlPanel;

namespace Signum.Web.Extensions.Sample.Controllers
{
    [HandleError]
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            if (UserDN.Current == null)
                return View();

            var panel = ControlPanelLogic.GetHomePageControlPanel();
            if (panel != null)
                return View(ControlPanelClient.ViewPrefix + "ControlPanel", panel);
            else
                return View();
        }

        public ActionResult About()
        {
            return View();
        }
    }
}
