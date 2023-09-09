<script setup>
import { storeToRefs } from 'pinia'
import opentype from 'opentype.js'
import { useFontStore } from '@/stores/font'

const store = useFontStore()

const { firstLoadHasHappened, showResults, isMonoSpace } = storeToRefs(store)
const { setShowResults, setFirstLoadHasHappened, setFont, setFileName } = store

function onFileChange(e) {
  setShowResults(false)
  var timeout = firstLoadHasHappened.value ? 1000 : 0

  setTimeout(() => {
    setFileName(e.target.value.split('\\').pop())

    var fileList = e.target.files || e.dataTransfer.files
    var file = fileList[0]

    var reader = new FileReader()

    reader.onload = function () {
      setFont(opentype.parse(reader.result))

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
  <div class="flex items-center justify-center h-[80vh] w-full">
    <div class="flex flex-col items-end">
      <h1 class="text-3xl mb-4">is it monospace?</h1>
      <p class="text-base">Find out if your font is monospace here</p>
      <form class="mt-9">
        <input
          type="file"
          id="fileInput"
          accept=".ttf,.otf,.woff"
          class="hidden"
          @change="onFileChange"
        />
        <label
          for="fileInput"
          class="bg-white p-2.5 border-2 border-black rounded cursor-pointer transition hover:bg-black hover:text-white"
        >
          Choose a font <font-awesome-icon icon="upload" />
        </label>
      </form>
    </div>
    <div
      class="h-0 border-2 border-transparent m-0 transition-all duration-700"
      :class="firstLoadHasHappened ? ['h-80', 'mx-8', '!border-black'] : []"
    />
    <div
      class="w-0 overflow-hidden transition-all duration-1000"
      :class="{ 'w-80': showResults }"
    >
      <div class="w-80">
        <p>{{ isMonoSpace ? 'Yes, your font is monospace' : 'No, your font is not monospace' }}</p>
      </div>
    </div>
  </div>
</template>
