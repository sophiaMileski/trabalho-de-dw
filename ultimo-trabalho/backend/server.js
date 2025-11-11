const express = require('express');
const cors = require('cors');
const teamsRouter = require('./src/routes/teams.routes');
const genresRouter = require('./src/routes/genres.routes');
const moviesRouter = require('./src/routes/movies.routes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
	res.json({ status: 'ok' });
});

app.use('/api', teamsRouter);
app.use('/api', genresRouter);
app.use('/api', moviesRouter);

app.use((err, _req, res, _next) => {
	console.error(err);
	res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
	console.log(`Backend listening on http://localhost:${PORT}`);
});