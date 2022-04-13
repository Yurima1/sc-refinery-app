import { createContext } from 'preact'
import { useContext, useEffect } from 'preact/hooks'
import { Router } from 'preact-router'

import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
dayjs.extend(relativeTime)
import duration from "dayjs/plugin/duration"
dayjs.extend(duration)

import constants from "../constants"
import { ModalLayer, handleModalActions } from "./modalLayer"
import Navbar from "./navbar"
import Admin from '../routes/admin';
import ApiConnector from "../apiConnector"
import { combineReducers, setCookie, getCookie } from "../util"
import { LoginForm } from "./loginForm"
import { Notifications } from "./notifications"


const authFailed = ({ response }) => {
  return response.status === 401 || response.status === 403
}

const handleAppActions = (state, action) => {
  switch (action.type) {
    case "setIsReady":
      return { ...state, isReady: action.isReady }

    case "requestFailed": {
      const { notifications } = state
      return {
        ...state,
        notifications: [
          ...notifications,
          {
            status: action.response.status,
            statusText: action.response.statusText,
            body: action.body,
            created: dayjs()
          }
        ]
      }
    }

    case "scopesAvailable":
      return { ...state, scopes: action.scopes }

    case "setCurrentScope":
      return { ...state, currentScope: action.scope }

    case "notificationsToggle": {
      const { notificationsShow } = state
      return { ...state, notificationsShow: !notificationsShow }
    }

    default: return state
  }
}


const handleLoginActions = (state, action) => {
  switch (action.type) {
    case "logout":
      setCookie("u", "", { samesite: "strict", "max-age": -1 })
      setCookie("s", "", { samesite: "strict", "max-age": -1 })
      return { ...state, user: null, credentials: null, status: null }

    case "loginCredentialsReady":
      return { ...state, user: null, credentials: action.credentials, status: "pending" }

    case "loginSuccess":
      return { ...state, user: action.user, credentials: null, status: "success" }

    case "loginFailed":
      setCookie("u", "", { samesite: "strict", "max-age": -1 })
      setCookie("s", "", { samesite: "strict", "max-age": -1 })
      return { ...state, user: null, credentials: null, status: "failed" }

    default: return state
  }
}


const checkTokenCookie = (apiConnector, stateUser, dispatch) => {
  if (stateUser) return
  const user_session = getCookie("s")
  const user_id = getCookie("u")
  console.log(`user_id: ${user_id}, user_session: ${user_session}`)
  if (user_session === null || user_id === null)
    return

  apiConnector
    .api("POST", "/login_session")
    .fetch()
    .then(result => result.json())
    .then(result => {
      dispatch({ type: "loginSuccess", user: result.json })
    })
    .catch(() => {
      dispatch({ type: "loginFailed" })
    })
}


const fetchLogin = (apiConnector, state, dispatch) =>
  useEffect(() => {
    if (!state.login.credentials) return;
    apiConnector
      .api("POST", "/login")
      .json(state.login.credentials)
      .fetch()
      .then(result => result.json())
      .then(result => {
        dispatch({ type: "loginSuccess", user: result.json })
        dispatch({ type: "resetModal" })
      })
      .catch(result => {
        if (authFailed(result)) {
          dispatch({type: "loginFailed"})
          return
        }
        return Promise.reject(result)
      })
  }, [ state.login.credentials ])

const AppContext = createContext({})
export const useAppContext = () => useContext(AppContext)

const App = () => {
  const [ state, dispatch ] = combineReducers({
    app: [ handleAppActions, {
      isReady: false,
      scopes: [],
      currentScope: null,
      notifications: []
    } ],
    login: [ handleLoginActions, {
      user: null,
      credentials: null,
      status: null
    } ],
    modal: [ handleModalActions, {
      show: null
    } ]
  })
  const apiConnector = new ApiConnector()
  apiConnector.onRequestFailed = (result) => {
    return result.response.text().then(body => {
      dispatch({
        type: "requestFailed", ...result, body
      })
    })
  }

  checkTokenCookie(apiConnector, state.login.user, dispatch)
  fetchLogin(apiConnector, state, dispatch)

  return (
    <AppContext.Provider value={{...state, dispatch, apiConnector}}>
    <main class="d-flex vh-100 align-items-stretch flex-column">
      <Navbar />
      {state.login.status === "success" ? (
        <Router>
          <div path={`${constants.BASEURL}/`}>HOME</div>
          <Admin
              path={`${constants.BASEURL}/admin/:rest*`}
          />
        </Router>
      ) : (
        <div class="d-flex flex-grow-1 align-content-center justify-content-center flex-column">
          <div class="flex-grow-0 m-auto">
            <h1 class="mb-4">Login required</h1>
            <LoginForm
              onCredentialsReady={(credentials) =>
                dispatch({
                  type: "loginCredentialsReady",
                  credentials,
                })
              }
            />
          </div>
        </div>
      )}
      <ModalLayer {...state.modal} />
      <Notifications
        showAll={state.app.notificationsShow}
        items={state.app.notifications}
      />
      </main>
    </AppContext.Provider>
  )
}

export default App
