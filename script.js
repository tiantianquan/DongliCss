var css = require('./style.scss')
var $ = require('zeptojs')
var co = require('co')
require("babel/register")


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

// var registerCss = (str) => {
//   var deviceWidth = $(document).width()
//   var imgWidth = $('.page3 .background').width()
//   var tranformWidth = imgWidth - deviceWidth <= 0 ? 0 : imgWidth - deviceWidth
//   $('.page3 .background').css('transform', 'translateX(-' + tranformWidth + 'px' + ')')
//   console.log(deviceWidth, imgWidth)
// }

var timeout = (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms)
  })
}

var timeDelay = 0
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

var removeActive = () => {
  $('.active').removeClass('active')
}

var click = function() {
  return new Promise(function(resolve) {
    $('.plane').one('click', resolve)
  })
}

var pageBegin = (pageNum, cb) => {
  var lastPageNum = 7
  var beforePage = pageNum - 1
  var nextPage = pageNum + 1
  $('.page' + pageNum).on('begin', () => {
    co(function*() {
      removeActive()
      if (pageNum == 1) {
        beforePage = lastPageNum
      }
      // yield timeout(1000).then(()=>{$('.page'+beforePage).addClass('zoomInDown')})
      $('.page' + beforePage).removeClass('is-show')
      $('.page' + pageNum).addClass('is-show')

      yield cb
      yield timeout(timeDelay)
      if (pageNum == lastPageNum) {
        nextPage = 1
      }
      yield click().then(() => {
        $('.page' + nextPage).trigger('begin')
      })
    })
  })
}

$(document).ready(function() {
  pageBegin(1, function*() {
    for (var i = 1; i < 6; i++) {
      yield addClass('.page1 .txt' + i, 'active', timeDelay)
    }
  })
  pageBegin(2, function*() {
    for (var i = 1; i < 4; i++) {
      yield addClass('.page2 .txt' + i, 'active', timeDelay)
    }
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
    yield addClass('.page5 .background', 'active', timeDelay)
    BgTransform.bt5.init().addCss()
    yield addClass('.page5 .txt', 'active', timeDelay)
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