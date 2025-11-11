const { v4: uuidv4 } = require('uuid');

class GenresService {
	constructor() {
		/** @type {{ id: string, name: string }[]} */
		this.genres = [];
	}

	getAll() {
		return this.genres;
	}

	create({ name }) {
		if (!name || typeof name !== 'string' || !name.trim()) {
			const error = new Error('Genre name is required');
			error.status = 400;
			throw error;
		}
		const exists = this.genres.some((g) => g.name.toLowerCase() === name.trim().toLowerCase());
		if (exists) {
			const error = new Error('Genre already exists');
			error.status = 409;
			throw error;
		}
		const genre = { id: uuidv4(), name: name.trim() };
		this.genres.push(genre);
		return genre;
	}

	getById(id) {
		return this.genres.find((g) => g.id === id);
	}

	getByName(name) {
		if (!name) return undefined;
		return this.genres.find((g) => g.name.toLowerCase() === String(name).toLowerCase());
	}

	delete(id) {
		const index = this.genres.findIndex((g) => g.id === id);
		if (index === -1) {
			const error = new Error('Genre not found');
			error.status = 404;
			throw error;
		}
		return this.genres.splice(index, 1)[0];
	}
}

module.exports = new GenresService();


