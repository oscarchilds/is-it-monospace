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

  const isMonospace = computed(() => {
    if (!glyphArray.value) return false

    const count = new Map<number, number>()
    let maxCount = 0

    for (const glyph of glyphArray.value) {
      if (glyph.advanceWidth === undefined) continue

      const currentCount = (count.get(glyph.advanceWidth) || 0) + 1
      count.set(glyph.advanceWidth, currentCount)
      maxCount = Math.max(maxCount, currentCount)
    }

    return (maxCount / glyphArray.value.length) * 100 > 90
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
    glyphArray,
    setShowResults,
    setFirstLoadHasHappened,
    setFont,
    setFileName,
  }
})
