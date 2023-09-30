import Cookies from 'universal-cookie'
import { api } from '../api'

const cookies = new Cookies()

export const basePath = '/app-management/user'

export function list(params) {
  return api({
    url: `${basePath}`,
    method: 'GET',
    params,
  })
}

export function add(data) {
  return api({
    url: `${basePath}`,
    method: 'POST',
    data,
  })
}

// export function detail(id) {
//   return api({
//     url: `${basePath}/${id}`,
//     method: 'GET',
//   })
// }

export function update(id, data) {
  return api({
    url: `${basePath}/${id}`,
    method: 'POST',
    data,
  })
}

export function deleteData(id) {
  return api({
    url: `${basePath}/${id}`,
    method: 'DELETE',
  })
}

export function getFile(id) {
  const accesstoken = cookies.get('accesstoken')

  const min = 1 // Minimum value
  const max = 100 // Maximum value
  const randomInt = Math.floor(Math.random() * (max - min + 1)) + min

  return `${process.env.REACT_APP_BACKEND_URL}/api${basePath}/get-photo/${id}?accesstoken=${accesstoken}&key=${randomInt}`
}

export function listRole(params) {
  return api({
    url: `${basePath}/role`,
    method: 'GET',
    params,
  })
}
