"use strict";

const { Socket } = require("net");
const MODBUS = require("./modbus.js");

module.exports = function () {

    this.socket = new Socket();
    let client = new MODBUS();

    let readHoldingRegistersCallback = null;
	let writeHoldingRegistersCallback = null;

    let transaction = 0;

    this.host = "127.0.0.1";
    this.port = 502;
	this.timeout = 500;

	let connected = false;
	let connecting = false;

	this.readHoldingRegisters = function (device, address, numAddresses) {
		let _this = this;
		return new Promise((resolve, reject) => {
			function onErr (err) {
				clearTimeout(timeoutTimer);
				if (_this.socket.readyState === "closed") { connected = false; }
				reject(err);
			}
			function sendReq () {
				let request = new MODBUS();
				request.mbap.transaction = transaction;
				request.mbap.protocol = 0;
				request.mbap.byteLength = 6;
				request.device = device;
				request.functionCode = 3;
				request.type = "readHoldingRegistersRequest";
				request.address = address;
				request.numAddresses = numAddresses;
				this.socket.write(request.toBuffer());
			}
			function recvRes (data) {
				let response = new MODBUS();
				response.fromBuffer(data);
				clearTimeout(timeoutTimer);
				this.socket.removeAllListeners("error");
				if (response.type === "readHoldingRegistersResponse") {
					resolve(response.data);
					return;
				}
				reject(new Error("response does not appear to match request"));
			}
			let timeoutTimer = setTimeout(()=>{
				reject(new Error("Modbus timeout exceeded"));
				connecting = false;
			}, this.timeout);
			this.socket.once("error", onErr);
			if (!connected) {
				if (!connecting) {
					connecting = true;
					this.socket.removeAllListeners("connect");
					this.socket.once("connect", () => {
						connected = true;
						this.socket.once("data", recvRes.bind(_this));
						sendReq.call(_this);
					});
					this.socket.connect({ port: this.port, host: this.host });
				}
			}
			else {
				this.socket.once("data", recvRes.bind(_this));
				sendReq.call(_this);
			}
		});
	}
	
	this.writeHoldingRegisters = function (device, address, data) {
		let _this = this;
		return new Promise((resolve, reject) => {
			function onErr (err) {
				clearTimeout(timeoutTimer);
				if (_this.socket.readyState === "closed") { connected = false; }
				reject(err);
			}
			function sendReq () {
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
				this.socket.write(request.toBuffer());
			}
			function recvRes (data) {
				let response = new MODBUS();
				response.fromBuffer(data);
				clearTimeout(timeoutTimer);
				this.socket.removeAllListeners("error");
				if (response.type === "writeHoldingRegistersResponse") {
					resolve();
					return;
				}
				reject(new Error("response does not appear to match request"));
			}
			let timeoutTimer = setTimeout(()=>{
				reject(new Error("Modbus timeout exceeded"));
				connecting = false;
			}, this.timeout);
			this.socket.once("error", onErr);
			if (!connected) {
				if (!connecting) {
					connecting = true;
					this.socket.removeAllListeners("connect");
					this.socket.once("connect", () => {
						connected = true;
						this.socket.once("data", recvRes.bind(_this));
						sendReq.call(_this);
					});
					this.socket.connect({ port: this.port, host: this.host });
				}
			}
			else {
				this.socket.once("data", recvRes.bind(_this));
				sendReq.call(_this);
			}
		});
	}

	this.writeHoldingRegisters = function (device, address, data) {
		return new Promise((resolve, reject) => {
			function onErr (err) {
				clearTimeout(timeoutTimer);
				if (_this.socket.readyState === "closed") { connected = false; }
				reject(err);
			}
			function sendReq () {
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
				this.socket.write(request.toBuffer());
			}
			function recvRes (data) {
				let response = new MODBUS();
				response.fromBuffer(data);
				clearTimeout(timeoutTimer);
				this.socket.removeAllListeners("error");
				if (response.type === "writeHoldingRegistersResponse") {
					resolve();
					return;
				}
				reject(new Error("response does not appear to match request"));
			}
			let timeoutTimer = setTimeout(()=>{
				reject(new Error("Modbus timeout exceeded"));
			}, this.timeout);
			this.socket.once("error", onErr);
			if (!connected) {				
				this.socket.connect({ port: this.port, host: this.host }, ()=>{
					connected = true;
					this.socket.once("data", recvRes.bind(_this));
					sendReq.call(_this);
				});
			}
			else {
				this.socket.once("data", recvRes.bind(_this));
				sendReq.call(_this);
			}
		});
	}

    return this;

}
