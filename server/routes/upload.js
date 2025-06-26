require("dotenv").config()
// routes/upload.js or controller
const express = require("express");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const router = express.Router();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

router.get("/generate-upload-url", async (req, res) => {
  try {
    const fileName = `${Date.now()}-${req.query.name}`;
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      ContentType: req.query.type
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

    res.send({
      url: signedUrl,
      publicUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`
    });
  } catch (err) {
    console.error('S3 upload URL error:', err);
    res.status(500).json({ error: 'Failed to generate upload URL', details: err.message });
  }
});

module.exports = router;
