import { _is, _isArray, _Node, _keys, SYMBOL_ITERATOR, _from, _toString } from "./refCache";
import { HNode } from "../core/HNode";
import { isObject } from "./helpers";

export const compare = function cmp(a: unknown, b: unknown): boolean {

    if (_is(a, b)) {
        return true;
    }

    if (_isArray(a)) {
        return _isArray(b) &&
            a.length === b.length &&
            a.every((v, i) => compare(b[i], v));
    }

    if (
        a && b &&
        isObject(a) && isObject(b) &&
        _toString.call(a) === _toString.call(b)
    ) {

        if ((a as any)[SYMBOL_ITERATOR]) {

            return (b as any)[SYMBOL_ITERATOR] &&
                compare(_from(a as Iterable<any>), _from(b as Iterable<any>));

        } else if ((a as HNode<any>).isHN) {

            return (b as HNode<any>).isHN &&
                (a as HNode<any>).type === (b as HNode<any>).type &&
                compare((a as HNode<any>).props, (b as HNode<any>).props);

        } else if (!(a instanceof _Node || b instanceof _Node)) {

            const keysA = _keys(a!),
                keysB = _keys(b!);

            return keysA.length === keysB.length &&
                keysA.every(k => keysB.includes(k) && compare((a as any)[k], (b as any)[k]));

        }

    }

    return false;

};
