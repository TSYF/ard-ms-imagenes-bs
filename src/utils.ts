// This is used for getting user input.
import { createInterface } from "readline/promises";

import {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
  DeleteObjectCommand,
  paginateListObjectsV2,
  GetObjectCommand,
  DeleteObjectCommandOutput,
  CreateBucketCommandOutput,
  PutObjectAclCommandOutput,
  GetObjectAclCommandOutput,
} from "@aws-sdk/client-s3";
import { Readable } from "stream";

export async function createBucket(s3Client: S3Client, bucketName: string): Promise<CreateBucketCommandOutput> {
    // Create an Amazon S3 bucket. The epoch timestamp is appended
    // to the name to make it unique.
    return await s3Client.send(
        new CreateBucketCommand({
            Bucket: bucketName,
        })
    );
}

export async function deleteBucket(s3Client: S3Client, bucketName: string): Promise<DeleteObjectCommandOutput[]> {
    const paginator = paginateListObjectsV2(
        { client: s3Client },
        { Bucket: bucketName }
    );
    const results: DeleteObjectCommandOutput[] = []
    for await (const page of paginator) {
        const objects = page.Contents;
        if (objects) {
            // For every object in each page, delete it.
            for (const object of objects) {
                results.push(await s3Client.send(
                    new DeleteObjectCommand({ Bucket: bucketName, Key: object.Key })
                ));
            }
        }
    }
    return results;
}

type StreamingBloaloadInputTpes = string | Uint8Array | Buffer | Readable

export async function putItemInBucket(
    s3Client: S3Client,
    bucketName: string,
    filePath: string,
    fileContent: StreamingBloaloadInputTpes
): Promise<PutObjectAclCommandOutput> {
    // Put an object into an Amazon S3 bucket.
    return await s3Client.send(
        new PutObjectCommand({
              Bucket: bucketName,
              Key: filePath,
              Body: fileContent,
              ACL: 'public-read'
        })
    );
}

export async function readItemFromBucket(
    s3Client: S3Client,
    bucketName: string,
    filePath: string
): Promise<GetObjectAclCommandOutput> {
    // Read the object.
    return await s3Client.send(
        new GetObjectCommand({
              Bucket: bucketName,
              Key: filePath,
        })
    );
}

export async function main() {
  

  /* 

  console.log(await Body!.transformToString());

  // Confirm resource deletion.
  const prompt = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const result = await prompt.question("Empty and delete bucket? (y/n) ");
  prompt.close();

  if (result === "y") {
    // Create an async iterator over lists of objects in a bucket.
    const paginator = paginateListObjectsV2(
      { client: s3Client },
      { Bucket: bucketName }
    );
    for await (const page of paginator) {
      const objects = page.Contents;
      if (objects) {
        // For every object in each page, delete it.
        for (const object of objects) {
          await s3Client.send(
            new DeleteObjectCommand({ Bucket: bucketName, Key: object.Key })
          );
        }
      }
    }

    // Once all the objects are gone, the bucket can be deleted.
    await s3Client.send(new DeleteBucketCommand({ Bucket: bucketName }));
  } */
}
/* 
// Call a function if this file was run directly. This allows the file
// to be runnable without running on import.
import { fileURLToPath } from "url";
import { envs } from "./env";
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
 */