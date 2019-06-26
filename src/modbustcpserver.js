"use strict";

const net = require("net");

module.exports = function ModbusTcpServer () {

    let sockets = [];
    let listeningSocket = net.createServer(function(socket){
        socket["mbState"] = "connected";
        socket.addListener("data", recv);
        socket.addListener("end", end);
    });

    this.start = function (ip, port) {
        if (ip == null) { ip = "127.0.0.1"; }
        if (port == null) { port = 502; }
        listeningSocket.listen(port, ip);
    };

    function recv (data) {
        if (this.mbState === "connected") {
            this.mbState = "recvd";
            let reply = makeReply.bind(this, data)();
            this.write(reply);
        }
        this.mbState = "connected";
    }

    function end () {
        console.log("Connection Closed.");
    }

    function makeReply (data) {
        let buffer = Buffer(data);
        let transaction = buffer.readUInt16BE(0);
        let protocol = buffer.readUInt16BE(2);
        if (protocol !== 0) { throw new Error("Invalid Protocol Specified in Query."); }
        let byteLength = buffer.readUInt16BE(4);
        if ((buffer.length - 6) !== byteLength) { throw new Error("Invalid Byte Length Specified in Query."); }
        let device = buffer.readUInt8(6);
        let func = buffer.readUInt8(7);
        if (func === 3) {
            let address = buffer.readUInt16BE(8);
            let length = buffer.readUInt16BE(10);
            if (length > 120) { throw new Error("Length Not Supported."); }
            let lengthBytes = length * 2;
            let reply = Buffer.alloc(11 + lengthBytes);
            reply.writeUInt16BE(transaction, 0);
            reply.writeUInt16BE(protocol, 2);
            reply.writeUInt16BE((5 + lengthBytes), 4);
            reply.writeUInt8(device, 6);
            reply.writeUInt8(func, 7);
            reply.writeUInt8(lengthBytes, 8);
            for (let i=0; i<lengthBytes; i+=2) {
                reply.writeUInt16BE(0, (9 + i))
            }
            return reply;
        }
        else {
            throw new Error("Function Not Supported.");
        }
    }

    return this;
}