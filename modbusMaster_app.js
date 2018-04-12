const { modbusMaster, readHoldingRegistersQuery } = require("./src/modbusTCPjs.js");
const fs = require("fs");
const {waterfall} = require("async");
const chalk = require("chalk");

let master = new modbusMaster();

let _port = 502;
let _ip = "127.0.0.1";
let _delay = 500;
let _device = 1;
let _type = "readHoldingRegisters"
let _register = 0;
let _length = 1;

// Process process args
for (let i=2; i<process.argv.length; i++) {
    let param = process.argv[i];
    let value;
    switch (param) {
        case "--port":
            value = process.argv[++i];
            if (Number.isNaN(value)) { throw(new Error('Port "' + value + '" is not recognized as valid.')); }
            _port = process.argv[i];
            break;
        case "--ip":
            value = process.argv[++i];
            if ((value).match(/\d+\.\d+\.\d+\.\d+/) == null) { throw(new Error('IP "' + value + '" is not recognized as valid.')); }
            _ip = value;
            break;
        case "--delay":
            value = process.argv[++i];
            if (Number.isNaN(value)) { throw(new Error('Delay of "' + value + '" is not recognized as valid.')); }
            _delay = process.argv[i];
            break;
        case "--device":
            value = process.argv[++i];
            if (Number.isNaN(value)) { throw(new Error('Device "' + value + '" is not recognized as valid.')); }
            _device = value;
            break;
        case "--type":
            value = process.argv[++i];
            if (value.toLowerCase() == "holdingregister") { _type = "readHoldingRegisters"; }
            else { throw(new Error('Device "' + value + '" is not recognized as valid.')); }
            break;
        case "--register":
            value = process.argv[++i];
            if (Number.isNaN(value)) { throw(new Error('Register "' + value + '" is not recognized as valid.')); }
            _register = value;
            break;
        case "--length":
            value = process.argv[++i];
            if (Number.isNaN(value)) { throw(new Error('Register "' + value + '" is not recognized as valid.')); }
            _length = value;
            break;
    }
}

// Register with the correct modbus slave events
master.on("connect", handleConnect);
master.on("query", handleQuery);
master.on("reply", handleReply);
master.on("disconnect", handleDisconnect);
master.on("error", handleError);

// Listen for modbus connections on specified ip/port
master.connect(_ip, _port, 500);

let query = new readHoldingRegistersQuery();
query.setDevice(_device);
switch (_type) {
    case "readHoldingRegisters":
        query.setRegister(_register);
        query.setRegisterCount(_length);
        break;
}

function handleConnect () {
    writeToConsole(chalk.green("[ Connected to slave ]"));
    master.sendQuery(query);
}

function handleQuery (query) {
    writeToConsole(query, false);
}

function handleReply (err, data, reply) {
    writeToConsole(reply, true);
    setTimeout(function () {
        if (master.isConnected) { master.sendQuery(query); }
    },_delay);
}  

function handleDisconnect () {
    writeToConsole(chalk.red("[ Master disconnected ]"));
}

function handleError (err) {
    throw(err);
}

function writeToConsole (query, tab) {
    if (typeof query === "string") {
        process.stdout.write(query + "\n");
    }
    else if ((query != null) && (query.getMap != null)) {
        let maps = query.getMap();
        let buffer = query.getBuffer();
        let i = 0;
        let str = "";
        while (i < buffer.length) {
            if (maps[i] != null) {
                switch (maps[i].name) {
                    case "transaction":
                        str += chalk.hex("#00FF00")("[" + maps[i].value + "]");
                        break;
                    case "protocol":
                    case "byteLength":
                        str += chalk.hex("#00AA00")("[" + maps[i].value + "]");
                        break;
                    case "device":
                        str += chalk.hex("#FF8800")("[" + maps[i].value + "]");
                        break;
                    case "function":
                        str += chalk.hex("#0000EE")("[" + maps[i].value + "]");
                        break;
                    case "register":
                        str += chalk.hex("#CD00CD")("[" + maps[i].value + "]");
                        break;
                    case "registerCount":
                        str += chalk.hex("#5F5F00")("[" + maps[i].value + "]");
                        break;
                }
                i += maps[i].length;
            }
            else {
                str += chalk.hex("#7F7F7F")("[" + buffer.readUInt8(i) + "]");
                i++;
            }
        }
        process.stdout.write(((tab) ? "\t\t" : "") + str + "\n");
    }
}