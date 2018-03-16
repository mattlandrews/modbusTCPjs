const modbusQuery = require("./modbusQuery.js");
const modbusReply = require("./modbusReply.js");

module.exports = function modbusSlave () {

    let net = require("net");
    let socket = new net.Server();
    let eventHandlers = {
        "listen": [],
        "connect": [],
        "query": [],
        "reply": [],
        "disconnect": [],
        "close": [],
        "error": []
    };

    this.on = function (eventName, handler) {
        if (typeof eventName != "string") { return; }
        if (typeof handler != "function") { return; }
        if (typeof eventHandlers[eventName] != null) {
            eventHandlers[eventName].push(handler);
        }
    };

    this.getHoldingRegisterValue = function (register) {
        return register;
    };

    this.listen = function (ip, port) {
        
        var _ip = null;
        var _port = 502;

        if (ip != null) {
            if ((typeof ip != "string")
                || (ip.split(".").filter(function(d){ return ((Number(d) >= 0) && (Number(d) <= 255)); }).length != 4 )) {
                eventHandlers.error.forEach(function(d){ d(new Error("supplied ip of '" + ip + "' is not a valid ip address.")); });
                return;
            }
            _ip = ip;
        }

        if (port != null) {
            if ((isNaN(port))
                || ((port < 0) || (port > 65535))) {
                eventHandlers.error.forEach(function(d){ d(new Error("supplied port of '" + port + "' is not a valid port number.")); });
                return;
            }
            _port = port;
        }

        function socketListening () {
            this.isListening = true;
            status = 1;
            eventHandlers.listen.forEach(function (f) { f(); });
        }

        function socketConnection (_socket) {
            _socket.on("data", socketData.bind(this, _socket));
            _socket.on("close", socketDisconnect.bind(this));
            this.isConnected = true;
            status = 2;
            eventHandlers.connect.forEach(function (f) { f(); });
        }

        function socketDisconnect () {
            this.isConnected = false;
            status = 1;
            eventHandlers.disconnect.forEach(function (f) { f(); });
        }

        function socketData (socket, buffer) {
            status = 1;
            let query = new modbusQuery();
            query.bufferToQuery(buffer);
            eventHandlers.query.forEach(function(f){ f(query); });
            let reply = new modbusReply();
            reply.transactionID = query.transactionID;
            reply.id = query.id;
            reply.type = query.type;
            if (query.func == 3) {
                reply.data = [];
                for (let i=0; i<query.length; i++) {
                    let value = this.getHoldingRegisterValue(query.register + i);
                    if (value == null) {
                        reply.exception = 2;
                        reply.replyToBuffer();
                        eventHandlers.reply.forEach(function(f){ f(reply); });
                        socket.write(reply.buffer);
                        return;
                    }
                    reply.data.push((value != null) ? value : 0);
                }
                reply.byteCount = query.length * 2;
                reply.replyToBuffer();
                eventHandlers.reply.forEach(function(f){ f(reply); });
                socket.write(reply.buffer);
            }
        }

        socket.on("listening", socketListening.bind(this));
        socket.on("connection", socketConnection.bind(this));
        socket.on("error", function (err) {
            eventHandlers.error.forEach(function(f){ f(err); });
            if (err.code == "ECONNREFUSED") { socket.connect(_port, _ip); }
        });

        socket.listen(_port, _ip);
    };

    this.close = function () {
        this.isListening = false;
        this.status = 0;
        socket.close();
        eventHandlers.close.forEach(function (f) { f(); });
    };

    this.isConnected = false;
    this.isListening = false;

    return this;

}