import { _isArray, _keys, _assign, _Boolean, _Map } from "../utils/refCache";
import { HNode } from "./HNode";
import { updateChildren } from "../ticker/updateChildren";

export type PropHandler<T = unknown> =
    (element: Element, newValue: T, oldValue: T | undefined, hNode: HNode<any>) => void;

export type RefCallback<T extends Element = Element> = (node?: T) => void;

export interface Attributes {
    [key: string]: string;
}

export interface EleProps<T extends Element = Element> {
    xmlns?: string;
    style?: string | { [key: string]: string };
    class?: string | any[];
    ref?: RefCallback<T>;
    attr?: Attributes;
    prop?: Partial<T>;
    [key: string]: unknown;
}

export const propHandlers = new _Map<string, PropHandler<any>>([

    ['children', function (element, newChildren: unknown[], oldChildren: unknown[] | undefined, hNode) {
        updateChildren(element, hNode, newChildren, oldChildren || []);
    }],

    ['style', function (element, style) {
        type HTMLElementOrSVG = HTMLElement | SVGSVGElement;
        if (style && typeof style === 'object') {
            _assign((element as HTMLElementOrSVG).style, style);
        } else {
            try {
                ((element as HTMLElementOrSVG).style as any) = style;
            } catch {
                element.setAttribute('style', style);
            }
        }
    }],

    ['class', function (element, classes) {
        element.setAttribute(
            'class',
            _isArray(classes) ?
                classes.filter(_Boolean).join(' ') :
                classes
        );
    }],

    ['ref', function (element, callback: RefCallback) {
        callback(element);
    }],

    ['attr', function (element, attributes: Attributes) {
        _keys(attributes).forEach(key => {
            element.setAttribute(key, attributes[key]);
        });
    }],

    ['prop', function (element, properties: Partial<HTMLElement>) {
        _assign(element, properties);
    }]

]);