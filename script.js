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
    console.log(this.tranformWidth, 1)
  }
  removeCss() {
    this.el.css('-webkit-transform', 'translateX(0)')
    console.log(this.tranformWidth, 2)
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
var timeDelay = 300

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

var click = () => {
  return new Promise((resolve) => {
    $('.plane').one('click', resolve)
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
      var plane = $('plane')
      removeActive()
      if (pageNum == 1) {
        beforePage = lastPageNum
      }
      //plane
      plane.removeClass('page' + beforePage + '-plane')
      plane.addClass('page' + pageNum + '-plane')


      $('.page' + beforePage).removeClass('is-show')
      $('.page' + pageNum).addClass('is-show')

      //页面执行
      yield cb

      //退出页面
      if (pageNum == lastPageNum) {
        nextPage = 1
      }
      yield timeout(convertToMs(plane.css('transition-duration'))).then(() => {
        $('.page' + nextPage).trigger('begin')
      })
    })
  })
}

$(document).ready(function() {
  var plane = $('.plane')

  pageBegin(1, function*() {
    for (var i = 1; i < 6; i++) {
      yield addClass('.page1 .txt' + i, 'active', timeDelay)
    }

    //page1 plane
    yield addClass(plane, 'show-entry show', timeDelay)
    plane.removeClass('hide')
    yield [removeClass(plane, 'show-entry', timeDelay), addClass(plane, 'flash', timeDelay)]
    yield click().then(() => {
      plane.addClass('page-fly')
    })
    yield timeout(convertToMs(plane.css('transition-duration')))
    $('.page2').trigger('begin')
  })
  pageBegin(2, function*() {


    //页面
    for (var i = 1; i < 4; i++) {
      yield addClass('.page2 .txt' + i, 'active', timeDelay)
    }

    //page2 plane
    yield addClass(plane, 'show-entry show', timeDelay)
    plane.removeClass('hide')
    yield [removeClass(plane, 'show-entry', timeDelay), addClass(plane, 'flash', timeDelay)]
    yield click().then(() => {
      plane.addClass('page-fly')
    })
    yield timeout(convertToMs(plane.css('transition-duration')))
    $('.page2').trigger('begin')
  })

  pageBegin(3, function*() {
    yield addClass('.page3 .background', 'active', timeDelay)
    BgTransform.bt3.init().addCss()
    yield addClass('.page3 .txt1', 'active', timeDelay)
  })

  pageBegin(4, function*() {
    BgTransform.bt3.removeCss()
    yield addClass('.page4 .background', 'active', timeDelay)
    BgTransform.bt4.init().addCss()
  })

  pageBegin(5, function*() {
    BgTransform.bt4.removeCss()
    yield [addClass('.page5 .background', 'active', timeDelay), addClass('.page5 .front', 'active', timeDelay)]
    BgTransform.bt5.init().addCss()
  })

  pageBegin(6, function*() {
    BgTransform.bt5.removeCss()
    yield addClass('.page6 .head', 'active', timeDelay)
    yield addClass('.page6 .sub', 'active', timeDelay)
  })
  pageBegin(7, function*() {
    yield addClass('.page7 .head', 'active', timeDelay)
    yield addClass('.page7 .sub', 'active', timeDelay)
    yield addClass('.page7 .qrcode', 'active', timeDelay)
  })


  $('.page1').trigger('begin')


})