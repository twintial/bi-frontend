import request from '@/utils/request'

export function searchOne(data) {
  return request({
    url: '/basic/one',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: JSON.stringify(data)
  })
}

export function searchTwo(data) {
  return request({
    url: '/basic/two',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: JSON.stringify(data)
  })
}

export function extend(name) {
  return request({
    url: '/basic/extend',
    method: 'post',
    params: { name }
  })
}
