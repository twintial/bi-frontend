import request from '@/utils/request'

export function getResource(params) {
  return request({
    url: '/search/label/resource',
    method: 'get',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    params
  })
}

export function getPredicate(params) {
  return request({
    url: '/search/label/predicate',
    method: 'get',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    params
  })
}
