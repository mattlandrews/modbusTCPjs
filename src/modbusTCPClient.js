'use strict';

const { Socket } = require("net");
const readHoldingRegistersQuery = require("./readHoldingRegistersQuery");
const readHoldingRegistersReply = require("./readHoldingRegistersReply");
const writeHoldingRegistersQuery = require("./writeHoldingRegistersQuery");
const writeHoldingRegistersReply = require("./writeHoldingRegistersReply");
const deviceIdentificationQuery = require("./deviceIdentificationQuery");
const deviceIdentificationReply = require("./deviceIdentificationReply");

module.exports = function () {

    this.connected = false;
    this.timeout = 1500;
    this.host = "127.0.0.1";
    this.port = 502;

    let socket = new Socket();
    let transaction = 0;

    this.connect = function () {
        return new Promise((resolve, reject) => {
            socket.setTimeout(this.timeout);
            function error (err) {
                socket.off("error", error);
                reject(err);
            }
            socket.on("error", error);
            socket.connect(this.port, this.host, () => {
                socket.off("error", error);
                this.connected = true;
                resolve();
            });
        });
    }

    this.disconnect = function () {
        socket.end();
    }

    this.writeHoldingRegisters = function (device, address, data) {
        return new Promise((resolve, reject) => {
            (async () => {
                if (this.connected === false) {
                    try {
                        this.connect();
                    }
                    catch (e) {
                        reject(e);
                    }
                }
                function fError (err) {
                    socket.off("error", fError);
                    socket.off("data", fData);
                    reject(e);
                }
                socket.on("error", fError);
                function fData (d) {
                    socket.off("error", fError);
                    socket.off("data", fData);
                    let reply = new writeHoldingRegistersReply();
                    try {
                        reply.fromBuffer(d);
                        resolve();
                    }
                    catch (e) {
                        reject(e);
                    }
                }
                socket.on("data", fData);
                let query = new writeHoldingRegistersQuery();
                query.mbap.transaction = transaction;
                query.modbus.device = device;
                query.modbus.address = address;
                query.modbus.length = data.length;
                query.modbus.dataByteLength = (data.length * 2);
                query.modbus.data = data;
                socket.write(query.toBuffer());
                transaction++;
                if (transaction > 65535) { transaction = 0; }
            })();
        });
    }

    this.readHoldingRegisters = function (device, address, length) {
        return new Promise((resolve, reject) => {
            if (this.connected === false) {
                try{
                    this.connect();
                }
                catch (e) {
                    reject(e);
                }
            }
            function fError (err) {
                socket.off("error", fError);
                socket.off("data", fData);
                reject(e);
            }
            socket.on("error", fError);
            function fData (d) {
                socket.off("error", fError);
                socket.off("data", fData);
                let reply = new readHoldingRegistersReply();
                try {
                    reply.fromBuffer(d);
                    resolve(reply.modbus.data);
                }
                catch (e) {
                    reject(e);
                }
            }
            socket.on("data", fData);
            let query = new readHoldingRegistersQuery();
            query.mbap.transaction = transaction;
            query.modbus.device = device;
            query.modbus.address = address;
            query.modbus.length = length;
            socket.write(query.toBuffer());
            transaction++;
            if (transaction > 65535) { transaction = 0; }
        });
    }

    this.deviceIdentification = function (device, readDeviceId, objectType) {
        return new Promise((resolve, reject) => {
            if (this.connected === false) {
                try{
                    this.connect();
                }
                catch (e) {
                    reject(e);
                }
            }
            function fError (err) {
                socket.off("error", fError);
                socket.off("data", fData);
                reject(e);
            }
            socket.on("error", fError);
            function fData (d) {
                socket.off("error", fError);
                socket.off("data", fData);
                let reply = new deviceIdentificationReply();
                try {
                    reply.fromBuffer(d);
                    resolve(reply.modbus.objects);
                }
                catch (e) {
                    reject(e);
                }
            }
            socket.on("data", fData);
            let query = new deviceIdentificationQuery();
            query.mbap.transaction = transaction;
            query.modbus.device = device;
            query.modbus.readDeviceId = readDeviceId;
            query.modbus.objectType = objectType;
            socket.write(query.toBuffer());
            transaction++;
            if (transaction > 65535) { transaction = 0; }
        });
    }

}