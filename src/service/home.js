import { api } from './api'

const basePath = '/home'

export async function home(method = 'GET', params = null) {
  return api({
    url: `${basePath}`,
    method,
    params,
  })
}
