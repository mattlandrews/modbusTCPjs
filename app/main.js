'use strict';

const Controller = require('./controller.js');
const Model = require('./model.js');
const View = require('./view.js');

const app = new Controller(new Model(), new View());

process.on("uncaughtException", (err) => {
    app.showError(err);
    process.exit(1);
});

app.selectInterface()
    .then(() => {
        app.main()
            .then(() => {
                debugger;
            })
            .catch(app.showError);
    })
    .catch(app.showError);