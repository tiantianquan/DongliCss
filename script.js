var css = require('./style.scss')
var $ = require('zeptojs')
var co = require('co')
require('babel/register')

var createjs = window.createjs

//log err
var Raven = require('raven-js')
Raven.config('https://af519d37286343ba8a18b50d2e15bbb2@app.getsentry.com/54864').install()


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
            var bgAudio = $('.bg-audio')[0]
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
  Raven.context(() => {
    var videoEl = $('<div class="video"> <iframe src="http://www.tudou.com/programs/view/html5embed.action?type=0&code=WtRmrh5VYak&lcode=&resourceId=489764491_06_05_99" allowtransparency="true" allowfullscreen="true" allowfullscreenInteractive="true" scrolling="no"></iframe> </div>')
    var shortVideo = $(' <video src="video/video.mp4" preload="none" controls poster="images/video-poster.jpg" class="video is-hidden"></video>')
    $('.loading').hide()

    var planeBot = $('.plane-bottom')
    var planeTxt = $('.plane-txt')

    //音频控制
    var bgAudio = $('.bg-audio')[0]
      // bgAudio.play()
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
        addClass('.page2 .txt3', 'active', timeDelay)
      ]

      //广播
      //暂停背景音乐
      yield timeout(timeDelay)

      bgAudio.pause()
        //音频归位
      broadcast.currentTime = 0
      broadcast.play()
      audioWrapper.removeClass('rotate')
      $('.audio-circle').removeClass('is-hidden')

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
      yield [addClass('.mom', 'active', timeDelay), addClass('.kid', 'active', timeDelay)]
      yield addClass(plane, 'fly1', timeDelay)
      yield timeout(convertToMs(plane.css('-webkit-transition-duration')))
      $('.page3 .video-wrapper').append(shortVideo)
      shortVideo.addClass('is-show')
      shortVideo[0].currentTime = 0
      shortVideo[0].play()
      yield addClass(plane, 'fly-out', timeDelay)
    })



    pageBegin(4, function*(plane) {
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
      $('.page6 .video-wrapper').append(videoEl)
      planeTxt.text('点击返回')

      BgTransform.bt5.removeCss()
      plane.addClass('hide')
      yield addClass('.page6 .head', 'active', timeDelay)

    })



    pageBegin(7, function*(plane) {
      videoEl.remove()
      planeTxt.text('再穿一次')

      plane.addClass('hide')
      yield addClass('.page7 .head', 'active', timeDelay)
      yield addClass('.page7 .sub', 'active', timeDelay)
      yield addClass('.page7 .qrcode', 'active', timeDelay)
    })


    $('.page1').trigger('begin')


  })
}

//加载
$(window).on('load', () => {
  startPlay()
})

// var get = (url) => {
//   return new Promise((resolve, reject) => {
//     $.get(url, (res) => {
//       resolve(res)
//     })
//   })
// }

// var loadedProm = (loader) => {
//   return new Promise((resolve) => {
//     loader.on('fileload', (event) => {
//       resolve(event)
//     })
//   })
// }




// var step1Loader = new createjs.LoadQueue(true)
// step1Loader.setMaxConnections(2)

// createjs.Sound.registerPlugins([createjs.HTMLAudioPlugin])
// step1Loader.installPlugin(createjs.Sound);

// step1Loader.aaa = loadedProm(step1Loader)

// step1Loader.manifest = [{
//   src: 'loading-bg.png'
// }, {
//   src: 'loading-front.png'
// }]

// step1Loader.loadManifest(step1Loader.manifest, true, 'images/')