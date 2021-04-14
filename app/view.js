'use strict';

const term = require('terminal-kit').terminal;

module.exports = function View () {

    term.on('key', (key) => {
        if (key === 'CTRL_C') { process.exit(); }
    });

    this.showError = function (err) {
        term.eraseDisplay();
        term.moveTo(1,1);
        term.red(err.stack + '\n\n');
    }

    this.selectInterface = function (interfaces) {

        return new Promise((resolve, reject) => {
            interfaces.forEach((d, i) => {
                term('\t' + (i+1) + ': ' + d.name + ' (' + d.address + ')\n');
            });
            term('Select an interface: ');
            term.inputField({}, (err, result) => {
                if (err != null) { reject(null); }
                let n = parseInt(result);
                resolve(interfaces[n-1]);
            });
        });

    }

    return this;

}