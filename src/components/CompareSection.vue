<script setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useFontStore } from '@/stores/font'

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

const drawComparison = function() {
  const fontSize = 100
  const textArray = ['iiiiiiiiiiiiiii', 'aaaaaaaaaaaaaaa' ,'wwwwwwwwwwwwwww', customTestText.value]
  var i = 0
  var ctx = compareCanvas.value.getContext("2d")

  const scale = 1 / font.value.unitsPerEm * fontSize;

  const glyph = glyphArray.value.find(x => x.unicode == 119)
  compareCanvas.value.width = ((glyph.advanceWidth * scale) * 15) + 20

  ctx.clearRect(0, 0, compareCanvas.value.width, compareCanvas.value.height)

  textArray.forEach(text => {
    var y = 110 * (i + 1)

    font.value.draw(ctx, text, 10, y, fontSize)
    font.value.drawMetrics(ctx, text, 10, y, fontSize)

    i++
  })
}
</script>

<template>
  <div 
    class="compare-container"
    :class="{ 'show': showResults }"
  >
    <h1>compare</h1>
    <canvas
      ref="compareCanvas"
      width="1200"
      height="480"
    />
    <div
      v-if="showResults"
      class="compare-controls"
    >
      <input v-model="customTestText">
    </div>
    <div class="compare-learn-container">
      <div class="learn-tile">
        <h2>monospace</h2>
        <img src="images/example-mono.png">
        <p>
          A monospace font is a font where the characters are the same width, regardless of which character is used. 
          This is helpful when you want to guarantee the width taken up by a certain number of characters, or when you 
          would like the characters on multiple rows of text to line up.
        </p>
      </div>
      <div class="learn-tile">
        <h2>not monospace</h2>
        <img src="images/example-not-mono.png">
        <p>
          When a font is not monospace, characters can be any width. This has the advantage of looking more natural and 
          easy to read, but means that you cannot predict the width of a set number of characters like you could with a 
          monospace font.
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.compare-container {
  padding: 125px 0;
  display: none;
  flex-direction: column;
  align-items: center;

  &.show {
    display: flex;
  }

  canvas {
    border: 2px solid black;
  }

  .compare-controls {
    display: flex;
    flex-direction: column;
    justify-content: center;

    input {
      appearance: none;
      height: 25px;
      border: 2px solid black;
      margin: 13px 0 0;
      font-family: 'Roboto Mono', monospace;
    }
  }

  .compare-learn-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 50px;

    .learn-tile {
      width: 500px;
      display: flex;
      flex-direction: column;
      align-items: center;

      img {
        width: 75%;
        border: 2px solid black;
      }

      p {
        width: 75%;
      }
    }
  }
}
</style>
