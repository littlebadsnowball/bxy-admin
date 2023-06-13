/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  adminName: string;
  adminPwd: string;
  verifyCode: string;
  no: string;
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  userId: string | number;
  token: string;
  role: RoleInfo;
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  adminName: string;
  adminNo: string;
  factoryNo: string;
  isFactory: boolean;
  isSupplier: boolean;
  realName: string;
  mobileNumber: number;
}
