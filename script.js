var css = require('./style.scss')
var $ = require('zeptojs')
var co = require('co')
require("babel/register")


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
var timeDelay = 500

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

var convertToMs = (str) => parseFloat(str) * 1000

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
      yield timeout(convertToMs(plane.css('transition-duration')))
      yield addClass(planeBot, 'show-entry show', timeDelay)
      planeBot.removeClass('hide')
      yield [removeClass(planeBot, 'show-entry', timeDelay), addClass(planeBot, 'flash', timeDelay)]
      yield click(planeBot).then(() => {
        planeBot.addClass('fly-out')
      })
      yield timeout(convertToMs(planeBot.css('transition-duration'))).then(() => {
        plane.removeClass()
        plane.addClass('plane')
        planeBot.removeClass()
        planeBot.addClass('plane-bottom')
        $('.page' + nextPage).trigger('begin')
      })
    })
  })
}

$(document).ready(function() {
  var planeBot = $('.plane-bottom')
  var planeTxt = $('.plane-txt')

  pageBegin(1, function*(plane) {
    planeTxt.text('点击进入')
    for (var i = 1; i < 6; i++) {
      yield addClass('.page1 .txt' + i, 'active', timeDelay)
    }
  })

  pageBegin(2, function*(plane) {
    planeTxt.text('继续前进')

    //页面
    yield addClass('.page2 .map', 'active', timeDelay)
    yield addClass('.page2 .rect', 'active', timeDelay)
    yield addClass('.page2 .txt3', 'active', timeDelay)
    yield [
      addClass('.page2 .paper', 'active', timeDelay),
      addClass('.page2 .people', 'active', timeDelay)
    ]

    yield addClass(plane, 'fly1', timeDelay)
    yield addClass('.page2 .front', 'active', timeDelay + convertToMs(plane.css('transition-duration')))
    yield click('.page2 .front').then(() => {
      $('.page2 .front').removeClass('active')
    })
    yield addClass(plane, 'fly-out', timeDelay)
  })

  pageBegin(3, function*(plane) {
    yield addClass('.kid', 'active', timeDelay)
    yield addClass('.mom', 'active', timeDelay)
    yield addClass(plane, 'fly1', timeDelay)
    yield addClass(plane, 'fly-out', timeDelay)
  })



  pageBegin(4, function*(plane) {
    yield addClass(plane, 'fly1', timeDelay)
    yield addClass('.weibo', 'active', timeDelay + convertToMs(plane.css('transition-duration')))
    yield click('.weibo').then(() => {
      $('.weibo').removeClass('active')
    })

    yield [addClass('.page4 .background', 'active', timeDelay), addClass(plane, 'fly2', timeDelay)]
    BgTransform.bt4.init().addCss()
    yield addClass('.phone', 'active', timeDelay + convertToMs(plane.css('transition-duration')))

    yield click('.phone').then(() => {
      $('.phone').removeClass('active')
    })
    yield addClass(plane, 'fly-out', timeDelay)
  })



  pageBegin(5, function*(plane) {
    BgTransform.bt4.removeCss()

    yield addClass(plane, 'fly1', timeDelay)
    yield [addClass('.page5 .background', 'active', timeDelay),
      addClass('.page5 .front', 'active', timeDelay),
      addClass(plane, 'fly2', timeDelay + convertToMs(plane.css('transition-duration')))
    ]
    BgTransform.bt5.init().addCss()
    yield addClass(plane, 'fly-out', timeDelay)
  })



  pageBegin(6, function*(plane) {
    planeTxt.text('点击返回')

    BgTransform.bt5.removeCss()
    plane.addClass('hide')

    yield addClass('.page6 .head', 'active', timeDelay)
    yield addClass('.page6 .sub', 'active', timeDelay)

  })



  pageBegin(7, function*(plane) {
    planeTxt.text('再穿一次')

    plane.addClass('hide')
    yield addClass('.page7 .head', 'active', timeDelay)
    yield addClass('.page7 .sub', 'active', timeDelay)
    yield addClass('.page7 .qrcode', 'active', timeDelay)
  })


  $('.page1').trigger('begin')


})