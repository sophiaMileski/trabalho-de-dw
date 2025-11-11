const { v4: uuidv4 } = require('uuid');

class TeamsService {
	constructor() {
		/** @type {{ id: string, name: string, members: { id: string, name: string, role?: string }[] }[]} */
		this.teams = [];
	}

	getAllTeams() {
		return this.teams;
	}

	createTeam({ name }) {
		if (!name || typeof name !== 'string' || !name.trim()) {
			const error = new Error('Team name is required');
			error.status = 400;
			throw error;
		}
		const team = { id: uuidv4(), name: name.trim(), members: [] };
		this.teams.push(team);
		return team;
	}

	getTeamById(teamId) {
		return this.teams.find((t) => t.id === teamId);
	}

	deleteTeam(teamId) {
		const index = this.teams.findIndex((t) => t.id === teamId);
		if (index === -1) {
			const error = new Error('Team not found');
			error.status = 404;
			throw error;
		}
		const [removed] = this.teams.splice(index, 1);
		return removed;
	}
}

module.exports = new TeamsService();


