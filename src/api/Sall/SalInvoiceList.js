import request from '/@/utils/request';

// 获取数据
export function getSalInvoiceList(params) {
	return request({
		url: 'finance/finSalInvoice/list/0/0',
		method: 'get',
		params,
	});
}