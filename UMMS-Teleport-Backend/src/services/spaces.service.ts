import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  type ObjectCannedACL,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "dotenv";

config();

const BUCKET = process.env.DO_SPACES_BUCKET || "";
const ENDPOINT =
  process.env.DO_SPACES_ENDPOINT || "https://nyc3.digitaloceanspaces.com";
const REGION = process.env.DO_SPACES_REGION || "nyc3";
const KEY = process.env.DO_SPACES_KEY || "";
const SECRET = process.env.DO_SPACES_SECRET || "";

// Default to 'private' to enforce HIPAA/medical image privacy unless explicitly overridden
const DEFAULT_ACL: ObjectCannedACL =
  (process.env.DO_SPACES_ACL as ObjectCannedACL) || "private";

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
 * Generate a secure time-limited presigned URL for private medical files
 */
export async function getPresignedFileUrl(
  key: string,
  expiresInSeconds = 3600,
): Promise<string> {
  if (!BUCKET || !KEY || !SECRET) {
    // If spaces credentials are not configured, build standard endpoint URL
    const [protocol, rest] = ENDPOINT.split("://");
    return `${protocol}://${BUCKET}.${rest}/${key}`;
  }

  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });

  return getSignedUrl(s3, command, { expiresIn: expiresInSeconds });
}

/**
 * Upload a buffer (binary file) to DigitalOcean Spaces or S3.
 * Uses private ACL by default for patient data protection.
 */
export async function uploadToSpaces(
  buffer: Buffer,
  fileName: string,
  mimeType: string,
  folder?: string,
  customAcl?: ObjectCannedACL,
): Promise<UploadedFile> {
  const timestamp = Date.now();
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");

  // Default to teleport-uploads folder if not specified
  const targetFolder = folder
    ? folder.trim().replace(/\/+$/, "")
    : "teleport-uploads";
  const key = `${targetFolder}/${timestamp}-${sanitizedName}`;

  const aclToUse = customAcl || DEFAULT_ACL;

  if (BUCKET && KEY && SECRET) {
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
        ACL: aclToUse,
      }),
    );
  }

  let fileUrl: string;
  if (aclToUse === "private" && BUCKET && KEY && SECRET) {
    fileUrl = await getPresignedFileUrl(key, 86400); // 24-hour initial access link
  } else {
    const [protocol, rest] = ENDPOINT.split("://");
    fileUrl = `${protocol}://${BUCKET}.${rest}/${key}`;
  }

  return {
    key,
    name: sanitizedName,
    url: fileUrl,
    uploadedAt: new Date().toISOString(),
    size: buffer.byteLength,
  };
}

/**
 * List all objects in the specified folder prefix (defaults to teleport-uploads).
 * Returns secure presigned or public URLs and metadata.
 */
export async function listSpacesFiles(folder: string): Promise<UploadedFile[]> {
  if (!folder) return [];
  const prefix = folder.endsWith("/") ? folder : `${folder}/`;

  if (!BUCKET || !KEY || !SECRET) {
    return [];
  }

  const result = await s3.send(
    new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: prefix,
    }),
  );

  if (!result.Contents || result.Contents.length === 0) return [];

  const [protocol, rest] = ENDPOINT.split("://");

  const files = await Promise.all(
    result.Contents.filter((obj) => obj.Key && obj.Key !== prefix)
      .sort((a, b) => {
        const aTime = a.LastModified?.getTime() ?? 0;
        const bTime = b.LastModified?.getTime() ?? 0;
        return bTime - aTime; // newest first
      })
      .map(async (obj) => {
        const key = obj.Key!;
        const nameParts = key.replace(prefix, "").split("-");
        const name = nameParts.slice(1).join("-") || key.replace(prefix, "");

        let url: string;
        if (DEFAULT_ACL === "private") {
          url = await getPresignedFileUrl(key, 3600);
        } else {
          url = `${protocol}://${BUCKET}.${rest}/${key}`;
        }

        return {
          key,
          name,
          url,
          uploadedAt: obj.LastModified?.toISOString() ?? "",
          size: obj.Size ?? 0,
        };
      }),
  );

  return files;
}
