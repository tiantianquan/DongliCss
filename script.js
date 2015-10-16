var css = require('./style.scss')
var $ = require('zeptojs')
var co = require('co')
require('babel/register')

var createjs = window.createjs

//log err
// var Raven = require('raven-js')
// Raven.config('https://af519d37286343ba8a18b50d2e15bbb2@app.getsentry.com/54864').install()

//全局变量
var bgAudio

//背景缓动类
class BgTransform {
  constructor(str) {
    this.queryStr = str

  }
  init() {
    this.el = $(this.queryStr)
    this.deviceWidth = $(document).width()
    this.imgWidth = this.el.width()
    this.tranformWidth = this.imgWidth - this.deviceWidth <= 0 ? 0 : this.imgWidth - this.deviceWidth
    return this
  }

  addCss() {
    this.el.css('-webkit-transform', 'translateX(-' + this.tranformWidth + 'px' + ')')
  }
  removeCss() {
    this.el.css('-webkit-transform', 'translateX(0)')
  }
}

BgTransform.bt3 = new BgTransform('.page3 .background')
BgTransform.bt4 = new BgTransform('.page4 .background')
BgTransform.bt5 = new BgTransform('.page5 .background')

class loadItem {
  constructor(str) {
    var strList = str.split('.')
    var name = strList[0]
    var ext = strList[1]
    switch (ext) {
      case 'jpg':
        this.src = `images/${str}`
        break
      case 'png':
        this.src = `images/${str}`
        break
      case 'mp3':
        this.src = `audio/${str}`
        break
      default:
        break
    }
    this.id = name
  }
}

class Preloader {
  constructor(manifest) {
    this.manifest = manifest.map((str) => {
      return new loadItem(str)
    })

    //init
    this.loadQueue = new createjs.LoadQueue(true)
      // createjs.Sound.registerPlugins([createjs.HTMLAudioPlugin])
      // this.loadQueue.installPlugin(createjs.Sound)
    this.loadQueue.setMaxConnections(this.manifest.length)

    this._onComplete()

    Preloader.list.push(this)
    return this
  }
  onFileLoad(cb) {
    this.loadQueue.on('fileload', cb)
    return this
  }
  _onComplete() {
    this.loadQueue.on('complete', (event) => {
      var events = event.target.getItems()
      events.forEach((event) => {
        if (event.item.type === 'image') {
          $(`#${event.item.id}`).attr('src', event.result.src)
        }
      })
    })
  }
  onComplete(cb) {
    this.loadQueue.on('complete', (event) => {
      var events = event.target.getItems()
      cb(events, event)
    })
    return this
  }
  load() {
    this.loadQueue.loadManifest(this.manifest)
  }
}

Preloader.list = []

//loading
Preloader.step1 = new Preloader([
  'loading-bg.png',
  'loading-front.png'
])

Preloader.step2 = new Preloader([
  'plane2.png',
  '1-txt1.png',
  '1-txt2.png',
  '1-txt3.png',
  '1-txt4.png',
  // 'bg2-lite.mp3',
  // 'broadcast.mp3'
])

Preloader.step3 = new Preloader([
  '2-txt1.png',
  '2-map.png',
  '2-rect.png',
  '2-paper.png',
  '2-people.png',
  '2-front2.jpg',
  '2-front1.jpg',
  '3-kid.png',
  '3-mom.png'
])


Preloader.step4 = new Preloader([
    '4-bg1.jpg',
    '4-txt1.png',
    '4-txt2.png',
    'website.jpg',
    'weibo.jpg',
    'phone-content1.jpg',
    'phone-content2.jpg',
    '5-bg1.jpg',
    '5-txt1.png',
    '5-txt2.png',
    '5-front1.jpg',
    '5-front2.jpg',
    '5-front3.jpg',
    '5-front4.jpg',
    'car1.png',
    'car2.png',
    '6-txt1.png',
    '7-txt1.png',
    '7-txt2.png',
    'qrcode.jpg',
    'title.jpg'
  ])
  //---------------------
Preloader.step1.onComplete(() => {
  Preloader.step2.load()
})

Preloader.step2.onComplete((events) => {
  console.log('complete')
  events.forEach((event) => {
    if (event.item.id === 'bg2-lite') {
      bgAudio = event.result
      $(bgAudio).addClass('bg-audio')
      $('#bg2-lite').append($(bgAudio))
      bgAudio.loop = true
      bgAudio.play()
    }
    if (event.item.id === 'broadcast') {
      $(event.result).addClass('broadcast')
      $('.page2').append($(event.result))
    }
    if (event.item.id === 'plane2') {
      $('.img-plane').attr('src', event.result.src)
    }
  })

  // bgAudio = $(' <audio class="bg-audio" src="audio/bg2-lite.mp3">')[0]
  // bgAudio.loop = true
  // $('#bg2-lite').append($(bgAudio))
  // bgAudio.load()
  var broadcast = $('<audio src="audio/broadcast.mp3" class="broadcast">')[0]
  $('.page2').append($(broadcast))
  broadcast.load()
  var si = setInterval(() => {
      // console.log(bgAudio.buffered.end(0), broadcast.buffered.end(0))
      if (bgAudio.readyState === 4 && broadcast.readyState === 4) {
        // if (bgAudio.buffered.length != 0 && bgAudio.duration === bgAudio.buffered.end(0) && broadcast.duration === broadcast.buffered.end(0)) {
        clearInterval(si)
        bgAudio.play()
        startPlay()
        Preloader.step3.load()
      }
    },
    500)

})

Preloader.step3.onComplete(() => {
  Preloader.step4.load()
})


//----------------------
$(document).ready(() => {
  Preloader.step1.load()
  bgAudio = $(' <audio class="bg-audio" src="audio/bg2-lite.mp3">')[0]
  bgAudio.loop = true
  $('#bg2-lite').append($(bgAudio))
  bgAudio.load()
})



var timeout = (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms)
  })
}


//延时时间
// var timeDelay = 2000
// var timeDelay = 1500
var timeDelay = 1000
var contentDur = 4000

var addClass = (el, className, delay) => {
  return timeout(delay).then(() => {
    $(el).addClass(className)
  })
}
var removeClass = (el, className, delay) => {
  return timeout(delay).then(() => {
    $(el).removeClass(className)
  })
}


//移除所有已完成效果
var removeActive = () => {
  $('.active').removeClass('active')
}

var click = (str) => {
  return new Promise((resolve) => {
    $(str).one('click', resolve)
  })
}

var convertToMs = (str) => {
  return parseFloat(str) * 1000
}

//注册页面开始事件
var pageBegin = (pageNum, cb) => {
  var lastPageNum = 7
  var beforePage = pageNum - 1
  var nextPage = pageNum + 1
  $('.page' + pageNum).on('begin', () => {
    co(function*() {
      //进入页面
      removeActive()
      if (pageNum == 1) {
        beforePage = lastPageNum
      }

      $('.page' + beforePage).removeClass('is-show')
      $('.page' + pageNum).addClass('is-show')

      var plane = $('.page' + pageNum + ' .plane')
      var planeBot = $('.plane-bottom')

      planeBot.addClass('hide')
        //页面执行
      yield cb(plane)


      //退出页面
      if (pageNum == lastPageNum) {
        nextPage = 1
      }
      yield addClass(planeBot, 'show-entry show', 0)
      planeBot.removeClass('hide')
      yield [removeClass(planeBot, 'show-entry', timeDelay), addClass('.plane-bottom .plane-bgc', 'flash', timeDelay),
        click(planeBot).then(() => {
          $('.plane-bgc').hide()
          planeBot.addClass('fly-out')

          //第二页暂停广播继续播放背景音乐
          if (pageNum === 2) {
            bgAudio = $('.bg-audio')[0]
            var broadcast = $('.broadcast')[0]
            var audioWrapper = $('.audio-wrapper')
            broadcast.pause()
            bgAudio.play()
            $('.audio-circle').addClass('is-hidden')
            audioWrapper.addClass('rotate')
          }
          if (pageNum === 3) {
            $('.page3 video').removeClass('is-show')
          }
        })
      ]
      yield timeout(convertToMs(planeBot.css('-webkit-transition-duration'))).then(() => {
        plane.removeClass()
        plane.addClass('plane')
        planeBot.removeClass()
        planeBot.addClass('plane-bottom')
        $('.plane-bgc').show()
        $('.page' + nextPage).trigger('begin')
      })
    })
  })
}


var startPlay = (cb) => {
  document.addEventListener('touchstart', function() {
      if (bgAudio.paused) {
        bgAudio.play()
        bgAudio.pause()

      } else {
        bgAudio.pause()
        bgAudio.play()
      }
    })
    // var videoEl = $('<div class="video"> <iframe src="http://www.tudou.com/programs/view/html5embed.action?type=0&code=WtRmrh5VYak&lcode=&resourceId=489764491_06_05_99" allowtransparency="true" allowfullscreen="true" allowfullscreenInteractive="true" scrolling="no"></iframe> </div>')
  var videoEl = $('<div class="video"><iframe frameborder="0" src="http://v.qq.com/iframe/player.html?vid=n0168ff67xt&tiny=0&auto=1" allowfullscreen></iframe></div>')
  var shortVideo = $(' <video src="video/video.mp4" preload="none" controls poster="images/video-poster.jpg" class="video is-hidden" webkit-playsinline></video> ')
  shortVideo[0].load()
  $('.loading').hide()

  var planeBot = $('.plane-bottom')
  var planeTxt = $('.plane-txt')

  //音频控制
  var audioWrapper = $('.audio-wrapper')
  var broadcast = $('.broadcast')[0]

  audioWrapper.click(() => {
    if (bgAudio.paused) {
      audioWrapper.addClass('rotate')
      bgAudio.play()
    } else {
      audioWrapper.removeClass('rotate')
      bgAudio.pause()
    }
  })

  pageBegin(1, function*(plane) {
    planeTxt.text('点击进入')
    for (var i = 1; i < 6; i++) {
      yield addClass('.page1 .txt' + i, 'active', timeDelay)
    }
  })

  pageBegin(2, function*(plane) {
    planeTxt.text('继续前进')

    //页面
    yield [
      addClass('.page2 .map', 'active', timeDelay),
      addClass('.page2 .rect', 'active', timeDelay),
      addClass('.page2 .txt3', 'active', timeDelay),
      timeout(timeDelay).then(() => {
        bgAudio = $('.bg-audio')[0]
        audioWrapper.removeClass('rotate')
        bgAudio.pause()
        if (bgAudio.paused === false)
          audioWrapper.trigger('click')
          // alert(`3:${bgAudio.paused}`)
          //音频归位
        broadcast.currentTime = 0
        broadcast.play()

        $('.audio-circle').removeClass('is-hidden')

        broadcast.addEventListener('ended', () => {
          if (bgAudio.paused) {
            bgAudio.play()
          }
          $('.audio-circle').addClass('is-hidden')
          audioWrapper.addClass('rotate')
        })
      })
    ]

    //广播
    //暂停背景音乐
    // yield timeout(timeDelay)
    // bgAudio.pause()
    // alert(1, bgAudio.paused)
    // audioWrapper.removeClass('rotate')
    //   //音频归位
    // broadcast.currentTime = 0
    // broadcast.play()

    // $('.audio-circle').removeClass('is-hidden')

    // broadcast.addEventListener('ended', () => {
    //   if (bgAudio.paused) {
    //     bgAudio.play()
    //   }
    //   $('.audio-circle').addClass('is-hidden')
    //   audioWrapper.addClass('rotate')
    // })

    //报纸 人
    yield [
      addClass('.page2 .paper', 'active', timeDelay * 5),
      addClass('.page2 .people', 'active', timeDelay * 5)
    ]

    yield addClass(plane, 'fly1', timeDelay / 2)
    yield addClass('.page2 .front1', 'active', convertToMs(plane.css('-webkit-transition-duration')))
    yield addClass('.page2 .front1', 'out', contentDur)
    yield [removeClass('.page2 .front1', 'out active', timeDelay), addClass('.page2 .front2', 'active', 0)]
    yield addClass('.page2 .front2', 'out', contentDur)
    yield removeClass('.page2 .front2', 'out active', timeDelay / 2)
    yield addClass(plane, 'fly-out', 0)
  })

  pageBegin(3, function*(plane) {
    bgAudio.play()
    yield [addClass('.mom', 'active', timeDelay), addClass('.kid', 'active', timeDelay)]
    yield addClass(plane, 'fly1', timeDelay)
    yield timeout(convertToMs(plane.css('-webkit-transition-duration'))).then(() => {
      $('.page3 .video-wrapper').append(shortVideo)
      shortVideo.addClass('is-show')
        // shortVideo[0].currentTime = 0
      shortVideo[0].play()
        // shortVideo[0].addEventListener('play', () => {
        //   bgAudio.play()
        // })
        // shortVideo[0].addEventListener('playing', () => {
        //   bgAudio.play()
        // })
      bgAudio.play()
    })
    yield addClass(plane, 'fly-out', timeDelay)
  })



  pageBegin(4, function*(plane) {
    bgAudio.play()
    shortVideo.removeClass('is-show')
    shortVideo.remove()
    yield addClass('.txt1', 'active', timeDelay)
    yield addClass(plane, 'fly1', timeDelay)
    yield addClass('.website', 'active', convertToMs(plane.css('-webkit-transition-duration')))
    yield removeClass('.website', 'active', contentDur)
    yield addClass('.weibo', 'active', convertToMs(plane.css('-webkit-transition-duration')))
    yield timeout(3 * timeDelay)
    $('.page4 .txt1').removeClass('active')
    $('.page4 .txt2').addClass('active')

    yield [addClass('.page4 .background', 'active', timeDelay), addClass(plane, 'fly2', timeDelay)]
    BgTransform.bt4.init().addCss()
    yield addClass('.phone-wrapper', 'active', timeDelay + convertToMs(plane.css('-webkit-transition-duration')))
    $('.page4 .content1').removeClass('hidden')
    yield timeout(contentDur)
    $('.page4 .content1').addClass('hidden')
    $('.page4 .content2').removeClass('hidden')
      // yield timeout(contentDur)
      // $('.page4 .content2').addClass('hidden')
      // $('.page4 .content3').removeClass('hidden')

    yield removeClass('.phone-wrapper', 'active', contentDur)
    yield addClass('.page4 .content2', 'hidden', timeDelay)
    yield addClass(plane, 'fly-out', 0)
  })



  pageBegin(5, function*(plane) {
    BgTransform.bt4.removeCss()

    yield [addClass('.page5 .car', 'active', 0),
      addClass(plane, 'fly1', 0)
    ]
    yield [addClass('.txt1', 'active', timeDelay), addClass('.page5 .front1', 'active', timeDelay)]
    yield addClass('.page5 .front1', 'out', contentDur)
    yield [removeClass('.page5 .front1', 'out active', timeDelay), addClass('.page5 .front2', 'active', 0)]
    yield addClass('.page5 .front2', 'out', contentDur)
    yield removeClass('.page5 .front2', 'out active', timeDelay / 2)
    yield [
      addClass('.page5 .background', 'active', timeDelay / 2),
      removeClass('.txt1', 'active', timeDelay / 2),
      addClass('.txt2', 'active', timeDelay / 2),
      addClass(plane, 'fly2', timeDelay / 2)
    ]
    BgTransform.bt5.init().addCss()
    yield addClass('.page5 .front3', 'active', timeDelay)
    yield addClass('.page5 .front3', 'out', contentDur)
    yield [removeClass('.page5 .front3', 'out active', timeDelay), addClass('.page5 .front4', 'active', 0)]
    yield addClass('.page5 .front4', 'out', contentDur)
    yield [removeClass('.page5 .front4', 'out active', timeDelay / 2), removeClass('.txt2', 'active', timeDelay / 2)]
    yield addClass(plane, 'fly-out', 0)
  })



  pageBegin(6, function*(plane) {
    bgAudio.pause()
    audioWrapper.removeClass('rotate')

    $('.page6 .video-wrapper').append(videoEl)
    planeTxt.text('点击返回')

    BgTransform.bt5.removeCss()
    plane.addClass('hide')
    yield addClass('.page6 .head', 'active', timeDelay)

  })



  pageBegin(7, function*(plane) {
    bgAudio.play()
    audioWrapper.addClass('rotate')

    videoEl.remove()
    planeTxt.text('再穿一次')

    plane.addClass('hide')
    yield addClass('.page7 .head', 'active', timeDelay)
    yield addClass('.page7 .sub', 'active', timeDelay)
    yield addClass('.page7 .qrcode', 'active', timeDelay)
  })


  $('.page1').trigger('begin')


}