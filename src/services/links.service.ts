import {
  PutCommand,
  GetCommand,
  DeleteCommand,
  PutCommandInput,
  GetCommandInput,
  DeleteCommandInput,
  ScanCommand,
  ScanCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { generateSlug } from "random-word-slugs";

import { db } from "../libs/ddbDocClient";

import { ILink, ILinkDTO } from "../models/ILink";

//[TODO]: Strange import bug
const { nanoid } = require("nanoid");

const TableName = process.env.LINKS_TABLE_NAME || "links";
const BASE_PATH = process.env.BASE_URL;

export const putLink = async ({
  readable,
  redirect,
  slug,
}: ILinkDTO): Promise<ILink | undefined> => {
  const insertSlug: string = slug
    ? slug
    : readable
    ? generateSlug(1, { format: "title" }).toLocaleLowerCase()
    : nanoid(6);

  const newLink: ILink = {
    redirect,
    short_link: `${BASE_PATH}/${insertSlug}`,
    slug: insertSlug,
  };

  const params: PutCommandInput = {
    TableName,
    Item: newLink,
  };

  try {
    await db.send(new PutCommand(params));
    return newLink;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getLink = async (slug: string): Promise<ILink | undefined> => {
  const params: GetCommandInput = {
    TableName,
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
    throw err;
  }
};

export const getLinks = async (): Promise<ILink[] | undefined> => {
  const params: ScanCommandInput = {
    TableName,
  };
  try {
    return (await (
      await db.send(new ScanCommand(params))
    ).Items) as ILink[];
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const deleteLink = async (slug: string): Promise<any | undefined> => {
  const params: DeleteCommandInput = {
    TableName,
    Key: {
      slug: slug,
    },
  };
  try {
    await db.send(new DeleteCommand(params));
    return { message: "Link deleted", status: "success" };
  } catch (err) {
    console.error(err);
    throw err;
  }
};
