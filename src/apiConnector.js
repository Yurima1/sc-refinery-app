import constants from "./constants"


const trimEnd = (val, chars = "\n\t\r ") => {
  const regex = new RegExp(`[${chars}]+$`)
  return val.replace(regex, "")
}


const trimStart = (val, chars = "\n\t\r ") => {
  const regex = new RegExp(`^[${chars}]+`)
  return val.replace(regex, "")
}


const urlJoin = (base, ...append) => (
  [
    trimEnd(base, "/"),
    ...append.map(it => trimStart(it, "/"))
  ].join("/")
)


const logFailedRequest = value => {
  console.log("unhandled failed request", value)
}


class ApiRequest {
  constructor(method, baseUrl, headers = {}, options = {}, onRequestFailed=null) {
    this.body = null
    this.params = {
      mode: "cors",
      credentials: "include",
      method,
      baseUrl,
      url: null
    }
    this.headers = new Headers(headers)
    this.options = options
    this.onRequestFailed = onRequestFailed
  }

  param (prop, value) {
    if (value === undefined) return this.params[prop]
    this.params[prop] = value
    return this
  }

  method = (method) => this.param("method", method)

  url = (url) => this.param("url", url)

  baseUrl = (url) => this.param("baseUrl", url)

  header = (key, value) => {
    this.headers.set(key, value)
    return this
  }

  option = (key, value) => { this.options[key] = value; return this }

  json = (value) => {
    this.headers.set("Content-Type", "application/json")
    this.body = JSON.stringify(value)
    return this
  }

  makeRequest () {
    const { url, baseUrl, ...params } = this.params
    return new Request(
      urlJoin(baseUrl, url),
      {
        headers: this.headers,
        body: this.body,
        ...params,
        ...this.options
      }
    )
  }

  fetch = () => {
    const req = this.makeRequest()
    return fetch(req)
      .then(response =>
        (response.ok && response.status >= 200 && response.status < 400)
          ? Promise.resolve(new ApiRequestContext(response, this))
          : Promise.reject(new ApiRequestContext(response, this))
      )
      .catch(value => {
        this.onRequestFailed
          ? this.onRequestFailed(value)
          : logFailedRequest(value)
        return Promise.reject(value)
      })
  }
}


class ApiRequestContext {
  constructor(response, request) {
    this.request = request
    this.response = response
  }

  json = () =>
    this.response.json()
      .then(json => {
        this.json = json
        return Promise.resolve(this)
      })
}


export default class ApiConnector {
  constructor (defaultHeaders = {}, defaultOptions = {}, onRequestFailed=null) {
    this.defaultHeaders = new Headers(defaultHeaders)
    this.defaultOptions = defaultOptions
    this.onRequestFailed = onRequestFailed
  }

  setDefaultHeader (headerName, value) {
    this.defaultHeaders.set(headerName, value)
    return this
  }

  request = (method, baseUrl, url, options) => {
    const r = new ApiRequest(method, baseUrl,
      this.defaultHeaders, { ...this.defaultOptions, ...options },
      this.onRequestFailed)
    return r.url(url)
  }

  api = (method, url, options) =>
    this.request(method, constants.APIURL, url, options)
}
