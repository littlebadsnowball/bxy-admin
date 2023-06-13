<template>
  <h2 class="mb-3 text-2xl font-bold text-center xl:text-3xl enter-x xl:text-left">
    {{ t('sys.login.signInFormTitle') }}
  </h2>
</template>
<script lang="ts" setup>
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();
</script>
