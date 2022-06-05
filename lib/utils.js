"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var debounce = function debounce(func, delay) {
    var inDebounce = void 0;
    return function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var context = this;
        clearTimeout(inDebounce);
        inDebounce = setTimeout(function () {
            return func.apply(context, args);
        }, delay);
    };
};

exports.default = { debounce: debounce };