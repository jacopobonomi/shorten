import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

if (!process.env.AWS_REGION) {
  throw new Error("AWS_REGION is not set");
}

export const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
