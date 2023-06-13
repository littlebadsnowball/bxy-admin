import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';
import { RoleEnum } from '/@/enums/roleEnum';
const IFrame = () => import('/@/views/sys/iframe/FrameBlank.vue');
const dashboard: AppRouteModule = {
  path: '/dashboard',
  name: 'Dashboard',
  component: LAYOUT,
  redirect: '/dashboard/analysis',
  meta: {
    orderNo: 0,
    icon: 'ion:grid-outline',
    title: '数据总览',
    roles: [RoleEnum.NO_FACTORY],
    hideChildrenInMenu: true,
  },
  children: [
    {
      path: 'analysis',
      name: 'Analysis',
      component: IFrame,
      meta: {
        frameSrc:
          'https://superset.tools.baoxiaohe.com/superset/dashboard/63/?native_filters_key=mJnR4oXYz-uzTxNS3Ikq-LCukG7Vj4P02-9dttJS8Bl7rb6avJWiN6pTtRtMdM5L',
        title: t('routes.dashboard.analysis'),
      },
    },
  ],
};

export default dashboard;
