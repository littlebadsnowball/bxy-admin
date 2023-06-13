import { ref, unref } from 'vue';
import { useMessage } from '/@/hooks/web/useMessage';
import { useAliOSS } from '/@/hooks/business/useAliOSS';
import { v4 as uuidv4 } from 'uuid';
import { MaybeRef } from '@vueuse/shared';
import type { UploadRequestOption } from 'ant-design-vue/lib/vc-upload/interface';
interface Options {
  /**
   * @description: 上传文件的前缀
   */
  prefix?: MaybeRef<string>;
  /**
   * @description: 上传文件的大小限制,单位为M
   */
  limit?: MaybeRef<number>;
}
export function useUploadImage(options?: Options) {
  const loading = ref(false);
  const imageUrlRef = ref<string>('');
  const { createMessage } = useMessage();
  const { prefix = 'bxy-open/', limit = 2 } = options || {};
  async function uploadImage(cb: UploadRequestOption) {
    const { file } = cb;
    // 这里的file必须是File类型，不能是Blob类型
    if (!(file instanceof File)) {
      createMessage.error('上传文件类型错误');
      return;
    }
    const filename = `${unref(prefix)}${uuidv4()}.${file.name.split('.').pop()}`;
    if (!file) return;
    loading.value = true;
    try {
      const { upload } = await useAliOSS();
      const result = await upload(filename, file);
      if (result) {
        imageUrlRef.value = result;
      } else {
        createMessage.error('上传失败');
      }
    } catch (err) {
      createMessage.error(`${err}`);
    } finally {
      loading.value = false;
    }
  }
  function beforeUpload(file: File | Blob) {
    if (file.size > unref(limit) * 1024 * 1024) {
      createMessage.error(`上传文件不能超过${unref(limit)}M`);
      return false;
    }
    return true;
  }
  return {
    loading,
    uploadImage,
    beforeUpload,
    imageUrlRef,
  };
}
