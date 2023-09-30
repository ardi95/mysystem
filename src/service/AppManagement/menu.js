import { api } from "../api";

const basePath = '/app-management/menu'

export function list(params) {
  return api({
    url: `${basePath}`,
    method: 'GET',
    params
  });
}

export function add(data) {
  return api({
    url: `${basePath}`,
    method: 'POST',
    data
  });
}

export function detail(id) {
  return api({
    url: `${basePath}/${id}`,
    method: 'GET'
  });
}

export function update(id, data) {
  return api({
    url: `${basePath}/${id}`,
    method: 'PUT',
    data
  });
}

export function deleteData(id) {
  return api({
    url: `${basePath}/${id}`,
    method: 'DELETE'
  });
}

export function allStructure(params) {
  return api({
    url: `${basePath}/all-structure`,
    method: 'GET',
    params
  });
}
