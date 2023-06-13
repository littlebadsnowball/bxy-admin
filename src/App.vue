<template>
  <ConfigProvider :locale="getAntdLocale">
    <AppProvider>
      <RouterView />
    </AppProvider>
  </ConfigProvider>
</template>

<script lang="ts" setup>
  import { ConfigProvider } from 'ant-design-vue';
  import { AppProvider } from '/@/components/Application';
  import { useTitle } from '/@/hooks/web/useTitle';
  import { useLocale } from '/@/locales/useLocale';
  import 'dayjs/locale/zh-cn';
  // support Multi-language
  const { getAntdLocale } = useLocale();
  // 根据路由切换动态更改标题
  useTitle();
</script>
<style>
  .fo-3 {
    color: #333333;
  }

  .fo-6 {
    color: #666666;
  }

  .fo-9 {
    color: #999999;
  }

  .fo-12 {
    font-size: 12px;
  }

  .no-nowrap {
    white-space: normal;
  }

  .bold {
    font-weight: bold;
  }
</style>
