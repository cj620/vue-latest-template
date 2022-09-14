<!--
 * @Author: C.
 * @Date: 2022-09-13 09:00:14
 * @LastEditTime: 2022-09-14 10:48:43
 * @Description: file content
-->
<script setup lang="ts">
import { defineProps } from 'vue'

defineProps<{ msg: string }>()
const utilList = ['eslint', 'prettier', 'stylelint', 'husky']
// const tree2 = ref<TreeItem[]>([]);
</script>

<template>
  <div
    class="rounded-t-xl bg-gradient-to-r from-emerald-50 to-teal-100 h-screen w-screen flex justify-center items-center flex-col"
  >
    <div class="text-9xl font-extrabold">
      <span class="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
        Hello world
      </span>
    </div>
    <div class="mt-5 text-2xl text-gray-400">
      {{ msg }}
    </div>
    <div class="w-full flex justify-center items-center mt-2">
      <div class="utils-tag mx-1" v-for="item in utilList" :key="item">{{ item }}</div>
    </div>
  </div>
</template>
<style>
.utils-tag {
  @apply bg-violet-100 text-violet-700 text-base font-semibold px-6 py-2 rounded-lg border-none;
}
</style>
