<script setup>
import { storeToRefs } from 'pinia'
import opentype from 'opentype.js'
import { useFontStore } from '@/stores/font'

const store = useFontStore()

const { firstLoadHasHappened, showResults, isMonospace } = storeToRefs(store)
const { setShowResults, setFirstLoadHasHappened, setFont, setFileName } = store

function onFileChange(e) {
  setShowResults(false)
  const timeout = firstLoadHasHappened.value ? 1000 : 0

  setTimeout(() => {
    setFileName(e.target.value.split('\\').pop())

    const fileList = e.target.files || e.dataTransfer.files
    const file = fileList[0]

    const reader = new FileReader()

    reader.onload = function () {
      const font = opentype.parse(reader.result)
      setFont(font)

      animateResults()
    }

    reader.readAsArrayBuffer(file)
  }, timeout)
}

function animateResults() {
  const timeout = firstLoadHasHappened.value ? 1000 : 0

  setFirstLoadHasHappened(true)

  setTimeout(() => setShowResults(true), timeout)
}
</script>

<template>
  <div class="header">
    <div class="title">
      <h1>is it monospace?</h1>
      <p>Find out if your font is monospace here</p>
      <form>
        <input type="file" id="fileInput" accept=".ttf,.otf,.woff" @change="onFileChange" />
        <label for="fileInput">Choose a font <font-awesome-icon icon="upload" /></label>
      </form>
    </div>
    <div class="line" :class="{ open: firstLoadHasHappened }" />
    <div class="results-pane" :class="{ open: showResults }">
      <div class="results-text">
        <p>{{ isMonospace ? 'Yes, your font is monospace' : 'No, your font is not monospace' }}</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80vh;
  width: 100%;
  background-color: white;

  .title {
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    h1 {
      margin-top: 0;
    }

    p {
      margin: 0;
    }

    #fileInput {
      display: none;
    }

    form {
      margin-top: 36px;
    }

    label {
      background-color: white;
      padding: 10px;
      border: 2px solid black;
      transition: 300ms all ease;

      &:hover {
        background-color: black;
        color: white;
        cursor: pointer;
      }
    }
  }

  .line {
    height: 0;
    border: none;
    margin: 0;
    transition: all 750ms ease;

    &.open {
      border: 1px solid black;
      height: 300px;
      margin: 0 30px;
    }
  }

  .results-pane {
    width: 0;
    overflow: hidden;
    transition: all 1s ease;

    &.open {
      width: 350px;
    }

    .results-text {
      width: 350px;
    }
  }
}
</style>
