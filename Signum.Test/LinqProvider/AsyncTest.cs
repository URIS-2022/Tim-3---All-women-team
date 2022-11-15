﻿
namespace Signum.Test.LinqProvider;

/// <summary>
/// Summary description for SelectManyTest
/// </summary>
public class AsyncTest
{
    public AsyncTest()
    {
        MusicStarter.StartAndLoad();
        Connector.CurrentLogger = new DebugTextWriter();
    }

    [Fact]
    public void ToListAsync()
    {
        var artistsInBands = Database.Query<BandEntity>().ToListAsync().Result;
        Assert.NotNull(artistsInBands);
    }

    [Fact]
    public void ToArrayAsync()
    {
        var artistsInBands = Database.Query<BandEntity>().ToArrayAsync().Result;
        Assert.NotNull(artistsInBands);
    }

    [Fact]
    public void AverageAsync()
    {
        var artistsInBands = Database.Query<BandEntity>().AverageAsync(a=>a.Members.Count).Result;
    }


    [Fact]
    public void MinAsync()
    {
        var artistsInBands = Database.Query<BandEntity>().MinAsync(a => a.Members.Count).Result;
    }
}
