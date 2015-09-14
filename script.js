var css = require('./style.scss')
var $ = require('zeptojs')
var co = require('co')
require("babel/register")

var timeout = function(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms)
  })
}

var timeDelay = 2000
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

var pageBegin = (pageNum, cb) => {
  $('.page' + pageNum).on('begin', () => {
    co(function*() {
      removeActive()
      $('.page' + (pageNum - 1)).removeClass('is-show')
      $('.page' + (pageNum)).addClass('is-show')
      yield cb
      yield timeout(timeDelay)
      click().then(() => {
        $('.page' + (pageNum + 1)).trigger('begin')
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
    yield addClass('.page3', 'active', timeDelay)
    yield addClass('.page3 .txt1', 'active', timeDelay)
  })


  $('.page1').trigger('begin')
})

var click = function() {
  return new Promise(function(resolve) {
    $('.plane').one('click', resolve)
  })
}