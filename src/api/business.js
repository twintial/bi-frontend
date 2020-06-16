import request from '@/utils/request'

export function getFoundation() {
  return request({
    url: '/business/foundation',
    method: 'get'
  })
}
