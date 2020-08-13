import React from 'react'
import PropTypes from 'prop-types'
import {
  FaUserFriends,
  FaFighterJet,
  FaTrophy,
  FaTimesCircle,
} from 'react-icons/fa'
import Results from './Results'
import ThemeContext from '../contexts/theme'
import { Link } from 'react-router-dom'

function Instructions() {
  const theme = React.useContext(ThemeContext)
  return (
    <div className="instructions-container">
      <h1 className="center-text header-lg">Instructions</h1>
      <ol className="container-sm grid center-text battle-instructions">
        <li>
          <h3 className="header-sm">Enter two Github Users</h3>
          <FaUserFriends
            className={`bg-${theme}`}
            color="rgb(255,191,116)"
            size={140}
          />
        </li>
        <li>
          <h3 className="header-sm">Battle</h3>
          <FaFighterJet className={`bg-${theme}`} color="#727272" size={140} />
        </li>
        <li>
          <h3 className="header-sm">See the winners</h3>
          <FaTrophy
            className={`bg-${theme}`}
            color="rgb(255,215,0)"
            size={140}
          />
        </li>
      </ol>
    </div>
  )
}

const PlayerInput = ({ onSubmit, label }) => {
  const [username, setUsername] = React.useState('')
  const theme = React.useContext(ThemeContext)

  const handleSubmit = event => {
    event.preventDefault()
    onSubmit(username)
  }

  const handleChange = event => {
    setUsername(event.target.value)
  }

  return (
    <form onSubmit={handleSubmit} className="column player">
      <label htmlFor="username" className="player-label">
        {label}
      </label>
      <div className="row player-inputs">
        <input
          type="text"
          id="username"
          className={`input-${theme}`}
          placeholder="github username"
          autoComplete="off"
          value={username}
          onChange={handleChange}
        />
        <button
          className={`btn ${theme === 'dark' ? 'light-btn' : 'dark-btn'}`}
          type="submit"
          disabled={!username}>
          Submit
        </button>
      </div>
    </form>
  )
}

PlayerInput.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
}

function PlayerPreview({ username, onReset, label }) {
  const theme = React.useContext(ThemeContext)
  return (
    <div className="column player">
      <h3 className="player-label">{label}</h3>
      <div className={`row bg-${theme}`}>
        <div className="player-info">
          <img
            className="avatar-small"
            src={`https://github.com/${username}.png?size=200`}
            alt={`Avatar for ${username}`}
          />
          <a href={`https://github.com/${username}`} className="link">
            {username}
          </a>
        </div>
        <button className="btn-clear flex-center" onClick={onReset}>
          <FaTimesCircle color="rgb(194, 57, 42)" size={26} />
        </button>
      </div>
    </div>
  )
}

PlayerPreview.propTypes = {
  username: PropTypes.string.isRequired,
  onReset: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
}

export default () => {
  const [player1, setPlayer1] = React.useState(null)
  const [player2, setPlayer2] = React.useState(null)

  const handleSubmit = (id, player) => {
    id === 'player1' ? setPlayer1(player) : setPlayer2(player)
  }

  const handleReset = id => {
    setPlayer1(null)
    setPlayer2(null)
  }

  return (
    <>
      <Instructions />

      <div className="players-container">
        <h1 className="center-text header-lg">Players</h1>
        <div className="row space-around">
          {player1 === null ? (
            <PlayerInput
              label="Player1"
              onSubmit={player => handleSubmit('player1', player)}
            />
          ) : (
            <PlayerPreview
              username={player1}
              onReset={() => handleReset('player1')}
              label="Player1"
            />
          )}
          {player2 === null ? (
            <PlayerInput
              label="Player2"
              onSubmit={player => handleSubmit('player2', player)}
            />
          ) : (
            <PlayerPreview
              username={player2}
              onReset={() => handleReset('player2')}
              label="Player2"
            />
          )}
        </div>

        {player1 && player2 && (
          <Link
            className="btn dark-btn btn-space"
            to={{
              pathname: '/battle/results',
              search: `?player1=${player1}&player2=${player2}`,
            }}>
            Battle
          </Link>
        )}
      </div>
    </>
  )
}
