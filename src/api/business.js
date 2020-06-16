import request from '@/utils/request'

export function getFoundation() {
  return request({
    url: '/business/foundation',
    method: 'get'
  })
}

export function getProducts() {
  return request({
    url: '/business/products',
    method: 'get'
  })
}
