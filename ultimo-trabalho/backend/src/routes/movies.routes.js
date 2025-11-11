const express = require('express');
const moviesService = require('../services/movies.service');

const router = express.Router();

// GET /api/movies?genre=Acao
router.get('/movies', (req, res) => {
	const { genre } = req.query;
	const items = moviesService.getAll({ genre });
	res.json(items);
});

// POST /api/movies
// body: { title, type: 'movie'|'series', genreIds: string[] }
router.post('/movies', (req, res, next) => {
	try {
		const { title, type, genreIds } = req.body || {};
		const created = moviesService.create({ title, type, genreIds });
		res.status(201).json(created);
	} catch (err) {
		next(err);
	}
});

// DELETE /api/movies/:id
router.delete('/movies/:id', (req, res, next) => {
	try {
		const deleted = moviesService.delete(req.params.id);
		res.json(deleted);
	} catch (err) {
		next(err);
	}
});

module.exports = router;


