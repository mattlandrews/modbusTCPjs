module.exports = function Exception() {

    this.type = 'excp';
    this.reply = {
        type: 'excp_reply',
        transaction: 0,
        protocol: 0,
        length: 5,
        device: 1,
        func: 131,
        code: 1
    }

    return this;

}