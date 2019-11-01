const express = require('express');

const Project = require('./data/helpers/projectModel.js');

const router = express();

router.use(express.json());

// Projects
// initial get request to get projects
router.get('/', (req, res) => {
	Project.get()
		.then((project) => {
			res.status(200).json(project);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: 'unable to get projects' });
		});
});

// get specific projects by their id
router.get('/:id', (req, res) => {
	const { id } = req.params;
	Project.get(id).then((project) => {
		if (project) {
			res.status(200).json(project);
		} else {
			res.status(404).json({ error: 'invalid id' });
		}
	});
});

// getting the actions for a specific project/user
router.get('/:id/actions', (req, res) => {
	const { id } = req.params;

	Project.getProjectActions(id)
		.then((actions) => {
			res.status(200).json(actions);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: 'error with the server' });
		});
});

// creating a new project object
router.post('/', validate, (req, res) => {
	const body = req.body;

	Project.insert(body)
		.then((project) => {
			res.status(200).json(project);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: 'unable to complete request' });
		});
});

// route for editing projects with the matching id
router.put('/:id', (req, res) => {
	const { id } = req.params;
	const { name, description } = req.body;

	if (!name && !description) {
		res.status(400).json({ error: 'please include a name and description with a maximum of 128 characters ' });
	} else {
		Project.update(id, req.body)
			.then((projects) => {
				if (projects) {
					res.status(200).json(projects);
				} else {
					res.status(404).json({ error: 'project with this id not found' });
				}
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json({ error: 'unable to update' });
			});
	}
});

// removing/ deleting a project
router.delete('/:id', (req, res) => {
	const { id } = req.params;

	Project.remove(id)
		.then(() => {
			res.status(204).end();
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: 'error deleting user' });
		});
});

// some custom middleware
function validate(req, res, next) {
	const body = req.body;
	const name = req.body.name;
	const description = req.body.description;

	if (JSON.stringify(body) === '{}') {
		res.status(400).json({ error: 'Missing data' });
	} else if (!name && !description) {
		res.status(400).json({ error: 'Missing required fields' });
	} else {
		next();
	}
}

module.exports = router;
