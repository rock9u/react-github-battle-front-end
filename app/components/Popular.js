import React from 'react'
import propTypes from 'prop-types'
import { fetchPopularRepos } from '../utils/api'

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

export default class Popular extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      selectedLanguage: 'All',
      repos: null,
      error: null
    }

    this.handleUpdateLanguage = this.handleUpdateLanguage.bind(this)
    this.isLoading = this.isLoading.bind(this)
  }

  componentDidMount () {
    this.handleUpdateLanguage(this.state.handleUpdateLanguage)
  }

  handleUpdateLanguage (selectedLanguage) {
    this.setState({
      selectedLanguage,
      repos: null,
      error: null
    })
    fetchPopularRepos(selectedLanguage)
      .then(repos => this.setState({
        selectedLanguage,
        repos,
        error: null
      }))
      .catch(error => {
        console.warn('Error fetching repos: ', error)
        this.setState({
          error: 'Error fetching repos!'
        })
      })
  }

  isLoading () {
    return this.state.repos === null && this.state.error === null
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
        {repos && <pre>{JSON.stringify(repos, null, 2)}</pre>}
      </>
    )
  }
}
