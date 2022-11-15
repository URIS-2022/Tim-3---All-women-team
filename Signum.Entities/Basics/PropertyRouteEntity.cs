
namespace Signum.Entities.Basics;

#pragma warning disable CS8618 // Non-nullable field is uninitialized.
[EntityKind(EntityKind.SystemString, EntityData.Master), TicksColumn(false)]
public class PropertyRouteEntity : Entity
{
    [StringLengthValidator(Min = 1, Max = 100)]
    public string Path { get; set; }

    public TypeEntity RootType { get; set; }

    public PropertyRoute ToPropertyRoute()
    {
        return ToPropertyRouteFunc(this);
    }

    public static Func<PropertyRouteEntity, PropertyRoute> ToPropertyRouteFunc;
  

    [AutoExpressionField]
    public override string ToString() => As.Expression(() => this.Path);
}
