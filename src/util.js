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


export const sortableToQuery = (value) =>
  Object.keys(value)
    .filter(key => value[key] !== null)
    .map(key => `${key}:${value[key] ? "asc" : "desc"}`)
    .join(";")


export const filterableToQuery = (value) =>
  Object.keys(value)
    .filter((key) => value[key] !== null && value[key] !== undefined)
    .map((key) => `${key}:${value[key]}`)
    .join(";")
