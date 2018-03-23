const chalk = require("chalk");

module.exports = function modbusReply(opts) {

    this.transaction = 0;
    this.protocol = 0;
    this.id = 1;
    this.type = "readHoldingRegisters";
    this.func = 3;
    this.register = 0;
    this.byteCount = 0;
    this.length = 1;
    this.data = [0];
    this.dataByteLength = 2;
    this.exception = null;

    if ((opts != null) && (typeof opts === "object")) {
        if (opts.transaction != null) { this.transaction = opts.transaction; }
        if (opts.id != null) { this.id = opts.id; }
        if (opts.type != null) { this.type = opts.type; }
        if (opts.register != null) { this.register = opts.register; }
        if (opts.length != null) { this.length = opts.length; }
        if (opts.data != null) {
            this.data = opts.data;
            this.length = this.data.length;
            this.dataByteLength = this.data.length * 2;
        }
    }

    this.buffer = null;
    this.debugString = "";

    this.bufferToReply = function (buffer) {
        this.buffer = buffer;
        this.bufferString = "";

        // This variable is used to mark your current position within the buffer
        let pos = 0;

        // Check for the MBAP header (always 6 bytes long)
        if (this.buffer.length >= 6) {

            // Get TransactionID
            this.transaction = this.buffer.readUInt16BE(pos);
            this.debugString += chalk.hex("#33cc33")(blockNumber(this.transaction, 5));
            
            // Get protocol
            pos += 2;
            this.protocol = this.buffer.readUInt16BE(pos);
            if (this.protocol != 0) { rollupBuffer(pos); return false; }
            this.debugString += chalk.hex("#99ff33")(blockNumber(this.protocol, 5));

            // Get byteLength
            pos += 2;
            let byteLength = this.buffer.readUInt16BE(pos);
            if (this.buffer.length != (byteLength + 6)) { rollupBuffer.call(this, pos); return false; }
            this.debugString += chalk.hex("#99ff33")(blockNumber(byteLength, 5));

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
                this.dataByteLength = this.buffer.readUInt8(pos);
                this.length = (this.dataByteLength / 2);
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
            else if (this.func == 16) {
                this.debugString += chalk.hex("#cc6600")(blockNumber(this.func, 3));
                this.type = "writeHoldingRegisters";
                this.data = [];
                this.dataByteLength = 0;

                // Get register
                pos++;
                this.register = this.buffer.readUInt16BE(pos);
                this.debugString += chalk.hex("#cc6600")(blockNumber(this.register, 5));

                // Get length
                pos+=2;
                this.length = this.buffer.readUInt16BE(pos);
                this.debugString += chalk.hex("#cc6600")(blockNumber(this.length, 5));

                if (pos < this.buffer.length) { rollupBuffer.call(this, pos); }
                return true;
            }
            else if (this.func >= 128) {
                this.debugString += chalk.hex("#880000")(blockNumber(this.func, 3));

                // Get Exception Code
                pos++;
                this.exception = this.buffer.readUInt8(pos);
                this.debugString += chalk.hex("#880000")(blockNumber(this.exception, 3));

                if (pos < this.buffer.length) { rollupBuffer.call(this, pos); }
                return true;
            }
            else {
                rollupBuffer.call(this, pos); return false;
            }
        }
    }

    this.replyToBuffer = function () {

        // Predict buffer size
        let byteSize;
        if (this.type == "readHoldingRegisters") { 
            this.func = 3;
            byteSize = (9 + this.dataByteLength);
        }
        else if (this.type == "writeHoldingRegisters") {
            this.func = 16;
            this.dataByteLength = 0;
            this.data = [];
            byteSize = 12;
        }
        if (this.exception != null) {
            this.func += 128;
            byteSize = 9;
        }

        this.buffer = Buffer.allocUnsafe(byteSize);
        this.debugString = "";

        // set transaction ID
        this.buffer.writeUInt16BE(this.transaction, 0);
        this.debugString += chalk.hex("#33cc33")(blockNumber(this.transaction, 5));
            
        // set protocol
        this.buffer.writeUInt16BE(this.protocol, 2);
        this.debugString += chalk.hex("#99ff33")(blockNumber(this.protocol, 5));

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

            // set byteCount
            this.buffer.writeUInt8(this.dataByteLength, 8);
            this.debugString += chalk.hex("#ff9933")(blockNumber(this.dataByteLength, 3));

            // set data
            for (let i = 0; i < this.data.length; i++) {
                this.buffer.writeUInt16BE(this.data[i], (9 + (i * 2)));
                this.debugString += chalk.hex("#888888")(blockNumber(this.data[i], 5));
            }
            return true;
        }
        else if (this.func == 16) {
            this.debugString += chalk.hex("#3399ff")(blockNumber(this.func, 3));

            // set register
            this.buffer.writeUInt16BE(this.register, 8);
            this.debugString += chalk.hex("#888888")(blockNumber(this.register, 5));
            
            // set count
            this.buffer.writeUInt16BE(this.length, 10);
            this.debugString += chalk.hex("#888888")(blockNumber(this.length, 5));

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

    this.replyToBuffer();

    return this;
}