const { v4: uuidv4 } = require('uuid');
const genresService = require('./genres.service');

class MoviesService {
	constructor() {
		/** @type {{ id: string, title: string, type: 'movie'|'series', genreIds: string[] }[]} */
		this.items = [];
	}

	/**
	 * Returns all movies/series, optionally filtered by genre (name or id).
	 */
	getAll({ genre } = {}) {
		if (!genre) return this.items;
		// support by name or id, case-insensitive for name
		const byId = this.items.filter((m) => m.genreIds.includes(String(genre)));
		if (byId.length > 0) return byId;
		const genreByName = genresService.getByName(String(genre));
		if (!genreByName) return [];
		return this.items.filter((m) => m.genreIds.includes(genreByName.id));
	}

	create({ title, type = 'movie', genreIds = [] }) {
		if (!title || typeof title !== 'string' || !title.trim()) {
			const error = new Error('Title is required');
			error.status = 400;
			throw error;
		}
		const normalizedType = String(type).toLowerCase();
		if (!['movie', 'series'].includes(normalizedType)) {
			const error = new Error("Type must be 'movie' or 'series'");
			error.status = 400;
			throw error;
		}
		if (!Array.isArray(genreIds)) {
			const error = new Error('genreIds must be an array');
			error.status = 400;
			throw error;
		}
		// validate genres exist
		for (const gid of genreIds) {
			if (!genresService.getById(gid)) {
				const error = new Error(`Genre not found: ${gid}`);
				error.status = 400;
				throw error;
			}
		}
		const item = {
			id: uuidv4(),
			title: title.trim(),
			type: normalizedType,
			genreIds: [...new Set(genreIds)],
		};
		this.items.push(item);
		return item;
	}

	delete(id) {
		const index = this.items.findIndex((m) => m.id === id);
		if (index === -1) {
			const error = new Error('Movie not found');
			error.status = 404;
			throw error;
		}
		return this.items.splice(index, 1)[0];
	}
}

module.exports = new MoviesService();


