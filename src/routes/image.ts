import { envs } from "@/config/env";
import { client } from "@/config/s3"
import { createBucket, deleteBucket, putItemInBucket } from "@/utils"
import { randomUUID } from "crypto";
import express from "express"
const router = express.Router()

const { S3_BUCKET, S3_IMAGE_DIR_PATH } = envs;

router.post("", async (req, res) => {
    const bucketName = S3_BUCKET
    const { fileList }: { fileList: string[] } = req.body

    const responseList = fileList.map(async (fileContent) => {
        
        const fileName = randomUUID() + ".jpg"
        const filePath = S3_IMAGE_DIR_PATH + fileName
        const encodedFilePath = encodeURIComponent(filePath)
        const decodedContent = Buffer.from(fileContent, "base64")
        
        return {
            bucketName,
            encodedFilePath,
            response: putItemInBucket(
                client,
                bucketName,
                filePath,
                decodedContent
            )
        }
    })

    const uriList = await Promise.all(responseList)
                    .then(responses => responses.map(({ bucketName, encodedFilePath }) => {
                        return `https://${bucketName}.s3.amazonaws.com/${encodedFilePath}`;
                    }))
    console.log(uriList)
    res.send(uriList)
})
/* 
router.post("/bucket", async (req, res) => {
    const bucketName = `test-bucket-${Date.now()}`
    const response = await createBucket(client, bucketName);
    res.send(response)
})

router.delete("/bucket/:name", async (req, res) => {
    const { name } = req.params;
    const response = await deleteBucket(client, name)
    res.send(response)
}) */

export default router