import React from 'react'
import propTypes from 'prop-types'
import { fetchPopularRepos } from '../utils/api'
import { FaUser, FaStar, FaCodeBranch, FaExclamationTriangle } from 'react-icons/fa'

function LanguageNav ({ selected, onUpdateLanguage }) {
  const languages = ['All', 'JavaScript', 'Ruby', 'Java', 'CSS', 'Python']
  return (
    <ul className='flex-center'>
      {languages.map((language) => {
        return (
          <li key={language}>
            <button
              className='btn-clear nav-link'
              style={language === selected ? { color: 'paleVioletRed' } : null}
              onClick={() => onUpdateLanguage(language)}
            >
              {language}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

LanguageNav.propTypes = {
  selected: propTypes.string.isRequired,
  onUpdateLanguage: propTypes.func.isRequired
}

function ReposGrid ({ repos }) {
  return (
    <ul className='grid space-around'>
      {repos.map((repo, index) => {
        const { name, owner, html_url, stargazers_count, forks, open_issues } = repo
        const { login, avatar_url } = owner

        return (
          <li key={html_url} className='repo bg-light'>
            <h4 className='header-lg center-text'>
              #{index + 1}
            </h4>
            <img
              className='avatar'
              src={avatar_url}
              alt={`Avatar for ${login}`}
            />
            <h2 className='center-text'>
              <a className='link' href={html_url}>{login}</a>
            </h2>
            <ul className='card-list'>
              <li>
                <FaUser color='orange' size={22} />
                <a href={`https://github.com/${login}`}>
                  {login}
                </a>
              </li>
              <li>
                <FaStar color='gold' size={22} />
                {stargazers_count.toLocaleString()} stars
              </li>
              <li>
                <FaCodeBranch color='LightSkyBlue' size={22} />
                {forks.toLocaleString()} forks
              </li>
              <li>
                <FaExclamationTriangle color='indianRed' size={22} />
                {open_issues.toLocaleString()} open issues
              </li>
            </ul>
          </li>
        )
      })}
    </ul>
  )
}

export default class Popular extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      selectedLanguage: 'All',
      repos: {},
      error: null
    }

    this.handleUpdateLanguage = this.handleUpdateLanguage.bind(this)
    this.isLoading = this.isLoading.bind(this)
  }

  componentDidMount () {
    this.handleUpdateLanguage(this.state.selectedLanguage)
  }

  handleUpdateLanguage (selectedLanguage) {
    this.setState({
      selectedLanguage,
      error: null
    })

    if (!this.state.repos[selectedLanguage]) {
      fetchPopularRepos(selectedLanguage)
        .then(data => {
          this.setState(({ repos }) => ({
            repos: {
              ...repos,
              [selectedLanguage]: data
            }
          }))
        }
        )
        .catch(error => {
          console.warn('Error fetching repos: ', error)
          this.setState({
            error: 'Error fetching repos!'
          })
        })
    }
  }

  isLoading () {
    const { selectedLanguage, repos, error } = this.state

    return !repos[selectedLanguage] === null && error === null
  }

  render () {
    const { selectedLanguage, repos, error } = this.state
    return (
      <>
        <LanguageNav
          selected={selectedLanguage}
          onUpdateLanguage={this.handleUpdateLanguage}
        />
        {error && <p>Error⛔️</p>}
        {this.isLoading() && <p>Loading😃</p>}
        {repos[selectedLanguage] && <ReposGrid repos={repos[selectedLanguage]} />}
      </>
    )
  }
}
