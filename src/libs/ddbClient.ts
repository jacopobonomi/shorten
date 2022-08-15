import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { env } from "process";

if (!env.AWS_REGION) {
  throw new Error("AWS_REGION is not set on .env file");
}

export const ddbClient: DynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
});
