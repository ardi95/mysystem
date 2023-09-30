import { api } from '../api'

const basePath = '/app-management/role-menu'

export function allstructure(params) {
  return api({
    url: `${basePath}/all-structure`,
    method: 'GET',
    params,
  })
}

export function list(id, params = null) {
  return api({
    url: `${basePath}/menu-role-list/${id}`,
    method: 'GET',
    params
  })
}

export function update(id, data) {
  return api({
    url: `${basePath}/${id}`,
    method: 'PATCH',
    data
  })
}
