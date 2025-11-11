const express = require('express');
const teamsService = require('../services/teams.service');
const membersService = require('../services/members.service');

const router = express.Router();

// GET /api/teams
router.get('/teams', (_req, res) => {
	const teams = teamsService.getAllTeams();
	res.json(teams);
});

// POST /api/teams
router.post('/teams', (req, res, next) => {
	try {
		const team = teamsService.createTeam({ name: req.body?.name });
		res.status(201).json(team);
	} catch (err) {
		next(err);
	}
});

// DELETE /api/teams/:id
router.delete('/teams/:id', (req, res, next) => {
	try {
		const removed = teamsService.deleteTeam(req.params.id);
		res.json(removed);
	} catch (err) {
		next(err);
	}
});

// GET /api/teams/:id/members
router.get('/teams/:id/members', (req, res, next) => {
	try {
		const members = membersService.getMembersByTeam(req.params.id);
		res.json(members);
	} catch (err) {
		next(err);
	}
});

// POST /api/teams/:id/members
router.post('/teams/:id/members', (req, res, next) => {
	try {
		const member = membersService.addMemberToTeam(req.params.id, {
			name: req.body?.name,
			role: req.body?.role,
		});
		res.status(201).json(member);
	} catch (err) {
		next(err);
	}
});

module.exports = router;


