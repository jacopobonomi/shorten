import { CacheContainer } from "node-ts-cache";
import { MemoryStorage } from "node-ts-cache-storage-memory";

const NodeCache = require("node-cache");
new NodeCache();

export default new CacheContainer(new MemoryStorage());