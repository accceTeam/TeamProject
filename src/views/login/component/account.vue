<template>
	<el-form size="large" class="login-content-form">
		<el-form-item class="login-animation1">
			<el-input text placeholder="用户名 admin 或不输均为 common" v-model="state.ruleForm.username" clearable autocomplete="off">
				<template #prefix>
					<el-icon class="el-input__icon"><ele-User /></el-icon>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item class="login-animation2">
			<el-input :type="state.isShowPassword ? 'text' : 'password'" placeholder="密码：123456" v-model="state.ruleForm.password" autocomplete="off">
				<template #prefix>
					<el-icon class="el-input__icon"><ele-Unlock /></el-icon>
				</template>
				<template #suffix>
					<i
						class="iconfont el-input__icon login-content-password"
						:class="state.isShowPassword ? 'icon-yincangmima' : 'icon-xianshimima'"
						@click="state.isShowPassword = !state.isShowPassword"
					>
					</i>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item class="login-animation3">
			<el-col :span="15">
				<el-input text maxlength="4" placeholder="请输入验证码" v-model="state.ruleForm.captcha" clearable autocomplete="off">
					<template #prefix>
						<el-icon class="el-input__icon"><ele-Position /></el-icon>
					</template>
				</el-input>
			</el-col>
			<el-col :span="1"></el-col>
			<el-col :span="8">
				<div @click="getCodeImg"><img :src="Codesrc" alt=""></div>
			</el-col>
		</el-form-item>
		<el-form-item class="login-animation4">
			<el-button type="primary" class="login-content-submit" round v-waves @click="onSignIn" :loading="state.loading.signIn">
				<span>登 录</span>
			</el-button>
		</el-form-item>
	</el-form>
</template>

<script setup name="loginAccount">
import { ref,reactive, computed,onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import Cookies from 'js-cookie';


import { Session } from '/@/utils/storage';
import { formatAxis } from '/@/utils/formatTime';
import { NextLoading } from '/@/utils/loading';
import {useLoginApi} from '/@/api/login';



// 定义变量内容
const route = useRoute();
const router = useRouter();
const state = reactive({
	isShowPassword: false,
	ruleForm: {
		username: 'admin',
		password: 'admin@Erp.',
		captcha: ''
	},
	loading: {
		signIn: false,
	},
});
let Codesrc = ref('');
let timer = 0;
let time = ref(0);
timer = new Date().getTime();
const { getCode,signIn } = useLoginApi();

time.value = timer;
onMounted(() => {
	getCode(timer).then((res) => {
		Codesrc.value = res.result;
	});
});
// 获取验证码
const getCodeImg = () => {
	getCode(timer).then((res) => {
		Codesrc.value = res.result;
	});
};

// 时间获取
const currentTime = computed(() => {
	return formatAxis(new Date());
});
// 登录
const onSignIn = async () => {
	state.loading.signIn = true;

	try {
		// 存储 token 到浏览器缓存
		let res = await signIn({...state.ruleForm, checkKey: timer,remember_me:true})
		console.log(res.result.token,'登录成功获取token')
		Session.set('token', res.result.token);
		// 模拟数据，对接接口时，记得删除多余代码及对应依赖的引入。用于 `/src/stores/userInfo.ts` 中不同用户登录判断（模拟数据）
		Cookies.set('userName', state.ruleForm.username);

		// 登录成功提示
		const currentTimeInfo = currentTime.value;
		const signInText = '欢迎回来！';
		ElMessage.success(`${currentTimeInfo}，${signInText}`);

		// 登录成功，让路由守卫来处理路由初始化和跳转
		console.log('登录成功，准备跳转');

		// 直接进行路由跳转，让路由守卫处理路由初始化
		const targetPath = route.query?.redirect || '/';
		const targetQuery = route.query?.params ? JSON.parse(route.query.params) : {};

		console.log('准备跳转到:', targetPath);

		// 添加 loading
		NextLoading.start();

		try {
			// 直接跳转，路由守卫会检查并初始化路由
			await router.push({
				path: targetPath,
				query: targetQuery
			});
			console.log('路由跳转成功');
		} catch (error) {
			console.error('路由跳转失败:', error);
		}

		// 跳转完成后关闭loading
		setTimeout(() => {
			state.loading.signIn = false;
			console.log('登录流程完成');
		}, 100);

	} catch (error) {
		console.error('登录失败:', error);
		ElMessage.error('登录失败，请重试');
		NextLoading.done();
		state.loading.signIn = false;
	}
};

</script>

<style scoped lang="scss">
.login-content-form {
	margin-top: 20px;
	@for $i from 1 through 4 {
		.login-animation#{$i} {
			opacity: 0;
			animation-name: error-num;
			animation-duration: 0.5s;
			animation-fill-mode: forwards;
			animation-delay: calc($i/10) + s;
		}
	}
	.login-content-password {
		display: inline-block;
		width: 20px;
		cursor: pointer;
		&:hover {
			color: #909399;
		}
	}
	.login-content-code {
		width: 100%;
		padding: 0;
		font-weight: bold;
		letter-spacing: 5px;
	}
	.login-content-submit {
		width: 100%;
		letter-spacing: 2px;
		font-weight: 300;
		margin-top: 15px;
	}
}
</style>
