<template>
  <div class="footer">
    <p>made possible by <a href="https://opentype.js.org/">opentype.js</a> | visit me on <a href="https://github.com/oscarchilds/is-it-monospace">github</a></p>
  </div>
</template>

<style lang="scss" scoped>
.footer {
  height: 200px;
  background-color: black;
  padding-top: 50px;
  display: flex;
  justify-content: center;

  a, p {
    color: white;
  }

  a:hover {
    color: gray;
  }
}
</style>