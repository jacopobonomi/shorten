import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { ddbClient } from "./ddbClient";

const marshallOptions = {
  convertEmptyValues: false, 
  removeUndefinedValues: false, 
  convertClassInstanceToMap: false, 
};

const unmarshallOptions = {
  wrapNumbers: false, 
};

const translateConfig = { marshallOptions, unmarshallOptions };
const db = DynamoDBDocumentClient.from(ddbClient, translateConfig);

export { db };