﻿import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as ReactDOM from 'react-dom';
import { Popper } from './Popper';
import { Placement, Modifiers, Data } from 'popper.js';
import { classes } from '../Globals';

interface PopperContentProps {
    children: React.ReactElement<any>;
    className?: string;
    placement?: Placement;
    placementPrefix?: string,
    hideArrow?: boolean;
    isOpen: boolean;
    offset?: string | number;
    fallbackPlacement?: string | string[];
    flip?: boolean;
    container?: string | (() => HTMLElement) | HTMLElement;
    target: string | (() => HTMLElement) | HTMLElement;
    modifiers?: Modifiers;
}

interface PopperContentState {
    placement?: Placement;
    isRTL: boolean;
}

export class PopperContent extends React.Component<PopperContentProps, PopperContentState> {

    static defaultProps = {
        placement: 'auto',
        isOpen: false,
        offset: 0,
        fallbackPlacement: 'flip',
        flip: true,
        container: 'body',
        modifiers: {},
    }

    constructor(props: PopperContentProps) {
        super(props);

        this.handlePlacementChange = this.handlePlacementChange.bind(this);
        this.setTargetNode = this.setTargetNode.bind(this);
        this.getTargetNode = this.getTargetNode.bind(this);
        this.state = {
            isRTL: document.body.classList.contains("rtl"),
        };
    }

    static childContextTypes = {
        popperManager: PropTypes.object.isRequired,
    };

    getChildContext() {
        return {
            popperManager: {
                setTargetNode: this.setTargetNode,
                getTargetNode: this.getTargetNode,
            },
        };
    }

    componentDidMount() {
        this.handleProps();
    }

    _element?: HTMLDivElement | null;

    componentDidUpdate(prevProps: PopperContentProps) {
        if (this.props.isOpen !== prevProps.isOpen) {
            this.handleProps();
        } else if (this._element) {
            // rerender
            this.renderIntoSubtree();
        }
    }

    componentWillUnmount() {
        this.hide();
    }

    targetNode?: HTMLElement;
    setTargetNode = (node: HTMLElement) => {
        this.targetNode = node;
    }

    getTargetNode = () => {
        return this.targetNode!;
    }

    getContainerNode() {
        return getTarget(this.props.container!);
    }

    handlePlacementChange = (data: Data) => {
        if (this.state.placement !== data.placement) {
            this.setState({ placement: data.placement });
        }
        return data;
    }

    handleProps() {
        if (this.props.container !== 'inline') {
            if (this.props.isOpen) {
                this.show();
            } else {
                this.hide();
            }
        }
    }

    hide() {
        if (this._element) {
            this.getContainerNode().removeChild(this._element);
            ReactDOM.unmountComponentAtNode(this._element);
            this._element = null;
        }
    }

    show() {
        this._element = document.createElement('div');
        this.getContainerNode().appendChild(this._element);
        this.renderIntoSubtree();
        if (this._element.childNodes) {
            const first = this._element.childNodes[0] as HTMLElement;
            if (first && first.focus) {
                first.focus();
            }
        }
    }

    renderIntoSubtree() {
        ReactDOM.unstable_renderSubtreeIntoContainer(
            this,
            this.renderChildren(),
            this._element!
        );
    }

    renderChildren() {
        const {
            children,
            isOpen,
            flip,
            target,
            offset,
            fallbackPlacement,
            placementPrefix,
            className,
            container,
            modifiers,
            hideArrow,
            placement,
            ...attrs
        } = this.props;

        const culturePlacement = !this.state.isRTL ? placement :
            placement && placement.replace(/right|left/, str => str == "right" ? "left" : "right") as Placement;

        const placementSuffix = (this.state.placement || culturePlacement)!.split('-')[0];
        
        const popperClassName = classes(
            className,
            placementPrefix ? `${placementPrefix}-${placementSuffix}` : placementSuffix
        );

        const extendedModifiers = {
            offset: { offset },
            flip: { enabled: flip, behavior: fallbackPlacement },
            update: {
                enabled: true,
                order: 950,
                fn: this.handlePlacementChange,
            },
            ...modifiers,
        } as Modifiers;

        return (
            <Popper modifiers={extendedModifiers} {...attrs} placement={culturePlacement}>
                {({ ref, style, placement, arrowProps }) => (
                    <div ref={ref} style={style} data-placement={placement}>
                        {children}
                        {!hideArrow && <div ref={arrowProps.ref} style={arrowProps.style} />}
                    </div>
                )}
            </Popper>
        );
    }

    render() {
        this.setTargetNode(getTarget(this.props.target));

        if (this.props.container === 'inline') {
            return this.props.isOpen ? this.renderChildren() : null;
        }

        return null;
    }
}


export function getTarget(target: string | (() => HTMLElement) | HTMLElement): HTMLElement {
    if (typeof target == "function") {
        return target();
    }

    if (typeof target === 'string') {
        let selection = document.querySelector(target);
        if (selection === null) {
            selection = document.querySelector(`#${target}`);
        }
        if (selection === null) {
            throw new Error(`The target '${target}' could not be identified in the dom, tip: check spelling`);
        }
        return selection as HTMLElement;
    }

    return target;
}