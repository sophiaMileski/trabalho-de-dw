const express = require('express');
const genresService = require('../services/genres.service');

const router = express.Router();

// GET /api/genres
router.get('/genres', (_req, res) => {
	res.json(genresService.getAll());
});

// POST /api/genres
router.post('/genres', (req, res, next) => {
	try {
		const genre = genresService.create({ name: req.body?.name });
		res.status(201).json(genre);
	} catch (err) {
		next(err);
	}
});

// DELETE /api/genres/:id
router.delete('/genres/:id', (req, res, next) => {
	try {
		const deleted = genresService.delete(req.params.id);
		res.json(deleted);
	} catch (err) {
		next(err);
	}
});

module.exports = router;


