// https://vitepress.dev/guide/custom-theme
import { h, defineAsyncComponent } from "vue";
import Theme from 'vitepress/theme' // https://vitepress.dev/zh/guide/extending-default-theme#using-different-fonts
// 仅引入 TDesign 全局 token（--td-* 变量），避免组件样式变量缺失
import 'tdesign-vue-next/es/style/index.css';
// 按需引入使用到的组件样式
import 'tdesign-vue-next/es/pagination/style/index.css';
import 'tdesign-vue-next/es/tag/style/index.css';

import "./style.css";

const Comment = defineAsyncComponent(() => import("./components/Comment.vue"));
const ImageViewer = defineAsyncComponent(() => import("./components/ImageViewer.vue"));
const GoBack = defineAsyncComponent(() => import("./components/GoBack.vue"));

export default {
	...Theme,
	Layout: () => {
		return h(Theme.Layout, null, {
			// https://vitepress.dev/guide/extending-default-theme#layout-slots
			"doc-after": () => h(Comment),
			"doc-top": () => h(ImageViewer),
			"aside-top": () => h(GoBack),
		});
	},

	enhanceApp({ router }: any) {
		// 为logo添加点击跳转功能
		if (typeof window !== 'undefined') {
			setTimeout(() => {
				const logoElement = document.querySelector('.VPNavBarTitle .title');
				if (logoElement) {
					logoElement.addEventListener('click', () => {
						window.location.href = 'https://blog.idealiu.cn';
					});
				}
			}, 1000);
		}

		router.onAfterRouteChanged = (to: string) => {
			// 兼容旧博客的中文路径，重定向到新路径，避免外链失效
			if (to.startsWith(encodeURI('/博客/'))) {
				const newUrl = to.replace(encodeURI('/博客/'), '/posts/')
				window.location.href = newUrl
			}
			
			// 重新为logo添加点击事件（路由变化后需要重新绑定）
			setTimeout(() => {
				const logoElement = document.querySelector('.VPNavBarTitle .title');
				if (logoElement && !logoElement.hasAttribute('data-logo-click')) {
					logoElement.setAttribute('data-logo-click', 'true');
					logoElement.addEventListener('click', () => {
						window.location.href = 'https://blog.idealiu.cn';
					});
				}
			}, 100);
		}
	},
};

