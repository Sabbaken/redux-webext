'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (options.hasOwnProperty('onDisconnect') && typeof options.onDisconnect !== 'function') {
        return Promise.reject(new Error('Expected the "onDisconnect" to be a function.'));
    }

    onDisconnect = options.onDisconnect;

    // connect to "background" store
    var connection = chrome.runtime.connect({ name: _constants.CONNECTION_NAME });

    // listen for changes in the "background" store
    connection.onMessage.addListener(handleMessage);

    connection.onDisconnect.addListener(handleDisconnect);

    // return promise to allow getting current state of "background" store
    return new Promise(function (resolve) {
        chrome.runtime.sendMessage({ type: _constants.UPDATE_STATE }, function (res) {
            state = res;

            // return an object with equivalent to Redux store interface
            resolve({
                subscribe: subscribe,
                dispatch: dispatch,
                getState: getState
            });
        });
    });
};

var _constants = require('./constants');

var listeners = [];

var state = void 0;
var onDisconnect = void 0;

function handleMessage(msg) {
    if (msg.type === _constants.UPDATE_STATE) {
        state = msg.data;

        listeners.forEach(function (l) {
            return l();
        });
    }
}

function handleDisconnect() {
    if (onDisconnect) {
        onDisconnect();
    }
}

function subscribe(listener) {
    listeners.push(listener);

    // return unsubscribe function
    return function () {
        listeners = listeners.filter(function (l) {
            return l !== listener;
        });
    };
}

function dispatch(action) {
    // perform an action to change state of "background" store
    chrome.runtime.sendMessage({
        type: _constants.DISPATCH,
        action: action
    });
}

function getState() {
    return state;
}