"use strict";

const net = require("net");

module.exports = {

    Server: function mockSocket () {

        let socket = new net.Server();
    
        this.on = function (type, callback) {
            socket.on(type, callback);
        };
        
        this.listen = function (port, ip) {
            socket.listen(port, ip);
        };
    
        return this;
    }
}