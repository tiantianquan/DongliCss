var css = require('./style.scss')
var $ = require('zeptojs')
  // var Reveal = require('reveal.js')

var timeDelay = 2000

$(document).ready(function() {

  var plane = $('.plane')
    //page1
  $('.page1').addClass('is-show')
  $('.page1 .txt1').addClass('active')

  for (var i = 1; i < 5; i++) {
    setTimeout(function(num) {
      $('.page1 .txt' + (num + 1)).addClass('active')
    }, timeDelay * i, i)
  }

  //page2
  $('.page2').on('begin', function() {
    for (var i = 1; i < 4; i++) {
      setTimeout(function(num) {
        $('.page2 .txt' + num).addClass('active')
      }, timeDelay * i, i)
    }
  })



  plane.on('click', function() {
    $('.page1').removeClass('is-show')
    $('.page2').addClass('is-show')
    $('.page2').trigger('begin')


    plane.off('click')

    plane.on('click', function() {})
  })
})