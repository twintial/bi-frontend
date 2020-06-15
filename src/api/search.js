import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}

export function searchOne(data) {
  return request({
    url: 'http://localhost:8899/basic/one?name=' + data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export function searchTwo(data) {
  return request({
    url: 'http://localhost:8899/basic/two?name1=' + data.node1 + '&name2=' + data.node2 + '&nLinks=' + data.nlinks,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
