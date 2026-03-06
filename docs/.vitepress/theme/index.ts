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

	enhanceApp() {
		if (typeof window === 'undefined') return;

		// 兼容旧博客的中文路径，重定向到新路径，避免外链失效
		// 无历史旧路径，移除旧博客路由兼容逻辑。

		const installNonCriticalHandlers = () => {
			// 为 logo 添加点击跳转功能：事件委托避免反复查询/重复绑定
			document.addEventListener('click', (event) => {
				const target = event.target as HTMLElement | null;
				const logoLink = target?.closest('.VPNavBarTitle .title') as HTMLAnchorElement | null;
				if (!logoLink) return;
				event.preventDefault();
				window.location.href = 'https://blog.idealiu.cn';
			}, { passive: false });

			document.addEventListener('dblclick', async (event) => {
				const target = event.target as HTMLElement | null;
				const mathRoot = target?.closest('.vp-math-copy') as HTMLElement | null;
				if (!mathRoot) return;

				const raw = mathRoot.getAttribute('data-tex');
				if (!raw) return;
				const isDisplay = mathRoot.getAttribute('data-display') === '1';
				const content = isDisplay ? `$$\n${raw}\n$$` : `$${raw}$`;

				try {
					if (navigator.clipboard?.writeText) {
						await navigator.clipboard.writeText(content);
						return;
					}
				} catch (_) {
					// fallback below
				}

				const area = document.createElement('textarea');
				area.value = content;
				area.style.position = 'fixed';
				area.style.opacity = '0';
				document.body.appendChild(area);
				area.focus();
				area.select();
				document.execCommand('copy');
				document.body.removeChild(area);
			});
		};

		if ('requestIdleCallback' in window) {
			(window as any).requestIdleCallback(installNonCriticalHandlers, { timeout: 1200 });
		} else {
			window.setTimeout(installNonCriticalHandlers, 200);
		}
	},
};

