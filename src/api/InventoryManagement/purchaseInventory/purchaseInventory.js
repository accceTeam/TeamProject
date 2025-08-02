import request from '/@/utils/request'

export const getPurchaseInventory = (params)=>{
    return request({
        url:'/stock/stkIo/list/101/0',
        method:'get',
        params
    })
}







