/*
 * @Author: C.
 * @Date: 2022-09-13 09:00:14
 * @LastEditTime: 2022-09-13 09:11:19
 * @Description: file content
 */
/// <reference types="vite/client" />
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}
