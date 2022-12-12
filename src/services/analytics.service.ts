import {
  PutCommand,
  PutCommandInput,
  ScanCommand,
  ScanCommandInput,
} from "@aws-sdk/lib-dynamodb";

import { db } from "../libs/ddbDocClient";

import { IAnalyticsSetting } from "../models/IAnalyticsSetting";
import { IAnalyticsSlug } from "../models/IAnalyticsSlug";

const TableName = process.env.LINKS_TABLE_NAME || "analytics";

/**
 * @description Update the analytics settings for a given slug
 * @param null
 * @returns {IAnalyticsSetting} Analytics setting
 * @throws {Error} if error inserting
 * @example await getAnalyticsSetting()
 */
export const putAnalyticsSetting = async (
  analyticsSetting: IAnalyticsSetting
) => {
  const existingAnalyticsSetting = await getAnalyticsSetting();

  const slugs: IAnalyticsSlug[] = existingAnalyticsSetting?.slugs || [];
  const newSlugs: IAnalyticsSlug[] = analyticsSetting.slugs.map(
    (analyticsSetting) => {
      const existingSlug = slugs.find(
        (slug) => slug.slug === analyticsSetting.slug
      );
      return existingSlug
        ? {
            ...existingSlug,
            ...analyticsSetting,
          }
        : analyticsSetting;
    }
  );

  const newAnalyticsSetting = {
    ...existingAnalyticsSetting,
    ...analyticsSetting,
    slugs: newSlugs,
  };

  const params: PutCommandInput = {
    TableName,
    Item: newAnalyticsSetting,
  };

  try {
    await db.send(new PutCommand(params));
    return newAnalyticsSetting;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

/**
 * @description Get analytics setting
 * @param null
 * @returns {IAnalyticsSetting} Analytics setting
 * @throws {Error} if error inserting
 * @example await getAnalyticsSetting()
 */
export const getAnalyticsSetting = async (): Promise<IAnalyticsSetting> => {
  const params: ScanCommandInput = {
    TableName,
  };

  try {
    const data = (await db.send(new ScanCommand(params))) as any;
    return data.Items[0] as IAnalyticsSetting;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

/**
 * @description Insert a empty analytics setting if one does not exist
 * @param null
 * @returns {boolean} true if inserted, false if not
 * @throws {Error} if error inserting
 * @example await insertAnalyticsSetting();
 */
export const insertAnalyticsSetting = async () => {
  const analyticsSetting: IAnalyticsSetting = {
    enabled: false,
    slugs: [],
  };
  const params: PutCommandInput = {
    TableName,
    Item: analyticsSetting,
  };

  try {
    await db.send(new PutCommand(params));
    return analyticsSetting;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
