module.exports = {
    modbusQuery: modbusQuery,
    modbusReply: modbusReply,
    modbusMaster: modbusMaster,
    modbusSlave: modbusSlave
}

function modbusReply() {

    let _transaction = 0;
    let _protocol = 0;
    let _byteLength = null;
    let _device = 1;
    let _func = null;
    let _register = null;
    let _length = null;
    let _data = null;
    let _dataByteLength = null;
    let _buffer = null;

    this.getTransaction = function () { return _transaction; };
    this.setTransaction = function (transaction) {
        if (typeof transaction === "number") { _transaction = range(transaction, 0, 65535); }
    }

    this.getDevice = function () { return _device; };
    this.setDevice = function (device) {
        if (typeof device === "number") { _device = range(device, 0, 255); }
    }

    this.getBuffer = function () { return _buffer; };
    this.setBuffer = function (buffer) {
        _transaction = buffer.readUInt16BE(0);
        _protocol = buffer.readUInt16BE(2);
        _byteLength = buffer.readUInt16BE(4);
        _device = buffer.readUInt8(6);
        _func = buffer.readUInt8(7);
        switch (_func) {
            case 3:
                _dataByteLength = buffer.readUInt8(8);
                _data = [];
                for (i = 9; i < (9 + _dataByteLength); i += 2) {
                    _data.push(buffer.readUInt16BE(i));
                }
                break;
        }
    }

    this.readHoldingRegisters = function (data) {
        if (typeof data === "number") { data = [data]; }
        if (Array.isArray(data) == false) { throw new Error("Invalid data"); }
        _func = 3;
        _byteLength = 3 + (data.length * 2);
        _dataByteLength = (data.length * 2);
        _data = data;
        standardQueryToBuffer();
        _buffer.writeUInt8(_dataByteLength, 8);
        for (let i = 0; i < _data.length; i++) { _buffer.writeUInt16BE(_data[i], (9 + (i * 2))); }
    }

    this.toString = function () {
        return JSON.stringify({
            transaction: _transaction,
            protocol: _protocol,
            byteLength: _byteLength,
            device: _device,
            func: _func,
            register: _register,
            length: _length,
            data: _data,
            dataByteLength: _dataByteLength
        });
    }

    function range(value, min, max) {
        return (value < min) ? min : (value > max) ? max : value;
    }

    function standardQueryToBuffer() {
        _buffer = Buffer.allocUnsafe(6 + _byteLength);
        _buffer.writeUInt16BE(_transaction, 0);
        _buffer.writeUInt16BE(_protocol, 2);
        _buffer.writeUInt16BE(_byteLength, 4);
        _buffer.writeUInt8(_device, 6);
        _buffer.writeUInt8(_func, 7);
    }

}

function modbusQuery() {

    let _transaction = 0;
    let _protocol = 0;
    let _byteLength = null;
    let _device = 1;
    let _func = null;
    let _register = null;
    let _length = null;
    let _data = null;
    let _dataByteLength = null;
    let _buffer = null;

    this.getTransaction = function () { return _transaction; };
    this.setTransaction = function (transaction) {
        if (typeof transaction === "number") { _transaction = range(transaction, 0, 65535); }
    }

    this.getDevice = function () { return _device; };
    this.setDevice = function (device) {
        if (typeof device === "number") { _device = range(device, 0, 255); }
    }

    this.getFunction = function () { return _func; };

    this.getBuffer = function () { return _buffer; };
    this.setBuffer = function (buffer) {
        _transaction = buffer.readUInt16BE(0);
        _protocol = buffer.readUInt16BE(2);
        _byteLength = buffer.readUInt16BE(4);
        _device = buffer.readUInt8(6);
        _func = buffer.readUInt8(7);
        switch (_func) {
            case 3:
                _register = buffer.readUInt16BE(8);
                _length = buffer.readUInt16BE(10);
                break;
        }
    }

    this.readHoldingRegisters = function (register, length) {
        if (typeof register !== "number") { throw new Error("Invalid holding register"); }
        if (typeof length !== "number") { throw new Error("Invalid length"); }
        _func = 3;
        _register = range(register, 0, 65535);
        _length = range(length, 0, 127);
        _byteLength = 6;
        standardQueryToBuffer();
        _buffer.writeUInt16BE(_register, 8);
        _buffer.writeUInt16BE(_length, 10);
    }

    this.toString = function () {
        return JSON.stringify({
            transaction: _transaction,
            protocol: _protocol,
            byteLength: _byteLength,
            device: _device,
            func: _func,
            register: _register,
            length: _length,
            data: _data,
            dataByteLength: _dataByteLength
        });
    }

    function range(value, min, max) {
        return (value < min) ? min : (value > max) ? max : value;
    }

    function standardQueryToBuffer() {
        _buffer = Buffer.allocUnsafe(6 + _byteLength);
        _buffer.writeUInt16BE(_transaction, 0);
        _buffer.writeUInt16BE(_protocol, 2);
        _buffer.writeUInt16BE(_byteLength, 4);
        _buffer.writeUInt8(_device, 6);
        _buffer.writeUInt8(_func, 7);
    }
}

function modbusMaster() {

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
                else { eventHandlers.reply.forEach(function (f) { f(null, reply.data, reply); }); }
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

    this.modbusQuery = modbusQuery;

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

function modbusSlave() {

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

    this.listen = function (ip, port, delay) {

        var _ip = null;
        var _port = 502;

        if (ip != null) {
            if ((typeof ip != "string")
                || (ip.split(".").filter(function (d) { return ((Number(d) >= 0) && (Number(d) <= 255)); }).length != 4)) {
                eventHandlers.error.forEach(function (d) { d(new Error("supplied ip of '" + ip + "' is not a valid ip address.")); });
                return;
            }
            _ip = ip;
        }

        if (port != null) {
            if ((isNaN(port))
                || ((port < 0) || (port > 65535))) {
                eventHandlers.error.forEach(function (d) { d(new Error("supplied port of '" + port + "' is not a valid port number.")); });
                return;
            }
            _port = port;
        }

        if (delay != null) {
            if ((isNaN(delay))
                || ((delay < 0) || (delay > 120000))) {
                eventHandlers.error.forEach(function (d) { d(new Error("supplied delay of '" + delay + "' is not a valid delay number.")); });
                return;
            }
        }

        function socketListening() {
            this.isListening = true;
            status = 1;
            eventHandlers.listen.forEach(function (f) { f(); });
        }

        function socketConnection(_socket) {
            _socket.on("data", socketData.bind(this, _socket));
            _socket.on("error", socketError);
            _socket.on("close", socketDisconnect.bind(this));
            this.isConnected = true;
            status = 2;
            eventHandlers.connect.forEach(function (f) { f(); });
        }

        function socketError(err) {
            if (err.code != "ECONNRESET") { eventHandlers.error.forEach(function (f) { f(err); }); }
        }

        function socketDisconnect() {
            this.isConnected = false;
            status = 1;
            eventHandlers.disconnect.forEach(function (f) { f(); });
        }

        function socketData(socket, buffer) {
            status = 1;
            let query = new modbusQuery();
            query.setBuffer(buffer);
            eventHandlers.query.forEach(function (f) { f(query); });
            let reply = new modbusReply();
            reply.setTransaction(query.getTransaction());
            reply.setDevice(query.getDevice());
            if (query.getFunction() == 3) {
                let values = []
                for (let i = 0; i < query.length; i++) {
                    values.push(this.getHoldingRegisterValue(query.register + i));
                }
                reply.readHoldingRegisters(values);
                setTimeout(function () {
                    if (this.isConnected) {
                        eventHandlers.reply.forEach(function (f) { f(reply); });
                        socket.write(reply.getBuffer());
                    }
                }.bind(this), delay);
            }
        }

        socket.on("listening", socketListening.bind(this));
        socket.on("connection", socketConnection.bind(this));
        socket.on("error", function (err) {
            eventHandlers.error.forEach(function (f) { f(err); });
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