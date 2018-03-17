const modbusSlave = require("./dist/modbusSlave.js");
const fs = require("fs");
const {waterfall} = require("async");
const chalk = require("chalk");

let slave = new modbusSlave();

let _port = 502;
let _ip = null;
let _delay = 0;
let _slaveData = null;
let _slaveDataPath = null;

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
            if (Number.isNaN(value)) { throw(new Error('Delay "' + value + '" is not recognized as valid.')); }
            _delay = value;
            break;
        case "--data":
            _slaveDataPath = process.argv[++i];
            break;
    }
}

waterfall([
    (cb) => { openDataFile(_slaveDataPath, cb); },
    launchSlave
],
function (err) {
    if (err) { throw err }
});

function openDataFile (path, callback) {
    if (path != null) {
        fs.readFile(path, function (err, buf) {
            _slaveData = JSON.parse(buf.toString())
            callback();
        });
    }
    else { callback(); }
}

function launchSlave (callback) {
    // Register with the correct modbus slave events
    slave.on("listen", handleListen);
    slave.on("connect", handleConnect);
    slave.on("query", handleQuery);
    slave.on("reply", handleReply);
    slave.on("disconnect", handleDisconnect);
    slave.on("error", handleError);

    if (_slaveData != null) {
        if (_slaveData.holdingRegisters != null) {
            slave.getHoldingRegisterValue = function (register) {
                return _slaveData.holdingRegisters[register];
            }
        }
    }

    // Listen for modbus connections on specified ip/port
    slave.listen(_ip, _port, _delay);

    function handleListen () {
        console.log("Slave listening to " + ((_ip != null) ? (_ip + ":") : ("")) + _port);
    }

    function handleConnect () {
        process.stdout.write(chalk.green("[ Master connected ]\n"));
    }

    function handleQuery (query) {
        process.stdout.write(query.debugString + "\n");
    }

    function handleReply (reply) {
        process.stdout.write("\t\t\t" + reply.debugString + "\n");
    }

    function handleDisconnect () {
        process.stdout.write(chalk.red("[ Master disconnected ]\n"));
    }

    function handleError (err) {
        throw(err);
    }

    function writeQueryOrReplyToConsole (query) {
        process.stdout.write(query.debugString + "\n");
    }
}