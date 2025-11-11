const { v4: uuidv4 } = require('uuid');
const teamsService = require('./teams.service');

class MembersService {
	getMembersByTeam(teamId) {
		const team = teamsService.getTeamById(teamId);
		if (!team) {
			const error = new Error('Team not found');
			error.status = 404;
			throw error;
		}
		return team.members;
	}

	addMemberToTeam(teamId, { name, role }) {
		const team = teamsService.getTeamById(teamId);
		if (!team) {
			const error = new Error('Team not found');
			error.status = 404;
			throw error;
		}
		if (!name || typeof name !== 'string' || !name.trim()) {
			const error = new Error('Member name is required');
			error.status = 400;
			throw error;
		}
		const member = { id: uuidv4(), name: name.trim(), role: role?.trim() || undefined };
		team.members.push(member);
		return member;
	}
}

module.exports = new MembersService();


