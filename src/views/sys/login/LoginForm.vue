<template>
  <LoginFormTitle class="enter-x" />
  <Form
    class="p-4 enter-x"
    :model="formData"
    :rules="getFormRules"
    ref="formRef"
    @keypress.enter="handleLogin"
  >
    <FormItem name="adminName" class="enter-x">
      <Input
        size="large"
        style="height: 50px"
        v-model:value="formData.adminName"
        :placeholder="t('sys.login.userName')"
        class="fix-auto-fill"
      />
    </FormItem>
    <FormItem name="adminPwd" class="enter-x">
      <InputPassword
        size="large"
        style="height: 50px"
        visibilityToggle
        v-model:value="formData.adminPwd"
        :placeholder="t('sys.login.password')"
      />
    </FormItem>
    <FormItem name="verifyCode" class="enter-x">
      <div class="flex flex-between item-center">
        <Input
          size="large"
          style="height: 50px"
          v-model:value="formData.verifyCode"
          :placeholder="t('sys.login.code')"
          class="fix-auto-fill"
        />

        <div :class="`${prefixCls}-captcha`" :innerHTML="svg" @click="getCaptcha"></div>
      </div>
    </FormItem>

    <FormItem class="enter-x">
      <Button
        type="primary"
        size="large"
        style="height: 50px"
        block
        @click="handleLogin"
        :loading="loading"
      >
        {{ t('sys.login.loginButton') }}
      </Button>
    </FormItem>
  </Form>
</template>
<script lang="ts" setup>
  import { reactive, ref, onMounted, toRaw } from 'vue';
  import { getCaptchaApi } from '/@/api/sys/common';
  import { Form, Input, Button } from 'ant-design-vue';
  import LoginFormTitle from './LoginFormTitle.vue';
  import { useUserStore } from '/@/store/modules/user';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useFormRules, useFormValid } from './useLogin';
  import { useDesign } from '/@/hooks/web/useDesign';

  const FormItem = Form.Item;
  const InputPassword = Input.Password;
  const { t } = useI18n();
  const { prefixCls } = useDesign('login');
  const { getFormRules } = useFormRules();
  const userStore = useUserStore();
  const formRef = ref();
  const loading = ref(false);

  const formData = reactive({
    adminName: '',
    adminPwd: '',
    verifyCode: '',
    no: '',
  });
  // 验证码 svg
  const svg = ref();
  const { validForm } = useFormValid(formRef);
  onMounted(() => {
    getCaptcha();
  });
  // 登录
  async function handleLogin() {
    // 表单校验
    const data = await validForm();
    if (!data) return;
    try {
      loading.value = true;
      await userStore.login(toRaw(formData));
    } catch (error) {
      // do nothing
    } finally {
      loading.value = false;
    }
  }
  // 获取验证码
  async function getCaptcha() {
    try {
      const { svg: svgCaptcha, no } = await getCaptchaApi();
      svg.value = svgCaptcha ? svgCaptcha : undefined;
      formData.no = no;
    } catch (error) {
      throw error;
    }
  }
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-login';
  .@{prefix-cls} {
    &-captcha {
      cursor: pointer;
    }
  }
</style>
