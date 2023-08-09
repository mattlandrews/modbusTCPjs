"use strict";

const { Socket } = require("net");
const { isArray } = require("util");
const MODBUS = require("./modbus.js");

module.exports = function () {

    this.socket = new Socket();
    this.modbus = new MODBUS();
    this.host = "127.0.0.1";
    this.port = 502;
    this.state = "closed";

    this.errors = [];

    this.readHoldingRegisters = function (transaction, device, readAddress, readLength) {

        return new Promise((resolve, reject) => {
            if (this.state === "closed") {
                this.state = "connecting";
                this.socket.listeners("error").forEach((d) => { this.socket.off("error", d); });
                this.socket.on("error", function (err) {
                    this.socket.destroy();
                    this.state = "closed";
                    this.errors.push(err);
                    reject(err);
                }.bind(this));
                this.socket.listeners("connect").forEach((d) => { this.socket.off("connect", d); });
                this.socket.connect(this.port, this.host, () => {
                    this.state = "connected";
                    this.socket.listeners("data").forEach((d) => { this.socket.off("data", d); });
                    this.socket.on("data", function (buffer) {
                        this.state = "connected";
                        try {
                            let reply = this.modbus.replyFromBuffer(buffer);
                            resolve(reply.data);
                        }
                        catch (err) {
                            this.socket.destroy();
                            this.state = "closed";
                            this.errors.push(err);
                            reject(err);
                        }
                    }.bind(this));
                    let query = new this.modbus.readHoldingRegistersRequest(transaction, device, readAddress, readLength);
                    this.socket.write(query.getBuffer());
                });
            }
            else {
                this.socket.listeners("error").forEach((d) => { this.socket.off("error", d); });
                this.socket.on("error", reject.bind(this));
                this.socket.listeners("data").forEach((d) => { this.socket.off("data", d); });
                this.socket.on("data", function (buffer) {
                    this.state = "connected";
                    try {
                        let reply = this.modbus.replyFromBuffer(buffer);
                        resolve(reply.data);
                    }
                    catch (err) {
                        this.errors.push(err);
                        reject(err);
                    }
                }.bind(this));
                let query = new this.modbus.readHoldingRegistersRequest(transaction, device, readAddress, readLength);
                this.socket.write(query.getBuffer());
            }
        });
    }

    return this;
}