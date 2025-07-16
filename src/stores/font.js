import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useFontStore = defineStore('font', () => {
  const firstLoadHasHappened = ref(false)
  const showResults = ref(false)
  const fileName = ref(null)
  const font = ref(null)

  const glyphArray = computed(() => {
    if (!font.value) return null

    var glyphsAsObject = font.value.glyphs.glyphs
    return Object.keys(glyphsAsObject).map((key) => glyphsAsObject[key])
  })

  const modes = computed(() => {
    if (!glyphArray.value) return []

    var result = [],
      count = [],
      i,
      number,
      maxIndex = 0

    const widths = glyphArray.value.map((x) => x.advanceWidth)

    for (i = 0; i < widths.length; i += 1) {
      number = widths[i]
      count[number] = (count[number] || 0) + 1

      if (count[number] > maxIndex) {
        maxIndex = count[number]
      }
    }

    for (i in count) {
      if (count.hasOwnProperty(i)) {
        if (count[i] === maxIndex) {
          result.push({
            number: Number(i),
            count: count[i],
          })
        }
      }
    }

    return result
  })

  const modePercent = computed(() => {
    if (!modes.value[0]) return null

    var modesCount = modes.value[0].count
    return ((modesCount / glyphArray.value.length) * 100).toFixed(3)
  })

  const isMonoSpace = computed(() => {
    return modePercent.value > 90
  })

  const setShowResults = function (value) {
    showResults.value = value
  }

  const setFirstLoadHasHappened = function (value) {
    firstLoadHasHappened.value = value
  }

  const setFont = function (value) {
    font.value = value
  }

  const setFileName = function (value) {
    fileName.value = value
  }

  return {
    firstLoadHasHappened,
    showResults,
    fileName,
    font,
    isMonoSpace,
    modePercent,
    modes,
    glyphArray,
    setShowResults,
    setFirstLoadHasHappened,
    setFont,
    setFileName,
  }
})
