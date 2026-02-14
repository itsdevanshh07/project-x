const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3Client = new S3Client({
    region: 'auto', // For R2, use 'auto'. For S3, use your region.
    endpoint: process.env.STORAGE_ENDPOINT,
    credentials: {
        accessKeyId: process.env.STORAGE_ACCESS_KEY,
        secretAccessKey: process.env.STORAGE_SECRET_KEY,
    },
});

/**
 * Generate a pre-signed URL for uploading a file
 * @param {string} fileName 
 * @param {string} contentType 
 * @returns {Promise<Object>} URL and public path
 */
exports.getUploadPresignedUrl = async (fileName, contentType) => {
    try {
        const key = `notes/${Date.now()}-${fileName}`;
        const command = new PutObjectCommand({
            Bucket: process.env.STORAGE_BUCKET,
            Key: key,
            ContentType: contentType,
        });

        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        const publicUrl = `${process.env.STORAGE_PUBLIC_URL}/${key}`;

        return { uploadUrl: url, publicUrl, key };
    } catch (error) {
        console.error('Storage Signature Error:', error);
        throw new Error('Failed to generate upload signature');
    }
};

/**
 * Delete a file from storage
 * @param {string} key 
 */
exports.deleteFile = async (key) => {
    try {
        const command = new DeleteObjectCommand({
            Bucket: process.env.STORAGE_BUCKET,
            Key: key,
        });
        await s3Client.send(command);
    } catch (error) {
        console.error('Storage Delete Error:', error);
    }
};
