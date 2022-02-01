declare module "*.yaml" {
  const data: any
  export default data
}

declare module "*.svg" {
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>
  const src: string
  export default src
}
