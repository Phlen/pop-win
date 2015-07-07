/*
 *弹窗组件
 *
 *Created by Phlen on 14-12-23.
 */

(function(global){
//首先：构造函数（方法）
  function PopWin(options){
    this._init(options)   //自定义方法
  }

  //原型法设计模型：

  PopWin.prototype = {
    //初始化
    _init:function(options){
      //设计默认选项：
      var defaultOptions = {
        title : "Title",
        width : 300,
        height : 150,
        content : "",
        className : " ",
        zIndex : 1,
        button : [
          {
            id : 'ok-btn',
            className: " ",
            btnText : "确定"
          }
        ]
      }

      $.extend(this,defaultOptions,options);  //扩展函数,参数按顺序为夫，子，孙子...(理解为继承)
      this._initDom();
      this._bindEvent();
    },

    //dom初始化
    _initDom:function(){
      //将弹框框架的HTML加到DOM里

      this.$mask = $('<div class="mask"></div>');
      this.$pop = $('<div class="pop"></div> ');
      this.$PopHeader = $('<div class="pop-header"></div> ');
      this.$PopBody = $('<div class="pop-body"></div> ');
      this.$PopFooter = $('<div class="pop-foot"></div> ');
      this.$PopTitle = $('<div class="pop-title"></div> ');
      this.$closeBtn = $('<div class="pop-close-btn"></div> ');


      this.$PopHeader.append(this.$PopTitle,this.$closeBtn);
    /*  this.$PopFooter.append(this.$actionBtn);*/
      this.$pop.append(this.$PopHeader,this.$PopBody,this.$PopFooter);
      $('body').append(this.$mask,this.$pop);

      //计算样式
      this._setStyle();

      //设计自定义样式

      this.$PopTitle.html(this.title);
      this.$PopBody.html(this.content);
      this.$pop.addClass(this.className);

      //底部按钮
      for (var i=0;i<this.buttons.length;i++){
        var btn = this.buttons[i];
        var $actionBtn = $('<a href="javascript:;" class="pop-action-btn"></a> ')
        btn.btnText && $actionBtn.text(btn.btnText)
        $actionBtn.addClass(btn.className);
        $actionBtn.data('id',btn.id);
        this.$PopFooter.append($actionBtn);
      }
    },
      //绑定内部DOM事件
    _bindEvent:function(){
      var self = this;
      //关闭按钮
      this.$closeBtn.on('click',function(){
        self.trigger('close-btn-click');
        self.hide();
      })
        //底部按钮：
        self.$pop.find('.pop-action-btn').click(function(){
          self.trigger('action-btn-click'+$(this).data('id'));
        });

    //当弹窗高度大于窗口高度时，pop的position设置为absolute
        $(window).on('resize.pop',function(){
          var winH = $(window).height();
          if(self.height > winH){
            var top = $(window).scrollTop() + 10; //无论滚条在距离顶部多远的位置，保证弹窗都在距离窗口顶部10px的位置显示
            self.$pop.css({"position":"absolute","top":top, "margin-top":0})
          }else{
            self.$pop.css({"position": "fixed", "top": "50%", "margin-top": -(self.height / 2)});
          }
        });
        $(window).trigger('resize.pop');
    },
    //设置样式：
    _setStyle:function(){
      this.$mask.css({"zIndex":this.zIndex});
      this.$pop.css({
        "width" : this.width,
        "height" : this.height,
        "zIndex" : this.zIndex+1,
        "marginTop" : -this.height/2,
        "marginLeft" : -this.width/2
      })
    },

    //外部监听:
    on:function(events,selector,callback){
      if(typeof selector === "string"){  //判断selector是否为字符串类型
        events += selector;
      }else{              //如果selector不是字符串，说明要调用on，要传递两个参数，一个是事件名字，一个是回调函数
        callback = selector;  //传递给on的selector参数即为callback
      }
      this.$pop.on(events, $.proxy(callback,this));     //改变this
    },

    //触发事件：

    trigger : function(events){
      this.$pop.trigger(events);
    },

    //设计弹窗内容（body）：
    setContent : function(html){
      this.$PopBody.html(html);
    },

    //显示弹窗：
    show:function(){
      this.$mask.show();
      this.$pop.show();
      this.trigger('show');
      $(window).trigger('resize.pop')
    },

    //隐藏弹窗：
    hide:function(){
      this.$mask.hide();
      this.$pop.hide();
      this.trigger('hide');
      $(window).trigger('resize.pop');
    }
  }
  global.PopWin = PopWin;
})(window)