import LinksController from "../src/controllers/links.controller";
jest.mock("express");

jest.mock("node-ts-cache");
jest.mock("node-ts-cache-storage-memory");

const expressMock = require("express");
import { CacheContainer } from "node-ts-cache";

//test insert slug
describe("insert slug", () => {
  it('should throw 400 error if id is empty string', async () => {
    const mReq = { params: { id: '' } };
    const mRes = {};
    const mNext = jest.fn();
    const msStorable = jest.fn();
    const NodeCache = require("node-cache");
    new NodeCache();
    const cacheNode = new CacheContainer(msStorable);
        await new LinksController(expressMock, mRes, mNext);
    expect(mNext).toBeCalledWith(new Error('invalid.'));
  });
});

//test get slug
//test get all slugs
//test update slug
//test delete slug
