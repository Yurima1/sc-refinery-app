import { useEffect, useReducer } from "preact/hooks"

export const dispatchEvent = (element, eventName, eventDetails) => {
  element.dispatchEvent(new CustomEvent(eventName, {
    detail: eventDetails,
    bubbles: true,
    cancelable: true
  }))
}

export const debounceEffect = (fun, deps, time=250) =>
  useEffect(() => {
    const timeoutId = setTimeout(fun, time)
    return () => clearTimeout(timeoutId)
  }, deps)

export const stopEvent = (fn) => (ev) => {
  ev.stopPropagation()
  ev.preventDefault()
  fn(ev)
}

export const compose = (g, f) => (...x) => g(f(...x))

export const identity = (x) => x

const sideEffect = (dispatch) => (action) => { dispatch(action); return action }

export const combineReducers = (reducers) =>
  Object.keys(reducers)
  .map(key =>
    [key, ...useReducer(...reducers[key])]
  )
  .reduce((agg, [key, state, dispatch]) => {
      agg[0][key] = state
      agg[1] = compose(agg[1], sideEffect(dispatch))
      return agg
    }
  , [{}, identity])


/**
 * @param {object} handlers
 * @param {function} handlers.*
 * @returns {function}
 */
const mapHandlers = (handlers) => (state, { type, ...data }) => {
  const handler = handlers[type]
  if (handler === undefined) return state
  return handler(state, data)
}

/**
 * Create a dispatch object with methods for each key in handlers.
 * each dispatch object method will call dispatch like
 * ``dispatch({ type: key, ...data })``
 */
export const actionDispatch = (handlers, [state, dispatch]) =>
  [ state, Object.keys(handlers).reduce((agg, key) => {
    agg[key] = (eventData) => dispatch({ type: key, ...eventData })
    return agg
  }, {}) ]

export const useActionReducer = (handlers, initial) =>
  actionDispatch(handlers, useReducer(mapHandlers(handlers), initial))

export const usvEncode = (params) =>
  Object.keys(params).reduce((usv, key) => {
    usv.append(key, params[key])
    return usv
  }, new URLSearchParams())


export const setCookie = (name, value, options = {}) => {
  options = {
    [name]: value,
    path: '/',
    ...options
  }
  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString()
  }
  const cookieValue = Object.keys(options).map(key =>
    `${key}=${options[key]}`
  ).join("; ")
  document.cookie = cookieValue
}


export const getCookie = (name) => {
  let matches = document.cookie.match(new RegExp(
    // eslint-disable-next-line no-useless-escape
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : null;
}


/**
 * Take object with keys being column names and values being "asc" or "desc"
 * and create a string where keys and values are separated by ":" with each
 * key/value pair separated by ";".
 *
 * Example:
 *
 *   sortableToQuery({"name": "asc", "age": "desc"}) => "name:asc;age:desc"
 */
export const sortableToQuery = (value) =>
  Object.keys(value)
    .filter(key => value[key] !== null)
    .map(key => `${key}:${value[key] ? "asc" : "desc"}`)
    .join(";")

/**
 * Take object with names and values and create a string where keys and values
 * are separated by ":" with each key/value pair separated by ";".
 *
 * Example:
 *
 *   filterableToQuery({"name": "Albert", "age": "25"}) => "name:Albert;age:25"
 */
export const filterableToQuery = (value) =>
  Object.keys(value)
    .filter((key) => value[key] !== null && value[key] !== undefined)
    .map((key) => `${key}:${value[key]}`)
    .join(";")


/**
 * Take optional string and return with postfix appended if not empty.
 */
export const postfix = (str, postfix) => (str ? `${str}${postfix}` : "")

/**
 * Take seconds and return in format "(days)d (hours)h (minutes)m (seconds)s"
 *
 * Example:
 *  formatDuration(3600) => "1h 0m 0s"
 */
export const formatDuration = (value) => {
  const days = Math.floor(value / (3600 * 24))
  const hours = Math.floor((value % (3600 * 24)) / 3600)
  const minutes = Math.floor((value % 3600) / 60)
  const seconds = Math.floor(value % 60)

  return `${postfix(days, "d ")}${postfix(hours, "h ")}${postfix(minutes, "m ")}${postfix(seconds, "s")}`
}

/**
 * Parse string in format "(days)d (hours)h (minutes)m (seconds)s" into seconds
 * using regular expression.
 */
export const parseDuration = (value) => {
  const regex = /(\d+d)?\s*(\d+h)?\s*(\d+m)?\s*(\d+s)?/i
  const match = regex.exec(value)
  if (!match) return 0
  const [, days, hours, minutes, seconds] = match
  return (parseInt(days, 10) || 0) * 3600 * 24 +
    (parseInt(hours, 10) || 0) * 3600 +
    (parseInt(minutes, 10) || 0) * 60 +
    (parseInt(seconds, 10) || 0)
}
