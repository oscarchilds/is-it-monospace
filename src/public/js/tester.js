var app = new Vue({
  el: '#app',
  data: {
    showResults: false,
    isMonoSpace: null,
    modePercent: null,
    showLine: false,
    fileName: '',
    font: null,
    modes: null
  },
  computed: {
    glyphArray: function () {
      if (this.font) {
        var glyphsAsObject = this.font.glyphs.glyphs 
        return Object.keys(glyphsAsObject).map((key) => [Number(key), glyphsAsObject[key]]);
      }

      return null
    },
    widths: function() {
      var widths = []

      for (let index = 0; index < this.glyphArray.length; index++) {
        var glyph = this.glyphArray[index][1];
        widths.push(glyph.advanceWidth)
      }

      return widths
    },
  },
  methods: {
    onFileChange: function(e) {
      this.showResults = false
      var vn = this
      var fileList = e.target.files || e.dataTransfer.files
      var file = fileList[0]

      this.fileName = e.target.value.split('\\').pop();

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

      if (this.showLine) {
        setTimeout(function() {
          vn.isMonoSpace = modePercent > 95
          vn.modePercent = modePercent
          vn.showResults = true
        }, 1000)
      } else {
        this.showLine = true
        setTimeout(function() {
          vn.isMonoSpace = modePercent > 95
          vn.modePercent = modePercent
          vn.showResults = true
        }, 750)
      }
    }
  }
})