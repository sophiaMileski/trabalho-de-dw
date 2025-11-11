import { useEffect, useState } from 'react'
import './App.css'

const API_BASE = 'http://localhost:3001/api'

function App() {
  const [genres, setGenres] = useState([])
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [newGenre, setNewGenre] = useState('')
  const [newMovieTitle, setNewMovieTitle] = useState('')
  const [newMovieType, setNewMovieType] = useState('movie')
  const [newMovieGenres, setNewMovieGenres] = useState([])

  const [filterGenre, setFilterGenre] = useState('')
  const [showAddGenre, setShowAddGenre] = useState(false)
  const [showAddMovie, setShowAddMovie] = useState(false)

  async function fetchGenres() {
    const res = await fetch(`${API_BASE}/genres`)
    if (!res.ok) throw new Error('Falha ao carregar gêneros')
    return res.json()
  }

  async function fetchMovies(genre) {
    const url = genre ? `${API_BASE}/movies?genre=${encodeURIComponent(genre)}` : `${API_BASE}/movies`
    const res = await fetch(url)
    if (!res.ok) throw new Error('Falha ao carregar filmes/séries')
    return res.json()
  }

  async function loadAll() {
    try {
      setLoading(true)
      setError('')
      const [g, m] = await Promise.all([fetchGenres(), fetchMovies(filterGenre || undefined)])
      setGenres(g)
      setMovies(m)
    } catch (e) {
      setError(e.message || 'Erro inesperado')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterGenre])

  async function createGenre(e) {
    e.preventDefault()
    if (!newGenre.trim()) return
    try {
      setError('')
      const res = await fetch(`${API_BASE}/genres`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newGenre.trim() }),
      })
      if (!res.ok) throw new Error('Não foi possível criar o gênero')
      setNewGenre('')
      setShowAddGenre(false)
      await loadAll()
    } catch (e) {
      setError(e.message || 'Erro ao criar gênero')
    }
  }

  async function deleteGenre(id) {
    if (!confirm('Tem certeza que deseja excluir este gênero?')) return
    try {
      setError('')
      const res = await fetch(`${API_BASE}/genres/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Não foi possível deletar o gênero')
      await loadAll()
    } catch (e) {
      setError(e.message || 'Erro ao deletar gênero')
    }
  }

  async function createMovie(e) {
    e.preventDefault()
    if (!newMovieTitle.trim()) return
    try {
      setError('')
      const res = await fetch(`${API_BASE}/movies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newMovieTitle.trim(), type: newMovieType, genreIds: newMovieGenres }),
      })
      if (!res.ok) throw new Error('Não foi possível criar o título')
      setNewMovieTitle('')
      setNewMovieType('movie')
      setNewMovieGenres([])
      setShowAddMovie(false)
      await loadAll()
    } catch (e) {
      setError(e.message || 'Erro ao criar título')
    }
  }

  async function deleteMovie(id) {
    if (!confirm('Tem certeza que deseja excluir este título?')) return
    try {
      setError('')
      const res = await fetch(`${API_BASE}/movies/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Não foi possível deletar')
      await loadAll()
    } catch (e) {
      setError(e.message || 'Erro ao deletar')
    }
  }

  function toggleGenreSelection(id) {
    setNewMovieGenres((prev) => (prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]))
  }

  function getGenreNames(genreIds) {
    return genreIds.map(id => {
      const genre = genres.find(g => g.id === id)
      return genre ? genre.name : ''
    }).filter(Boolean)
  }

  function getMovieIcon(type) {
    return type === 'movie' ? '🎬' : '📺'
  }

  return (
    <div className="aplicacao">
      <header className="cabecalho">
        <h1>MovieList</h1>
      </header>

      <div className="container">
        {error && <div className="erro">{error}</div>}

        {/* Filtro por Gênero */}
        <div className="secao-filtro">
          <label htmlFor="genre-filter">Filtrar por Gênero:</label>
          <select
            id="genre-filter"
            className="selecao-filtro"
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value)}
          >
            <option value="">Todos os Títulos</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        {/* Gêneros */}
        <section className="secao">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 className="titulo-secao">Gêneros</h2>
            <button
              className="botao-enviar"
              style={{ width: 'auto', padding: '10px 20px' }}
              onClick={() => setShowAddGenre(!showAddGenre)}
            >
              {showAddGenre ? 'Cancelar' : '+ Adicionar Gênero'}
            </button>
          </div>

          {showAddGenre && (
            <form onSubmit={createGenre} className="secao-formulario">
              <div className="grupo-formulario">
                <label htmlFor="new-genre">Nome do Gênero</label>
                <input
                  id="new-genre"
                  type="text"
                  className="entrada-formulario"
                  placeholder="Ex: Ação, Drama, Comédia..."
                  value={newGenre}
                  onChange={(e) => setNewGenre(e.target.value)}
                />
              </div>
              <button type="submit" className="botao-enviar">
                Criar Gênero
              </button>
            </form>
          )}

          <div className="secao-generos">
            {genres.map((g) => (
              <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="etiqueta-genero">{g.name}</span>
                <button
                  className="etiqueta-genero excluir"
                  onClick={() => deleteGenre(g.id)}
                >
                  ✕
                </button>
              </div>
            ))}
            {!loading && genres.length === 0 && (
              <div className="vazio">Nenhum gênero cadastrado. Adicione um novo gênero acima.</div>
            )}
          </div>
        </section>

        {/* Filmes e Séries */}
        <section className="secao">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 className="titulo-secao">
              {filterGenre
                ? `Títulos - ${genres.find((g) => g.id === filterGenre)?.name || ''}`
                : 'Todos os Títulos'}
            </h2>
            <button
              className="botao-enviar"
              style={{ width: 'auto', padding: '10px 20px' }}
              onClick={() => setShowAddMovie(!showAddMovie)}
            >
              {showAddMovie ? 'Cancelar' : '+ Adicionar Título'}
            </button>
          </div>

          {showAddMovie && (
            <form onSubmit={createMovie} className="secao-formulario">
              <div className="grupo-formulario">
                <label htmlFor="movie-title">Título</label>
                <input
                  id="movie-title"
                  type="text"
                  className="entrada-formulario"
                  placeholder="Ex: Matrix, Breaking Bad..."
                  value={newMovieTitle}
                  onChange={(e) => setNewMovieTitle(e.target.value)}
                />
              </div>

              <div className="grupo-formulario">
                <label htmlFor="movie-type">Tipo</label>
                <select
                  id="movie-type"
                  className="selecao-formulario"
                  value={newMovieType}
                  onChange={(e) => setNewMovieType(e.target.value)}
                >
                  <option value="movie">Filme</option>
                  <option value="series">Série</option>
                </select>
              </div>

              <div className="grupo-formulario">
                <label>Gêneros</label>
                <div className="grupo-checkbox">
                  {genres.map((g) => (
                    <label key={g.id} className="item-checkbox">
                      <input
                        type="checkbox"
                        checked={newMovieGenres.includes(g.id)}
                        onChange={() => toggleGenreSelection(g.id)}
                      />
                      <span>{g.name}</span>
                    </label>
                  ))}
                </div>
                {genres.length === 0 && (
                  <p style={{ color: '#b3b3b3', fontSize: '0.9rem', marginTop: '8px' }}>
                    Crie gêneros primeiro para associá-los ao título.
                  </p>
                )}
              </div>

              <button type="submit" className="botao-enviar" disabled={!newMovieTitle.trim()}>
                Adicionar Título
              </button>
            </form>
          )}

          {loading ? (
            <div className="carregando">Carregando...</div>
          ) : movies.length === 0 ? (
            <div className="vazio">
              {filterGenre ? 'Nenhum título encontrado para este gênero.' : 'Nenhum título cadastrado. Adicione um novo título acima.'}
            </div>
          ) : (
            <div className="grade-filmes">
              {movies.map((m) => (
                <div key={m.id} className="cartao-filme">
                  <div className="cartao-filme-poster">
                    {getMovieIcon(m.type)}
                  </div>
                  <div className="cartao-filme-info">
                    <div>
                      <div className="cartao-filme-titulo">{m.title}</div>
                      <div className="cartao-filme-tipo">{m.type === 'movie' ? 'Filme' : 'Série'}</div>
                      {m.genres && m.genres.length > 0 && (
                        <div className="cartao-filme-generos">
                          {getGenreNames(m.genreIds || []).map((name, idx) => (
                            <span key={idx} className="cartao-filme-genero">
                              {name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="cartao-filme-acoes">
                    <button className="botao-excluir" onClick={() => deleteMovie(m.id)}>
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default App
