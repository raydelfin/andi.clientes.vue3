declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // const component: DefineComponent<{}, {}, any>
  const component: DefineComponent<"", "", "">
  export default component
}