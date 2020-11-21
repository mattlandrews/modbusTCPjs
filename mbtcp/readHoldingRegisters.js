module.exports = function ReadHoldingRegisters() {

    this.query = {
        type: 'rhrs_query',
        transaction: 0,
        protocol: 0,
        length: 6,
        device: 1,
        func: 3,
        address: 0,
        count: 1
    };
    this.reply = {
        type: 'rhrs_reply',
        transaction: 0,
        protocol: 0,
        length: 5,
        device: 1,
        func: 3,
        bytecount: 2,
        data: [0]
    }

    return this;

}