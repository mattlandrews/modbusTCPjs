"use strict";

const { Server } = require("net");
const MODBUS = require("./modbus.js");

module.exports = function () {

    let server = new Server();
    let modbus = new MODBUS();

    let readHoldingRegistersCallback = null;
    let writeHoldingRegistersCallback = null;

    this.host = "127.0.0.1";
    this.port = 502;

    this.listen = function () {
        return new Promise((resolve, reject) => {
            server.on("error", reject);
            server.listen({ port: this.port, host: this.host }, () => {
                server.off("error", reject);
                server.on("error", serverError);
                server.on("connection", serverConnect);
                resolve();
            });
        });
    }

    this.on = function (event, callback) {
        if (event === "readHoldingRegisters") { readHoldingRegistersCallback = callback; }
        if (event === "writeHoldingRegisters") { writeHoldingRegistersCallback = callback; }
    }

    function serverError (err) {
        throw err;
    }

    function serverConnect (socket) {
        socket.on("data", serverData);
    }

    function serverData (data) {
        let request = new MODBUS();
        let socket = this;
        request.fromBuffer(data);
        //console.log("---> " + JSON.stringify(data));
        if ((request.type === "readHoldingRegistersRequest") && (readHoldingRegistersCallback != null)) {
            readHoldingRegistersCallback(request, (data) => {
                //console.log("------R> " + request.address);
                let response = new MODBUS();
                response.mbap.transaction = request.mbap.transaction;
                response.mbap.protocol = request.mbap.protocol;
                response.mbap.byteLength = (4 + (data.length * 2));
                response.device = request.device;
                response.functionCode = request.functionCode;
                response.type = "readHoldingRegistersResponse";
                response.dataLength = (data.length * 2);
                response.data = data;
                socket.write(response.toBuffer());
            });
        }
	if ((request.type === "writeHoldingRegistersRequest") && (writeHoldingRegistersCallback != null)) {
	    writeHoldingRegistersCallback(request, () => {
            //console.log("------W> " + request.address);
            let response = new MODBUS();
            response.mbap.transaction = request.mbap.transaction;
            response.mbap.protocol = request.mbap.protocol;
            response.mbap.byteLength = 6;
            response.device = request.device;
            response.functionCode = request.functionCode;
            response.type = "writeHoldingRegistersResponse";
            response.address = request.address;
            response.numAddresses = request.numAddresses;
            socket.write(response.toBuffer());
	    });
	}
    }

    return this;
}
