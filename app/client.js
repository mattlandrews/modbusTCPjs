'use strict';

const mbtcp = new require('../mbtcp/mbtcp.js')();

module.exports = function (options, queries) {

    this.queries = queries;
    this.options = options;
    this.client = new mbtcp.client();
    this.connected = false;
    this.validResponses = 0;
    this.errorResponses = 0;
    this.reconnections = 0;
    this.data = {};

    let currentQuery = 0;

    this.client.connect(options, (err) => {
        let that = this;
        if (!this.connected) { this.connected = true; }
        else { this.reconnections++; }
        if (err == null) {
            let query = this.queries[currentQuery];
            this.client.readHoldingRegisters( query.device, query.address, query.length, handleData.bind(that));
        }
    });

    function handleData (err, data) {
        if (err) { this.errorResponses++; }
        else {
            this.validResponses++;
            for (let i=0; i<data.length; i++) {
                this.data[i] = data[i];
            }
            
            if (currentQuery >= this.queries.length) { currentQuery = 0; }
            let query = this.queries[currentQuery];
            let that = this;
            setTimeout(() => { this.client.readHoldingRegisters( query.device, query.address, query.length, handleData.bind(that)); }, 0);
        }
    }

    return this;
}