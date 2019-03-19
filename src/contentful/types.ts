export interface IContent {
  content?: IContent;
  data: Object;
  marks: Array<any>;
  nodeType?: string;
}

export interface IComponent {
  c?: string;
  v?: string;
}

export interface IRichContentItem {
  content: IContent;
}

export interface IEntry {
  sys: {
    id: string;
    contentType?: {
      sys: {
        id: string;
      };
    };
  };
  fields: Object;
}

export interface IAsset {
  sys: {
    id: string;
    contentType?: {
      sys: {
        id: string;
      };
    };
  };
  fields: Object;
}

export interface IIncludes {
  Entry: Array<IEntry>;
  Asset: Array<IAsset>;
}

export interface ICleanEntry {
  id: string;
  fields: Object;
}
