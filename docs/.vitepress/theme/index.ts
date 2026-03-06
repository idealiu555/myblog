// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import Theme from 'vitepress/theme' // https://vitepress.dev/zh/guide/extending-default-theme#using-different-fonts

import "./style.css";
import DocAfterEnhancer from "./components/DocAfterEnhancer.vue";
import DocTopEnhancer from "./components/DocTopEnhancer.vue";
import AsideTopEnhancer from "./components/AsideTopEnhancer.vue";

export default {
	...Theme,
	Layout: () => {
		return h(Theme.Layout, null, {
			// https://vitepress.dev/guide/extending-default-theme#layout-slots
			"doc-after": () => h(DocAfterEnhancer),
			"doc-top": () => h(DocTopEnhancer),
			"aside-top": () => h(AsideTopEnhancer),
		});
	},

	enhanceApp({ router }: any) {
		// 为 logo 添加点击跳转功能：事件委托避免反复查询/重复绑定
		if (typeof window !== 'undefined') {
			document.addEventListener('click', (event) => {
				const target = event.target as HTMLElement | null;
				const logoLink = target?.closest('.VPNavBarTitle .title') as HTMLAnchorElement | null;
				if (!logoLink) return;
				event.preventDefault();
				window.location.href = 'https://blog.idealiu.cn';
			}, { passive: false });
		}

		router.onAfterRouteChanged = (to: string) => {
			// 兼容旧博客的中文路径，重定向到新路径，避免外链失效
			if (to.startsWith(encodeURI('/博客/'))) {
				const newUrl = to.replace(encodeURI('/博客/'), '/posts/')
				window.location.href = newUrl
			}
		}
	},
};

