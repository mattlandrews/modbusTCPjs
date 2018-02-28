module.exports = function (id, type, register, length, data, callback) {
    this.id = id;
    this.type = type;
    this.register = register;
    this.length = length;
    this.data = data;
    this.callback = callback;

    let byteArray = [this.id & 255];           // id
    if (this.type === "readHoldingRegisters") {
        this.func = 3;
        byteArray = byteArray.concat([
            (this.func & 255),                  // function code
            (this.register >> 8),               // register (hi byte)
            (this.register & 255),              // register (lo byte)
            (this.length >> 8),                 // length (hi byte)
            (this.length & 255),                // length (lo byte)
        ]);
    }
    else if (this.type === "writeHoldingRegisters") {
        this.func = 16;

        this.data = (Array.isArray(data)) ? data : [data];
        byteArray = byteArray.concat([
            (this.func & 255),                  // function code
            (this.register >> 8),               // register (hi byte)
            (this.register & 255),              // register (lo byte)
            (this.length >> 8),                 // length (hi byte)
            (this.data.length & 255),                // length (lo byte)
            ((this.data.length * 2) & 255),          // byte count
        ]);

        for (let i = 0; i < this.data.length; i++) {
            byteArray = byteArray.concat([
                (this.data[i] >> 8),                 // data (hi byte)
                (this.data[i] & 255),                // data (lo byte)
            ]);
        }
    }
    else {
        this.func = null;
    }
    this.queryByteArray = byteArray;

    this.setMBAP = function (id) {
        if (this.transactionID != null) { this.queryByteArray.splice(0,6); }
        this.transactionID = id;
        this.queryByteArray = [
            ((this.transactionID >> 8) & 0xFF),
            (this.transactionID & 0xFF),
            0,
            0,
            ((this.queryByteArray.length >> 8) & 0xFF),
            (this.queryByteArray.length & 0xFF)
        ].concat(this.queryByteArray);
    }

    return this;
};