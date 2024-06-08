import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
    PORT: get("PORT").required().asPortNumber(),
    HOSTNAME: get("HOSTNAME").asString(),
    DEFAULT_API_PREFIX: get("DEFAULT_API_PREFIX").required().asString(),
    BODY_SIZE_LIMIT: get("BODY_SIZE_LIMIT").default("2mb").asString(),
    AWS_ACCESS_KEY_ID: get("AWS_ACCESS_KEY_ID").required().asString(),
    AWS_SECRET_ACCESS_KEY: get("AWS_SECRET_ACCESS_KEY").required().asString(),
    S3_ENDPOINT: get("S3_ENDPOINT").asUrlString(),
    S3_REGION: get("S3_REGION").required().asString(),
    S3_BUCKET: get("S3_BUCKET").required().asString(),
    S3_IMAGE_DIR_PATH: get("S3_IMAGE_DIR_PATH").default("").asString()
}