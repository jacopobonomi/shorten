import { CacheContainer } from "node-ts-cache";
import { MemoryStorage } from "node-ts-cache-storage-memory";

const NodeCache = require("node-cache");
new NodeCache();
const linksCache = new CacheContainer(new MemoryStorage());

export default linksCache;
