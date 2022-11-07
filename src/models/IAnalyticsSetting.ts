import { IAnalyticsSlug } from "./IAnalyticsSlug";

export interface IAnalyticsSetting {
  enabled: boolean;
  slugs: IAnalyticsSlug[];
}