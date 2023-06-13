<script lang="ts">
  import { defineComponent, toRefs, nextTick, reactive, ref, onMounted, watch } from 'vue';
  import { Tooltip, Tag, Input } from 'ant-design-vue';
  import { PlusOutlined } from '@ant-design/icons-vue';
  const props = {
    tags: {
      type: [Array<number>, Array<string>],
      default: () => {
        return [];
      },
    },
    placeHolder: {
      type: String,
      default: '新建标签',
    },
  };
  export default defineComponent({
    components: { Tooltip, Tag, Input, PlusOutlined },
    props,
    emits: ['update:tags'],
    setup(props, { emit }) {
      const { tags, placeHolder } = toRefs(props);
      const inputRef = ref();
      const state = reactive<{
        tags: string[] | number[] | null;
        inputValue: string;
        inputVisible: boolean;
      }>({
        tags: [],
        inputVisible: false,
        inputValue: '',
      });
      watch(tags, (newVal) => {
        state.tags = newVal;
      });
      const showInput = () => {
        state.inputVisible = true;
        nextTick(() => {
          inputRef.value.focus();
        });
      };
      const handleInputConfirm = () => {
        const inputValue = state.inputValue;
        let tags = state.tags;
        if (tags && tags.length !== 0) {
          if (inputValue && tags.map(String).indexOf(inputValue) === -1) {
            if (typeof tags[0] === 'number') {
              tags = [...tags, Number(inputValue)] as number[];
            } else if (typeof tags[0] === 'string') {
              tags = [...tags, inputValue] as string[];
            }
          }
        } else {
          tags = [inputValue];
        }
        Object.assign(state, {
          tags,
          inputVisible: false,
          inputValue: '',
        });
        emit('update:tags', tags);
      };
      const handleClose = (removedTagIndex: number) => {
        const tags = (state.tags as any[]).filter((_, index) => index !== removedTagIndex);
        state.tags = tags;
        emit('update:tags', state.tags);
      };
      onMounted(() => {
        state.tags = tags.value;
      });
      return {
        ...toRefs(state),
        handleClose,
        handleInputConfirm,
        showInput,
        inputRef,
        placeHolder,
      };
    },
  });
</script>

<template>
  <div>
    <template v-for="(tag, index) in tags" :key="tag">
      <Tooltip :title="tag">
        <Tag @close="handleClose(index)" :closable="true">
          {{ String(tag) }}
        </Tag>
      </Tooltip>
    </template>
    <Input
      v-if="inputVisible"
      ref="inputRef"
      v-model:value="inputValue"
      type="text"
      size="small"
      :style="{ width: '78px' }"
      @blur="handleInputConfirm"
      @keyup.enter="handleInputConfirm"
    />
    <Tag v-else style="background: #fff; border-style: dashed" @click="showInput">
      <plus-outlined />
      {{ placeHolder }}
    </Tag>
  </div>
</template>
