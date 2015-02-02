
window.onload = function () {

  // apply default colors
  updateColors(getAmbientColors())

  var vidWidth = 24
  var vidHeight = 18

  navigator.getMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia)
  navigator.getMedia(

    { video:true, audio:false },

    function (mediaStream) {

      document.getElementsByTagName('header')[0].innerHTML = 'Excellent!'

      var video = document.createElement('video')
      video.id = 'camera'
      video.height = vidHeight
      document.body.appendChild(video)
      video.src = window.URL.createObjectURL(mediaStream)
      video.play()
      video.style.visibility = 'hidden'

      var canvas = document.createElement('canvas')
      canvas.id = 'canvas'
      canvas.height = vidHeight
      document.body.appendChild(canvas)
      canvas.style.visibility = 'hidden'

      var ctx = canvas.getContext('2d')

      setInterval(function () {

        ctx.drawImage(video, 0, 0, vidWidth, vidHeight)

        var imgData = ctx.getImageData(0, 0, vidWidth, vidHeight)
        var colors = getAmbientColors(imgData.data)
        updateColors(colors)

      }, 500)

    },

    function (error) {
        console.log(error);
    }
  )

}

function getAmbientColors(data) {

  // config this anyway
  var defaultColors = {
    lightest: 'ffffff',
    darkest: '000000',
    median: '555555',
    link: '008fff'
  }

  var colors = {
    lightest: 'ffffff',
    darkest: '000000',
    median: '555555',
    link: '008fff'
  }

  if (data) {

    var rows = Math.floor(data.length / 4)

    var red = 0
    var green = 0
    var blue = 0

    var lightest = [0, 0, 0]
    var darkest = [100, 100, 100] // manually set the limit

    for ( var i = 0; i < data.length; i += 4 ) {

      var r = data[i]
      var g = data[i + 1]
      var b = data[i + 2]

      // darkest
      if (r < darkest[0] && g < darkest[1] && b < darkest[2]) {
        darkest[0] = r
        darkest[1] = g
        darkest[2] = b
      }
      colors.darkest = (
        (0 + (Math.floor(darkest[0]).toString(16))).slice(-2) + '' +
        (0 + (Math.floor(darkest[1]).toString(16))).slice(-2) + '' +
        (0 + (Math.floor(darkest[2]).toString(16))).slice(-2) + ''
      )

      // lightest
      if (r > lightest[0] && g > lightest[1] && b > lightest[2]) {
        lightest[0] = r
        lightest[1] = g
        lightest[2] = b
      }
      colors.lightest = (
        (0 + (Math.floor(lightest[0]).toString(16))).slice(-2) + '' +
        (0 + (Math.floor(lightest[1]).toString(16))).slice(-2) + '' +
        (0 + (Math.floor(lightest[2]).toString(16))).slice(-2) + ''
      )

      red += r
      green += g
      blue += b

    }

    // median
    colors.median = (
      Math.floor(red/(rows * 255) * 100 * 255/100).toString(16) + '' +
      Math.floor(green/(rows * 255) * 100 * 255/100).toString(16) + '' +
      Math.floor(blue/(rows * 255) * 100 * 255/100).toString(16) + ''
    )

    // links
    colors.link = (
      Math.floor(red/(rows * 255) * 100 * 255/100).toString(16) + '' +
      Math.floor(green/(rows * 150) * 100 * 255/100).toString(16) + '' +
      Math.floor(blue/(rows * 50) * 100 * 255/100).toString(16) + ''
    )

    // median dark
    colors.medianDark = (
      Math.floor(red/(rows * 255) * 50 * 255/100).toString(16) + '' +
      Math.floor(green/(rows * 255) * 50 * 255/100).toString(16) + '' +
      Math.floor(blue/(rows * 255) * 50 * 255/100).toString(16) + ''
    )

    // too dark to read data, use defaults
    if (red == 0 || green == 0 || blue == 0) {
      return defaultColors
    }
    else {
      return colors
    }
  }
  else {
    return defaultColors
  }

}


function updateColors(colors) {

  document.body.style.backgroundColor = '#' + colors.median
  document.body.style.color = '#' + colors.lightest
  document.getElementsByTagName('header')[0].style.backgroundColor = '#' + colors.darkest
  document.getElementsByTagName('header')[0].style.color = '#' + colors.median
  document.getElementsByTagName('h2')[0].style.color = '#' + colors.medianDark
  document.getElementsByTagName('p')[0].style.color = '#' + colors.medianDark

  var links = document.getElementsByTagName('a')
  for (var i = 0; i < links.length; i++) {
    links[i].style.color = '#' + colors.link
  }
  document.getElementsByTagName('footer')[0].style.color = '#' + colors.medianDark

}

