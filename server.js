const express = require('express');

const server = express();

const projectRouter = require('./projects-router.js');
const actionsRouter = require('./actions-router.js');

server.use(express.json());

server.use('/api/projects', projectRouter);
server.use('/api/actions', actionsRouter);

server.get('/', (req, res) => {
	res.send("Hey how's it going?");
});

module.exports = server;
