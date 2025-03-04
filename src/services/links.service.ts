import {
  PutCommand,
  GetCommand,
  DeleteCommand,
  PutCommandInput,
  GetCommandInput,
  DeleteCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { generateSlug } from "random-word-slugs";
import { nanoid } from "nanoid"; // Proper import

import { db } from "../libs/dbClient"; // Updated import
import { ILink, ILinkDTO } from "../models/ILink";
import { config } from "../libs/config"; // Using centralized config
import { AppError, ErrorType } from "../libs/errorHandler";

const TABLE_NAME = config.db.tableName;
const BASE_PATH = config.app.baseUrl;

/**
 * Creates a new link in the database
 */
export const putLink = async ({
  readable,
  redirect,
  slug,
}: ILinkDTO): Promise<ILink> => {
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
    TableName: TABLE_NAME,
    Item: newLink,
  };

  try {
    await db.send(new PutCommand(params));
    return newLink;
  } catch (err) {
    console.error("Error creating link:", err);
    throw new AppError(
      "Failed to create link",
      ErrorType.DB_ERROR,
      500,
      { originalError: err }
    );
  }
};

/**
 * Retrieves a link by slug
 */
export const getLink = async (slug: string): Promise<ILink> => {
  const params: GetCommandInput = {
    TableName: TABLE_NAME,
    Key: {
      slug: slug,
    },
  };
  
  try {
    const result = await db.send(new GetCommand(params));
    
    if (!result.Item) {
      throw new AppError(
        "Link not found",
        ErrorType.NOT_FOUND,
        404,
        { slug }
      );
    }
    
    return result.Item as ILink;
  } catch (err) {
    if (err instanceof AppError) {
      throw err;
    }
    
    console.error("Error fetching link:", err);
    throw new AppError(
      "Failed to retrieve link",
      ErrorType.DB_ERROR,
      500,
    );
  }
};

/**
 * Deletes a link by slug
 */
export const deleteLink = async (slug: string): Promise<{message: string, status: string}> => {
  const params: DeleteCommandInput = {
    TableName: TABLE_NAME,
    Key: {
      slug: slug,
    },
  };
  
  try {
    await db.send(new DeleteCommand(params));
    return { message: "Link deleted", status: "success" };
  } catch (err) {
    console.error("Error deleting link:", err);
    throw new AppError(
      "Failed to delete link",
      ErrorType.DB_ERROR,
      500,
      { originalError: err, slug }
    );
  }
};