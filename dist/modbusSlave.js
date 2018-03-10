const modbusQuery = require("./modbusQuery.js");
const modbusReply = require("./modbusReply.js");

module.exports = function modbusSlave () {

    let net = require("net");
    let socket = new net.Server();
    let eventHandlers = {
        "listen": [],
        "connect": [],
        "query": [],
        "disconnect": [],
        "close": [],
        "error": []
    };

    const knownExceptions = {
        1: "Illegal Function",
        2: "Illegal Data Address",
        3: "Illegal Data Value",
        4: "Slave Device Failure",
        5: "Acknowledge",
        6: "Slave Device Busy",
        7: "Negative Acknowledge",
        8: "Memory Parity Error",
        10: "Gateway Path Unavailable",
        11: "Gateway Target Device Failed to Respond"
    };

    this.on = function (eventName, handler) {
        if (typeof eventName != "string") { return; }
        if (typeof handler != "function") { return; }
        if (typeof eventHandlers[eventName] != null) {
            eventHandlers[eventName].push(handler);
        }
    };

    this.listen = function (ip, port) {
        
        var _ip;
        var _port;

        if ((typeof ip != "string")
            || (ip.split(".").filter(function(d){ return ((Number(d) >= 0) && (Number(d) <= 255)); }).length != 4 )) {
            eventHandlers.error.forEach(function(d){ d(new Error("supplied ip of '" + ip + "' is not a valid ip address.")); });
            return;
        }
        _ip = ip;

        if ((typeof port != "number")
            || ((port < 0) || (port > 65535))) {
            eventHandlers.error.forEach(function(d){ d(new Error("supplied port of '" + port + "' is not a valid port number.")); });
            return;
        }
        _port = port;

        function socketListening () {
            this.isListening = true;
            status = 1;
            eventHandlers.listen.forEach(function (f) { f(); });
        }

        function socketConnection (_socket) {
            _socket.on("data", socketData.bind(this, _socket));
            this.isConnected = true;
            status = 2;
            eventHandlers.connect.forEach(function (f) { f(); });
        }

        function socketDisconnect () {
            this.isConnected = false;
        }

        function socketClose () {
            this.isListening = false;
            status = 0;
            eventHandlers.closed.forEach(function (f) { f(); });
        }

        function socketData (socket, buffer) {
            status = 1;
            let query = new modbusQuery();
            query.buffer = buffer;
            query.bufferToQuery();
            let reply = new modbusReply();
            reply.transactionID = query.transactionID;
            reply.id = query.id;
            reply.type = query.type;
            if (query.func == 3) {
                reply.data = [];
                for (let i=0; i<query.length; i++) {
                    reply.data.push(query.register + i);
                }
                reply.byteCount = query.length * 2;
                reply.replyToBuffer();
                socket.write(reply.buffer);
            }
            /*if (outstandingQuery != null) {
                let query = outstandingQuery;
                outstandingQuery = null;
                if (reply.exception != null) {
                    exceptionString = knownExceptions[reply.exception];
                    if (exceptionString == null) { exceptionString = "Unknown Exception"; }
                    eventHandlers.query.forEach(function (f) { f(new Error(exceptionString)); });
                }
                else { eventHandlers.query.forEach(function (f) { f(null, reply.data, query); }); }
            }*/
        }

        socket.on("listening", socketListening.bind(this));
        socket.on("connection", socketConnection.bind(this));
        //socket.on("close", socketClosed.bind(this));
        socket.on("error", function (err) {
            eventHandlers.error.forEach(function(f){ f(err); });
            if (err.code == "ECONNREFUSED") { socket.connect(_port, _ip); }
        });

        socket.listen(port, ip);
    }

    //this.modbusQuery = modbusQuery;

    /*this.sendQuery = function (query, callback) {
        if (query.func == null) {
            eventHandlers.error.forEach(function(d){ d(new Error("Function not recognized, not sent")); });
            return;
        }
        if (status == 2) return;
        status = 2;
        outstandingQuery = { query: query, transactionID: transactionID, callback: callback };
        socket.write(query.buffer);
        transactionID++;
        if (transactionID > 65535) { transactionID = 0; }
    }*/

    this.disconnect = function () {
        this.isConnected = false;
        this.status = 0;
        socket.end();
    }

    this.isConnected = false;

    return this;

}