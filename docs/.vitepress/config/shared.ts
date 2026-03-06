import { defineConfig } from 'vitepress'
// 自动导入 TDesign 
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { TDesignResolver } from 'unplugin-vue-components/resolvers';
import viteCompression from 'vite-plugin-compression';

import { handleHeadMeta } from "../theme/utils/handleHeadMeta";
import { search as zhSearch } from './zh'

function escapeAttr(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\r/g, '&#13;')
    .replace(/\n/g, '&#10;');
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lastUpdated: true,
  cleanUrls: true,
  ignoreDeadLinks: true,
  // 解决首屏自动预取文章页 chunk 导致 503（服务端短暂不可用或尚未同步）的问题：
  // VitePress 默认会预取视口内可见链接指向的页面资源。首页只有一篇文章时，会立即尝试拉取该文章的 js chunk。
  // 在某些部署 / CDN 场景下，构建产物刚发布瞬间或边缘节点尚未同步，预取易收到 503。禁用后仅在真正导航时加载，避免首屏报错。
  router: {
    prefetchLinks: false,
  },
  sitemap: {
    hostname: 'https://blog.idealiu.cn'
  },
  head: [
    [
      "link",
      {
        rel: "icon",
        href: "https://oss.idealiu.cn/headshot.jpeg",
      },
    ],
  ],
  // https://vitepress.dev/reference/site-config#transformhead
  async transformHead(context) {
    return handleHeadMeta(context)
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    outline: [2, 4],

    // 本地搜索
    search: {
      provider: "local",
      options: {
        locales: { ...zhSearch }
      }
    },
    externalLinkIcon: true,
  },

  markdown: {
    math: true,
    config(md) {
      const originalInline = md.renderer.rules.math_inline;
      const originalBlock = md.renderer.rules.math_block;

      md.renderer.rules.math_inline = (...args) => {
        const [tokens, idx] = args;
        const tex = tokens[idx].content || '';
        const rendered = originalInline ? originalInline(...args) : '';
        return `<span class="vp-math-copy" data-tex="${escapeAttr(tex)}" data-display="0" title="双击复制 LaTeX">${rendered}</span>`;
      };

      md.renderer.rules.math_block = (...args) => {
        const [tokens, idx] = args;
        const tex = tokens[idx].content || '';
        const rendered = originalBlock ? originalBlock(...args) : '';
        return `<div class="vp-math-copy" data-tex="${escapeAttr(tex)}" data-display="1" title="双击复制 LaTeX">${rendered}</div>`;
      };
    }
  },

  vite: {
    server: { 
      host: '0.0.0.0',
      port: 8080
    },
    plugins: [
      // ...
      AutoImport({
        resolvers: [TDesignResolver({
          library: 'vue-next'
        })],
      }),
      Components({
        resolvers: [TDesignResolver({
          library: 'vue-next'
        })],
      }),
      // 生成 gzip 压缩资源 (仅 js / css, >1KB)
      viteCompression({
        filter: (file) => /\.(js|css)$/i.test(file),
        threshold: 1024,
        algorithm: 'gzip',
        ext: '.gz'
      })
    ],
  },
})
