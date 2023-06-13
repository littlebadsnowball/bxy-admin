import OSS from 'ali-oss';
import { getUserSTS } from '/@/api/sys/common';
import type { Credentials } from 'ali-oss';
type STS = Credentials & {
  oss: {
    region: string;
    bucket: string;
  };
};

function getSTS(): Promise<STS> {
  return new Promise((resolve, reject) => {
    getUserSTS()
      .then((res) => {
        resolve(res as STS);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
}

export async function createOSSClient() {
  const sts = await getSTS().catch((err) => {
    console.log(err);
  });
  if (!sts) return null;
  return new OSS({
    // yourRegion填写Bucket所在地域。以华东1（杭州）为例，yourRegion填写为oss-cn-hangzhou。
    region: sts.oss.region,
    // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
    accessKeyId: sts.AccessKeyId,
    accessKeySecret: sts.AccessKeySecret,
    // 从STS服务获取的安全令牌（SecurityToken）。
    stsToken: sts.SecurityToken,
    // 填写Bucket名称。
    bucket: sts.oss.bucket,
    secure: true,
    // 通过refreshSTSToken定时刷新临时密钥。
    refreshSTSToken: async () => {
      const newSTS = await getSTS();
      return {
        accessKeyId: newSTS.AccessKeyId,
        accessKeySecret: newSTS.AccessKeySecret,
        stsToken: newSTS.SecurityToken,
      };
    },
    refreshSTSTokenInterval: 30 * 60 * 1000,
  });
}
