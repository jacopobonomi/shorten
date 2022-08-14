import { PutCommand, GetCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "../libs/ddbDocClient";

import { ILink, ILinkDTO } from "../models/ILink";

//FIX: Strange import bug
const { nanoid } = require("nanoid");

const TABLE_NAME = process.env.LINKS_TABLE_NAME || "links";
const BASE_PATH = process.env.BASE_URL;

export const putLink = async ({ redirect, slug }: ILinkDTO) => {
  const insertSlug: string = slug ? slug : nanoid(6);

  const newLink: ILink = {
    redirect,
    short_link: `${BASE_PATH}/${insertSlug}`,
    slug: insertSlug,
  };

  const params = {
    TableName: TABLE_NAME,
    Item: newLink,
  };

  try {
    await db.send(new PutCommand(params));
    return newLink;
  } catch (err) {
    console.error(err);
  }
};

export const getLink = async (slug: string): Promise<ILink | undefined> => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      slug: slug,
    },
  };
  try {
    return (await (
      await db.send(new GetCommand(params))
    ).Item) as ILink;
  } catch (err) {
    console.error(err);
  }
};

export const deleteLink = async (slug: string) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      slug: slug,
    },
  };
  try {
    await db.send(new DeleteCommand(params));
    return { message: "Link deleted", status: "success" };
  } catch (err) {
    console.error(err);
  }
};
