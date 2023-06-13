import { withInstall } from '/@/utils';
import basicUpload from './src/BasicUpload.vue';
import imageUpload from './src/ImageUpload.vue';
import imageUploadList from './src/ImageUploadList.vue';

export const BasicUpload = withInstall(basicUpload);
export const ImageUpload = withInstall(imageUpload);
export const ImageUploadList = withInstall(imageUploadList);
