import {
  S3Client,
} from "@aws-sdk/client-s3";
import { envs } from "./env";

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_REGION } = envs;


// A region and credentials can be declared explicitly. For example
// `new S3Client({ region: 'us-east-1', credentials: {...} })` would
//initialize the client with those settings. However, the SDK will
// use your local configuration and credentials if those properties
// are not defined here.
export const client = new S3Client({
    region: S3_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
    }
});