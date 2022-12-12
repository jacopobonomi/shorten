export interface ILinkDTO {
  redirect: string;
  slug?: string;
  short_link?: string;
  readable?: boolean;
  enabled?: boolean;
}

export interface ILink {
  redirect: string;
  slug: string;
  short_link: string;
  enabled?: boolean;
}
