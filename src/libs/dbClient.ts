import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

if (!process.env.AWS_REGION) {
  throw new Error("AWS_REGION is not set in environment variables");
}

// Create base DynamoDB client
const ddbClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
});

// Document client configuration
const marshallOptions = {
  convertEmptyValues: false,
  removeUndefinedValues: true, // Changed to true to avoid potential DynamoDB issues
  convertClassInstanceToMap: false,
};

const unmarshallOptions = {
  wrapNumbers: false,
};

const translateConfig = { marshallOptions, unmarshallOptions };

// Create and export document client
export const db = DynamoDBDocumentClient.from(ddbClient, translateConfig);