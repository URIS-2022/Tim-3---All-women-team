//////////////////////////////////
//Auto-generated. Do NOT modify!//
//////////////////////////////////
import { MessageKey, QueryKey, Type, EnumType, registerSymbol } from '../../../Framework/Signum.React/Scripts/Reflection' 

import * as Entities from '../../../Framework/Signum.React/Scripts/Signum.Entities' 

import * as Basics from '../../../Framework/Signum.React/Scripts/Signum.Entities.Basics' 

import * as ExBasics from '../Basics/Signum.Entities.Basics' 

import * as Authorization from '../Authorization/Signum.Entities.Authorization' 




export const AppendixHelpEntity = new Type<AppendixHelpEntity>("AppendixHelp");
export interface AppendixHelpEntity extends Entities.Entity {
    uniqueName: string;
    culture: ExBasics.CultureInfoEntity;
    title: string;
    description: string;
}

export module AppendixHelpOperation {
    export const Save : Entities.ExecuteSymbol<AppendixHelpEntity> = registerSymbol({ Type: "Operation", key: "AppendixHelpOperation.Save" });
}

export const EntityHelpEntity = new Type<EntityHelpEntity>("EntityHelp");
export interface EntityHelpEntity extends Entities.Entity {
    type: Basics.TypeEntity;
    culture: ExBasics.CultureInfoEntity;
    description: string;
    properties: Entities.MList<PropertyRouteHelpEntity>;
    operations: Entities.MList<OperationHelpEntity>;
    queries: Entities.MList<QueryHelpEntity>;
    isEmpty: boolean;
}

export module EntityHelpOperation {
    export const Save : Entities.ExecuteSymbol<EntityHelpEntity> = registerSymbol({ Type: "Operation", key: "EntityHelpOperation.Save" });
}

export module HelpKindMessage {
    export const HisMainFunctionIsTo0 = new MessageKey("HelpKindMessage", "HisMainFunctionIsTo0");
    export const RelateOtherEntities = new MessageKey("HelpKindMessage", "RelateOtherEntities");
    export const ClassifyOtherEntities = new MessageKey("HelpKindMessage", "ClassifyOtherEntities");
    export const StoreInformationSharedByOtherEntities = new MessageKey("HelpKindMessage", "StoreInformationSharedByOtherEntities");
    export const StoreInformationOnItsOwn = new MessageKey("HelpKindMessage", "StoreInformationOnItsOwn");
    export const StorePartOfTheInformationOfAnotherEntity = new MessageKey("HelpKindMessage", "StorePartOfTheInformationOfAnotherEntity");
    export const StorePartsOfInformationSharedByDifferentEntities = new MessageKey("HelpKindMessage", "StorePartsOfInformationSharedByDifferentEntities");
    export const AutomaticallyByTheSystem = new MessageKey("HelpKindMessage", "AutomaticallyByTheSystem");
    export const AndIsRarelyCreatedOrModified = new MessageKey("HelpKindMessage", "AndIsRarelyCreatedOrModified");
    export const AndAreFrequentlyCreatedOrModified = new MessageKey("HelpKindMessage", "AndAreFrequentlyCreatedOrModified");
}

export module HelpMessage {
    export const _0IsA1 = new MessageKey("HelpMessage", "_0IsA1");
    export const _0IsA1AndShows2 = new MessageKey("HelpMessage", "_0IsA1AndShows2");
    export const _0IsACalculated1 = new MessageKey("HelpMessage", "_0IsACalculated1");
    export const _0IsACollectionOfElements1 = new MessageKey("HelpMessage", "_0IsACollectionOfElements1");
    export const Amount = new MessageKey("HelpMessage", "Amount");
    export const Any = new MessageKey("HelpMessage", "Any");
    export const Appendices = new MessageKey("HelpMessage", "Appendices");
    export const Buscador = new MessageKey("HelpMessage", "Buscador");
    export const Call0Over1OfThe2 = new MessageKey("HelpMessage", "Call0Over1OfThe2");
    export const Character = new MessageKey("HelpMessage", "Character");
    export const Check = new MessageKey("HelpMessage", "Check");
    export const ConstructsANew0 = new MessageKey("HelpMessage", "ConstructsANew0");
    export const Date = new MessageKey("HelpMessage", "Date");
    export const DateTime = new MessageKey("HelpMessage", "DateTime");
    export const ExpressedIn = new MessageKey("HelpMessage", "ExpressedIn");
    export const From0OfThe1 = new MessageKey("HelpMessage", "From0OfThe1");
    export const FromMany0 = new MessageKey("HelpMessage", "FromMany0");
    export const Help = new MessageKey("HelpMessage", "Help");
    export const HelpNotLoaded = new MessageKey("HelpMessage", "HelpNotLoaded");
    export const Integer = new MessageKey("HelpMessage", "Integer");
    export const Key0NotFound = new MessageKey("HelpMessage", "Key0NotFound");
    export const OfThe0 = new MessageKey("HelpMessage", "OfThe0");
    export const OrNull = new MessageKey("HelpMessage", "OrNull");
    export const Property0NotExistsInType1 = new MessageKey("HelpMessage", "Property0NotExistsInType1");
    export const QueryOf0 = new MessageKey("HelpMessage", "QueryOf0");
    export const RemovesThe0FromTheDatabase = new MessageKey("HelpMessage", "RemovesThe0FromTheDatabase");
    export const Should = new MessageKey("HelpMessage", "Should");
    export const String = new MessageKey("HelpMessage", "String");
    export const The0 = new MessageKey("HelpMessage", "The0");
    export const TheDatabaseVersion = new MessageKey("HelpMessage", "TheDatabaseVersion");
    export const TheProperty0 = new MessageKey("HelpMessage", "TheProperty0");
    export const Value = new MessageKey("HelpMessage", "Value");
    export const ValueLike0 = new MessageKey("HelpMessage", "ValueLike0");
    export const YourVersion = new MessageKey("HelpMessage", "YourVersion");
    export const _0IsThePrimaryKeyOf1OfType2 = new MessageKey("HelpMessage", "_0IsThePrimaryKeyOf1OfType2");
    export const In0 = new MessageKey("HelpMessage", "In0");
    export const Entities = new MessageKey("HelpMessage", "Entities");
    export const SearchText = new MessageKey("HelpMessage", "SearchText");
}

export module HelpPermissions {
    export const ViewHelp : Authorization.PermissionSymbol = registerSymbol({ Type: "Permission", key: "HelpPermissions.ViewHelp" });
}

export module HelpSearchMessage {
    export const Search = new MessageKey("HelpSearchMessage", "Search");
    export const _0ResultsFor1In2 = new MessageKey("HelpSearchMessage", "_0ResultsFor1In2");
    export const Results = new MessageKey("HelpSearchMessage", "Results");
}

export module HelpSyntaxMessage {
    export const BoldText = new MessageKey("HelpSyntaxMessage", "BoldText");
    export const ItalicText = new MessageKey("HelpSyntaxMessage", "ItalicText");
    export const UnderlineText = new MessageKey("HelpSyntaxMessage", "UnderlineText");
    export const StriketroughText = new MessageKey("HelpSyntaxMessage", "StriketroughText");
    export const LinkToEntity = new MessageKey("HelpSyntaxMessage", "LinkToEntity");
    export const LinkToProperty = new MessageKey("HelpSyntaxMessage", "LinkToProperty");
    export const LinkToQuery = new MessageKey("HelpSyntaxMessage", "LinkToQuery");
    export const LinkToOperation = new MessageKey("HelpSyntaxMessage", "LinkToOperation");
    export const LinkToNamespace = new MessageKey("HelpSyntaxMessage", "LinkToNamespace");
    export const ExernalLink = new MessageKey("HelpSyntaxMessage", "ExernalLink");
    export const LinksAllowAnExtraParameterForTheText = new MessageKey("HelpSyntaxMessage", "LinksAllowAnExtraParameterForTheText");
    export const Example = new MessageKey("HelpSyntaxMessage", "Example");
    export const UnorderedListItem = new MessageKey("HelpSyntaxMessage", "UnorderedListItem");
    export const OtherItem = new MessageKey("HelpSyntaxMessage", "OtherItem");
    export const OrderedListItem = new MessageKey("HelpSyntaxMessage", "OrderedListItem");
    export const TitleLevel = new MessageKey("HelpSyntaxMessage", "TitleLevel");
    export const Title = new MessageKey("HelpSyntaxMessage", "Title");
    export const Images = new MessageKey("HelpSyntaxMessage", "Images");
    export const Texts = new MessageKey("HelpSyntaxMessage", "Texts");
    export const Links = new MessageKey("HelpSyntaxMessage", "Links");
    export const Lists = new MessageKey("HelpSyntaxMessage", "Lists");
    export const InsertImage = new MessageKey("HelpSyntaxMessage", "InsertImage");
    export const Options = new MessageKey("HelpSyntaxMessage", "Options");
    export const Edit = new MessageKey("HelpSyntaxMessage", "Edit");
    export const Save = new MessageKey("HelpSyntaxMessage", "Save");
    export const Syntax = new MessageKey("HelpSyntaxMessage", "Syntax");
    export const TranslateFrom = new MessageKey("HelpSyntaxMessage", "TranslateFrom");
}

export const NamespaceHelpEntity = new Type<NamespaceHelpEntity>("NamespaceHelp");
export interface NamespaceHelpEntity extends Entities.Entity {
    name: string;
    culture: ExBasics.CultureInfoEntity;
    title: string;
    description: string;
}

export module NamespaceHelpOperation {
    export const Save : Entities.ExecuteSymbol<NamespaceHelpEntity> = registerSymbol({ Type: "Operation", key: "NamespaceHelpOperation.Save" });
}

export const OperationHelpEntity = new Type<OperationHelpEntity>("OperationHelp");
export interface OperationHelpEntity extends Entities.Entity {
    operation: Entities.OperationSymbol;
    culture: ExBasics.CultureInfoEntity;
    description: string;
}

export module OperationHelpOperation {
    export const Save : Entities.ExecuteSymbol<OperationHelpEntity> = registerSymbol({ Type: "Operation", key: "OperationHelpOperation.Save" });
}

export const PropertyRouteHelpEntity = new Type<PropertyRouteHelpEntity>("PropertyRouteHelpEntity");
export interface PropertyRouteHelpEntity extends Entities.EmbeddedEntity {
    property: Basics.PropertyRouteEntity;
    description: string;
}

export const QueryColumnHelpEntity = new Type<QueryColumnHelpEntity>("QueryColumnHelpEntity");
export interface QueryColumnHelpEntity extends Entities.EmbeddedEntity {
    columnName: string;
    description: string;
}

export const QueryHelpEntity = new Type<QueryHelpEntity>("QueryHelp");
export interface QueryHelpEntity extends Entities.Entity {
    query: Basics.QueryEntity;
    culture: ExBasics.CultureInfoEntity;
    description: string;
    columns: Entities.MList<QueryColumnHelpEntity>;
    isEmpty: boolean;
}

export module QueryHelpOperation {
    export const Save : Entities.ExecuteSymbol<QueryHelpEntity> = registerSymbol({ Type: "Operation", key: "QueryHelpOperation.Save" });
}

