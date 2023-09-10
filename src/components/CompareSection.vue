<script setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useFontStore } from '@/stores/font'

import CompareExample from './ui/CompareExample.vue'
import exampleMonoUrl from '@/assets/images/example-mono.png'
import exampleNotMonoUrl from '@/assets/images/example-not-mono.png'

const store = useFontStore()

const { showResults, font, glyphArray } = storeToRefs(store)
const customTestText = ref('compare')
const compareCanvas = ref(null)

watch(showResults, () => {
  drawComparison()
})

watch(customTestText, () => {
  drawComparison()
})

const drawComparison = function () {
  const fontSize = 100
  const textArray = ['iiiiiiiiiiiiiii', 'aaaaaaaaaaaaaaa', 'wwwwwwwwwwwwwww', customTestText.value]
  var i = 0
  var ctx = compareCanvas.value.getContext('2d')

  const scale = (1 / font.value.unitsPerEm) * fontSize

  const glyph = glyphArray.value.find((x) => x.unicode == 119)
  compareCanvas.value.width = glyph.advanceWidth * scale * 15 + 20

  ctx.clearRect(0, 0, compareCanvas.value.width, compareCanvas.value.height)

  textArray.forEach((text) => {
    var y = 110 * (i + 1)

    font.value.draw(ctx, text, 10, y, fontSize)

    i++
  })
}
</script>

<template>
  <div
    class="py-32 flex-col items-center hidden"
    :class="{ '!flex': showResults }"
  >
    <h1 class="text-2xl my-4">compare</h1>
    <canvas
      ref="compareCanvas"
      width="1200"
      height="480"
      class="border-2 border-black"
    />
    <div
      v-if="showResults"
      class="flex flex-col justify-center"
    >
      <input
        class="border-2 border-black appearance-none h-6 my-4"
        v-model="customTestText"
      />
    </div>
    <div class="flex flex-wrap justify-center mt-12">
      <CompareExample :img-url="exampleMonoUrl">
        <template v-slot:title>monospace</template>
        <template v-slot:content>
          A monospace font is a font where the characters are the same width, regardless of which
          character is used. This is helpful when you want to guarantee the width taken up by a
          certain number of characters, or when you would like the characters on multiple rows of
          text to line up.
        </template>
      </CompareExample>
      <CompareExample :img-url="exampleNotMonoUrl">
        <template v-slot:title>not monospace</template>
        <template v-slot:content>
          When a font is not monospace, characters can be any width. This has the advantage of
          looking more natural and easy to read, but means that you cannot predict the width of a
          set number of characters like you could with a monospace font.
        </template>
      </CompareExample>
    </div>
  </div>
</template>
