import axios from 'axios'

export let BASE_URL = 'https://laughing-umbrella-6x6w96gpjx9c6w4-8080.app.github.dev/'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
})

export function setBaseUrl(url: string) {
  BASE_URL = url
  api.defaults.baseURL = url
}

export default api
