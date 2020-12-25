declare namespace ExampleCssNamespace {
  export interface IExampleCss {
    App: string;
    clearLeft: string;
    clearfix: string;
    container: string;
    ellipsis: string;
    header: string;
    "loading-msg": string;
    "msg-app-loading": string;
    "msg-loading-more": string;
    "react-images-container": string;
    "react-photo-gallery--gallery": string;
    sub: string;
    "toggle-select": string;
  }
}

declare const ExampleCssModule: ExampleCssNamespace.IExampleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ExampleCssNamespace.IExampleCss;
};

export = ExampleCssModule;
