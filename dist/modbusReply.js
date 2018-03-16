const chalk = require("chalk");

module.exports = function modbusReply() {

    this.transactionID = null;
    this.id = null;
    this.func = null;
    this.register = null;
    this.byteCount = null;
    this.length = null;
    this.data = [];
    this.exception = null;
    this.buffer = null;
    this.debugString = "";

    modbusReply.prototype.bufferToReply = function (buffer) {
        this.buffer = buffer;
        this.bufferString = "";

        // This variable is used to mark your current position within the buffer
        let pos = 0;

        // Check for the MBAP header (always 6 bytes long)
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
            this.debugString += chalk.hex("#ccccff")(blockNumber(this.id, 3));

            // Get function
            pos++;
            this.func = this.buffer.readUInt8(pos);

            if (this.func == 3) {
                this.debugString += chalk.hex("#cc6600")(blockNumber(this.func, 3));
                this.type = "readHoldingRegisters";

                // Get byteCount
                pos++;
                this.byteCount = this.buffer.readUInt8(pos);
                this.debugString += chalk.hex("#cc6600")(blockNumber(this.byteCount, 3));

                // Get Values
                this.data = [];
                for (pos++; pos < this.buffer.length; pos += 2) {
                    let datum = this.buffer.readUInt16BE(pos);
                    this.data.push(datum);
                    this.debugString += chalk.hex("#888888")(blockNumber(datum, 5));
                }
                if (pos < this.buffer.length) { rollupBuffer.call(this, pos); }
                return true;
            }
            else if (this.func >= 128) {
                this.debugString += chalk.hex("#880000")(blockNumber(this.func, 3));

                // Get Exception Code
                pos++;
                this.exception = this.buffer.readUInt8(pos);
                this.debugString += chalk.hex("#880000")(blockNumber(this.exception, 3));
            }
            else {
                rollupBuffer.call(this, pos); return false;
            }
        }
    }

    modbusReply.prototype.replyToBuffer = function () {

        // Predict buffer size
        let byteSize;
        if (this.type == "readHoldingRegisters") { 
            this.func = 3;
            byteSize = (9 + this.byteCount);
        }
        else if (this.func == "readHoldingRegisters") {
            this.func = 16;
            byteSize = (13 + (this.data.length * 2));
        }
        if (this.exception != null) {
            this.func += 128;
            byteSize = 9;
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
        this.buffer.writeUInt16BE(this.id, 6);
        this.debugString += chalk.hex("#0066ff")(blockNumber(this.id, 3));

        // set function
        this.buffer.writeUInt8(this.func, 7);
        
        if (this.func == 3) {
            this.debugString += chalk.hex("#3399ff")(blockNumber(this.func, 3));

            // set byteCount
            this.buffer.writeUInt8(this.byteCount, 8);
            this.debugString += chalk.hex("#ff9933")(blockNumber(this.byteCount, 3));

            // set data
            for (let i = 0; i < this.data.length; i++) {
                this.buffer.writeUInt16BE(this.data[i], (9 + (i * 2)));
                this.debugString += chalk.hex("#888888")(blockNumber(this.data[i], 5));
            }
            return true;
        }
        else if (this.func == 16) {
            this.debugString += chalk.hex("#3399ff")(blockNumber(this.func, 3));

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

    return this;
}