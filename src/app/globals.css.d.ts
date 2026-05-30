// This file tells TypeScript that CSS imports are allowed
declare module '*.css' {
  const content: any
  export default content
}