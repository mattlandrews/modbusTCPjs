module.exports = function WriteHoldingRegisters() {

    this.query = {
        type: 'whrs_query',
        transaction: 0,
        protocol: 0,
        length: 9,
        device: 1,
        func: 16,
        address: 0,
        count: 1,
        bytecount: 2,
        data: [0]
    };
    this.reply = {
        type: 'whrs_reply',
        transaction: 0,
        protocol: 0,
        length: 6,
        device: 1,
        func: 16,
        address: 0,
        count: 1
    }

    return this;

}