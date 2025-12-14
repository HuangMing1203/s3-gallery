import axios from 'axios'

class RequestError extends Error {
  constructor(response) {
    if (response instanceof Error) {
      super(`Request error: ${response.message}`)
      this.name = 'RequestError'
      return
    }
    super(`Request failure: HTTP ${response.status} ${response.statusText}`)
    this.name = 'RequestError'
    this.status = response.status
    this.statusText = response.statusText
  }
}

const ok = (res) => res.status >= 200 && res.status < 300

// const defaultOptions = { method: 'get', mode: 'no-cors' } // fetch
const defaultOptions = { method: 'get', responseType: 'blob' } // axios
const fetch = axios

const request = (url, options) =>
  fetch(url, { ...defaultOptions, ...options })
    .catch((err) => Promise.reject(new RequestError(err)))
    .then((res) =>
      ok(res) ? Promise.resolve(res) : Promise.reject(new RequestError(res)),
    )
    // .then((res) => res.blob()) // fetch
    .then((res) => res.data) // axios

export default request
