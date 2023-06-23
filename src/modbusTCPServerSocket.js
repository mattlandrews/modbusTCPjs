"use strict";

module.exports = function (socket) {

    if ((typeof socket !== "object") || (typeof socket.readyState !== "string")) { throw new Error("modbusServerSocket() did not recv a valid SOCKET object."); }

    this.socket = socket;

    this.stats = {
        numTotalRequests: 0,
        requestsPerSecond: 0,
        numTotalErrors: 0
    }

    this.socket.on("end", () => {
        this.socket.end();
    })

    this.socket.on("error", (err) => {
	if (err.code === "ECONNRESET") { this.socket.destroy(); return; }
        throw err;
    });

    let lastNumTotalRequests = 0;
    setInterval(()=>{
        this.stats.requestsPerSecond = (this.stats.numTotalRequests - lastNumTotalRequests);
        lastNumTotalRequests = this.stats.numTotalRequests;
    }, 1000);
}
