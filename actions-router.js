const express = require('express');

const Action = require('./data/helpers/actionModel.js');
const db = require('./data/dbConfig.js');

const router = express();

router.use(express.json());

router.post('/', (req, res) => {
	const { notes, description } = req.body;

	if (!notes && !description && !description.length < 128) {
		res.status(400).json({ message: 'Please include a description with max 128 characters and/or notes' });
	} else {
		Action.insert(req.body)
			.then((actions) => {
				res.status(200).json(actions);
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json({ error: 'please include notes, a description and project_id' });
			});
	}
});

module.exports = router;
