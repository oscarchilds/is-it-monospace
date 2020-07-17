var app = new Vue({
  el: '#app',
  data: {
    showResults: false,
    isMonoSpace: null,
    modePercent: null,
    firstLoad: false,
    fileName: '',
    font: null,
    modes: null,
    tileCount: 20
  },
  computed: {
    glyphArray: function () {
      if (this.font) {
        var glyphsAsObject = this.font.glyphs.glyphs 
        return Object.keys(glyphsAsObject).map((key) => glyphsAsObject[key]);
      }

      return null
    },
    widths: function() {
      var widths = []

      for (let index = 0; index < this.glyphArray.length; index++) {
        var glyph = this.glyphArray[index];
        widths.push(glyph.advanceWidth)
      }

      return widths
    },
  },
  watch: {
    showResults: function () {
      this.tileCount = 20
      this.drawComparison()
      this.drawGlyphs()
    },
    tileCount: function () {
      this.drawGlyphs()
    }
  },
  methods: {
    onFileChange: function(e) {
      this.showResults = false
      var vn = this
      this.fileName = e.target.value.split('\\').pop();
      var fileList = e.target.files || e.dataTransfer.files
      var file = fileList[0]

      setTimeout(function() {
        vn.processFile(file)
      }, 1000)
    },
    processFile: function (file) {
      var vn = this
      var reader = new FileReader()

      reader.onload = function () {
        var arrayBuffer = this.result
        vn.font = opentype.parse(arrayBuffer)

        vn.getModes(vn.widths)
        vn.animateResults(vn.modes)
      }

      reader.readAsArrayBuffer(file)
    },
    getModes: function (numbers) {
      var modes = [], count = [], i, number, maxIndex = 0;
  
      for (i = 0; i < numbers.length; i += 1) {
          number = numbers[i];
          count[number] = (count[number] || 0) + 1;
          if (count[number] > maxIndex) {
              maxIndex = count[number];
          }
      }
  
      for (i in count)
          if (count.hasOwnProperty(i)) {
              if (count[i] === maxIndex) {
                  modes.push({
                    number: Number(i),
                    count: count[i]
                  });
              }
          }
  
      this.modes = modes;
    },
    animateResults(modeResults) {
      var vn = this
      var modePercent = ((modeResults[0].count / this.glyphArray.length) * 100).toFixed(3)

      if (this.firstLoad) {
        vn.isMonoSpace = modePercent > 90
        vn.modePercent = modePercent
        vn.showResults = true
      } else {
        this.firstLoad = true
        setTimeout(function() {
          vn.isMonoSpace = modePercent > 90
          vn.modePercent = modePercent
          vn.showResults = true
        }, 750)
      }
    },
    drawGlyphs() {
      for (let index = 0; index < this.tileCount; index++) {
        var canvas = document.getElementById(index + '-canvas')
        var ctx = canvas.getContext("2d")
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        var glyph = this.glyphArray[index]
        var char = String.fromCharCode(glyph.unicode)

        this.font.draw(
          ctx, 
          char,
          30, 
          150, 
          100
        )

        this.font.drawMetrics(
          ctx, 
          char, 
          30, 
          150, 
          100
        )
      }
    },
    drawComparison() {
      var canvas = document.getElementById('compare-canvas')
      var ctx = canvas.getContext("2d")
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      this.font.draw(ctx, 'iiiiiiiiii', 10, 100, 100)
      this.font.drawMetrics(ctx, 'iiiiiiiiii', 10, 100, 100)

      this.font.draw(ctx, 'wwwwwwwwww', 10, 200, 100)
      this.font.drawMetrics(ctx, 'wwwwwwwwww', 10, 200, 100)
    }
  }
})