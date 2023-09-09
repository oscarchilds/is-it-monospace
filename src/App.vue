<script setup>
import HeroSection from './components/HeroSection.vue'
import FontInfo from './components/FontInfo.vue'
import CompareSection from './components/CompareSection.vue'
import GlyphSearch from './components/GlyphSearch.vue'
import FooterSection from './components/FooterSection.vue'
</script>

<template>
  <div
    id="app"
    class="w-full h-[101vh]"
  >
    <HeroSection />
    <FontInfo />
    <CompareSection />
    <GlyphSearch />
    <FooterSection />
  </div>
</template>
