/**
 * Created by Administrator on 14-12-24.
 */

(function (global) {

  function PopWin(options) {
    this._init(options);
  }

  PopWin.prototype = {
    _init: function (options) {
      var defaultOptions = {
        title: "Title",
        width: 300,
        height: 150,
        content: " ",
        className: "",
        zIndex: 1,
        buttons: [
          {
            id: "ok-btn",
            btnText: "确定",
            className: " "
          }
        ]
      };

      $.extend(this, defaultOptions, options);
      this._initDom();
      this._bindEvent();
    },

    //将HTML放到DOM里
    _initDom: function () {
      this.$mask = $('<div class="pop-win-mask"></div>');
      this.$win = $('<div class="pop-win"></div>');
      this.$winHeader = $('<div class="win-header"></div>');
      this.$winBody = $('<div class="win-body"></div>');
      this.$winFooter = $('<div class="win-footer"></div>');
      this.$winTitle = $('<div class="win-title"></div>');
      this.$closeBtn = $('<div class="win-close-btn"></div>');

      this.$winHeader.append(this.$winTitle, this.$closeBtn);
      this.$winFooter.append(this.$actionBtn);
      this.$win.append(this.$winHeader, this.$winBody, this.$winFooter);
      $('body').append(this.$mask, this.$win);

      //设置样式：
      this._setStyle();

      //自定义样式：
      this.$winTitle.html(this.title);
      this.$winBody.html(this.content);
      this.$win.addClass(this.className);

      //设置底部按钮：
      for (var i = 0; i < this.buttons.length; i++) {
        var btn = this.buttons[i],
            $actionBtn = $('<a href="javascript:;" class="win-action-btn"></a> ');
        btn.btnText && $actionBtn.text(btn.btnText);
        $actionBtn.addClass(btn.className);
        $actionBtn.data('id', btn.id);
        this.$winFooter.append($actionBtn);
      }
    },

    //绑定内部事件：

    _bindEvent: function () {
      var self = this;
      //关闭按钮：
      this.$closeBtn.on('click', function () {
        self.trigger('close-btn-click');
        self.hide();
      });

      //按下底部按钮：

      this.$win.find('.win-action-btn').click(function () {
        self.trigger('action-btn-click' + $(this).data('id'));
      });

      //当弹窗高度大于窗口高度是，将win的position设置为absolute,且无论滚动条在距离网页顶部多远，保证弹窗在距离窗口上部10px处显示
      $(window).on('resize.pop-win', function () {
        var winH = $(window).height();
        if (self.height > winH) {
          var top = $(window).scrollTop() + 10; //$(window).scrollHeight()为当前窗口距离顶部的位置，即滚动条的位置
          self.$win.css({"position": "absolute", "top": top, "marginTop": 0})
        } else {
          self.$win.css({"position": "fixed", "top": "50%", "marginTop": -(self.height / 2)})
        }
      });
      $(window).trigger('resize.pop-win');
    },

    //设置样式：
    _setStyle: function () {
      this.$mask.css({
        "zIndex": this.zIndex
      });

      this.$win.css({
        "width": this.width,
        "height": this.height,
        "marginLeft": -this.width / 2,
        "marginTop": -this.height / 2,
        "zIndex": this.zIndex + 1
      })
    },

    //外部监听事件：
    on: function (events, selector, callback) {
      //先判断selector是不是字符串，如果不是字符串，说明要调用on事件
      if (typeof selector === "string") {
        events += selector;
      } else {
        //selector不是字符串，要调用on事件，传递两个参数，一个是事件名字，一个是回调函数，此时传递个on的selector就是callback
        callback = selector;
      }
      this.$win.on(events, $.proxy(callback, this))
    },

    //触发事件：
    trigger: function (events) {
      this.$win.trigger(events);
    },

    //设置添加弹窗body部分的内容（自定义）
    setContent: function (html) {
      this.$winBody.html(html);
    },

    //显示弹窗：
    show: function () {
      this.$mask.show();
      this.$win.show();
      this.trigger('show');
      $(window).trigger('resize.pop-win');
    },

    //隐藏弹窗：

    hide: function () {
      this.$mask.hide();
      this.$win.hide();
      this.trigger('hide');
    }
  }

  global.PopWin = PopWin;
})(window)