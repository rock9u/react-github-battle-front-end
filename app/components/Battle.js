import React from 'react'
import PropTypes from 'prop-types'
import { FaUserFriends, FaFighterJet, FaTrophy, FaTimesCircle } from 'react-icons/fa'
import Results from './Results'
import { ThemeConsumer } from '../contexts/theme'

function Instructions () {
  return (
    <ThemeConsumer>
      {({ theme }) => (
        <div className='instructions-container'>
          <h1 className='center-text header-lg'>
        Instructions
          </h1>
          <ol className='container-sm grid center-text battle-instructions'>
            <li>
              <h3 className='header-sm'>Enter two Github Users</h3>
              <FaUserFriends className={`bg-${theme}`} color='rgb(255,191,116)' size={140} />
            </li>
            <li>
              <h3 className='header-sm'>Battle</h3>
              <FaFighterJet className={`bg-${theme}`} color='#727272' size={140} />
            </li>
            <li>
              <h3 className='header-sm'>See the winners</h3>
              <FaTrophy className={`bg-${theme}`} color='rgb(255,215,0)' size={140} />
            </li>
          </ol>
        </div>
      )}
    </ThemeConsumer>
  )
}

class PlayerInput extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      username: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit (event) {
    event.preventDefault()
    this.props.onSubmit(this.state.username)
  }

  handleChange (event) {
    this.setState({ username: event.target.value })
  }

  render () {
    return (
      <ThemeConsumer>
        {({ theme }) => (
          <form onSubmit={this.handleSubmit} className='column player'>
            <label
              htmlFor='username'
              className='player-label'
            >
              {this.props.label}
            </label>
            <div className='row player-inputs'>
              <input
                type='text'
                id='username'
                className={`input-${theme}`}
                placeholder='github username'
                autoComplete='off'
                value={this.state.username}
                onChange={this.handleChange}
              />
              <button
                className={`btn ${theme === 'dark' ? 'light-btn' : 'dark-btn'}`}
                type='submit'
                disabled={!this.state.username}
              >
            Submit
              </button>
            </div>

          </form>
        )}
      </ThemeConsumer>
    )
  }
}

PlayerInput.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired
}

function PlayerPreview ({ username, onReset, label }) {
  return (
    <ThemeConsumer>
      {({ theme }) => (
        <div className='column player'>
          <h3 className='player-label'>{label}</h3>
          <div className={`row bg-${theme}`}>
            <div className='player-info'>
              <img
                className='avatar-small'
                src={`https://github.com/${username}.png?size=200`}
                alt={`Avatar for ${username}`}
              />
              <a
                href={`https://github.com/${username}`}
                className='link'
              >
                {username}
              </a>
            </div>
            <button className='btn-clear flex-center' onClick={onReset}>
              <FaTimesCircle color='rgb(194, 57, 42)' size={26} />
            </button>
          </div>
        </div>

      )}
    </ThemeConsumer>
  )
}

PlayerPreview.propTypes = {
  username: PropTypes.string.isRequired,
  onReset: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired
}

export default class Battle extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      player1: null,
      player2: null,
      battle: false
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleReset = this.handleReset.bind(this)
  }

  handleSubmit (id, player) {
    this.setState({
      [id]: player
    })
  }

  handleReset (id) {
    this.setState({
      [id]: null
    })
  }

  render () {
    const { player1, player2, battle } = this.state
    if (battle) {
      return <Results
        player1={player1}
        player2={player2}
        onReset={() => this.setState({
          player1: null,
          player2: null,
          battle: false
        })}
      />
    }
    return (
      <>
        <Instructions />

        <div className='players-container'>

          <h1 className='center-text header-lg'>Players</h1>
          <div className='row space-around'>
            {player1 === null
              ? <PlayerInput
                label='Player1'
                onSubmit={(player) => this.handleSubmit('player1', player)}
                />
              : <PlayerPreview
                username={player1}
                onReset={() => this.handleReset('player1')}
                label='Player1'
                />}
            {player2 === null
              ? <PlayerInput
                label='Player2'
                onSubmit={(player) => this.handleSubmit('player2', player)}
                />
              : <PlayerPreview
                username={player2}
                onReset={() => this.handleReset('player2')}
                label='Player2'
                />}
          </div>

          {player1 && player2 && (
            <button
              className='btn dark-btn btn-space'
              onClick={() => this.setState({ battle: true })}
            >
              Battle
            </button>
          )}
        </div>

      </>
    )
  }
}
