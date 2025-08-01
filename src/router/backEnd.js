import { storeToRefs } from 'pinia';
import Cookies from 'js-cookie';
import pinia from '/@/stores/index';
import { useUserInfo } from '/@/stores/userInfo';
import { useRequestOldRoutes } from '/@/stores/requestOldRoutes';
import { Session } from '/@/utils/storage';
import { NextLoading } from '/@/utils/loading';
import { dynamicRoutes, notFoundAndNoPower } from '/@/router/route';
import { formatTwoStageRoutes, formatFlatteningRoutes, router } from '/@/router/index';
import { useRoutesList } from '/@/stores/routesList';
import { useTagsViewRoutes } from '/@/stores/tagsViewRoutes';
import { useMenuApi } from '/@/api/menu/index';

// 后端控制路由

// 引入 api 请求接口
const menuApi = useMenuApi();

/**
 * 获取目录下的 .vue、.tsx 全部文件
 * @method import.meta.glob
 * @link 参考：https://cn.vitejs.dev/guide/features.html#json
 */
const layouModules = import.meta.glob('../layout/routerView/*.{vue,tsx}');
const viewsModules = import.meta.glob('../views/**/*.{vue,tsx}');
const dynamicViewsModules = Object.assign({}, { ...layouModules }, { ...viewsModules });

/**
 * 后端控制路由：初始化方法，防止刷新时路由丢失
 * @method NextLoading 界面 loading 动画开始执行
 * @method useUserInfo().setUserInfos() 触发初始化用户信息 pinia
 * @method useRequestOldRoutes().setRequestOldRoutes() 存储接口原始路由（未处理component），根据需求选择使用
 * @method setAddRoute 添加动态路由
 * @method setFilterMenuAndCacheTagsViewRoutes 设置路由到 pinia routesList 中（已处理成多级嵌套路由）及缓存多级嵌套数组处理后的一维数组
 */
export async function initBackEndControlRoutes() {
	try {
		// 界面 loading 动画开始执行
		if (window.nextLoading === undefined) NextLoading.start();
		// 无 token 停止执行下一步
		if (!Session.get('token')) return false;
		// 触发初始化用户信息 pinia
		// https://gitee.com/lyt-top/vue-next-admin/issues/I5F1HP
		await useUserInfo().setUserInfos();

		// 添加延迟确保token生效
		await new Promise(resolve => setTimeout(resolve, 100));

		// 获取路由菜单数据，添加重试机制
		let res;
		let retryCount = 0;
		const maxRetries = 3;

		while (retryCount < maxRetries) {
			try {
				// console.log(`尝试获取后端路由数据，第${retryCount + 1}次`);
				res = await getBackEndControlRoutes();
				if (res && res.result && res.result.menu) {
					// console.log('成功获取后端路由数据:', res.result.menu.length, '个菜单');
					break;
				}
			} catch (error) {
				// console.error(`第${retryCount + 1}次获取路由失败:`, error);
				retryCount++;
				if (retryCount < maxRetries) {
					await new Promise(resolve => setTimeout(resolve, 500 * retryCount));
				}
			}
		}

		// 无登录权限时，添加判断
		// https://gitee.com/lyt-top/vue-next-admin/issues/I64HVO
		if (!res || !res.result || !res.result.menu || res.result.menu.length <= 0) {
			// console.error('获取后端路由数据失败或无权限');
			return Promise.resolve(true);
		}
		// 存储接口原始路由（未处理component），根据需求选择使用
		useRequestOldRoutes().setRequestOldRoutes(JSON.parse(JSON.stringify(res.result.menu)));
		// 处理路由（component），替换 dynamicRoutes（/@/router/route）第一个顶级 children 的路由
		dynamicRoutes[0].children = await backEndComponent(res.result.menu);
		// 添加动态路由
		await setAddRoute();
		// 设置路由到 pinia routesList 中（已处理成多级嵌套路由）及缓存多级嵌套数组处理后的一维数组
		setFilterMenuAndCacheTagsViewRoutes();

		// console.log('后端路由初始化完成，路由数量:', dynamicRoutes[0].children.length);

		// 确保路由完全添加后再停止loading
		await new Promise(resolve => setTimeout(resolve, 100));
		NextLoading.done();

		return Promise.resolve(false);
	} catch (error) {
		console.error('后端路由初始化失败:', error);
		// 发生错误时停止loading
		NextLoading.done();
		return Promise.resolve(true);
	}
}

/**
 * 设置路由到 pinia routesList 中（已处理成多级嵌套路由）及缓存多级嵌套数组处理后的一维数组
 * @description 用于左侧菜单、横向菜单的显示
 * @description 用于 tagsView、菜单搜索中：未过滤隐藏的(isHide)
 */
export async function setFilterMenuAndCacheTagsViewRoutes() {
	const storesRoutesList = useRoutesList(pinia);
	storesRoutesList.setRoutesList(dynamicRoutes[0].children);
	setCacheTagsViewRoutes();
}

/**
 * 缓存多级嵌套数组处理后的一维数组
 * @description 用于 tagsView、菜单搜索中：未过滤隐藏的(isHide)
 */
export function setCacheTagsViewRoutes() {
	const storesTagsView = useTagsViewRoutes(pinia);
	storesTagsView.setTagsViewRoutes(formatTwoStageRoutes(formatFlatteningRoutes(dynamicRoutes))[0].children);
}

/**
 * 处理路由格式及添加捕获所有路由或 404 Not found 路由
 * @description 替换 dynamicRoutes（/@/router/route）第一个顶级 children 的路由
 * @returns 返回替换后的路由数组
 */
export function setFilterRouteEnd() {
	let filterRouteEnd = formatTwoStageRoutes(formatFlatteningRoutes(dynamicRoutes));
	// notFoundAndNoPower 防止 404、401 不在 layout 布局中，不设置的话，404、401 界面将全屏显示
	// 关联问题 No match found for location with path 'xxx'
	filterRouteEnd[0].children = [...filterRouteEnd[0].children, ...notFoundAndNoPower];
	return filterRouteEnd;
}

/**
 * 添加动态路由
 * @method router.addRoute
 * @description 此处循环为 dynamicRoutes（/@/router/route）第一个顶级 children 的路由一维数组，非多级嵌套
 * @link 参考：https://next.router.vuejs.org/zh/api/#addroute
 */
export async function setAddRoute() {
	await setFilterRouteEnd().forEach((route) => {
		router.addRoute(route);
	});
}

/**
 * 请求后端路由菜单接口
 * @description isRequestRoutes 为 true，则开启后端控制路由
 * @returns 返回后端路由菜单数据
 */
export function getBackEndControlRoutes() {
	// 模拟 admin 与 test
	const stores = useUserInfo(pinia);
	const { userInfos } = storeToRefs(stores);

	// 从Cookie获取用户名作为备选方案
	const userName = Cookies.get('userName') || 'admin';
	const auth = userInfos.value.roles && userInfos.value.roles.length > 0
		? userInfos.value.roles[0]
		: (userName === 'admin' ? 'admin' : 'common');

	// console.log('获取后端路由，用户权限:', auth, '用户名:', userName);

	// 管理员 admin
	if (auth === 'admin') return menuApi.getAdminMenu();
	// 其它用户 test
	else return menuApi.getTestMenu();
}

/**
 * 重新请求后端路由菜单接口
 * @description 用于菜单管理界面刷新菜单（未进行测试）
 * @description 路径：/src/views/system/menu/component/addMenu.vue
 */
export async function setBackEndControlRefreshRoutes() {
	await getBackEndControlRoutes();
}

/**
 * 后端路由 component 转换
 * @param routes 后端返回的路由表数组
 * @returns 返回处理成函数后的 component
 */
export function backEndComponent(routes) {
	if (!routes) return;
	return routes.map((item) => {
		if (item.component) item.component = dynamicImport(dynamicViewsModules, item.component);
		item.children && backEndComponent(item.children);
		return item;
	});
}

/**
 * 后端路由 component 转换函数
 * @param dynamicViewsModules 获取目录下的 .vue、.tsx 全部文件
 * @param component 当前要处理项 component
 * @returns 返回处理成函数后的 component
 */
export function dynamicImport(dynamicViewsModules, component) {
	const keys = Object.keys(dynamicViewsModules);
	const matchKeys = keys.filter((key) => {
		const k = key.replace(/..\/views|../, '');
		return k.startsWith(`${component}`) || k.startsWith(`/${component}`);
	});
	if (matchKeys?.length === 1) {
		const matchKey = matchKeys[0];
		return dynamicViewsModules[matchKey];
	}
	if (matchKeys?.length > 1) {
		return false;
	}
}
