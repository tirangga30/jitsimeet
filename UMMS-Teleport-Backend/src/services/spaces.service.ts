import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { config } from "dotenv";

config();

const BUCKET = process.env.DO_SPACES_BUCKET || "";
const ENDPOINT =
  process.env.DO_SPACES_ENDPOINT || "https://nyc3.digitaloceanspaces.com";
const REGION = process.env.DO_SPACES_REGION || "nyc3";
const KEY = process.env.DO_SPACES_KEY || "";
const SECRET = process.env.DO_SPACES_SECRET || "";

const s3 = new S3Client({
  endpoint: ENDPOINT,
  region: REGION,
  credentials: {
    accessKeyId: KEY,
    secretAccessKey: SECRET,
  },
  forcePathStyle: true,
});

export interface UploadedFile {
  key: string;
  name: string;
  url: string;
  uploadedAt: string;
  size?: number;
}

/**
 * Upload a buffer (binary file) to DigitalOcean Spaces.
 * Returns the public URL and metadata.
 */
export async function uploadToSpaces(
  buffer: Buffer,
  fileName: string,
  mimeType: string,
  folder?: string,
): Promise<UploadedFile> {
  const timestamp = Date.now();
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");

  // Default to teleport-uploads folder if not specified
  const targetFolder = folder
    ? folder.trim().replace(/\/+$/, "")
    : "teleport-uploads";
  const key = `${targetFolder}/${timestamp}-${sanitizedName}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
      ACL: "public-read",
    }),
  );

  // DigitalOcean public URL format
  const [protocol, rest] = ENDPOINT.split("://");
  const url = `${protocol}://${BUCKET}.${rest}/${key}`;

  return {
    key,
    name: sanitizedName,
    url,
    uploadedAt: new Date().toISOString(),
    size: buffer.byteLength,
  };
}

/**
 * List all objects in the specified folder prefix (defaults to teleport-uploads).
 * Returns public URLs and metadata.
 */
export async function listSpacesFiles(folder: any): Promise<UploadedFile[]> {
  const prefix = folder.endsWith("/") ? folder : `${folder}/`;

  const result = await s3.send(
    new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: prefix,
    }),
  );

  if (!result.Contents || result.Contents.length === 0) return [];

  const [protocol, rest] = ENDPOINT.split("://");

  return result.Contents.filter((obj) => obj.Key && obj.Key !== prefix)
    .sort((a, b) => {
      const aTime = a.LastModified?.getTime() ?? 0;
      const bTime = b.LastModified?.getTime() ?? 0;
      return bTime - aTime; // newest first
    })
    .map((obj) => {
      const key = obj.Key!;
      const url = `${protocol}://${BUCKET}.${rest}/${key}`;
      const nameParts = key.replace(prefix, "").split("-");
      const name = nameParts.slice(1).join("-"); // strip timestamp prefix
      return {
        key,
        name,
        url,
        uploadedAt: obj.LastModified?.toISOString() ?? "",
        size: obj.Size ?? 0,
      };
    });
}
