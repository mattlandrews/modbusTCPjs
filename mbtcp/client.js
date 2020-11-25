'use strict';

const nodejs_net = require("net");
const readHoldingRegisters = require('./readHoldingRegisters.js');
const writeHoldingRegisters = require('./writeHoldingRegisters.js');
const exception = require('./exception.js');

let net = nodejs_net;

module.exports = function Client (options) {

    let socket;
    let connectCallback = [];
    let disconnectCallback = [];
    let dataCallback = [];
    let errorCallback = [];
    let transactionCounter = 0;

    this.reconnect = false;
    this.ip = '127.0.0.1';
    this.port = 502;
    
    if ((options != null) && (typeof options === 'object')) {
        if ((options.ip != null) && (typeof options.ip === 'string')) {
            this.ip = options.ip;
        }
        if ((options.port != null) && (typeof options.port === 'number')) {
            this.port = options.port;
        }
        if ((options.net != null) && (typeof options.net === 'object')) {
            net = options.net;
        }
    }

    socket = new net.Socket();

    function onConnect () {
        transactionCounter = 0;
        connectCallback.forEach((cb) => { cb(); });
    }

    function onDisconnect () {
        disconnectCallback.forEach((cb) => { cb(); });
        if (this.reconnect) { this.connect(); }
    }

    function onError (err) {
        errorCallback.forEach((cb) => { cb(err); });
    }

    socket.on('connect', onConnect.bind(this));
    socket.on('close', onDisconnect.bind(this));
    socket.on('data', onData.bind(this));
    socket.on('error', onError.bind(this));

    this.on = function (event, callback) {
        if ((typeof event === 'string') && (typeof callback === 'function')) {
            switch (event.toLowerCase()) {
                case 'connect': connectCallback.push(callback); break;
                case 'disconnect': disconnectCallback.push(callback); break;
                case 'data': dataCallback.push(callback); break;
                case 'error': errorCallback.push(callback); break;
            }
        }
    }

    this.getListeners = function (event) {
        if (typeof event === 'string') {
            switch (event.toLowerCase()) {
                case 'connect': return connectCallback;
                case 'disconnect': return disconnectCallback;
                case 'data': return dataCallback;
                case 'error': return errorCallback;
            }
        }
        return null;
    }

    this.off = function (event, callback) {
        if ((typeof event === 'string') && (typeof callback === 'function')) {
            switch (event.toLowerCase()) {
                case 'connect': connectCallback = connectCallback.filter((d) => { return (d !== callback); });
                case 'disconnect': disconnectCallback = disconnectCallback.filter((d) => { return (d !== callback); });
                case 'data': dataCallback = dataCallback.filter((d) => { return (d !== callback); });
                case 'error': errorCallback = errorCallback.filter((d) => { return (d !== callback); });
            }
        }
    }

    this.connect = function () {
        socket.connect(this.port, this.ip);
    }

    this.disconnect = function () {
        socket.destroy();
    }

    this.readHoldingRegisters = function (address, count) {
        let query = new readHoldingRegisters().query;
        query.transaction = transactionCounter++;
        query.address = address;
        query.count = count;
        send(query);
    }

    this.writeHoldingRegisters = function (address, data) {
        let query = new writeHoldingRegisters().query;
        query.transaction = transactionCounter++;
        query.address = address;
        query.data = data;
        send(query);
    }

    function send (query) {
        let buffer;
        switch (query.func) {
            case 3:
                buffer = Buffer.allocUnsafe(12);
                buffer.writeUInt16BE(query.transaction, 0);
                buffer.writeUInt16BE(query.protocol, 2);
                buffer.writeUInt16BE(query.length, 4);
                buffer.writeUInt8(query.device, 6);
                buffer.writeUInt8(3, 7);
                buffer.writeUInt16BE(query.address, 8);
                buffer.writeUInt16BE(query.count, 10);
                break;
            case 16:
                buffer = Buffer.allocUnsafe((query.data.length*2)+13);
                query.length = ((query.data.length * 2) + 7);
                query.count = query.data.length;
                query.bytecount = (query.data.length * 2);
                buffer.writeUInt16BE(query.transaction, 0);
                buffer.writeUInt16BE(query.protocol, 2);
                buffer.writeUInt16BE(query.length, 4);
                buffer.writeUInt8(query.device, 6);
                buffer.writeUInt8(16, 7);
                buffer.writeUInt16BE(query.address, 8);
                buffer.writeUInt16BE(query.count, 10);
                buffer.writeUInt8(query.bytecount, 12);
                for (let i=0; i<query.data.length; i++) {
                    buffer.writeUInt16BE(query.data[i], (13+(i*2)));
                }
                break;
        }
        socket.write(buffer);
    }

    function recv (buffer) {
        let reply;
        let func = buffer.readUInt8(7);
        switch (func) {
            case 3:
                reply = new readHoldingRegisters().reply;
                reply.func = 3;
                reply.bytecount = buffer.readUInt8(8);
                reply.data = [];
                for (let i=9; i<(buffer.length-1); i+=2 ) {
                    reply.data.push(buffer.readUInt16BE(i));
                }
                break;
            case 16:
                reply = new writeHoldingRegisters().reply;
                reply.func = 16;
                reply.address = buffer.readUInt16BE(8);
                reply.count = buffer.readUInt16BE(10);
                break;
            case 131:
            case 144:
                reply = new exception().reply;
                reply.func = func;
                reply.code = buffer.readUInt8(8);
                break;
        }
        reply.transaction = buffer.readUInt16BE(0);
        reply.protocol = buffer.readUInt16BE(2);
        reply.length = buffer.readUInt16BE(4);
        reply.device = buffer.readUInt8(6);
        return reply;
    }

    function onData (data) {
        let reply = recv(data);
        dataCallback.forEach((cb) => { cb(reply); });
    }

}