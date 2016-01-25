﻿import * as React from "react"
import { Router, Route, Redirect, IndexRoute } from "react-router"
import { Dic, hasFlag } from './Globals';
import { ajaxGet, ajaxPost } from './Services';
import { openModal } from './Modals';
import { IEntity, Lite, Entity, ModifiableEntity, EmbeddedEntity, LiteMessage } from './Signum.Entities';
import { PropertyRoute, PseudoType, EntityKind, TypeInfo, IType, Type, getTypeInfo } from './Reflection';
import { TypeContext } from './TypeContext';
import * as Finder from './Finder';
import NormalPopup from './NormalPage/NormalPopup';


export var NotFound: __React.ComponentClass<any>;

export var currentUser: IEntity;
export var currentHistory: HistoryModule.History & HistoryModule.HistoryQueries;



export function start(options: { routes: JSX.Element[] }) {
    options.routes.push(<Route path="view/:type/:id" getComponent={(loc, cb) => require(["./NormalPage/NormalPage"], (Comp) => cb(null, Comp.default)) } ></Route>);
    options.routes.push(<Route path="create/:type" getComponent={(loc, cb) => require(["./NormalPage/NormalPage"], (Comp) => cb(null, Comp.default))} ></Route>);
}

export function getTypeName(pseudoType: IType | TypeInfo | string) {
    if ((pseudoType as IType).typeName)
        return (pseudoType as IType).typeName;

    if ((pseudoType as TypeInfo).name)
        return (pseudoType as TypeInfo).name;

    if (typeof pseudoType == "string")
        return pseudoType as string;

    throw new Error("Unexpected pseudoType " + pseudoType);
}


export function getTypeTitel(entity: Entity) {

    var typeInfo = getTypeInfo(entity.Type)

    return entity.isNew ?
        LiteMessage.New_G.niceToString().forGenderAndNumber(typeInfo.gender).formatWith(typeInfo.niceName) :
        typeInfo.niceName + " " + entity.id;
}


export function navigateRoute(entity: IEntity);
export function navigateRoute(lite: Lite<IEntity>);
export function navigateRoute(type: PseudoType, id: any);
export function navigateRoute(typeOfEntity: any, id: any = null) {
    var typeName: string;
    if ((typeOfEntity as IEntity).Type) {
        typeName = (typeOfEntity as IEntity).Type;
        id = (typeOfEntity as IEntity).id;
    }
    else if ((typeOfEntity as Lite<IEntity>).EntityType) {
        typeName = (typeOfEntity as Lite<IEntity>).EntityType;
        id = (typeOfEntity as Lite<IEntity>).id;
    }
    else {
        typeName = getTypeName(typeOfEntity as PseudoType);
    }

    return "/view/" + typeName[0].toLowerCase() + typeName.substr(1) + "/" + id;
}

export var entitySettings: { [type: string]: EntitySettingsBase } = {};

export function addSettings(...settings: EntitySettingsBase[]) {
    settings.forEach(s=> Dic.addOrThrow(entitySettings, s.type.typeName, s));
}


export function getSettings(type: PseudoType): EntitySettingsBase {
    var typeName = getTypeName(type);

    return entitySettings[typeName];
}


export var isCreableEvent: Array<(typeName: string) => boolean> = [];

export function isCreable(type: PseudoType, isSearch?: boolean) {

    var typeName = getTypeName(type);

    var es = entitySettings[typeName];
    if (!es)
        return true;

    if (isSearch != null && !es.onIsCreable(isSearch))
        return false;

    return isCreableEvent.every(f=> f(typeName));
}

export var isFindableEvent: Array<(typeName: string) => boolean> = []; 

export function isFindable(type: PseudoType, isSearch?: boolean) {

    var typeName = getTypeName(type);

    if (!Finder.isFindable(typeName))
        return false;

    var es = entitySettings[typeName];
    if (es && !es.onIsFindable())
        return false;

    return true;
}

export var isViewableEvent: Array<(typeName: string, entity?: ModifiableEntity) => boolean> = []; 

export function isViewable(typeOrEntity: PseudoType | ModifiableEntity, customView = false): boolean{
    var entity = (typeOrEntity as ModifiableEntity).Type ? typeOrEntity as ModifiableEntity : null;

    var typeName = entity ? entity.Type : getTypeName(typeOrEntity as PseudoType);

    var es = entitySettings[typeName];

    return es != null && es.onIsViewable(customView) && isViewableEvent.every(f=> f(typeName, entity));
}

export function isNavigable(typeOrEntity: PseudoType | ModifiableEntity, customView = false, isSearch = false): boolean {

    var entity = (typeOrEntity as ModifiableEntity).Type ? typeOrEntity as Entity : null;

    var typeName = entity ? entity.Type : getTypeName(typeOrEntity as PseudoType);

    var es = entitySettings[typeName];

    return es != null && es.onIsNavigable(customView, isSearch) && isViewableEvent.every(f=> f(typeName, entity));
}

export interface ViewOptions {
    entity: Lite<IEntity> | ModifiableEntity;
    propertyRoute?: PropertyRoute;
    readOnly?: boolean;
    showOperations?: boolean;
    saveProtected?: boolean;
    compoenent?: EntityComponent<any>;
}

export function view(options: ViewOptions): Promise<ModifiableEntity>;
export function view<T extends ModifiableEntity>(entity: T, propertyRoute?: PropertyRoute): Promise<T>;
export function view<T extends IEntity>(entity: Lite<T>): Promise<T>
export function view(entityOrOptions: ViewOptions | ModifiableEntity | Lite<Entity>): Promise<ModifiableEntity>
{
    var options = (entityOrOptions as ModifiableEntity).Type ? { entity: entityOrOptions } as ViewOptions :
        (entityOrOptions as Lite<Entity>).EntityType ? { entity: entityOrOptions } as ViewOptions :
            entityOrOptions as ViewOptions;

    return new Promise<ModifiableEntity>((resolve) => {
        require(["./NormalPage/NormalPopup"], function (NP: typeof NormalPopup) {
            NP.open(options).then(resolve);
        });
    });
} 



export interface WidgetsContext {
    entity?: Entity;
    lite?: Lite<Entity>;
}

export function renderWidgets(ctx: WidgetsContext): React.ReactFragment {
    return null;
}

export function renderEmbeddedWidgets(ctx: WidgetsContext, position: EmbeddedWidgetPosition): React.ReactFragment {
    return null;
}

export enum EmbeddedWidgetPosition {
    Top, 
    Bottom,
}

export interface ButtonsContext {
    entity?: Entity;
    lite?: Lite<Entity>;
    canExecute: { [key: string]: string }
}

export function renderButtons(ctx: ButtonsContext): React.ReactFragment {
    return null;
}


export module API {

    export function fetchEntity<T extends Entity>(lite: Lite<T>): Promise<T>;
    export function fetchEntity<T extends Entity>(type: Type<T>, id: any): Promise<T>;
    export function fetchEntity<T extends Entity>(type: string, id: any): Promise<Entity>;
    export function fetchEntity(typeOrLite: PseudoType | Lite<any>, id?: any): Promise<Entity> {

        var typeName = (typeOrLite as Lite<any>).EntityType || getTypeName(typeOrLite as PseudoType);
        var id = (typeOrLite as Lite<any>).id || id;

        return ajaxGet<Entity>({ url: "/api/entity/" + typeName + "/" + id });
    }


    export function fetchEntityPack<T extends Entity>(lite: Lite<T>): Promise<EntityPack<T>>;
    export function fetchEntityPack<T extends Entity>(type: Type<T>, id: any): Promise<EntityPack<T>>;
    export function fetchEntityPack(type: PseudoType, id: any): Promise<EntityPack<Entity>>;
    export function fetchEntityPack(typeOrLite: PseudoType | Lite<any>, id?: any): Promise<EntityPack<Entity>> {

        var typeName = (typeOrLite as Lite<any>).EntityType || getTypeName(typeOrLite as PseudoType);
        var id = (typeOrLite as Lite<any>).id || id;

        return ajaxGet<EntityPack<Entity>>({ url: "/api/entityPack/" + typeName + "/" + id });
    }


    export function fetchOperationInfos(type: PseudoType): Promise<Array<OperationInfo>> {

        var typeName = getTypeName(type as PseudoType);

        return ajaxGet<Array<OperationInfo>>({ url: "/api/operations/" + typeName });

    }

}

export interface OperationInfo {
    key: string;
    operationType: OperationType,
}

export enum OperationType {
    Execute,
    Delete,
    Constructor,
    ConstructorFrom,
    ConstructorFromMany
}

export interface EntityPack<T extends Entity> {
    entity: T
    canExecute: { [key: string]: string };
}


export abstract class EntitySettingsBase {
    public type: IType;

    public avoidPopup: boolean;

    abstract onIsCreable(isSearch: boolean): boolean;
    abstract onIsFindable(): boolean;
    abstract onIsViewable(customView: boolean): boolean;
    abstract onIsNavigable(customView: boolean, isSearch: boolean): boolean;
    abstract onIsReadonly(): boolean;

    abstract onGetComponentDefault(entity: ModifiableEntity): Promise<EntityComponent<any>>;

    constructor(type: IType) {
        this.type = type;
    }
}


export interface EntityComponent<T> extends React.ComponentClass<{ ctx: TypeContext<T> }> 
{

}

export class EntitySettings<T extends Entity> extends EntitySettingsBase {
    public type: Type<T>;

    isCreable: EntityWhen;
    isFindable: boolean;
    isViewable: boolean;
    isNavigable: EntityWhen;
    isReadOnly: boolean;

    getComponent: (entity: T) => Promise<{ default: EntityComponent<T> }>;

    constructor(type: Type<T>, getComponent: (entity: T) => Promise<{ default: EntityComponent<T> }>,
        options?: { isCreable?: EntityWhen, isFindable?: boolean; isViewable?: boolean; isNavigable?: EntityWhen; isReadOnly?: boolean }) {
        super(type);

        this.getComponent = getComponent;

        switch (type.typeInfo().entityKind) {
            case EntityKind.SystemString:
                this.isCreable = EntityWhen.Never;
                this.isFindable = true;
                this.isViewable = false;
                this.isNavigable = EntityWhen.Never;
                this.isReadOnly = true;
                break;

            case EntityKind.System:
                this.isCreable = EntityWhen.Never;
                this.isFindable = true;
                this.isViewable = true;
                this.isNavigable = EntityWhen.Always;
                this.isReadOnly = true;
                break;

            case EntityKind.Relational:
                this.isCreable = EntityWhen.Never;
                this.isFindable = false;
                this.isViewable = false;
                this.isNavigable = EntityWhen.Never;
                this.isReadOnly = true;
                break;

            case EntityKind.String:
                this.isCreable = EntityWhen.IsSearch;
                this.isFindable = true;
                this.isViewable = false;
                this.isNavigable = EntityWhen.IsSearch;
                break;

            case EntityKind.Shared:
                this.isCreable = EntityWhen.Always;
                this.isFindable = true;
                this.isViewable = true;
                this.isNavigable = EntityWhen.Always;
                break;

            case EntityKind.Main:
                this.isCreable = EntityWhen.IsSearch;
                this.isFindable = true;
                this.isViewable = true;
                this.isNavigable = EntityWhen.Always;
                break;

            case EntityKind.Part:
                this.isCreable = EntityWhen.IsLine;
                this.isFindable = false;
                this.isViewable = true;
                this.isNavigable = EntityWhen.Always;
                break;

            case EntityKind.SharedPart:
                this.isCreable = EntityWhen.IsLine;
                this.isFindable = true;
                this.isViewable = true;
                this.isNavigable = EntityWhen.Always;
                break;

            default:
                break;

        }

        Dic.extend(this, options);
    }

    onIsCreable(isSearch: boolean): boolean {
        return hasFlag(this.isCreable, isSearch ? EntityWhen.IsSearch : EntityWhen.IsLine);
    }


    onIsFindable(): boolean {
        return this.isFindable;
    }

    onIsViewable(customView: boolean): boolean {
        if (!this.getComponent && !customView)
            return false;

        return this.isViewable;
    }

    onIsNavigable(customView: boolean, isSearch: boolean): boolean {

        if (!this.getComponent && !customView)
            return false;

        return hasFlag(this.isNavigable, isSearch ? EntityWhen.IsSearch : EntityWhen.IsLine);
    }

    onIsReadonly(): boolean {
        return this.isReadOnly;
    }


    onGetComponentDefault(entity: ModifiableEntity): Promise<EntityComponent<T>>{
        return this.getComponent(entity as T).then(a=> a.default);
    }
    
}

export class EmbeddedEntitySettings<T extends ModifiableEntity> extends EntitySettingsBase {
    public type: Type<T>;

    getComponent: (entity: T) => Promise<{ default: EntityComponent<T> }>;

    isCreable: boolean;
    isViewable: boolean;
    isReadOnly: boolean;

    constructor(type: Type<T>, getComponent: (entity: T) => Promise<{ default: EntityComponent<T> }>,
        options?: { isCreable?: boolean; isViewable?: boolean; isReadOnly?: boolean }) {
        super(type);

        this.getComponent = getComponent;

        Dic.extend(this, options);
    }

    onIsCreable(isSearch: boolean) {
        if (isSearch)
            throw new Error("EmbeddedEntitySettigs are not compatible with isSearch");

        return this.isCreable;
    }

    onIsFindable(): boolean {
        return false;
    }

    onIsViewable(customView: boolean): boolean {
        if (!this.getComponent && !customView)
            return false;

        return this.isViewable;
    }

    onIsNavigable(customView: boolean, isSearch: boolean): boolean {
        return false;
    }

    onIsReadonly(): boolean {
        return this.isReadOnly;
    }

    onGetComponentDefault(entity: ModifiableEntity): Promise<EntityComponent<T>> {
        return this.getComponent(entity as T).then(a=> a.default);;
    }
}


export enum EntityWhen {
    Always = 3,
    IsSearch = 2,
    IsLine = 1,
    Never = 0,
}



