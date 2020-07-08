var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    uploadedFiles: [],
    results: {
      showResults: false,
      isMonoSpace: null,
      modePercent: null
    }
  },
  methods: {
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
  
      return modes;
    },
    testFont: function(font) {
      var vn = this
      var widths = []
      var glyphsAsObject = font.glyphs.glyphs

      var glyphs = Object.keys(glyphsAsObject).map((key) => [Number(key), glyphsAsObject[key]]);

      for (let index = 0; index < glyphs.length; index++) {
        var glyph = glyphs[index][1];
        widths.push(glyph.advanceWidth)
      }

      var modeResults = this.getModes(widths)
      var modePercent = ((modeResults[0].count / glyphs.length) * 100).toFixed(3)
      
      console.log(modePercent)

      setTimeout(function() {
        vn.results.isMonoSpace = modePercent > 95
        vn.results.modePercent = modePercent
        vn.results.showResults = true
      }, 1000)
    },
    onFileChange: function(e) {
      this.results.showResults = false
      var vn = this
      var fileList = e.target.files || e.dataTransfer.files
      var file = fileList[0]

      var reader = new FileReader()
      reader.onload = function () {
        var arrayBuffer = this.result
        var font = opentype.parse(arrayBuffer)

        vn.testFont(font)
      }

      reader.readAsArrayBuffer(file)
    }
  }
})