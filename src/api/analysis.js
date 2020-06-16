import request from '@/utils/request'
import { param } from '@/utils'
import { parseComponent } from 'vue-template-compiler'

export function getCompany() {
  return request({
    url: '/business/company',
    method: 'get',
    headers: { 'content-type': 'application/x-www-form-urlencoded' }
  })
}

export function getDetails(companyName) {
  return request({
    url: '/business/info',
    method: 'get',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    params: { 'companyName': companyName }
  })
}
