'use strict';

const os = require('os');

module.exports = function Model () {

    this.selectedInterface = null;

    this.getInterfaces = function () {

        return new Promise((resolve, reject) => {
            let interfaces = [];
            let _interfaces = os.networkInterfaces();
            for (let i in _interfaces) {
                _interfaces[i].forEach((d) => {
                    if (d.family === 'IPv4') {
                        d['name'] = i;
                        interfaces.push(d);
                    }
                });
            }
            resolve(interfaces);
        });

    }

    return this;

}