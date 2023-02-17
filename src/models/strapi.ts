export interface StrapiPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface StrapiGetById<T> {
  data: {
    id: number;
    attributes: T;
  };
  meta: {};
}

export interface StrapiMeta {
  pagination: StrapiPagination;
}

interface StrapiFormat {
  ext: string;
  hash: string;
  height: number;
  mime: string;
  name: string;
  path?: string;
  size: number;
  url: string;
  width: number;
}

interface StrapiFormats {
  medium: StrapiFormat;
  small: StrapiFormat;
  thumbnail: StrapiFormat;
}

export interface StrapiImage {
  alternativeText: string;
  caption: string;
  createdAt: Date | string;
  ext: string;
  formats: StrapiFormats;
  hash: string;
  height: number;
  mime: string;
  name: string;
  previewUrl?: string;
  provider: string;
  provider_metadata?: string;
  size: number;
  updatedAt: Date | string;
  url: string;
  width: number;
}

// TODO: update this
export interface StrapiVideo {
  alternativeText: string;
  caption: string;
  createdAt: Date | string;
  ext: string;
  formats: StrapiFormats;
  hash: string;
  height: number;
  mime: string;
  name: string;
  previewUrl?: string;
  provider: string;
  provider_metadata?: string;
  size: number;
  updatedAt: Date | string;
  url: string;
  width: number;
}
