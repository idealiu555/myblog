// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import Theme from 'vitepress/theme' // https://vitepress.dev/zh/guide/extending-default-theme#using-different-fonts
// 引入组件库的少量全局样式变量
import 'tdesign-vue-next/es/style/index.css';

import "./style.css";
import Comment from "./components/Comment.vue";
import ImageViewer from "./components/ImageViewer.vue"
import GoBack from "./components/GoBack.vue";

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

	enhanceApp({ app, router }: any) {
		app.component("Comment", Comment);
		app.component("ImageViewer", ImageViewer);
		app.component("GoBack", GoBack);

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

