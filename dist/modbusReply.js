module.exports = function modbusReply () {
    
    this.transactionID = null;
    this.id = null;
    this.func = null;
    this.register = null;
    this.byteCount = null;
    this.length = null;
    this.data = null;
    this.exception = null;
    this.buffer = null;

    modbusReply.prototype.bufferToReply = function () {
        this.data = [];
        if (this.buffer.length >= 6) {
            this.transactionID = this.buffer.readUInt16BE(0);
            let byteLength = this.buffer.readUInt16BE(4);
            if (this.buffer.length === byteLength + 6) {
                this.id = this.buffer.readUInt8(6);
                this.func = this.buffer.readUInt8(7);
                if (this.func == 3) {
                    this.byteCount = this.buffer.readUInt8(8);
                    for (i = 0; i<this.byteCount; i+=2) {
                        this.data.push(this.buffer.readUInt16BE(9 + i));
                    }
                }
                else if (this.func == 16) {
                    this.register = this.buffer.readUInt16BE(8);
                    this.length = this.buffer.readUInt16BE(10);
                }
                else if (this.func >= 128) {
                    this.exception = this.buffer.readUInt8(8);
                }
            }
        }
    }

    modbusReply.prototype.replyToBuffer = function () {
        if (this.type === "readHoldingRegisters") {
            this.func = 3;
            let byteLength = 9 + this.byteCount;
            this.buffer = Buffer.allocUnsafe(byteLength);
            this.buffer.writeUInt16BE(this.transactionID, 0);
            this.buffer.writeUInt16BE(0, 2);
            this.buffer.writeUInt16BE(6, 4);
            this.buffer.writeUInt8(this.id, 6);
            this.buffer.writeUInt8(this.func, 7);
            this.buffer.writeUInt8(this.byteCount, 8);
            for (let i=0; i<this.data.length; i++) {
                this.buffer.writeUInt16BE(this.data[i], (9 + (i * 2)));
            }
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
        }
    }
    
    return this;
}