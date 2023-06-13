<template>
  <div v-if="!deletable">
    <Upload
      :show-upload-list="false"
      :accept="accept"
      list-type="picture-card"
      :before-upload="beforeUpload"
      :custom-request="uploadImage"
      :class="prefixCls"
    >
      <img v-if="image" :src="image" style="max-width: 100%; max-height: 100%" />
      <div v-else>
        <PlusOutlined />
        <div>Upload</div>
      </div>
    </Upload>
  </div>
  <div v-else>
    <ImageUploadList
      v-model:images="images"
      :accept="accept"
      :limit="limit"
      :max-count="1"
      :height="height"
      :width="width"
      :prefix="filePrefix"
    />
  </div>
</template>
<script lang="ts">
  import ImageUploadList from './ImageUploadList.vue';
  import { useUploadImage } from '/@/hooks/business/useUploadImage';
  import { useVModel } from '@vueuse/core';
  import { Upload } from 'ant-design-vue';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import { computed, defineComponent, ref, toRefs, watch, watchEffect } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';

  const props = {
    accept: {
      type: String,
      default: 'image/*,.svg',
    },
    width: {
      type: Number,
      default: 100,
    },
    height: {
      type: Number,
      default: 100,
    },
    image: {
      type: String,
      default: '',
    },
    limit: {
      type: Number,
      default: 2,
    },
    filePrefix: {
      type: String,
      default: 'enterprise/',
    },
    deletable: {
      type: Boolean,
      default: false,
    },
  };
  export default defineComponent({
    components: { Upload, PlusOutlined, ImageUploadList },
    props,
    emits: ['update:image'],
    setup(props, { emit }) {
      const { prefixCls } = useDesign('image-upload');
      const image = useVModel(props, 'image', emit);
      const { accept, width, height, limit, filePrefix, deletable } = toRefs(props);
      const images = ref<string[]>([]);
      if (deletable.value) {
        watchEffect(() => {
          images.value = image.value ? [image.value] : [];
        });
        watch(images, (val) => {
          image.value = val[0] || '';
        });
      }
      const widthPx = computed(() => width.value + 'px');
      const heightPx = computed(() => height.value + 'px');
      // 上传图片
      const { uploadImage, beforeUpload, imageUrlRef } = useUploadImage({
        limit,
        prefix: filePrefix.value,
      });
      watchEffect(() => {
        if (imageUrlRef.value) image.value = imageUrlRef.value;
      });
      return {
        prefixCls,
        beforeUpload,
        widthPx,
        heightPx,
        accept,
        image,
        images,
        filePrefix,
        uploadImage,
      };
    },
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-image-upload';
  .@{prefix-cls} {
    width: v-bind(widthPx);
    height: v-bind(heightPx);
  }

  .@{prefix-cls} :deep(.ant-upload.ant-upload-select-picture-card) {
    width: 100%;
    height: 100%;
  }
</style>
