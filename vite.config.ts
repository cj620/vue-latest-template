/*
 * @Author: C.
 * @Date: 2022-09-13 16:45:11
 * @LastEditTime: 2022-09-13 16:49:30
 * @Description: file content
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import WindiCSS from 'vite-plugin-windicss'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), WindiCSS()]
})
