import * as React from 'react'
import { Lite, Entity, getToString } from '@framework/Signum.Entities'
import { OmniboxMessage } from './Signum.Entities.Omnibox'
import { OmniboxResult, OmniboxMatch, OmniboxProvider } from './OmniboxClient'
import * as Navigator from '@framework/Navigator'
import { getTypeInfo, tryGetTypeInfo } from '@framework/Reflection'

export default class EntityOmniboxProvider extends OmniboxProvider<EntityOmniboxResult>
{
  getProviderName() {
    return "EntityOmniboxResult";
  }

  icon() {
    return this.coloredIcon("arrow-circle-right", "#BCDEFF");
  }

  renderItem(result: EntityOmniboxResult): React.ReactChild[] {

    const array: React.ReactChild[] = [];

    array.push(this.icon());

    this.renderMatch(result.typeMatch, array)
    array.push(<span> </span>);

    if (result.id == undefined && result.toStr == undefined) {
      throw Error("Invalid EntityOmniboxProvider result");
    } else {

      if (result.id != undefined) {
        array.push(`${result.id}: `);

        if (result.lite == undefined) {
          array.push(this.coloredSpan(OmniboxMessage.NotFound.niceToString(), "gray"));
        } else {
          array.push(getToString(result.lite)!);
        }
      } else {
        if (result.lite == undefined) {
          array.push(`'${result.toStr}': `);
          array.push(this.coloredSpan(OmniboxMessage.NotFound.niceToString(), "gray"));
        } else {

          var ti = tryGetTypeInfo(result.typeMatch.text);
          if (ti?.members["Id"].type.name == "Guid") {
            var id = result.lite.id as string;
            array.push(<span className="guid">{id.substr(0, 4) + "…" + id.substring(id.length - 4)}</span>);
          } else {
            array.push(result.id);
          }

          array.push(": ");
          this.renderMatch(result.toStrMatch, array);
        }
      }
    }

    return array;

  }

  navigateTo(result: EntityOmniboxResult) {

    if (result.lite == undefined)
      return undefined;

    return Promise.resolve(Navigator.navigateRoute(result.lite));
  }

  toString(result: EntityOmniboxResult) {
    if (result.id)
      return `${result.typeMatch.text} ${result.id}`;

    if (result.toStr)
      return `${result.typeMatch.text} "${result.toStr}"`;

    return result.typeMatch.text;
  }
}

interface EntityOmniboxResult extends OmniboxResult {
  typeMatch: OmniboxMatch;
  id: any;
  toStr: string;
  toStrMatch: OmniboxMatch;

  lite: Lite<Entity>
}
