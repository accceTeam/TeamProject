import request from '/@/utils/request';

// 获取210发票列表数据
export function getRubricSalInvoice210List(params) {
	return request({
		url: 'finance/finSalInvoice/list/1/0',
		method: 'get',
		params,
	});
}
// 自动生成sys/fillRule/executeRuleByCode/fin_xsfp_bill_no
export function getFillRule(params) {
	return request({
		url: 'sys/fillRule/executeRuleByCode/fin_xsfp_bill_no',
		method: 'put',
		params,
	});
} 