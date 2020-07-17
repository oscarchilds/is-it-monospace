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
    tileCount: 20,
    customTestText: 'compare',
    glyphSearch: ''
  },
  computed: {
    glyphArray: function () {
      if (this.font) {
        var glyphsAsObject = this.font.glyphs.glyphs 
        return Object.keys(glyphsAsObject).map((key) => glyphsAsObject[key]);
      }

      return null
    },
    searchedGlyphArray: function () {
      if (this.glyphSearch) {
        return this.glyphArray.filter(glyph => glyph.name.includes(this.glyphSearch))
      }

      return this.glyphArray
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
      var vm = this
      Vue.nextTick(function () {
        vm.drawGlyphs()
      })
    },
    customTestText: function () {
      this.drawComparison()
    },
    searchedGlyphArray: function () {
      var vm = this
      Vue.nextTick(function () {
        vm.drawGlyphs()
      })
    },
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
      var scale = 1 / this.font.unitsPerEm * 100;

      for (let index = 0; index < this.tileCount; index++) {
        var canvas = document.getElementById(index + '-canvas')
        var ctx = canvas.getContext("2d")
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        var glyph = this.searchedGlyphArray[index]
        var char = String.fromCharCode(glyph.unicode)

        canvas.width = (glyph.advanceWidth * scale) + 40

        this.font.draw(
          ctx, 
          char,
          20, 
          150, 
          100
        )

        this.font.drawMetrics(
          ctx, 
          char, 
          20, 
          150, 
          100
        )
      }
    },
    drawComparison() {
      var fontSize = 100
      var textArray = ['iiiiiiiiiiiiiii', 'aaaaaaaaaaaaaaa' ,'wwwwwwwwwwwwwww', this.customTestText]
      var i = 0
      var canvas = document.getElementById('compare-canvas')
      var ctx = canvas.getContext("2d")

      var scale = 1 / this.font.unitsPerEm * fontSize;

      var glyph = this.glyphArray.find(x => x.unicode == 119)
      canvas.width = ((glyph.advanceWidth * scale) * 15) + 20

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      textArray.forEach(text => {
        var y = 110 * (i + 1)

        this.font.draw(ctx, text, 10, y, fontSize)
        this.font.drawMetrics(ctx, text, 10, y, fontSize)

        i++
      })
    }
  }
})