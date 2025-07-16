<script setup>
import HeroSection from './components/HeroSection.vue'
import FontInfo from './components/FontInfo.vue'
import CompareSection from './components/CompareSection.vue'
import GlyphSearch from './components/GlyphSearch.vue'
import FooterSection from './components/FooterSection.vue'
</script>

<template>
  <div id="app" class="container">
    <HeroSection />
    <FontInfo />
    <CompareSection />
    <GlyphSearch />
    <FooterSection />
  </div>
</template>

<style lang="scss" scoped>
.container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 101vh;
}
</style>
