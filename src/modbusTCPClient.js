"use strict";

const { Socket } = require("net");
const MODBUS = require("./modbus.js");

module.exports = function () {

    let socket = new Socket();
    let client = new MODBUS();

    let readHoldingRegistersCallback = null;
	let writeHoldingRegistersCallback = null;

    let transaction = 0;

    this.host = "127.0.0.1";
    this.port = 502;

    this.connect = function () {
		return new Promise((resolve, reject) => {
			socket.on("error", reject);
			socket.connect({ port: this.port, host: this.host }, () => {
				socket.off("error", reject);
				socket.on("error", clientError);
				socket.on("data", clientData);
				resolve();
			});
		});
    }

    this.readHoldingRegisters = function (device, address, numAddresses, callback) {
		if (typeof callback === "function") { readHoldingRegistersCallback = callback; }
		let request = new MODBUS();
		request.mbap.transaction = transaction;
		request.mbap.protocol = 0;
		request.mbap.byteLength = 6;
		request.device = device;
		request.functionCode = 3;
		request.type = "readHoldingRegistersRequest";
		request.address = address;
		request.numAddresses = numAddresses;
		socket.write(request.toBuffer());
    }

	this.writeHoldingRegisters = function (device, address, data, callback) {
		if (typeof callback === "function") { writeHoldingRegistersCallback = callback; }
		let request = new MODBUS();
		request.mbap.transaction = transaction;
		request.mbap.protocol = 0;
		request.mbap.byteLength = 7 + (data.length * 2);
		request.device = device;
		request.functionCode = 16;
		request.type = "writeHoldingRegistersRequest";
		request.address = address;
		request.numAddresses = data.length;
		request.dataLength = (data.length * 2);
		request.data = data;
		socket.write(request.toBuffer());
	}

    function clientError (err) {
		throw error;
    }

    function clientData (data) {
		let response = new MODBUS();
		response.fromBuffer(data);
		if ((response.type === "readHoldingRegistersResponse") && (typeof readHoldingRegistersCallback === "function")) { readHoldingRegistersCallback(response.data); }
		else if ((response.type === "writeHoldingRegistersResponse") && (typeof writeHoldingRegistersCallback === "function")) { writeHoldingRegistersCallback(response.data); }
    }

    return this;

}
