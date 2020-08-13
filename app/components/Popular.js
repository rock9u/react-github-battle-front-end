import React, { useEffect } from 'react'
import propTypes from 'prop-types'
import { fetchPopularRepos } from '../utils/api'
import Card from './Card'
import {
  FaUser,
  FaStar,
  FaCodeBranch,
  FaExclamationTriangle,
} from 'react-icons/fa'
import Loading from './Loading'
import Tooltip from './Tooltip'

function LanguageNav({ selected, onUpdateLanguage }) {
  const languages = ['All', 'JavaScript', 'Ruby', 'Java', 'CSS', 'Python']
  return (
    <ul className="flex-center">
      {languages.map(language => {
        return (
          <li key={language}>
            <button
              className="btn-clear nav-link"
              style={language === selected ? { color: 'paleVioletRed' } : null}
              onClick={() => onUpdateLanguage(language)}>
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
  onUpdateLanguage: propTypes.func.isRequired,
}

function ReposGrid({ repos }) {
  return (
    <ul className="grid space-around">
      {repos.map((repo, index) => {
        const {
          name,
          owner,
          html_url,
          stargazers_count,
          forks,
          open_issues,
        } = repo
        const { login, avatar_url } = owner

        return (
          <li key={html_url}>
            <Card
              header={`#${index + 1}`}
              avatar={avatar_url}
              href={html_url}
              name={login}>
              <ul className="card-list">
                <li>
                  <Tooltip text="Github username">
                    <FaUser color="rgb(255, 191, 116)" size={22} />
                    <a href={`https://github.com/${login}`}>{login}</a>
                  </Tooltip>
                </li>
                <li>
                  <FaStar color="gold" size={22} />
                  {stargazers_count.toLocaleString()} stars
                </li>
                <li>
                  <FaCodeBranch color="LightSkyBlue" size={22} />
                  {forks.toLocaleString()} forks
                </li>
                <li>
                  <FaExclamationTriangle color="indianRed" size={22} />
                  {open_issues.toLocaleString()} open issues
                </li>
              </ul>
            </Card>
          </li>
        )
      })}
    </ul>
  )
}

const popularReducer = (state, action) => {
  if (action.type === 'success') {
    return {
      ...state,
      [action.selectedLanguage]: action.repos,
      error: null,
    }
  } else if (action.type === 'error') {
    return {
      ...state,
      error: action.error.message,
    }
  } else {
    throw new Error(`That action type isn't supported.`)
  }
}

export default function Popular() {
  const [selectedLanguage, setSelectedLanguage] = React.useState('All')
  const [state, dispatch] = React.useReducer(popularReducer, { error: null })

  React.useEffect(() => {
    if (!state[selectedLanguage]) {
      fetchPopularRepos(selectedLanguage)
        .then(data => {
          dispatch({ type: 'success', selectedLanguage, repos: data })
        })
        .catch(error => {
          dispatch({
            type: 'error',
            error,
          })
        })
    } else {
      console.log('api is not called')
    }
  }, [selectedLanguage])

  const isLoading = () => {
    return !state[selectedLanguage] && state.error === null
  }

  return (
    <>
      <LanguageNav
        selected={selectedLanguage}
        onUpdateLanguage={setSelectedLanguage}
      />
      {state.error && <p className="center-text error">{state.error}⛔️</p>}
      {isLoading() && <Loading text="Fetching Repo😃" />}
      {state[selectedLanguage] && <ReposGrid repos={state[selectedLanguage]} />}
    </>
  )
}
