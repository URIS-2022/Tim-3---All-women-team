using Signum.Engine.Authorization;
using Signum.Entities.Authorization;
using Signum.Entities.Basics;
using Signum.React.Filters;
using System.Globalization;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Mvc.Routing;

namespace Signum.React.Translation;

[ValidateModelFilter]
public class CultureController : ControllerBase
{
    IHostApplicationLifetime _env;
    public CultureController(IHostApplicationLifetime env)
    {
        _env = env;
    }

    [HttpGet("api/culture/cultures"), SignumAllowAnonymous]
    public List<CultureInfoEntity> GetCultures()
    {
        return CultureInfoLogic.CultureInfoToEntity.Value.Values.ToList();
    }

    [HttpGet("api/culture/currentCulture"), SignumAllowAnonymous]
    public CultureInfoEntity CurrentCulture()
    {
        return CultureInfo.CurrentCulture.TryGetCultureInfoEntity() ?? CultureInfoLogic.CultureInfoToEntity.Value.Values.FirstEx();
    }

    [HttpPost("api/culture/setCurrentCulture"), SignumAllowAnonymous]
    public string SetCurrentCulture([Required, FromBody]Lite<CultureInfoEntity> culture)
    {
        var ci = ExecutionMode.Global().Using(_ => culture.RetrieveAndRemember().ToCultureInfo());

        if (UserEntity.Current != null && !UserEntity.Current.Is(AuthLogic.AnonymousUser)) //Won't be used till next refresh
        {
            using (AuthLogic.Disable())
            using (OperationLogic.AllowSave<UserEntity>())
            {
                var user = UserEntity.Current.RetrieveAndRemember();
                user.CultureInfo = culture.RetrieveAndRemember();
                UserHolder.Current = new UserWithClaims(user);
                user.Save();
            }
        }

        ControllerContext.HttpContext.Response.Cookies.Append("language", ci.Name, new CookieOptions
        {
            Expires = DateTimeOffset.Now.AddYears(10),
            Path = new UrlHelper(ControllerContext).Content("~/"),
            IsEssential = true,
            Domain = Request.Host.Host
        });
        return ci.Name;
    }
}
