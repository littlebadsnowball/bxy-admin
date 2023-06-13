import { defHttp } from '/@/utils/http/axios';
import { Captcha } from './model/captchaModel';
// 获取验证码
export const getCaptchaApi = () => {
  return defHttp.get<Captcha>({ url: '/verifycode' });
};
export const getUserSTS = () => {
  return defHttp.get({ url: '/sts' });
};
