module.exports = {

    modbusQuery: function (id, type, register, length, data, callback) {
        this.id = id;
        this.type = type;
        this.register = register;
        this.length = length;
        this.data = data;
        this.callback = callback;

        let byteArray = [this.id & 255];           // id
        if (this.type === "holdingRegisters") {
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

            var data;
            if (typeof this.data === "function") { data = this.data(); }
            else { data = this.data; }

            byteArray = byteArray.concat([
                (this.func & 255),                  // function code
                (this.register >> 8),               // register (hi byte)
                (this.register & 255),              // register (lo byte)
                (this.length >> 8),                 // length (hi byte)
                (data.length & 255),                // length (lo byte)
                ((data.length * 2) & 255),          // byte count
            ]);

            for (let i = 0; i < data.length; i++) {
                byteArray = byteArray.concat([
                    (data[i] >> 8),                 // data (hi byte)
                    (data[i] & 255),                // data (lo byte)
                ]);
            }
        }
        this.queryByteArray = byteArray;

        this.setMBAP = function (id) {
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
    },

    modbusReply: function (buffer) {
        this.replyBuffer = buffer;
        this.transactionID = (buffer[0] << 8) + (buffer[1] & 0xFF);
        this.id = buffer[6];
        this.func = buffer[7];        
        this.data = [];
        if (this.func == 3) {
            this.byteCount = buffer[8];
            let i = 0;
            while (i < this.byteCount) {
                var d = (buffer[i + 9] << 8);
                d += buffer[i + 10];
                this.data.push(d);
                i += 2;
            }
        }
        else if (this.func == 16) {
            this.register = (buffer[8] << 8) + (buffer[9] & 0xFF);
            this.length = (buffer[10] << 8) + (buffer[11] & 0xFF);
        }
        return this;
    }
}