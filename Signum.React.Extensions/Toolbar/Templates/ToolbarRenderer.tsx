import * as React from 'react'
import * as History from 'history'
import * as AppContext from '@framework/AppContext'
import * as ToolbarClient from '../ToolbarClient'
import { ToolbarConfig } from "../ToolbarClient";
import '@framework/Frames/MenuIcons.css'
import './Toolbar.css'
import { Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAPI, useUpdatedRef, useHistoryListen } from '@framework/Hooks'
import { QueryString } from '@framework/QueryString'
import { parseIcon } from '../../Basics/Templates/IconTypeahead'
import { SidebarMode  } from '../SidebarContainer'
import { isActive } from '@framework/FindOptions';

function isCompatibleWithUrl(r: ToolbarClient.ToolbarResponse<any>, location: History.Location, query: any): boolean {
  if (r.url)
    return (location.pathname + location.search).startsWith(AppContext.toAbsoluteUrl(r.url));

  if (!r.content)
    return false;

  var config = ToolbarClient.getConfig(r);
  if (!config)
    return false;

  return config.isCompatibleWithUrl(r, location, query);
}

function inferActive(r: ToolbarClient.ToolbarResponse<any>, location: History.Location, query: any): ToolbarClient.ToolbarResponse<any> | null {
  if (r.elements)
    return r.elements.map(e => inferActive(e, location, query)).notNull().onlyOrNull();

  if (isCompatibleWithUrl(r, location, query))
    return r;

  return null;
}

export default function ToolbarRenderer(p: {
  onAutoClose?: () => void | undefined;
  sidebarMode: SidebarMode;
  appTitle: React.ReactNode
}): React.ReactElement | null {
  const response = useAPI(() => ToolbarClient.API.getCurrentToolbar(), []);
  const responseRef = useUpdatedRef(response);

  const [refresh, setRefresh] = React.useState(false);
  const [active, setActive] = React.useState<ToolbarClient.ToolbarResponse<any> | null>(null);
  const activeRef = useUpdatedRef(active);

  function changeActive(location: History.Location) {
    var query = QueryString.parse(location.search);
    if (responseRef.current) {
      if (activeRef.current && isCompatibleWithUrl(activeRef.current, location, query)) {
        return;
      }

      var newActive = inferActive(responseRef.current, location, query);
      setActive(newActive);
    }
  }

  useHistoryListen((location: History.Location, action: History.Action) => {
    changeActive(location);
  }, response != null);

  React.useEffect(() => changeActive(AppContext.history.location), [response]);

  return (
    <div className={"sidebar-inner"}>
      {p.appTitle}
      <div className={"close-sidebar"}
        onClick={() => p.onAutoClose && p.onAutoClose()}>
        <FontAwesomeIcon icon={"angle-double-left"} />
      </div>

      <div onClick={(ev) => {
        if ((ev.target as any).className != "nav-item-dropdown-elem") {
          p.onAutoClose && p.onAutoClose();
        }
      }}>
        {response && response.elements && response.elements.map((res: ToolbarClient.ToolbarResponse<any>, i: number) => renderNavItem(res, () => setTimeout(() => setRefresh(!refresh), 500), i))}
      </div>
    </div>
  );

  function renderNavItem(res: ToolbarClient.ToolbarResponse<any>, onRefresh: () => void, key: string | number) {

    switch (res.type) {
      case "Divider":
        return <hr style={{ margin: "10px 0 5px 0px" }} key={key}></hr>;
      case "Header":
      case "Item":
        if (res.elements && res.elements.length) {
          var title = res.label || res.content!.toStr;
          var icon = ToolbarConfig.coloredIcon(parseIcon(res.iconName), res.iconColor);

          return (
            <CustomSidebarDropdown parentTitle={title} icon={icon} sidebarMode={p.sidebarMode} key={key}>
              {res.elements && res.elements.map((sr, i) => renderNavItem(sr, onRefresh, i))}
            </CustomSidebarDropdown>
          );
        }

        if (res.url) {
          return (
            <Nav.Item key={key}>
              <Nav.Link
                title={res.label}
                className={p.sidebarMode.firstLower()}
                onClick={(e: React.MouseEvent<any>) => AppContext.pushOrOpenInTab(res.url!, e)}
                onAuxClick={(e: React.MouseEvent<any>) => AppContext.pushOrOpenInTab(res.url!, e)}
                active={res == active}>
                {ToolbarConfig.coloredIcon(parseIcon(res.iconName), res.iconColor)}<span>{res.label}</span>
                {p.sidebarMode == "Narrow" && <div className={"nav-item-float"}>{res.label}</div>}
              </Nav.Link>
            </Nav.Item>
          );
        }

        if (res.content) {
          var config = ToolbarClient.getConfig(res);
          if (!config)
            return <Nav.Item style={{ color: "red" }}>{res.content!.EntityType + "ToolbarConfig not registered"}</Nav.Item>;

          return config.getMenuItem(res, res == active, p.sidebarMode, key);
        }

        if (res.type == "Header") {
          return (
            <div key={key} className={"nav-item-header" + (p.sidebarMode == "Wide" ? "" : " mini")}>
              {ToolbarConfig.coloredIcon(parseIcon(res.iconName), res.iconColor)}
              {p.sidebarMode == "Wide" && <span>{res.label}</span>}
              {p.sidebarMode == "Narrow" && <div className={"nav-item-float"}>{res.label}</div>}
            </div>
          );
        }

        return <Nav.Item key={key} style={{ color: "red" }}>{"No Content or Url found"}</Nav.Item>;

      default:
        throw new Error("Unexpected " + res.type);
    }
  }

  function getIcon(res: ToolbarClient.ToolbarResponse<any>) {

    var icon = parseIcon(res.iconName);

    return icon && <FontAwesomeIcon icon={icon} className={"icon"} color={res.iconColor} fixedWidth />
  }
}

function CustomSidebarDropdown(props: { parentTitle: string | undefined, sidebarMode: SidebarMode, icon: any, children: any }) {
  var [show, setShow] = React.useState(false);

  return (
    <div>
      <div className="nav-item">
        <div
          title={props.parentTitle}
          className={"nav-link"}
          onClick={() => setShow(!show)}
          style={{ paddingLeft: props.sidebarMode == "Wide" ? 25 : 13, cursor: 'pointer' }}>
          <div style={{ display: 'inline-block', position: 'relative' }}>
            <div className="nav-arrow-icon" style={{ position: 'absolute' }}>{show ? <FontAwesomeIcon icon={"caret-down"} /> : <FontAwesomeIcon icon={"caret-right"} />}</div>
            <div className="nav-icon-with-arrow">
              {props.icon}
            </div>
          </div>
          <span className={"nav-item-dropdown-elem"} style={{ marginLeft: "16px", verticalAlign: "middle" }}>{props.parentTitle}</span>
          {props.sidebarMode == "Narrow" && <div className={"nav-item-float"}>{props.parentTitle}</div>}
        </div>
      </div>
      <div style={{ display: show ? "block" : "none" }}>
        {show && props.children}
      </div>
    </div>
  );
}
