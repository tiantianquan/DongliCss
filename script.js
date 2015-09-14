var css = require('./style.scss')
var $ = require('zeptojs')
  // var Reveal = require('reveal.js')

$(document).ready(function() {

  var timeDelay = 1000
  $('.page1 .txt1').addClass('active')

  setTimeout(function() {
    $('.page1 .txt2').addClass('active')
  }, timeDelay * 1)
  setTimeout(function() {
    $('.page1 .txt3').addClass('active')
  }, timeDelay * 2)
  setTimeout(function() {
    $('.page1 .txt4').addClass('active')
  }, timeDelay * 3)
  setTimeout(function() {
    $('.page1 .txt5').addClass('active')
  }, timeDelay * 4)
})