var css = require('./style.scss')
var $ = require('zeptojs')
var co = require('co')
require("babel/register")

var timeout = function(ms) {
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
    yield addClass('.page3', 'active', timeDelay)
    yield addClass('.page3 .txt1', 'active', timeDelay)
  })

  pageBegin(4, function*() {
    yield addClass('.page4', 'active', timeDelay)
  })

  pageBegin(5, function*() {
    yield addClass('.page5 .txt', 'active', timeDelay)
  })

  pageBegin(6, function*() {
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