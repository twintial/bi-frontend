import request from '@/utils/request'

export function searchResource(data, page, limit) {
  return request({
    url: '/search/resource/' + page + '/' + limit,
    method: 'post',
    data
  })
}

export function searchPredicate(data, page, limit) {
  return request({
    url: '/search/predicate/' + page + '/' + limit,
    method: 'post',
    data
  })
}
