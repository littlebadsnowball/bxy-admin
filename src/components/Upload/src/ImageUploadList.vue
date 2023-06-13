<script lang="ts">
  import { computed, defineComponent, ref, toRefs, watch, watchEffect } from 'vue';
  import { useUploadImage } from '/@/hooks/business/useUploadImage';
  import { useVModel } from '@vueuse/core';
  import { Upload, Modal, UploadProps } from 'ant-design-vue';
  import { FileAddOutlined } from '@ant-design/icons-vue';
  import { getBase64WithFile } from './helper';
  import { useDesign } from '/@/hooks/web/useDesign';
  const props = {
    accept: {
      type: String,
      default: 'image/*,.svg',
    },
    images: {
      type: Array<string>,
      default: () => {
        return [] as string[];
      },
    },
    prefix: {
      type: String,
      default: 'enterprise/',
    },
    limit: {
      type: Number,
      default: 20,
    },
    maxCount: {
      type: Number,
      default: 100,
    },
    width: {
      type: Number,
      default: 100,
    },
    height: {
      type: Number,
      default: 100,
    },
  };
  export default defineComponent({
    components: { Upload, Modal, FileAddOutlined },
    props,
    emits: ['update:images'],
    setup(props, { emit }) {
      const { prefixCls } = useDesign('image-uploadList');
      const previewVisible = ref(false);
      const previewImage = ref('');
      const fileList = ref<UploadProps['fileList']>([]);
      const { accept, limit, maxCount, height, width, prefix } = toRefs(props);
      const images = useVModel(props, 'images', emit);
      const widthPx = computed(() => width.value + 'px');
      const heightPx = computed(() => height.value + 'px');
      const imageList2FileList = (list: string[]) => {
        if (list) {
          return list.map((item) => {
            return {
              name: item.split('/').pop()!,
              uid: item.split('/').pop()!.split('.')[0],
              url: item,
            };
          });
        } else {
          return [];
        }
      };
      // 同步images和fileList
      watchEffect(() => {
        if (images.value) {
          fileList.value = imageList2FileList(images.value);
        }
      });
      // 上传图片
      const { beforeUpload, uploadImage, imageUrlRef } = useUploadImage({
        limit,
        prefix: prefix.value,
      });
      watch(imageUrlRef, (newVal) => {
        if (newVal) {
          images.value = [...images.value, newVal];
        }
      });
      // 取消预览
      const handleCancel = () => {
        previewVisible.value = false;
      };
      // 预览图片
      const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
          const { result } = await getBase64WithFile(file.originFileObj);
          file.preview = result;
        }
        previewImage.value = file.url || file.preview;
        previewVisible.value = true;
      };
      // 删除图片
      const handleRemove = (file) => {
        images.value = images.value.filter((item) => item !== file.url);
      };

      return {
        beforeUpload,
        handleCancel,
        handleRemove,
        handlePreview,
        uploadImage,
        accept,
        limit,
        previewVisible,
        previewImage,
        fileList,
        maxCount,
        prefixCls,
        widthPx,
        heightPx,
      };
    },
  });
</script>

<template>
  <div>
    <div class="flex flex-start item-center">
      <Upload
        list-type="picture-card"
        v-model:file-list="fileList"
        :accept="accept"
        :before-upload="beforeUpload"
        :custom-request="uploadImage"
        :class="prefixCls"
        @preview="handlePreview"
        @remove="handleRemove"
      >
        <div v-if="fileList && fileList?.length < maxCount">
          <FileAddOutlined />
          <div class="ant-upload-text">上传图片</div>
        </div>
      </Upload>
    </div>
    <Modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </Modal>
  </div>
</template>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-image-uploadList';
  .@{prefix-cls} {
    :deep(.ant-upload.ant-upload-select-picture-card) {
      width: v-bind(widthPx);
      height: v-bind(heightPx);
    }

    :deep(.ant-upload-list-picture-card-container) {
      width: v-bind(widthPx);
      height: v-bind(heightPx);
    }

    :deep(.ant-upload-select-picture-card .ant-upload-text) {
      margin-top: 8px;
      color: #666;
    }
  }
</style>
