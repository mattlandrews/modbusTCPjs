module.exports = function (buffer) {
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