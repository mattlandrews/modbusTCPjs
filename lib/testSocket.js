"use strict";

module.exports = function TestSocket () {

    let errorCallbacks = [];
    let connectCallbacks = [];

    this.on = function (type, func) {
        if ((type === "error") && (typeof func === "function")) {
            errorCallbacks.push(func);
        }
        else if ((type === "connect") && (typeof func === "function")) {
            connectCallbacks.push(func);
        }
    };

    this.connect = function (port, ip) {
        setTimeout(function () {
            for (let i=0; i<connectCallbacks.length; i++) {
                connectCallbacks[i]();
            }
        }, 0);
    }
}