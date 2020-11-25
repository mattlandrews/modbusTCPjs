'use strict';

const assert = require('assert');
const mbtcp = require('../mbtcp/mbtcp.js');
const stub_net = require('./stub_net.js');

describe('client', function () {

    describe('#client()', function () {

        it ('client() returns valid object', () => {
            let client = new mbtcp.client();
            assert.strictEqual(typeof client, "object");
            assert.strictEqual(typeof client.connect, "function");
            assert.strictEqual(typeof client.disconnect, "function");
            assert.strictEqual(typeof client.on, "function");
            assert.strictEqual(typeof client.readHoldingRegisters, "function");
            assert.strictEqual(typeof client.writeHoldingRegisters, "function");
            assert.strictEqual(typeof client.ip, "string");
            assert.strictEqual(client.ip, "127.0.0.1");
            assert.strictEqual(typeof client.port, "number");
            assert.strictEqual(client.port, 502);
            assert.strictEqual(client.reconnect, false);
            assert.strictEqual(typeof client.reconnect, "boolean");
        });

        it ('client({ ip: \'172.22.0.1\', port: 503 }) returns valid object', () => {
            let client = new mbtcp.client({ ip: '172.22.0.1', port: 503 });
            assert.strictEqual(typeof client, "object");
            assert.strictEqual(typeof client.connect, "function");
            assert.strictEqual(typeof client.disconnect, "function");
            assert.strictEqual(typeof client.on, "function");
            assert.strictEqual(typeof client.readHoldingRegisters, "function");
            assert.strictEqual(typeof client.writeHoldingRegisters, "function");
            assert.strictEqual(typeof client.ip, "string");
            assert.strictEqual(client.ip, "172.22.0.1");
            assert.strictEqual(typeof client.port, "number");
            assert.strictEqual(client.port, 503);
            assert.strictEqual(client.reconnect, false);
            assert.strictEqual(typeof client.reconnect, "boolean");
        });

    });

    describe('on()', () => {

        it('on(\'connect\')', () => {
            let client = new mbtcp.client({ net: stub_net });
            client.on('connect', () => { });
            let listeners = client.getListeners('connect');
            assert.strictEqual(typeof listeners, 'object');
            assert.strictEqual(listeners.length, 1);
            assert.strictEqual(typeof listeners[0], 'function');
        });

        it('on(\'disconnect\')', () => {
            let client = new mbtcp.client({ net: stub_net });
            client.on('disconnect', () => { });
            let listeners = client.getListeners('disconnect');
            assert.strictEqual(typeof listeners, 'object');
            assert.strictEqual(listeners.length, 1);
            assert.strictEqual(typeof listeners[0], 'function');
        });

        it('on(\'data\')', () => {
            let client = new mbtcp.client({ net: stub_net });
            client.on('data', () => { });
            let listeners = client.getListeners('data');
            assert.strictEqual(typeof listeners, 'object');
            assert.strictEqual(listeners.length, 1);
            assert.strictEqual(typeof listeners[0], 'function');
        });

        it('on(\'error\')', () => {
            let client = new mbtcp.client({ net: stub_net });
            client.on('error', () => { });
            let listeners = client.getListeners('error');
            assert.strictEqual(typeof listeners, 'object');
            assert.strictEqual(listeners.length, 1);
            assert.strictEqual(typeof listeners[0], 'function');
        });

    });

    describe('off()', () => {

        it('off(\'connect\')', () => {
            let client = new mbtcp.client({ net: stub_net });

            function onConnect () {}

            client.on('connect', onConnect);
            let listeners = client.getListeners('connect');
            assert.strictEqual(typeof listeners, 'object');
            assert.strictEqual(listeners.length, 1);
            assert.strictEqual(typeof listeners[0], 'function');
            client.off('connect', () => {});
            listeners = client.getListeners('connect');
            assert.strictEqual(typeof listeners, 'object');
            assert.strictEqual(listeners.length, 1);
            assert.strictEqual(typeof listeners[0], 'function');
            client.off('connect', onConnect);
            listeners = client.getListeners('connect');
            assert.strictEqual(typeof listeners, 'object');
            assert.strictEqual(listeners.length, 0);
        });

        it('off(\'disconnect\')', () => {
            let client = new mbtcp.client({ net: stub_net });

            function onDisconnect () {}

            client.on('disconnect', onDisconnect);
            let listeners = client.getListeners('disconnect');
            assert.strictEqual(typeof listeners, 'object');
            assert.strictEqual(listeners.length, 1);
            assert.strictEqual(typeof listeners[0], 'function');
            client.off('disconnect', () => {});
            listeners = client.getListeners('disconnect');
            assert.strictEqual(typeof listeners, 'object');
            assert.strictEqual(listeners.length, 1);
            assert.strictEqual(typeof listeners[0], 'function');
            client.off('disconnect', onDisconnect);
            listeners = client.getListeners('disconnect');
            assert.strictEqual(typeof listeners, 'object');
            assert.strictEqual(listeners.length, 0);
        });

        it('off(\'data\')', () => {
            let client = new mbtcp.client({ net: stub_net });

            function onData () {}

            client.on('data', onData);
            let listeners = client.getListeners('data');
            assert.strictEqual(typeof listeners, 'object');
            assert.strictEqual(listeners.length, 1);
            assert.strictEqual(typeof listeners[0], 'function');
            client.off('data', () => {});
            listeners = client.getListeners('data');
            assert.strictEqual(typeof listeners, 'object');
            assert.strictEqual(listeners.length, 1);
            assert.strictEqual(typeof listeners[0], 'function');
            client.off('data', onData);
            listeners = client.getListeners('data');
            assert.strictEqual(typeof listeners, 'object');
            assert.strictEqual(listeners.length, 0);
        });

        it('off(\'error\')', () => {
            let client = new mbtcp.client({ net: stub_net });

            function onError () {}

            client.on('error', onError);
            let listeners = client.getListeners('error');
            assert.strictEqual(typeof listeners, 'object');
            assert.strictEqual(listeners.length, 1);
            assert.strictEqual(typeof listeners[0], 'function');
            client.off('error', () => {});
            listeners = client.getListeners('error');
            assert.strictEqual(typeof listeners, 'object');
            assert.strictEqual(listeners.length, 1);
            assert.strictEqual(typeof listeners[0], 'function');
            client.off('error', onError);
            listeners = client.getListeners('error');
            assert.strictEqual(typeof listeners, 'object');
            assert.strictEqual(listeners.length, 0);
        });

    });

    describe('connect()', () => {

        it('connect()', (done) => {
            let client = new mbtcp.client();
            
            client.on('connect', () => { done(); });
            client.connect();
        });

    });

    describe('readHoldingRegisters()', () => {

        it('readHoldingRegisters(0,1) - w/o event listner', (done) => {
            let client = new mbtcp.client({ net: stub_net });
            client.on('connect', () => {
                client.readHoldingRegisters(0,1);
                done();
            });
            client.connect();
        });

        it('readHoldingRegisters(0,1)', (done) => {
            let client = new mbtcp.client({ net: stub_net });
            client.on('connect', () => {
                client.readHoldingRegisters(0,1);
            });
            client.on('data', (reply) => {
                assert.deepStrictEqual(reply, {
                    type: 'rhrs_reply',
                    transaction: 0,
                    protocol: 0,
                    length: 5,
                    device: 1,
                    func: 3,
                    bytecount: 2,
                    data: [0]
                });
                done();
            })
            client.connect();
        });

        it('readHoldingRegisters(1,5)', (done) => {
            let client = new mbtcp.client({ net: stub_net });
            client.on('connect', () => {
                client.readHoldingRegisters(1,5);
            });
            client.on('data', (reply) => {
                assert.deepStrictEqual(reply, {
                    type: 'rhrs_reply',
                    transaction: 0,
                    protocol: 0,
                    length: 13,
                    device: 1,
                    func: 3,
                    bytecount: 10,
                    data: [1,2,3,4,5]
                });
                done();
            })
            client.connect();
        });

        it('readHoldingRegisters(2570,1)', (done) => {
            let client = new mbtcp.client({ net: stub_net });
            client.on('connect', () => {
                client.readHoldingRegisters(2570,1);
            });
            client.on('data', (reply) => {
                assert.deepStrictEqual(reply, {
                    type: 'rhrs_reply',
                    transaction: 0,
                    protocol: 0,
                    length: 5,
                    device: 1,
                    func: 3,
                    bytecount: 2,
                    data: [2570]
                });
                done();
            })
            client.connect();
        });

        it('readHoldingRegisters(254,4)', (done) => {
            let client = new mbtcp.client({ net: stub_net });
            client.on('connect', () => {
                client.readHoldingRegisters(254,4);
            });
            client.on('data', (reply) => {
                assert.deepStrictEqual(reply, {
                    type: 'rhrs_reply',
                    transaction: 0,
                    protocol: 0,
                    length: 11,
                    device: 1,
                    func: 3,
                    bytecount: 8,
                    data: [254,255,256,257]
                });
                done();
            })
            client.connect();
        });

        it('readHoldingRegisters(100,1) => readHoldingRegisters(101,1)', (done) => {
            let client = new mbtcp.client({ net: stub_net });

            function cb1 (reply) {
                assert.deepStrictEqual(reply, {
                    type: 'rhrs_reply',
                    transaction: 0,
                    protocol: 0,
                    length: 5,
                    device: 1,
                    func: 3,
                    bytecount: 2,
                    data: [100]
                });
                client.off('data', cb1);
                client.on('data', cb2);
                client.readHoldingRegisters(101,1);
            }

            function cb2 (reply) {
                assert.deepStrictEqual(reply, {
                    type: 'rhrs_reply',
                    transaction: 1,
                    protocol: 0,
                    length: 5,
                    device: 1,
                    func: 3,
                    bytecount: 2,
                    data: [101]
                });
                done();
            }

            client.on('connect', () => {
                client.readHoldingRegisters(100,1);
            });
            client.on('data', cb1);
            client.connect();
        });

        it('readHoldingRegisters(10,120)', (done) => {
            let client = new mbtcp.client({ net: stub_net });
            client.on('connect', () => {
                client.readHoldingRegisters(10,120);
            });
            client.on('data', (reply) => {
                assert.deepStrictEqual(reply, {
                    type: 'rhrs_reply',
                    transaction: 0,
                    protocol: 0,
                    length: 243,
                    device: 1,
                    func: 3,
                    bytecount: 240,
                    data: [10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120]
                });
                done();
            })
            client.connect();
        });

    });

    describe('writeHoldingRegisters()', () => {

        it('writeHoldingRegisters(0,[1]) - w/o event listner', (done) => {
            let client = new mbtcp.client({ net: stub_net });
            client.on('connect', () => {
                client.writeHoldingRegisters(0,[1]);
                done();
            });
            client.connect();
        });

        it('writeHoldingRegisters(0,[1])', (done) => {
            let client = new mbtcp.client({ net: stub_net });
            client.on('connect', () => {
                client.writeHoldingRegisters(0,[1]);
            });
            client.on('data', (reply) => {
                assert.deepStrictEqual(reply, {
                    type: 'whrs_reply',
                    transaction: 0,
                    protocol: 0,
                    length: 6,
                    device: 1,
                    func: 16,
                    address: 0,
                    count: 1
                });
                done();
            })
            client.connect();
        });

        it('writeHoldingRegisters(1,[2,3,4,5,6])', (done) => {
            let client = new mbtcp.client({ net: stub_net });
            client.on('connect', () => {
                client.writeHoldingRegisters(1,[2,3,4,5,6]);
            });
            client.on('data', (reply) => {
                assert.deepStrictEqual(reply, {
                    type: 'whrs_reply',
                    transaction: 0,
                    protocol: 0,
                    length: 6,
                    device: 1,
                    func: 16,
                    address: 1,
                    count: 5
                });
                done();
            })
            client.connect();
        });

    });

    describe('disconnect()', () => {

        it('disconnect()', (done) => {
            let client = new mbtcp.client();
            
            client.on('connect', () => { client.disconnect(); });
            client.on('disconnect', () => { done(); });
            client.connect();
        });

    });

});