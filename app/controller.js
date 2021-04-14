'use strict';

const modbustcp = require("../mbtcp/mbtcp.js");

module.exports = function Controller (model, view) {
    
    this.selectedInterface = null;

    this.model = model;
    this.view = view;

    this.showError = function (err) {
        view.showError(err);
        process.exit(1);
    }

    this.selectInterface = function () {

        return new Promise((resolve, reject) => {

            model.getInterfaces()
                .then((interfaces) => {
                    view.selectInterface(interfaces)
                        .then((iface) => {
                            model.selectedInterface = iface;
                            resolve();
                        })
                        .catch((err) => {
                            debugger;
                        });
                })
                .catch((err) => {
                    debugger;
                });
        });
        
    }

    this.main = function () {

        return new Promise((resolve, reject) => {
            model.startModbusEngine();
        });

    }

    return this;

}