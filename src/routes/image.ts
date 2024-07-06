import { envs } from "@/config/env";
import { client } from "@/config/s3"
import { createBucket, deleteBucket, deleteItemFromBucket, putItemInBucket } from "@/utils"
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

router.put("", async (req, res) => {
    const bucketName = S3_BUCKET
    const { fileList, oldList }: { fileList: string[], oldList: string[] } = req.body

    oldList.forEach(async (uri) => {
        
        const fileName = uri.split("/").pop()
        const filePath = S3_IMAGE_DIR_PATH + fileName
        if (!fileList.includes(uri)) {
            await deleteItemFromBucket(
                client,
                bucketName,
                filePath
            )
        }  
    })
    
    const responseList = fileList.map(async (fileContent) => {
        
        if (fileContent.startsWith(`https://${bucketName}.s3.amazonaws.com/`)) {
            return {
                bucketName,
                url: fileContent
            }
        }
        const fileName = randomUUID() + ".jpg"
        const filePath = S3_IMAGE_DIR_PATH + fileName
        const encodedFilePath = encodeURIComponent(filePath)
        const decodedContent = Buffer.from(fileContent, "base64")
        const response = await putItemInBucket(
            client,
            bucketName,
            filePath,
            decodedContent
        )
        
        return {
            bucketName,
            encodedFilePath,
            url: `https://${bucketName}.s3.amazonaws.com/${encodedFilePath}`,
            response
        }
    })

    const uriList = await Promise.all(responseList)
                    .then(responses => responses.map(({ url }) => url))
    console.log(uriList)
    res.send(uriList)
})
/* 
router.post("/bucket", async (req, res) => {
    const bucketName = `test-bucket-${Date.now()}`
    const response = await createBucket(client, bucketName);
    res.send(response)
})
*/
router.delete("", async (req, res) => {
    const bucketName = S3_BUCKET
    const { uriList }: { uriList: string[] } = req.body

    const responseList = uriList.map(async (uri) => {
        const fileName = uri.split("/").pop()
        const filePath = S3_IMAGE_DIR_PATH + fileName
        await deleteItemFromBucket(
            client,
            bucketName,
            filePath
        )
        return [uri, true]
    })

    const uriMap = Object.fromEntries(await Promise.all(responseList))
    console.log(uriMap)
    res.send(uriMap)
})
export default router