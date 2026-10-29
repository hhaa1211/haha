import { runCli } from "../../shared/cli-runner.ts";

export interface DriveMediaItem {
  id: string;
  name: string;
  mimeType?: string;
  size?: number | string;
  createdTime?: string;
}

export interface ProductFolderStructure {
  rootFolderId: string;
  videosFolderId: string;
  imagesFolderId: string;
}

/**
 * Tạo một thư mục mới trên Google Drive.
 */
export async function createFolder(
  name: string,
  parentFolderId?: string
): Promise<{ folderId: string; name: string }> {
  const args = ["mutate", "mkdir", name];
  if (parentFolderId) {
    args.push("--parent", parentFolderId);
  }

  const result = await runCli("gdrive", args, { json: true });
  const folderId = result.id || result.folderId;
  return { folderId, name };
}

/**
 * Đảm bảo cấu trúc thư mục lưu trữ media cho một sản phẩm TikTok Affiliate:
 * [Tên Sản Phẩm]/
 *   ├── videos/
 *   └── images/
 */
export async function ensureProductFolder(
  productName: string,
  baseFolderId?: string
): Promise<ProductFolderStructure> {
  const safeName = productName.replace(/[\\/:*?"<>|]/g, "_");
  
  // 1. Tạo thư mục gốc của sản phẩm
  const root = await createFolder(safeName, baseFolderId);
  
  // 2. Tạo 2 thư mục con videos và images
  const videos = await createFolder("videos", root.folderId);
  const images = await createFolder("images", root.folderId);

  return {
    rootFolderId: root.folderId,
    videosFolderId: videos.folderId,
    imagesFolderId: images.folderId,
  };
}

/**
 * Liệt kê danh sách video hoặc hình ảnh trong một thư mục Google Drive.
 */
export async function listMediaFiles(
  folderId: string,
  maxResults: number = 50
): Promise<DriveMediaItem[]> {
  const result = await runCli("gdrive", ["readonly", "ls", folderId, "--max", String(maxResults)], { json: true });

  if (!result) return [];
  const files = Array.isArray(result) ? result : result.files || [];

  return files.map((item: any) => ({
    id: item.id,
    name: item.name,
    mimeType: item.mimeType,
    size: item.size,
    createdTime: item.createdTime,
  }));
}

/**
 * Tải một tệp media (video mp4, ảnh png/jpg) từ máy cục bộ lên Google Drive.
 */
export async function uploadMediaFile(
  localFilePath: string,
  parentFolderId?: string,
  mimeType?: string
): Promise<{ fileId: string; name: string }> {
  const args = ["mutate", "upload", localFilePath];
  if (parentFolderId) {
    args.push("--parent", parentFolderId);
  }
  if (mimeType) {
    args.push("--mime-type", mimeType);
  }

  const result = await runCli("gdrive", args, { json: true });
  return {
    fileId: result.id || result.fileId,
    name: result.name || localFilePath,
  };
}
