export interface Env {
  DB: D1Database;
  CACHE: KVNamespace;
  ATTACHMENTS: R2Bucket;
  AI: Ai;
  VECTORIZE: VectorizeIndex;
}
