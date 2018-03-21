const chalk = require("chalk");

module.exports = function modbusQuery (id, type, register, length, data) {

    this.id = (id != null) ? id : 1;
    this.type = (type != null) ? type : "readHoldingRegisters";
    this.register = (register != null) ? register : 0;
    this.length = (length != null) ? length : 1;
    this.data = (data != null) ? data : [];
    
    this.buffer = null;
    this.debugString = "";

    switch (this.type) {
        case "readHoldingRegisters":
            this.func = 3;
            break;
        case "writeHoldingRegisters":
            this.func = 16;
            break;
        default:
            this.func = null;
            break;
    }

    modbusQuery.prototype.queryToBuffer = function () {

        // exit if query isn't defined
        if (this.type == null) { return; }

        // Predict buffer size
        let byteSize;
        if (this.type == "readHoldingRegisters") {
            this.func = 3;
            byteSize = 12;
        }
        else if (this.type == "writeHoldingRegisters") {
            this.func = 16;
            byteSize = (13 + (this.data.length * 2));
        }
        
        this.buffer = Buffer.allocUnsafe(byteSize);
        this.debugString = "";

        // set TransactionID
        this.buffer.writeUInt16BE(this.transactionID, 0);
        this.debugString += chalk.hex("#33cc33")(blockNumber(this.transactionID, 5));
            
        // set protocolID
        this.protocolID = 0;
        this.buffer.writeUInt16BE(this.protocolID, 2);
        this.debugString += chalk.hex("#99ff33")(blockNumber(this.protocolID, 5));

        // set byteLength
        this.buffer.writeUInt16BE(byteSize-6, 4);
        this.debugString += chalk.hex("#99ff33")(blockNumber((byteSize-6), 5));

        // set deviceID
        this.buffer.writeUInt8(this.id, 6);
        this.debugString += chalk.hex("#0066ff")(blockNumber(this.id, 3));

        // set function
        this.buffer.writeUInt8(this.func, 7);

        if (this.func == 3) {
            this.debugString += chalk.hex("#3399ff")(blockNumber(this.func, 3));

            // set register
            this.buffer.writeUInt16BE(this.register, 8);
            this.debugString += chalk.hex("#ff9933")(blockNumber(this.register, 5));

            // set length
            this.buffer.writeUInt16BE(this.length, 10);
            this.debugString += chalk.hex("#ff9933")(blockNumber(this.length, 5));

            return true;
        }
        else if (this.func == 16) {
            this.debugString += chalk.hex("#3399ff")(blockNumber(this.func, 3));

            // set register
            this.buffer.writeUInt16BE(this.register, 8);
            this.debugString += chalk.hex("#ff9933")(blockNumber(this.register, 5));

            // set length
            this.buffer.writeUInt16BE(this.length, 10);
            this.debugString += chalk.hex("#ff9933")(blockNumber(this.length, 5));

            // set data length
            this.buffer.writeUInt8((this.data.length * 2), 12);
            this.debugString += chalk.hex("#ff9933")(blockNumber((this.data.length * 2), 3));

            // set data
            for (let i = 0; i < this.data.length; i++) {
                this.buffer.writeUInt16BE(this.data[i], (13 + (i * 2)));
                this.debugString += chalk.hex("#888888")(blockNumber(this.data[i], 5));
            }
            return true;
        }
        else if (this.exception != null) {
            this.debugString += chalk.hex("#880000")(blockNumber(this.func, 3));

            // set exception code
            this.buffer.writeUInt8(this.exception, 8);
            this.debugString += chalk.hex("#880000")(blockNumber(this.exception, 3));
            return true;
        }
        else {
            return false;
        }

        /*if (this.type === "readHoldingRegisters") {
            this.func = 3;
            let byteLength = 12;
            this.buffer = Buffer.allocUnsafe(byteLength);
            this.buffer.writeUInt16BE(this.transactionID, 0);
            this.buffer.writeUInt16BE(0, 2);
            this.buffer.writeUInt16BE(6, 4);
            this.buffer.writeUInt8(this.id, 6);
            this.buffer.writeUInt8(this.func, 7);
            this.buffer.writeUInt16BE(this.register, 8);
            this.buffer.writeUInt16BE(this.length, 10);
        }
        else if (this.type === "writeHoldingRegisters") {
            this.func = 16;
            if (typeof this.data === "number") { this.data = [this.data]; }
            let byteLength = 13 + (this.data.length * 2);
            this.buffer = Buffer.allocUnsafe(byteLength);
            this.buffer.writeUInt16BE(this.transactionID, 0);
            this.buffer.writeUInt16BE(0, 2);
            this.buffer.writeUInt16BE(byteLength - 6, 4);
            this.buffer.writeUInt8(this.id, 6);
            this.buffer.writeUInt8(this.func, 7);
            this.buffer.writeUInt16BE(this.register, 8);
            this.buffer.writeUInt16BE(this.length, 10);
            this.buffer.writeUInt8((this.data.length * 2), 12);
            for (let i=0; i<this.data.length; i++) {
                this.buffer.writeUInt16BE(this.data[i], (i + 13));
            }
        }
        else {
            this.func = null;
            this.buffer = null;
        }*/
    }

    modbusQuery.prototype.bufferToQuery = function (buffer) {
        this.buffer = buffer;
        this.bufferString = "";

        // This variable is used to mark your current position within the buffer
        let pos = 0;

        // Check that an MBAP header is present (always 6 bytes in length)
        if (this.buffer.length >= 6) {

            // Get TransactionID
            this.transactionID = this.buffer.readUInt16BE(pos);
            this.debugString += chalk.hex("#33cc33")(blockNumber(this.transactionID, 5));
            
            // Get ProtocolID
            pos += 2;
            this.protocolID = this.buffer.readUInt16BE(pos);
            if (this.protocolID != 0) { rollupBuffer(pos); return false; }
            this.debugString += chalk.hex("#99ff33")(blockNumber(this.protocolID, 5));

            // Get byteLength
            pos += 2;
            this.byteLength = this.buffer.readUInt16BE(pos);
            if (buffer.length != (this.byteLength + 6)) { rollupBuffer(pos); return false; }
            this.debugString += chalk.hex("#99ff33")(blockNumber(this.byteLength, 5));

            // Get deviceID
            pos += 2;
            this.id = this.buffer.readUInt8(pos);
            this.debugString += chalk.hex("#0066ff")(blockNumber(this.id, 3));

            // Get function
            pos++;
            this.func = this.buffer.readUInt8(pos);
            
            if (this.func == 3) {
                this.debugString += chalk.hex("#3399ff")(blockNumber(this.func, 3));
                this.type = "readHoldingRegisters";

                // Get register
                pos++;
                this.register = this.buffer.readUInt16BE(pos);
                this.debugString += chalk.hex("#cc6600")(blockNumber(this.register, 5));

                // Get length
                pos += 2;
                this.length = this.buffer.readUInt16BE(pos);
                this.debugString += chalk.hex("#ff9933")(blockNumber(this.length, 5));
                
                pos += 2;
                if (pos < buffer.length) { rollupBuffer(pos); }
                return true;
            }
            else if (this.func == 16) {
                this.debugString += chalk.hex("#3399ff")(blockNumber(this.func, 3));
                this.type = "writeHoldingRegisters";

                // Get register
                pos++;
                this.register = this.buffer.readUInt16BE(pos);
                this.debugString += chalk.hex("#cc6600")(blockNumber(this.register, 5));
                
                // Get length
                pos += 2;
                this.length = this.buffer.readUInt16BE(pos);
                this.debugString += chalk.hex("#ff9933")(blockNumber(this.length, 5));

                // Get Data
                this.data = [];
                for (pos += 2; pos < this.buffer.length; pos += 2) {
                    let datum = this.buffer.readUInt16BE(pos);
                    this.data.push(datum);
                    this.debugString += chalk.hex("#888888")(blockNumber(datum, 5));
                }
                if (pos < this.buffer.length) { rollupBuffer.call(this, pos); }
                return true;
            }
            else {
                rollupBuffer.call(this, pos); return false;
            }
        }
    }

    function rollupBuffer (pos) {
        for (let i=pos; i<this.buffer.length; i++) {
            this.debugString += chalk.hex("#ff0000")(blockNumber(this.buffer[i], 3));
        }
    }

    function blockNumber (number, pad) {
        let s = parseInt(number).toString();
        let p = ""
        if (pad < 0) { pad = 0; }
        if (pad > 10) { pad = 10; }
        for (let i=0; i<(pad - s.length); i++) { p += "0"; }
        return "[" + p + s + "]";
    }

    modbusQuery.prototype.queryToBuffer.call(this);
    
    return this;
};