using System.Net.Http;
using Signum.Entities.Basics;
using Signum.Entities.Rest;

namespace Signum.Engine.Rest;

public class RestLogLogic
{
    public static void Start(SchemaBuilder sb)
    {
        if (sb.NotDefined(MethodBase.GetCurrentMethod()))
        {
            sb.Include<RestLogEntity>()
                .WithIndex(a => a.StartDate)
                .WithIndex(a => a.EndDate)
                .WithIndex(a => a.Controller)
                .WithIndex(a => a.Action)
                .WithQuery(() => e => new
                {
                    Entity = e,
                    e.Id,
                    e.StartDate,
                    e.Duration,
                    e.Url,
                    e.User,
                    e.Exception,
                });

            ExceptionLogic.DeleteLogs += ExceptionLogic_DeleteRestLogs;
        }
    }

    private static void ExceptionLogic_DeleteRestLogs(DeleteLogParametersEmbedded parameters, StringBuilder sb, CancellationToken token)
    {
        void Remove(DateTime? dateLimit, bool withExceptions)
        {
            if (dateLimit == null)
                return;

            var query = Database.Query<RestLogEntity>().Where(a => a.StartDate < dateLimit);

            if (withExceptions)
                query = query.Where(a => a.Exception != null);

            query.UnsafeDeleteChunksLog(parameters, sb, token);
        }

        Remove(parameters.GetDateLimitDelete(typeof(RestLogEntity).ToTypeEntity()), withExceptions: false);
        Remove(parameters.GetDateLimitDeleteWithExceptions(typeof(RestLogEntity).ToTypeEntity()), withExceptions: true);
    }

    public static async Task<RestDiffResult> GetRestDiffResult(HttpMethod httpMethod, string url, string apiKey, string? oldRequestBody, string? oldResponseBody)
    {
        var result = new RestDiffResult { previous = oldResponseBody };

        //create the new Request
        var restClient = new HttpClient
        {
            BaseAddress = new Uri(url),
            DefaultRequestHeaders = { { "X-ApiKey", apiKey } }
        };

        var request = new HttpRequestMessage(httpMethod, url);
        var requestUriAbsoluteUri = request.RequestUri!.AbsoluteUri;
        if (requestUriAbsoluteUri.Contains("apiKey"))
        {
            request.RequestUri = requestUriAbsoluteUri.After("apiKey=").Contains("&")
                ? new Uri(requestUriAbsoluteUri.Before("apiKey=") + requestUriAbsoluteUri.After("apiKey=").After('&'))
                : new Uri(requestUriAbsoluteUri.Before("apiKey="));
        }

        if (!string.IsNullOrWhiteSpace(oldRequestBody))
        {
            var response = await restClient.PostAsync("", new StringContent(oldRequestBody, Encoding.UTF8, "application/json"));
            result.current = await response.Content.ReadAsStringAsync();
        }
        else
        {  
            result.current = await restClient.SendAsync(request).Result.Content.ReadAsStringAsync();
        }

        return RestDiffLog(result);
    }

    public static RestDiffResult RestDiffLog(RestDiffResult result)
    {
        StringDistance sd = new StringDistance();
        long? size = (long?)result.current?.Length * result.previous?.Length;
        if (size != null && size<=int.MaxValue)
        {
            var diff = sd.DiffText(result.previous, result.current);
            result.diff = diff;
        }

        return result;
    }
}
