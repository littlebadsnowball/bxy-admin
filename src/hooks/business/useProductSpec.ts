import { Ref, ref, watch } from 'vue';
import { BoxClassForm } from '/@/api/business/model/boxClassModel';
import {
  BasicQuotationSpecInfo,
  DeliverOptions,
  MaterialOptions,
  TechOptions,
  HDOptions,
} from '/@/api/business/model/productQuotationSpecModel';
interface Options {
  category: 'material' | 'tech' | 'size' | 'deliver' | 'hd';
  formData: Ref<BasicQuotationSpecInfo | BoxClassForm>;
  list?: Ref<Material[] | Tech[] | Deliver[] | HD[]>;
}
export interface TreeList {
  title: string;
  key: string;
  disabled?: boolean;
  children?: Array<TreeList>;
}
export interface Material {
  materialNo: string;
  materialName: string;
  isDefault?: boolean;
  groupId?: number;
  groupName?: string;
}
export interface Tech {
  techNo: string;
  techName: string;
  isDefault?: boolean;
  groupId?: number;
  groupName?: string;
}
export interface Deliver {
  priceRate: number;
  deliverNo: string;
  deliverName: string;
  priceTrend: number;
}
export interface HD {
  hdNo: string;
  hdName: string;
  isDefault?: boolean;
  groupId?: number;
  groupName?: string;
}
export function useProductSpec(options: Options) {
  const category = ref(options.category);
  const defaultNo = ref<string | string[] | undefined>(undefined);
  const checkedNos = ref<string[]>([]);
  const treeList = ref<TreeList[] | undefined>(undefined);
  const expandKeys = ref<string[] | undefined>(undefined);
  const { list, formData } = options;
  function triggerFormData() {
    if (category.value === 'deliver') {
      if (formData.value.deliverOptions !== null) {
        defaultNo.value = formData.value.deliverOptions.find((item) => item.isDefault)?.deliverNo;
      }
    } else if (category.value === 'material') {
      if (formData.value.materialOptions !== null) {
        defaultNo.value = formData.value.materialOptions.find((item) => item.isDefault)?.materialNo;
      }
    } else if (category.value === 'size') {
      if ((formData.value as BasicQuotationSpecInfo).sizeOptions !== null) {
        defaultNo.value = (formData.value as BasicQuotationSpecInfo).sizeOptions.find(
          (item) => item.isDefault,
        )?.key;
      }
    } else if (category.value === 'tech') {
      if (formData.value.techOptions !== null) {
        defaultNo.value = formData.value.techOptions
          ?.filter((item) => item.isDefault)
          .map((item) => item.techNo);
      }
    } else if (category.value === 'hd') {
      if (formData.value.hdOptions !== null) {
        defaultNo.value = formData.value.hdOptions
          ?.filter((item) => item.isDefault)
          .map((item) => item.hdNo);
      }
    }

    // 设置选中项
    if (category.value === 'tech' && formData.value.techOptions !== null) {
      for (const item of formData.value.techOptions) {
        checkedNos.value.push(item.techNo);
      }
    } else if (category.value === 'material' && formData.value.materialOptions !== null) {
      for (const item of formData.value.materialOptions) {
        checkedNos.value.push(item.materialNo);
      }
    } else if (category.value === 'deliver' && formData.value.deliverOptions !== null) {
      for (const item of formData.value.deliverOptions) {
        checkedNos.value.push(item.deliverNo);
      }
    } else if (category.value === 'hd' && formData.value.hdOptions !== null) {
      for (const item of formData.value.hdOptions) {
        checkedNos.value.push(item.hdNo);
      }
    }
  }
  // 设置树形结构
  function setTreeList() {
    if (list && list.value?.length) {
      treeList.value = [];
      expandKeys.value = [];
      const expand: string[] = [];
      if (category.value === 'tech') {
        for (const item of list.value as Tech[]) {
          const groupInfo = treeList.value.find((ma) => ma.key === item.groupId + '');
          if (groupInfo) {
            groupInfo.children?.push({
              title: item.techName,
              key: item.techNo,
            });
            expand.push(item.techNo);
          } else {
            treeList.value.push({
              title: item.groupName || '',
              key: item.groupId + '',
              children: [
                {
                  title: item.techName,
                  key: item.techNo,
                },
              ],
            });
            expand.push(item.groupId + '');
          }
        }
      } else if (category.value === 'material') {
        for (const item of list.value as Material[]) {
          const groupInfo = treeList.value.find((ma) => ma.key === item.groupId + '');
          if (groupInfo) {
            groupInfo.children?.push({
              title: item.materialName,
              key: item.materialNo,
            });
            expand.push(item.materialNo);
          } else {
            treeList.value.push({
              title: item.groupName || '',
              key: item.groupId + '',
              children: [
                {
                  title: item.materialName,
                  key: item.materialNo,
                },
              ],
            });
            expand.push(item.groupId + '');
          }
        }
      } else if (category.value === 'hd') {
        for (const item of list.value as HD[]) {
          const groupInfo = treeList.value.find((ma) => ma.key === item.groupId + '');
          if (groupInfo) {
            groupInfo.children?.push({
              title: item.hdName,
              key: item.hdNo,
            });
            expand.push(item.hdNo);
          } else {
            treeList.value.push({
              title: item.groupName || '',
              key: item.groupId + '',
              children: [
                {
                  title: item.hdName,
                  key: item.hdNo,
                },
              ],
            });
            expand.push(item.groupId + '');
          }
        }
      }
      expandKeys.value = expand;
    }
  }

  function setDefaultOption(no: string | string[]) {
    if (typeof no === 'string') {
      switch (category.value) {
        case 'material':
          if (formData.value.materialOptions !== null) {
            for (const item of formData.value.materialOptions) {
              if (item.materialNo === no) {
                item.isDefault = true;
              } else {
                item.isDefault = false;
              }
            }
          }
          break;
        case 'size':
          if ((formData.value as BasicQuotationSpecInfo).sizeOptions !== null) {
            for (const item of (formData.value as BasicQuotationSpecInfo).sizeOptions) {
              if (item.key === no) {
                item.isDefault = true;
              } else {
                item.isDefault = false;
              }
            }
          }
          break;
        case 'deliver':
          if (formData.value.deliverOptions !== null) {
            for (const item of formData.value.deliverOptions) {
              if (item.deliverNo === no) {
                item.isDefault = true;
              } else {
                item.isDefault = false;
              }
            }
          }
          break;
      }
    } else {
      if (category.value === 'tech' && formData.value.techOptions !== null) {
        for (const item of formData.value.techOptions) {
          item.isDefault = false;
        }
        for (const item of no) {
          for (const techOption of formData.value.techOptions) {
            if (techOption.techNo === item) {
              techOption.isDefault = true;
            }
          }
        }
      } else if (category.value === 'hd' && formData.value.hdOptions !== null) {
        for (const item of formData.value.hdOptions) {
          item.isDefault = false;
        }
        for (const item of no) {
          for (const hdOption of formData.value.hdOptions) {
            if (hdOption.hdNo === item) {
              hdOption.isDefault = true;
            }
          }
        }
      }
    }
  }

  function check(checkedKeys: string[]) {
    const result: TechOptions[] | MaterialOptions[] | DeliverOptions[] | HDOptions[] = [];
    if (list) {
      list.value.map((item: Material | Tech | Deliver | HD) => {
        checkedKeys.map((ck) => {
          if (category.value === 'tech' && ck && (item as Tech).techNo === ck) {
            (result as TechOptions[]).push({
              techName: (item as Tech).techName,
              techNo: (item as Tech).techNo,
              isDefault: defaultNo.value?.includes(ck) || false,
            });
          } else if (category.value === 'material' && ck && (item as Material).materialNo === ck) {
            (result as MaterialOptions[]).push({
              materialName: (item as Material).materialName,
              materialNo: (item as Material).materialNo,
              isDefault: defaultNo.value?.includes(ck) || false,
            });
          } else if (category.value === 'deliver' && ck && (item as Deliver).deliverNo === ck) {
            (result as DeliverOptions[]).push({
              deliverName: (item as Deliver).deliverName,
              deliverNo: (item as Deliver).deliverNo,
              isDefault: defaultNo.value?.includes(ck) || false,
            });
          } else if (category.value === 'hd' && ck && (item as HD).hdNo === ck) {
            (result as HDOptions[]).push({
              name: (item as HD).hdName,
              hdNo: (item as HD).hdNo,
              isDefault: defaultNo.value?.includes(ck) || false,
            });
          }
        });
      });
      if (category.value === 'tech') {
        formData.value.techOptions = [...(result as TechOptions[])];
      } else if (category.value === 'material') {
        formData.value.materialOptions = [...(result as MaterialOptions[])];
      } else if (category.value === 'deliver') {
        formData.value.deliverOptions = [...(result as DeliverOptions[])];
      } else if (category.value === 'hd') {
        formData.value.hdOptions = [...(result as HDOptions[])];
      }
    }
  }
  // watch list
  watch(() => list?.value, setTreeList, { deep: true });
  // watch formData
  watch(() => formData.value, triggerFormData);

  return {
    defaultNo,
    checkedNos,
    treeList,
    expandKeys,
    setDefaultOption,
    check,
  };
}
