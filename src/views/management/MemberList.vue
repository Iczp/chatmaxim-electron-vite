<script setup lang="ts">
import { Ref, reactive, ref } from 'vue';
// defineProps<{ msg: string }>();

// 群成员 SessionUnitId=e52bacf4-c231-061a-6628-3a0b0cf571fb
</script>

<template>
  <page>
    <page-title title="Memeber Manager" description="managermemt" />

    <page-content>
      <a-page-header
        style="border: 1px solid rgb(235, 237, 240)"
        title="Title"
        sub-title="This is a subtitle"
      
      />
      <scroll-view>
        <RouterLink to="/">返回主页</RouterLink>
      </scroll-view>
    </page-content>
  </page>
</template>

<style scoped></style>
