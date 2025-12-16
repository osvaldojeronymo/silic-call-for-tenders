declare module 'pagedjs' {
  export class Previewer {
    preview(content: HTMLElement | string, stylesheets?: string[], target?: Element): Promise<any>;
  }
}
