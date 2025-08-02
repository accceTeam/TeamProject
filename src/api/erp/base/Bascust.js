import request from '../../../utils/request'

//获取表格数据
export const getTableData = (params) => {
  return request({
    url: '/base/basCustomer/list',
    method: 'get',
    params
  })
}