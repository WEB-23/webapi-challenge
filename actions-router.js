const express = require('express');

const Action = require('./data/helpers/actionModel.js');
const db = require('./data/dbConfig.js');

const router = express();

router.use(express.json());

// posts a new action
router.post('/', (req, res) => {
	const { notes, description } = req.body;

	if (!notes && !description && !description.length < 128) {
		res.status(400).json({ message: 'Please include a description with max 128 characters and/or notes' });
	} else {
		Action.insert(req.body)
			.then((action) => {
				res.status(200).json(action);
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json({ error: 'please include notes, a description and project_id' });
			});
	}
});

// get actions from the project with the passed in id
router.get('/:id', (req, res) => {
	const { id } = req.params;

	Action.get(id).then((removed) => {
		if (removed) {
			res.status(200).json(removed);
		} else {
			res.status(404).json({ error: 'invalid id' });
		}
	});
});

router.delete('/:id', (req, res) => {
	const { id } = req.params;
	Action.remove(id)
		.then((removed) => {
			if (removed) {
				res.status(204).json(removed);
			} else {
				res.status(404).json({ error: 'action with id not found' });
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: 'error deleting post' });
		});
});

router.put('/:id', (req, res) => {
	const { notes, description } = req.body;
	const { id } = req.params;

	if (!notes && !description) {
		return res
			.status(400)
			.json({ error: 'please include notes and a description with a maximum of 128 characters ' });
	} else {
		Action.update(id, req.body)
			.then((action) => {
				if (action) {
					res.status(200).json(action);
				} else {
					res.status(404).json({ error: 'action with this id not found' });
				}
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json({ error: 'unable to update' });
			});
	}
});

module.exports = router;
