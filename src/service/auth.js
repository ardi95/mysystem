import { api } from './api'

export async function login(data) {
  return api({
    url: `/login`,
    method: 'POST',
    data,
  })
}

export function profile() {
  return api({
    url: `/detail-user`,
  })
}

export function update(data) {
  return api({
    url: `/detail-user`,
    method: 'POST',
    data
  })
}

export function changePassword(data) {
  return api({
    url: `/detail-user/change-password`,
    method: 'PATCH',
    data
  })
}

export function logout() {
  return api({
    url: `/logout`,
    method: 'POST',
  })
}

export function permissionByMenu(params) {
  return api({
    url: `/permission-by-menu`,
    method: 'GET',
    params
  })
}
