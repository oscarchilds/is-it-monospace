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

  const result = glyphArray.value.slice(0, tileCount.value)

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
  const scale = (1 / font.value.unitsPerEm) * 100

  const maxLength = Math.min(tileCount.value, searchedGlyphArray.value.length)

  for (let index = 0; index < maxLength; index++) {
    const canvas = document.getElementById(index + '-canvas')
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const glyph = searchedGlyphArray.value[index]
    const char = String.fromCharCode(glyph.unicode)

    canvas.width = glyph.advanceWidth * scale + 40

    font.value.draw(ctx, char, 20, 150, 100)
    font.value.drawMetrics(ctx, char, 20, 150, 100)
  }
}
</script>

<template>
  <div class="glyph-container" v-show="showResults">
    <div class="glyph-nav">
      <p>search</p>
      <input v-model="glyphSearch" />
    </div>
    <div class="tile-container">
      <div
        v-for="(glyph, key) in searchedGlyphArray"
        :key="key"
        class="tile"
        :class="{ show: key < tileCount }"
      >
        <canvas :id="key + '-canvas'" width="200" height="200" />
        <h3>{{ glyph.name }}</h3>
        <p>advanceWidth: {{ glyph.advanceWidth }}</p>
      </div>
    </div>
    <div class="load-tiles" @click="tileCount += 20" v-if="showResults">Load more glyphs</div>
  </div>
</template>

<style lang="scss" scoped>
.glyph-container {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-bottom: 150px;

  .glyph-nav {
    background-color: black;
    position: sticky;
    top: 0px;
    width: 100%;
    display: flex;
    align-items: center;

    :first-child {
      margin-left: 91px;
    }

    :last-child {
      margin-right: 91px;
    }

    p {
      color: white;
      margin-right: 20px;
    }

    input {
      -webkit-appearance: none;
      height: 25px;
      border: 2px solid white;
      color: white;
      background-color: black;
      margin: 0 10px;
      font-family: 'Roboto Mono', monospace;
    }
  }

  .tile-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    min-height: 384px;

    .tile {
      height: 300px;
      width: 200px;
      border: 2px solid black;
      margin: 40px;
      opacity: 0;
      transition: 300ms all ease;
      display: flex;
      flex-direction: column;
      align-items: center;

      &.show {
        opacity: 1;
      }

      h3 {
        margin: 0;
      }
    }
  }

  .load-tiles {
    background-color: white;
    padding: 10px;
    border: 2px solid black;
    transition: 300ms all ease;
    width: 154px;

    &:hover {
      background-color: black;
      color: white;
      cursor: pointer;
    }
  }
}
</style>
