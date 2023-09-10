<script setup>
const props = defineProps(['imgUrl'])
</script>

<template>
  <div class="w-[500px] flex flex-col items-center">
    <p class="text-base w-3/4">
      <slot name="title" />
    </p>
    <img
      :src="props.imgUrl"
      class="w-3/4 border-2 border-black my-3"
    />
    <p class="text-base w-3/4">
      <slot name="content" />
    </p>
  </div>
</template>
