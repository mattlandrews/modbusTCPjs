"use strict";

const { Socket } = require("net");
const MODBUS = require("./modbus.js");

module.exports = function () {

    let socket = new Socket();
    let modbus = new Modbus();

    let readHoldingRegistersCallback = null;

    let transaction = 0;

    this.host = "127.0.0.1";
    this.port = 502;

    this.connect = function () {
	return new Promise((resolve, reject) => {
	    socket.on("error", reject);
	    socket.connect({ port: this.port, host: this.host }, () => {
		client.off("error", reject);
		client.on("error", clientError);
		client.on("connection", clientConnect);
		resolve();
	    });
	});
    }

    this.on = function (event, callback) {
	if (event === "readHoldingRegisters") { readHoldingRegistersCallback = callback; }
    }

    this.readHoldingRegisters = function (device, address, numAddresses, callback) {
	let request = new MODBUS();
	request.mbap.transaction = transaction;
	request.mbap.protocol = 0;
	request.mbap.byteLength = 6;
	request.mbap.device = device;
	request.mbap.address = address;
	request.mbap.numAddresses = numAddresses;
	socket.write(request.toBuffer());
    }

    function clientError (err) {
	throw error;
    }

    function clientConnect (socket) {
	socket.on("data", clientData);
    }

    function clientData (data) {
	let response = new MODBUS();
	response.fromBuffer(data);
	if (typeof readHoldingRegistersCallback === "function") { readHoldingRegistersCallback(reponse.data); }
    }

    return this;

}
