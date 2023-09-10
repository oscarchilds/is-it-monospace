<script setup>
import { storeToRefs } from 'pinia'
import { useFontStore } from '@/stores/font'
import { computed, nextTick, ref, watch } from 'vue'

const store = useFontStore()

const { showResults, glyphArray, font } = storeToRefs(store)
const glyphSearch = ref('')
const tileCount = ref(20)

const searchedGlyphArray = computed(() => {
  if (!glyphArray.value) return null

  var result = glyphArray.value.slice(0, tileCount.value)

  if (glyphSearch.value) {
    return result.filter((glyph) => glyph.name.includes(glyphSearch.value))
  }

  return result
})

watch(showResults, () => {
  nextTick(() => drawGlyphs())
})

watch(tileCount, () => {
  nextTick(() => drawGlyphs())
})

watch(glyphSearch, () => {
  nextTick(() => drawGlyphs())
})

const drawGlyphs = function () {
  var scale = (1 / font.value.unitsPerEm) * 100

  var maxLength = Math.min(tileCount.value, searchedGlyphArray.value.length)

  for (let index = 0; index < maxLength; index++) {
    var canvas = document.getElementById(index + '-canvas')
    var ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    var glyph = searchedGlyphArray.value[index]
    var char = String.fromCharCode(glyph.unicode)

    canvas.width = glyph.advanceWidth * scale + 40

    font.value.draw(ctx, char, 20, 150, 100)
    font.value.drawMetrics(ctx, char, 20, 150, 100)
  }
}
</script>

<template>
  <div
    class="flex items-center flex-col mb-36"
    v-show="showResults"
  >
    <div class="bg-black sticky top-0 w-full flex items-center pl-20">
      <p class="text-white mr-5 my-3">search</p>
      <input
        class="appearance-none h-6 border-2 border-white text-white bg-black"
        v-model="glyphSearch"
      />
    </div>
    <div class="flex flex-wrap justify-center min-h-[384px]">
      <div
        v-for="(glyph, key) in searchedGlyphArray"
        :key="key"
        class="h-72 w-48 border-2 border-black m-10 flex flex-col items-center justify-center rounded"
      >
        <canvas
          :id="key + '-canvas'"
          width="200"
          height="200"
        />
        <h3 class="text-lg my-1">{{ glyph.name }}</h3>
        <p class="text-base">advanceWidth: {{ glyph.advanceWidth }}</p>
      </div>
    </div>
    <div
      class="bg-white p-4 border-2 border-black transition w-fit rounded cursor-pointer hover:bg-black hover:text-white"
      @click="tileCount += 20"
      v-if="showResults"
    >
      Show more glyphs
    </div>
  </div>
</template>
