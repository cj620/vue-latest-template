<!--
 * @Author: C.
 * @Date: 2022-09-13 09:00:14
 * @LastEditTime: 2022-09-14 08:58:35
 * @Description: file content
-->
<script setup lang="ts">
import { ref, defineProps } from 'vue'

defineProps<{ msg: string }>()
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
  </div>
</template>
+
