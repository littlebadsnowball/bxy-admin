import { createOSSClient } from '/@/utils/file/oss';
import type { PutObjectOptions } from 'ali-oss';
export async function useAliOSS() {
  const client = await createOSSClient();
  if (!client) {
    throw new Error('OSS client is null');
  }

  /**
   * 上传文件
   */
  const upload = async (name: string, file: File, headers?: PutObjectOptions) => {
    const result = await client.put(name, file, headers);
    return result.url;
  };
  return {
    upload,
  };
}
