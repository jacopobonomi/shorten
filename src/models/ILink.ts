export interface ILinkDTO {
  redirect: string;
  slug?: string;
  short_link?: string;
  readable?: boolean;
}

export interface ILink {
  redirect: string;
  slug: string;
  short_link: string;
}
