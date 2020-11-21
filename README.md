modbusTCPjs
===========

ModbusTCP.js is a simple light-weight modbusTCP client for javascript. It is still in the early stages of development (work-in-progress), and should not be considered production-ready.

### Download
Download all required files from the 'mbtcp' folder.

### Install
If you clone this entire repository, be sure to install dependancies by running "npm install".

### How To Use
Below is an example of how to connect to a single modbus slave, issue a query, then disconnect.
```javascript
'use strict';

const ModbusTCP = require("./mbtcp/mbtcp.js");
const mbtcp = new ModbusTCP();

let client = new mbtcp.client({ ip: '127.0.0.1', port: 502 });

client.on("error", (err) => { console.log(err); });

client.on("connect", () => {
    console.log("connected");
    client.send(new mbtcp.readHoldingRegisters().query);
});

client.on("data", (reply) => {
    console.log("data recvd");
    client.disconnect();
});

client.on("disconnect", () => { console.log("disconnected"); });

client.connect();

```

### Tests
TBD

### License
Licensed under [MIT]
(http://opensource.org/licenses/MIT)