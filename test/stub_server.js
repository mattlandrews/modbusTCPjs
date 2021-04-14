module.exports = function () {
    
    let events = {};
    
    this.on = function (event, callback) {
        events[event] = callback;
    };

    this.listen = function () {
        setTimeout(() => {
            if (typeof events['listen'] === 'function') { events['listen'](); }
        }, 0);
    };

    return this;

}