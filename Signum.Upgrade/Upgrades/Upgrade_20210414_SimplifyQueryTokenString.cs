namespace Signum.Upgrade.Upgrades;

class Upgrade_20210414_SimplifyQueryTokenString : CodeUpgradeBase
{
    public override string Description => "Simplify QueryTokenString entity().token(a=>a.name) by entity(a=>a.entity.name)";

    public override void Execute(UpgradeContext uctx)
    {
        uctx.ForeachCodeFile("*.tsx,*.ts", "Southwind.React", file =>
        {
            file.Replace(new Regex(@"token\(\).entity\((\w+) *=> *\1"), @"token($1 => $1.entity");
            file.Replace(new Regex(@"t.entity\((\w+) *=> *\1"), @"t.append($1 => $1.entity");
            file.Replace(@"token().entity()", @"token(a => a.entity)");
        });
    }
}
