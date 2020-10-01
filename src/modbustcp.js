"use strict";

const mbtcp_client = require("./mbtcp_client.js");

module.exports = function ModbusTCP () {

    this.client = mbtcp_client;
    return this;
}