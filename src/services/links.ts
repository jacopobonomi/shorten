import { PutCommand, GetCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../libs/ddbDocClient";
import { ILink, ILinkDTO } from "../models/link";

const { nanoid } = require("nanoid");
const TABLE_NAME = "links";

export const putLink = async (link: ILinkDTO) => {
  const newLink = {
    ...link,
    slug: link.slug ? link.slug : nanoid(6),
  };
  const params = {
    TableName: TABLE_NAME,
    Item: newLink,
  };

  try {
    await ddbDocClient.send(new PutCommand(params));
    return newLink;
  } catch (err) {
    console.error(err);
    return { message: err, status: "error" };
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
    const data = await ddbDocClient.send(new GetCommand(params));
    const link: ILink = data.Item as ILink;
    return link;
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
    await ddbDocClient.send(new DeleteCommand(params));
    return { message: "Link deleted", status: "success" };
  } catch (err) {
    console.error(err);
    return { message: err, status: "error" };
  }
};
