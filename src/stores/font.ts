import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useFontStore = defineStore('font', () => {
  const firstLoadHasHappened = ref(false)
  const showResults = ref(false)
  const fileName = ref<string | undefined>()
  const font = ref<opentype.Font | undefined>()

  const glyphArray = computed(() => {
    if (!font.value) return undefined

    const result: opentype.Glyph[] = []

    for (let i = 0; i < font.value.glyphs.length; i++) {
      const glyph = font.value.glyphs.get(i)
      result.push(glyph)
    }

    return result
  })

  const modes = computed(() => {
    // TODO look at removing all of this
    if (!glyphArray.value) return []

    let result = [],
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
          result.push({ number: Number(i), count: count[i] })
        }
      }
    }

    return result
  })

  const modePercent = computed(() => {
    if (!modes.value[0]) return null

    const modesCount = modes.value[0].count
    return ((modesCount / glyphArray.value.length) * 100).toFixed(3)
  })

  const isMonospace = computed(() => {
    return modePercent.value > 90
  })

  const setShowResults = function (value: boolean) {
    showResults.value = value
  }

  const setFirstLoadHasHappened = function (value: boolean) {
    firstLoadHasHappened.value = value
  }

  const setFont = function (value: opentype.Font) {
    font.value = value
  }

  const setFileName = function (value: string) {
    fileName.value = value
  }

  return {
    firstLoadHasHappened,
    showResults,
    fileName,
    font,
    isMonospace,
    modePercent,
    modes,
    glyphArray,
    setShowResults,
    setFirstLoadHasHappened,
    setFont,
    setFileName,
  }
})
