import { defHttp } from '/@/utils/http/axios';
import { LoginParams, LoginResultModel, GetUserInfoModel } from './model/userModel';

/**
 * 用户登录
 */
export function loginApi(params: LoginParams) {
  return defHttp.post<LoginResultModel>({ url: '/login', params });
}

/**
 * @description: 获取用户信息
 */
export function getUserInfo() {
  return defHttp.get<GetUserInfoModel>({ url: '/info' });
}
