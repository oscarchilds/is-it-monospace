<script setup>
import { storeToRefs } from 'pinia'
import { useFontStore } from '@/stores/font'

const store = useFontStore()

const { firstLoadHasHappened, showResults, fileName, font } = storeToRefs(store)
</script>

<template>
  <div class="font-info" :class="{ show: firstLoadHasHappened }">
    <transition name="fade">
      <h1 v-if="showResults">font info</h1>
    </transition>
    <transition name="fade">
      <div class="info-container" v-if="showResults">
        <p>file name: {{ fileName }}</p>
        <p>font name: {{ font.names.fullName.en }}</p>
        <p>format: {{ font.outlinesFormat }}</p>
        <p>number of glyphs: {{ font.numGlyphs }}</p>
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.font-info {
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 125px 0;
  transition: all 1s ease;

  &.show {
    background-color: black;
  }

  h1,
  p {
    color: white;
  }
}
</style>
