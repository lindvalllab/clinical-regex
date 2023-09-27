declare module "*.yaml" {
  const data: string
  export default data
}

declare module "*.svg" {
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>
  const src: string
  export default src
}

declare module "*.png" {
  const value: string
  export default value
}
