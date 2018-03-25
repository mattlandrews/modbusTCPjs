const modbusQuery = require("./modbusQuery.js");
const modbusReply = require("./modbusReply.js");

module.exports = function modbusMaster() {

    let net = require("net");
    let socket = new net.Socket();
    let outstandingQuery = null;
    let transactionID = 0;
    let status = 0;
    let eventHandlers = {
        "connect": [],
        "query": [],
        "reply": [],
        "disconnect": [],
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

    this.connect = function (ip, port, timeout) {

        var _ip;
        var _port;
        var _timeout;

        if ((typeof ip != "string")
            || (ip.split(".").filter(function (d) { return ((Number(d) >= 0) && (Number(d) <= 255)); }).length != 4)) {
            eventHandlers.error.forEach(function (d) { d(new Error("supplied ip of '" + ip + "' is not a valid ip address.")); });
            return;
        }
        _ip = ip;

        if ((typeof port != "number")
            || ((port < 0) || (port > 65535))) {
            eventHandlers.error.forEach(function (d) { d(new Error("supplied port of '" + port + "' is not a valid port number.")); });
            return;
        }
        _port = port;

        if ((typeof timeout != "number")
            || ((timeout < 0) || (timeout > 120000))) {
            eventHandlers.error.forEach(function (d) { d(new Error("supplied port of '" + timeout + "' is not a valid timeout number (must be between 0ms and 120000ms.")); });
            return;
        }
        _timeout = timeout;

        function socketConnected() {
            this.isConnected = true;
            status = 1;
            eventHandlers.connect.forEach(function (f) { f(); });
        }

        function socketClosed() {
            this.isConnected = false;
            status = 0;
            eventHandlers.disconnect.forEach(function (f) { f(); });
            if (this.isConnected) { socket.connect(_port, _ip); }
        }

        function socketData(buffer) {
            status = 1;
            let reply = new modbusReply();
            reply.setBuffer(buffer);
            if (outstandingQuery != null) {
                let query = outstandingQuery;
                outstandingQuery = null;
                if (reply.exception != null) {
                    exceptionString = knownExceptions[reply.exception];
                    if (exceptionString == null) { exceptionString = "Unknown Exception"; }
                    eventHandlers.reply.forEach(function (f) { f(new Error(exceptionString)); });
                }
                else { eventHandlers.reply.forEach(function (f) { f(null, reply.getData(), reply); }); }
            }
        }

        socket.setTimeout(timeout);

        socket.on("connect", socketConnected.bind(this));
        socket.on("data", socketData.bind(this));
        socket.on("close", socketClosed.bind(this));
        socket.on("error", function (err) {
            if (outstandingQuery != null) { eventHandlers.error.forEach(function (f) { f(err); }); }
            if (err.code == "ECONNREFUSED") { socket.connect(_port, _ip); }
        });

        socket.connect(port, ip);
    }

    this.sendQuery = function (query) {
        if (status == 2) return;
        status = 2;
        outstandingQuery = { query: query, transactionID: transactionID };
        query.setTransaction(transactionID);
        eventHandlers.query.forEach(function (f) { f(query); });
        socket.write(query.getBuffer());
        transactionID++;
        if (transactionID > 65535) { transactionID = 0; }
    }

    this.disconnect = function () {
        this.isConnected = false;
        this.status = 0;
        socket.end();
    }

    this.isConnected = false;

    return this;

}