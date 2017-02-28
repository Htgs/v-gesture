;(function () {
  function touchStart (e, self) {
    var touchObj = self.touchObj
    touchObj.startX = e.touches[0].clientX
    touchObj.startY = e.touches[0].clientY
    touchObj.startTime = new Date().getTime()
  }
  function touchEnd (e, self) {
    var touchObj = self.touchObj
    touchObj.endX = e.changedTouches[0].clientX
    touchObj.endY = e.changedTouches[0].clientY
    touchObj.endTime = new Date().getTime()
    touchObj.distanceX = touchObj.endX - touchObj.startX
    touchObj.distanceY = touchObj.endY - touchObj.startY
    touchObj.time = touchObj.endTime - touchObj.startTime
  }
  function tap (e, self) {
    var touchObj = self.touchObj
    if (touchObj.time < 300 && Math.abs(touchObj.distanceX) < 6 && Math.abs(touchObj.distanceY) < 6) {
      self.handler(e)
    }
  }
  function swiper (e, self) {
    console.log(1);
    var touchObj = self.touchObj
    if (Math.abs(touchObj.distanceX) >= Math.abs(touchObj.distanceY)) {
      if (touchObj.distanceX > 20) {
        // 向左滑动
        console.log('swipeLeft is happen')
        self.handler(e, 'left')
      }
      else if (touchObj.distanceX < -20) {
        // 向右滑动
        console.log('swipeRight is happen')
        self.handler(e, 'right')
      }
    }
  }

  var vTap = {}
  vTap.install = function (Vue) {
    Vue.directive('gesture', {
      bind: function (el, binding) {
        el.touchObj = {}
        el.handler = function (e, dir) { // This directive.handler
          // console.dir(binding)
          var value = binding.value
          value.event = e
          if (dir) value.dir = dir
          value.methods(value)
        }
        el.addEventListener('touchstart', function (e) {
          if (binding.modifiers.stop) e.stopPropagation()
          if (binding.modifiers.prevent) e.preventDefault()
          touchStart(e, el)
        }, false)
        el.addEventListener('touchend', function (e) {
          touchEnd(e, el)
          switch (binding.arg) {
            case 'tap': {
              tap(e, el)
              break
            }
            case 'swiper': {
              swiper(e, el)
              break
            }
          }
        }, false)
      }
    })
  }
  if (typeof exports === 'object') {
    module.exports = vTap
  } else if (typeof define === 'function' && define.amd) {
    define([], function () { return vTap })
  } else if (window.Vue) {
    window.vTap = vTap
    Vue.use(vTap)
  }
})()
