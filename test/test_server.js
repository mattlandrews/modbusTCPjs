'use strict';

const assert = require('assert');
const mbtcp = require('../mbtcp/mbtcp.js');
const stub_net = require('./stub_net.js');

describe('server', function () {

    describe('#server()', function () {

        it ('server() returns valid object', () => {
            let server = new mbtcp.server();
            assert.strictEqual(typeof server, "object");
            assert.strictEqual(typeof server.start, "function");
            assert.strictEqual(typeof server.stop, "function");
            assert.strictEqual(typeof server.on, "function");
            assert.strictEqual(typeof server.setHoldingRegisters, "function");
            assert.strictEqual(typeof server.ip, "string");
            assert.strictEqual(server.ip, "127.0.0.1");
            assert.strictEqual(typeof server.port, "number");
            assert.strictEqual(server.port, 502);
            assert.deepStrictEqual(server.holdingRegisters, {});
        });

        it ('server({ ip: \'172.22.0.1\', port: 503 }) returns valid object', () => {
            let server = new mbtcp.server({ ip: '172.22.0.1', port: 503 });
            assert.strictEqual(typeof server, "object");
            assert.strictEqual(typeof server.start, "function");
            assert.strictEqual(typeof server.stop, "function");
            assert.strictEqual(typeof server.on, "function");
            assert.strictEqual(typeof server.setHoldingRegisters, "function");
            assert.strictEqual(typeof server.ip, "string");
            assert.strictEqual(server.ip, "172.22.0.1");
            assert.strictEqual(typeof server.port, "number");
            assert.strictEqual(server.port, 503);
            assert.deepStrictEqual(server.holdingRegisters, {});
        });

    });

    describe('on()', () => {

        it('on(\'start\')', () => {
            function onStart () { ; }
            let server = new mbtcp.server({ net: stub_net });
            server.on('start', onStart);
            let listeners = server.getListeners('start');
            assert.strictEqual(typeof listeners, 'object');
            assert.strictEqual(listeners.length, 1);
            assert.strictEqual(typeof listeners[0], 'function');
            assert.strictEqual(listeners[0], onStart);
        });

        it('on(\'stop\')', () => {
            function onStop () { ; }
            let server = new mbtcp.server({ net: stub_net });
            server.on('stop', onStop);
            let listeners = server.getListeners('stop');
            assert.strictEqual(typeof listeners, 'object');
            assert.strictEqual(listeners.length, 1);
            assert.strictEqual(typeof listeners[0], 'function');
            assert.strictEqual(listeners[0], onStop);
        });

        it('on(\'connect\')', () => {
            function onConnect () { ; }
            let server = new mbtcp.server({ net: stub_net });
            server.on('connect', onConnect);
            let listeners = server.getListeners('connect');
            assert.strictEqual(typeof listeners, 'object');
            assert.strictEqual(listeners.length, 1);
            assert.strictEqual(typeof listeners[0], 'function');
            assert.strictEqual(listeners[0], onConnect);
        });

        it('on(\'disconnect\')', () => {
            function onDisconnect () { ; }
            let server = new mbtcp.server({ net: stub_net });
            server.on('disconnect', onDisconnect);
            let listeners = server.getListeners('disconnect');
            assert.strictEqual(typeof listeners, 'object');
            assert.strictEqual(listeners.length, 1);
            assert.strictEqual(typeof listeners[0], 'function');
            assert.strictEqual(listeners[0], onDisconnect);
        });

        it('on(\'error\')', () => {
            function onError () { ; }
            let server = new mbtcp.server({ net: stub_net });
            server.on('error', onError);
            let listeners = server.getListeners('error');
            assert.strictEqual(typeof listeners, 'object');
            assert.strictEqual(listeners.length, 1);
            assert.strictEqual(typeof listeners[0], 'function');
            assert.strictEqual(listeners[0], onError);
        });

        it('on(\'data\')', () => {
            function onData () { ; }
            let server = new mbtcp.server({ net: stub_net });
            server.on('data', onData);
            let listeners = server.getListeners('data');
            assert.strictEqual(typeof listeners, 'object');
            assert.strictEqual(listeners.length, 1);
            assert.strictEqual(typeof listeners[0], 'function');
            assert.strictEqual(listeners[0], onData);
        });

    });

    describe('off()', () => {

        it('off(\'start\')', () => {
            let server = new mbtcp.server({ net: stub_net });

            function onStart () {}

            server.on('start', onStart);
            let listeners = server.getListeners('start');
            assert.strictEqual(typeof listeners, 'object');
            assert.strictEqual(listeners.length, 1);
            assert.strictEqual(typeof listeners[0], 'function');
            assert.strictEqual(listeners[0], onStart);
            server.off('start', () => {});
            listeners = server.getListeners('start');
            assert.strictEqual(typeof listeners, 'object');
            assert.strictEqual(listeners.length, 1);
            assert.strictEqual(typeof listeners[0], 'function');
            assert.strictEqual(listeners[0], onStart);
            server.off('start', onStart);
            listeners = server.getListeners('start');
            assert.strictEqual(typeof listeners, 'object');
            assert.strictEqual(listeners.length, 0);
        });

        it('off(\'stop\')', () => {
            let server = new mbtcp.server({ net: stub_net });

            function onStop () {}

            server.on('stop', onStop);
            let listeners = server.getListeners('stop');
            assert.strictEqual(typeof listeners, 'object');
            assert.strictEqual(listeners.length, 1);
            assert.strictEqual(typeof listeners[0], 'function');
            assert.strictEqual(listeners[0], onStop);
            server.off('stop', () => {});
            listeners = server.getListeners('stop');
            assert.strictEqual(typeof listeners, 'object');
            assert.strictEqual(listeners.length, 1);
            assert.strictEqual(typeof listeners[0], 'function');
            assert.strictEqual(listeners[0], onStop);
            server.off('stop', onStop);
            listeners = server.getListeners('stop');
            assert.strictEqual(typeof listeners, 'object');
            assert.strictEqual(listeners.length, 0);
        });

        it('off(\'connect\')', () => {
            let server = new mbtcp.server({ net: stub_net });

            function onConnect () {}

            server.on('connect', onConnect);
            let listeners = server.getListeners('connect');
            assert.strictEqual(typeof listeners, 'object');
            assert.strictEqual(listeners.length, 1);
            assert.strictEqual(typeof listeners[0], 'function');
            server.off('connect', () => {});
            listeners = server.getListeners('connect');
            assert.strictEqual(typeof listeners, 'object');
            assert.strictEqual(listeners.length, 1);
            assert.strictEqual(typeof listeners[0], 'function');
            server.off('connect', onConnect);
            listeners = server.getListeners('connect');
            assert.strictEqual(typeof listeners, 'object');
            assert.strictEqual(listeners.length, 0);
        });

        it('off(\'disconnect\')', () => {
            let server = new mbtcp.server({ net: stub_net });

            function onDisconnect () {}

            server.on('disconnect', onDisconnect);
            let listeners = server.getListeners('disconnect');
            assert.strictEqual(typeof listeners, 'object');
            assert.strictEqual(listeners.length, 1);
            assert.strictEqual(typeof listeners[0], 'function');
            server.off('disconnect', () => {});
            listeners = server.getListeners('disconnect');
            assert.strictEqual(typeof listeners, 'object');
            assert.strictEqual(listeners.length, 1);
            assert.strictEqual(typeof listeners[0], 'function');
            server.off('disconnect', onDisconnect);
            listeners = server.getListeners('disconnect');
            assert.strictEqual(typeof listeners, 'object');
            assert.strictEqual(listeners.length, 0);
        });

        it('off(\'data\')', () => {
            let server = new mbtcp.server({ net: stub_net });

            function onData () {}

            server.on('data', onData);
            let listeners = server.getListeners('data');
            assert.strictEqual(typeof listeners, 'object');
            assert.strictEqual(listeners.length, 1);
            assert.strictEqual(typeof listeners[0], 'function');
            server.off('data', () => {});
            listeners = server.getListeners('data');
            assert.strictEqual(typeof listeners, 'object');
            assert.strictEqual(listeners.length, 1);
            assert.strictEqual(typeof listeners[0], 'function');
            server.off('data', onData);
            listeners = server.getListeners('data');
            assert.strictEqual(typeof listeners, 'object');
            assert.strictEqual(listeners.length, 0);
        });

        it('off(\'error\')', () => {
            let server = new mbtcp.server({ net: stub_net });

            function onError () {}

            server.on('error', onError);
            let listeners = server.getListeners('error');
            assert.strictEqual(typeof listeners, 'object');
            assert.strictEqual(listeners.length, 1);
            assert.strictEqual(typeof listeners[0], 'function');
            server.off('error', () => {});
            listeners = server.getListeners('error');
            assert.strictEqual(typeof listeners, 'object');
            assert.strictEqual(listeners.length, 1);
            assert.strictEqual(typeof listeners[0], 'function');
            server.off('error', onError);
            listeners = server.getListeners('error');
            assert.strictEqual(typeof listeners, 'object');
            assert.strictEqual(listeners.length, 0);
        });

    });

    describe('start()', () => {

        it('start()', (done) => {
            let server = new mbtcp.server();
            
            server.on('start', () => { done(); });
            server.start();
        });

    });

    describe('setHoldingRegisters()', () => {

        it('setHoldingRegisters()', (done) => {
            let server = new mbtcp.server();
            assert.deepStrictEqual(server.holdingRegisters, {});
            server.setHoldingRegisters({ 100: 100, 101: 101 });
            assert.deepStrictEqual(server.holdingRegisters, { 100: 100, 101: 101 });
            server.setHoldingRegisters({ 0: 0, 65535: 65535 });
            assert.deepStrictEqual(server.holdingRegisters, { 0: 0, 65535: 65535 });
            done();
        });

    });

    describe('disconnect()', () => {

        

    });

    describe('stop()', () => {

        it('stop()', (done) => {
            let server = new mbtcp.server();
            
            server.on('stop', () => { done(); });
            server.stop();
        });

    });

});