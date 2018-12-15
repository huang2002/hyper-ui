import { _isArray, _document, _is, _keys } from "./refCache";
import { HNode } from "./HNode";
import { RefCallback } from "./propHandlers";
import { expired } from "./ticker";

export const toArr = <T>(a: T): T extends any[] ? T : [T] =>
    (_isArray(a) ? a : [a]) as T extends any[] ? T : [T];

export const toFrag = (nodes: Node[]) => nodes.reduce(
    (frag, node) => (frag.appendChild(node), frag),
    _document.createDocumentFragment()
);

export const isHNode = (value: any): value is HNode<any> =>
    value && typeof value === 'object' && value.isHNode;

export const clear = function (hNode: HNode) {

    const { desc, output } = hNode;

    hNode.active = false;

    if (desc) {
        if (desc.clear) {
            try {
                desc.clear(hNode.props, hNode.store!, hNode.context!);
            } catch (err) {
                console.error(err);
            }
        }
    } else {
        const { ref } = hNode.props;
        if (ref) {
            (ref as RefCallback)();
        }
    }

    const index = expired.indexOf(hNode);
    if (~index) {
        expired.splice(index, 1);
    }

    if (output) {
        output.forEach((child: any) => {
            if (isHNode(child)) {
                clear(child);
            }
        });
    }

};

export const cmp = function (a: unknown, b: unknown): boolean {

    if (_is(a, b)) {
        return true;
    }

    if (_isArray(a)) {
        return _isArray(b) &&
            a.length === b.length &&
            a.every((v, i) => cmp(b[i], v));
    }

    if (a && b && typeof a === 'object' && typeof b === 'object') {
        const keysA = _keys(a!),
            keysB = _keys(b!);
        return keysA.length === keysB.length &&
            keysA.every(k => keysB.includes(k) && cmp((a as any)[k], (b as any)[k]));
    }

    return false;

};
