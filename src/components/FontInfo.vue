<script setup>
import { storeToRefs } from 'pinia'
import { useFontStore } from '@/stores/font'

const store = useFontStore()

const { firstLoadHasHappened, showResults, fileName, font, modes, modePercent } = storeToRefs(store)
</script>

<template>
  <div
    class="text-white bg-white flex flex-col items-center py-32 transition duration-1000"
    :class="{ '!bg-black': firstLoadHasHappened }"
  >
    <transition name="fade">
      <h1
        v-if="showResults"
        class="text-2xl pt-2 pb-6"
      >
        font info
      </h1>
    </transition>
    <transition name="fade">
      <div
        class="info-container"
        v-if="showResults"
      >
        <p class="py-2 text-base">file name: {{ fileName }}</p>
        <p class="py-2 text-base">font name: {{ font.names.fullName.en }}</p>
        <p class="py-2 text-base">format: {{ font.outlinesFormat }}</p>
        <p class="py-2 text-base">number of glyphs: {{ font.numGlyphs }}</p>
        <p class="py-2 text-base">
          most commonly occuring advanceWidth value: {{ modes[0].number }}
        </p>
        <p class="py-2 text-base">
          percentage of glyphs with that advanceWidth: {{ modePercent }}%
        </p>
      </div>
    </transition>
  </div>
</template>
