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

    this.readHoldingRegisters = function (transaction, device, readAddress, readLength) {
        return new Promise(async (resolve, reject) => {
            if (this.state === "closed") {
                this.state = "connecting"
                this.socket.on("error", (err) => {
                    if (err.code === "ETIMEDOUT") {
                        this.socket.destroy();
                        this.state = "closed";
                    }
                    reject(err);
                });
                this.socket.on("data", (buffer) => {
                    this.state = "connected";
                    this.socket.listeners("error").forEach((d) => { this.socket.off("error", d); });
                    this.socket.listeners("data").forEach((d) => { this.socket.off("data", d); });
                    let reply = this.modbus.fromBuffer(buffer);
                    resolve(reply.data);
                });
                this.socket.connect(this.port, this.host, () => {
                    let query = new this.modbus.readHoldingRegistersRequest(transaction, device, readAddress, readLength);
                    this.socket.write(query.getBuffer());
                });
            }
            else if (this.state === "connected") {
                this.state = "awaitingReply";
                this.socket.on("error", (err) => {
                    if (err.code === "ECONNRESET") {
                        this.socket.destroy();
                        this.state = "closed"
                    }
                    reject(err);
                });
                this.socket.on("data", (buffer) => {
                    this.state = "connected";
                    this.socket.listeners("error").forEach((d) => { this.socket.off("error", d); });
                    this.socket.listeners("data").forEach((d) => { this.socket.off("data", d); });
                    let reply = this.modbus.fromBuffer(buffer);
                    resolve(reply.data);
                });
                let query = new this.modbus.readHoldingRegistersRequest(transaction, device, readAddress, readLength);
                this.socket.write(query.getBuffer());
            }
            else resolve();
        });
    }

    return this;
}