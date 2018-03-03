module.exports = function modbusReply () {
    
    this.transactionID;
    this.id;
    this.func;
    this.register;
    this.byteCount;
    this.length;
    this.data;
    this.exception;

    modbusReply.prototype.bufferToReply = function (buffer) {
        this.replyBuffer = buffer;
        this.data = [];
        if (buffer.length >= 6) {
            this.transactionID = buffer.readUInt16BE(0);
            let byteLength = buffer.readUInt16BE(4);
            if (buffer.length === byteLength + 6) {
                this.id = buffer.readUInt8(6);
                this.func = buffer.readUInt8(7);
                if (this.func == 3) {
                    this.byteCount = buffer.readUInt8(8);
                    for (i = 0; i<this.byteCount; i+=2) {
                        this.data.push(buffer.readUInt16BE(9 + i));
                    }
                }
                else if (this.func == 16) {
                    this.register = buffer.readUInt16BE(8);
                    this.length = buffer.readUInt16BE(10);
                }
                else if (this.func >= 128) {
                    this.exception = buffer.readUInt8(8);
                }
            }
        }
    }
    
    return this;
}