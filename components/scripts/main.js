/* ============================================================================
 index1
 TOPç”¨
============================================================================ */
/* 
 AlignGrid ãƒ‘ãƒãƒ«å…¨ä½“ç®¡ç†
---------------------------------------------- */
var AlignGrid = function(){
  this.init();
};

AlignGrid.prototype.init = function(){
  var self = this;

  self.$container = $('.content-main');

  self.$el = $('.cell');
  self.$elL = $('.sizeL');
  self.$elL = $('.sizeM');
  self.$elS = $('.sizeS');

  self._elLength = self.$el.length;
  self._lLength = self.$elL.length;
  self._sLength = self.$elS.length;
  self.split = 4;
  self.getSize(true);

  self.events();
};

AlignGrid.prototype.setEachCell = function(){
  var self = this;

  self.cells = [];

  var eachCell;
  for(var i = 0, l = self._elLength; i < l; i++){
    eachCell = new EachCell(self.$el[i], i, self.elW, self.split);
    self.cells.push(eachCell);
  }
};

AlignGrid.prototype.getSize = function(type){
  var self = this;

  self.containerW = self.$container.width();

  self.winW = $(window).innerWidth();
  self.winH = $(window).innerHeight();

  self.prevSplit = self.split;

  if($.browser.sp || $.browser.ds3 || $.browser.ds){
    self.split = 2;
  } else if(self.containerW < 1130) {
    self.split = 4;
  } else {
    self.split = 6;
  }

  self.elW = self.containerW/self.split;

  if(type){
    self.setEachCell();
  } else {
    $.each(self.cells, function(i ,e){
      e.getSize(self.split);
      e.setSize(self.elW);
    });
  }
  
  self.setGrid();
  self.setPostion();
  self.setContainerHeight();
}

AlignGrid.prototype.events = function(){
  var self = this;

  self.resizeHandler();

  self._showNum = 0;
  $.each(self.cells, function(i ,e){
    e.$el.on('countUpRequest',function(){
      self._showNum += 1;

      $.each(self.cells, function(i ,e){
        e.crtNum = self._showNum;
      });
    });
  });
};

AlignGrid.prototype.resizeHandler = function(){
  var self = this;

  var timer = null;
  var widthChange = (typeof window.onorientationchange) ? 'resize' : 'orientationchange'
  $(window).on(widthChange,function() {
      if(self.winW != $(window).innerWidth()){
        self.getSize(false);

        var moveType = (self.prevSplit != self.split) ? true : false;

        self.goPostion(moveType);
      }
      if(self.winH != $(window).innerHeight()){
        self.winH = $(window).innerHeight();

        $.each(self.cells, function(i ,e){
          e.winH = self.winH
        });
      }
  });
};

AlignGrid.prototype.showHandler = function(){
  var self = this;

  self.getSize(true);
  self.setContainerHeight();
  self.goPostion(false);

  $.each(self.cells, function(i ,e){
    e.$el.triggerHandler('showCellRequest');
  });
};

AlignGrid.prototype.setGrid = function(){
  var self = this;

  self._maxRow = 4*self._lLength + self._sLength;
  self._maxCol = self.split;

  self.arG = [];

  for(var i = 1; i <= self._maxRow; i++){
    self.arG[i] = [];
    for(var l = 1; l <= self._maxCol; l++){
      self.arG[i][l] = [i,l];
    }
  }
};

AlignGrid.prototype.setPostion = function(){
  var self = this;

  var cell, _size, g1, g2, _top, _left;
  loop0:
  for(var i = 0; i < self._elLength; i++){
    cell = self.cells[i];
    _size = cell._size;

    if(_size === 4){
      loop1:
      for(var j = 1; j <= self._maxRow; j++){
        for(var k = 1; k <= self._maxCol; k++){
          g1 = self.arG[j][k];
          g2 = self.arG[j][k+1];
          if(g1 && g2) {
            _top = eval(self.arG[j][k][0])-1;
            _left = eval(self.arG[j][k][1])-1;
            delete self.arG[j][k];
            delete self.arG[j][k+1];
            delete self.arG[j+1][k];
            delete self.arG[j+1][k+1];
            break loop1;
          }
        }
      }
    } else if(_size == 2) {
      loop2:
      for(var j = 1; j <= self._maxRow; j++){
        for(var k = 1; k <= self._maxCol; k++){
          g1 = self.arG[j][k];
          g2 = self.arG[j][k+1];
          if(g1 && g2) {
            _top = eval(self.arG[j][k][0])-1;
            _left = eval(self.arG[j][k][1])-1;
            delete self.arG[j][k];
            delete self.arG[j][k+1];
            break loop2;
          }
        }
      }
    } else if(_size === 1){
      loop2:
      for(var j = 1; j <= self._maxRow; j++){
        for(var k = 1; k <= self._maxCol; k++){
          g1 = self.arG[j][k];

          if(g1){
            _top = eval(self.arG[j][k][0])-1;
            _left = eval(self.arG[j][k][1])-1;
            delete self.arG[j][k];
            break loop2;
          }
        }
      }
    }
    cell.setPosition(_top*self.elW, _left*self.elW);
  }
};

AlignGrid.prototype.goPostion = function(type){
  var self = this;

  $.each(self.cells, function(i ,e){
    e.goPostion(type);
  });
};

AlignGrid.prototype.setContainerHeight = function(){
  var self = this;

  var ind = 0;
  var eH = 0;
  $.each(self.cells, function(i, e){
    if(eH < e._top + e.elH) {
      eH = e._top + e.elH;
    }
  });

  self.$container.height(eH).css({
    position: 'relative',
    'min-height': 0
  });
};

AlignGrid.prototype.deleteEach = function(){
  var self = this;

  $.each(self.cells, function(i ,e){
    delete e;
  });
};




/* 
 EachCell å„ãƒ‘ãƒãƒ«
---------------------------------------------- */
var EachCell = function(el, i, minW, split){
  this.$el = $(el);
  this._num = i;
  this.minW = minW;

  this.init(split);
};

EachCell.prototype.init = function(split){
  var self = this;

  self.sizeLarge = self.$el.attr('data-sizeLargeW');

  self.getSize(split);

  self.$box = self.$el.find('.box');
  self.$boxOv = self.$el.find('.box-over');

  if(self.$el.find('.box_label').length === 0){
    self.appendLabel();
  }

  if($.browser.pc || $.browser.tablet || $.browser.wiiu){
    if(self.$box.find('p').is('.imgS') && self.$box.find('imgL').length === 0){
      self.$box.find('p').after('<p class="imgL"><img src="'+self.$box.find('p').attr('data-imgL')+'" width="532" height="532"></p>')
    }
  }

  self.$box.find('p').css({
    opacity: 0,
    position: 'absolute'
  });

  self.$video = self.$box.find('video');
  self.$canvas = self.$video.next('canvas');
  self.videoW = self.$video.attr('width');
  self.videoH = self.$video.attr('height');

  if(self.$video.length > 0){
    if($.browser.ie8 || $.browser.nintendo || $.browser.sp || $.browser.tablet){
      var substitute = self.$video.attr('data-image');
      self.$video.after('<p><img src="'+substitute+'"></p>');
      self.$video.remove();
    } else {
      self.videoControl();
    }
  }

  self.$el.css({
    position: 'absolute'
  });

  self.$box.css({
    opacity: 0
  });
  self.$box.addClass('box-hide');

  self.pdg = self.$el.outerWidth() - self.$el.width();
  self.prevW = 0;
  self.prevH = 0;

  self.crtNum = 0;
  self.count = 0;

  self.setSize(self.minW);

  self.$el.one('showCellRequest',function(){
    if($.browser.ie8) self.fixedIE8();
    self.showCell(self._num - self.crtNum);
  });
};

EachCell.prototype.fixedIE8 = function(){
  var self = this;

  self.$box.find('img').each(function() {
    if($(this).attr('src').indexOf('.png') != -1) {
      $(this).css(
        'cssText','filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + $(this).attr('src') + '", sizingMethod="scale")'
      );
    }
  });
};

EachCell.prototype.appendLabel = function(){
  var self = this;

  self._label = self.$box.attr('data-label');
  self._labelPositon =  self.$box.attr('data-labelPosition');

  if(self._labelPositon == 'left'){
    self.$box.addClass('label-left');
  } else {
    self.$box.addClass('label-right');
  }

  if(self._label == 'wiiu'){
    self.$label = $('<span class="box_label"><img src="index/img/01_welcome/label/label_wiiu.png" width="46" height="22" alt="Wii U"></span>');
  } else if(self._label == '3ds'){
    self.$label = $('<span class="box_label"><img src="index/img/01_welcome/label/label_3ds.png" width="38" height="22" alt="3DS"></span>');
  } else if(self._label == 'amiibo'){
    self.$label = $('<span class="box_label"><img src="index/img/01_welcome/label/label_amiibo.png" width="56" height="22" alt="amiibo"></span>');
  } else if(self._label == 'wiiu-3ds'){
    self.$label = $('<span class="box_label"><img src="index/img/01_welcome/label/label_wiiu_3ds.png" width="85" height="22" alt="Wii U &amp; 3DS"></span>');
  } else if(self._label == 'wiiu-amiibo'){
    self.$label = $('<span class="box_label"><img src="index/img/01_welcome/label/label_wiiu_amiibo.png" width="103" height="22" alt="Wii U &amp; amiibo"></span>');
  } else if(self._label == '3ds-amiibo'){
    self.$label = $('<span class="box_label"><img src="index/img/01_welcome/label/label_3ds_amiibo.png" width="95" height="22" alt="Wii U"></span>');
  } else if(self._label == 'wiiu-3ds-amiibo'){
    self.$label = $('<span class="box_label"><img src="index/img/01_welcome/label/label_wiiu_3ds_amiibo.png" width="142" height="22" alt="Wii U"></span>');
  }

  self.$box.find('a').prepend(self.$label);

  if(!$.browser.anim && self.$label) self.$label.css('opacity',0);
};

EachCell.prototype.getSize = function(split){
  var self = this;

  self.split = split;

  if(split === 6){
    if(self.sizeLarge == 'sizeM'){
      self._size = 2;
    } else if(self.sizeLarge == 'sizeS'){
      self._size = 1;
    } else {
      self._size = 4;
    }
  } else {
    if(self.$el.is('.sizeL')){
      self._size = 4;
    } else if(self.$el.is('.sizeM')){
      self._size = 2;
    } else if(self.$el.is('.sizeS')){
      self._size = 1;
    }
  }
    
};

EachCell.prototype.setSize = function(minW){
  var self = this;

  if(self._size === 4){
    self.boxW = Math.round(minW*2 - self.pdg);
    self.boxH = Math.floor(self.boxW);
  } else if(self._size === 2){
    self.boxW = Math.round(minW*2 - self.pdg);
    self.boxH = Math.floor(minW - self.pdg);
  } else if(self._size === 1){
    self.boxW = Math.round(minW - self.pdg);
    self.boxH = Math.floor(self.boxW);
  }

  self.prevW = self.boxW;
  self.winH = $(window).innerHeight();
  self.elH = self.boxH + self.pdg;
};

EachCell.prototype.setPosition = function(t, l){
  var self = this;

  self._top = t;
  self._left = l;
};

EachCell.prototype.goPostion = function(type){
  var self = this;

  self.across = Math.ceil(self.elH*Math.sqrt(2));

  var animType = (self.$el.is(':animated') && !self.$box.is('box-show')) ? true : type;
  self.duration =  (self.$el.is(':animated') && !self.$box.is('box-show')) ? 200 : 300;

  if(self.count != 0){
    self.$box.finish().removeClass('box-hide box-show');
  }

  if(animType){
    self.$box.find('p').find('.imgProtrude').each(function(){
      var $that = $(this);
      thatW = $that.attr('width');
      thatH = $that.attr('height');

      thatL = $that.attr('data-left');
      thatT = $that.attr('data-top');

      if(self._size === 4){
        var imgW = 532;
        var imgH = 532;
      } else  if(self._size === 2){
        var imgW = 532;
        var imgH = 256;
      } else if(self._size === 1){
        var imgW = 256;
        var imgH = 256;
      }

      $that.closest('p').stop().animate({
        width: thatW*self.boxW/imgW,
        height: thatW*self.boxW/imgW * thatH/thatW,
        marginLeft: thatL*self.boxW/imgW,
        marginTop: thatT*self.boxH/imgH
      },self.duration,'easeOutQuad');
    });

    if($.browser.safari){
      self.$box.find('video').each(function(){
        var $that = $(this);
        $that.css({
          width: self.boxW,
          height: self.boxW*self.videoH/self.videoW
        });
      });
    }

    self.$el.stop().animate({
      top: self._top,
      left: self._left
    },self.duration,'easeOutQuad');
    self.$box.stop().animate({
      width: self.boxW,
      height: self.boxH
    },self.duration,'easeOutQuad',function(){
      self.$video.css({
        marginTop: -(self.boxW*self.videoH/self.videoW - self.boxH)/2
      });
    });
    if(self.split === 6){
      self.$el.find('.imgS').stop().fadeOut(300);
      self.$el.find('.imgL').stop().fadeIn(300);
    } else {
      self.$el.find('.imgS').stop().fadeIn(300);
      self.$el.find('.imgL').stop().fadeOut(300);
    }
  } else {
    self.$box.find('p').find('.imgProtrude').each(function(){
      var $that = $(this);
      thatW = $that.attr('width');
      thatH = $that.attr('height');

      thatL = $that.attr('data-left');
      thatT = $that.attr('data-top');

      if(self._size === 4){
        var imgW = 532;
        var imgH = 532;
      } else  if(self._size === 2){
        var imgW = 532;
        var imgH = 256;
      } else if(self._size === 1){
        var imgW = 256;
        var imgH = 256;
      }

      $that.closest('p').css({
        width: thatW*self.boxW/imgW,
        height: thatW*self.boxW/imgW * thatH/thatW,
        marginLeft: thatL*self.boxW/imgW,
        marginTop: thatT*self.boxH/imgH
      });
    });

    if($.browser.safari){
      self.$box.find('video').each(function(){
        var $that = $(this);
        $that.css({
          width: Math.ceil(self.boxW),
          height: Math.ceil(self.boxW*self.videoH/self.videoW)
        });
      });
    }

    self.$el.css({
      top: self._top,
      left: self._left
    });
    self.$box.css({
      width: self.boxW,
      height: self.boxH
    });

    if(self.count === 0){
      self.count += 1;
      self.showCell(self._num);
    }
    if(self.split === 6){
      self.$el.find('.imgS').hide();
      self.$el.find('.imgL').show();
    } else {
      self.$el.find('.imgS').show();
      self.$el.find('.imgL').hide();
    }
    self.$video.css({
      marginTop: -(self.boxW*self.videoH/self.videoW - self.boxH)/2
    });
  }
};

EachCell.prototype.showCell = function(delay){
  var self = this;

  if(_index1View === 0){
    if($.browser.anim){
      setTimeout(function(){
        self.$box.find('p').animate({
          opacity: 1,
        },4,'easeInOutSine');
        self.$box.animate({
          opacity: 1,
        },4,'easeInOutSine');
        self.$box.removeClass('box-hide').addClass('box-show');
      },50+150*self._num);
    } else {
      setTimeout(function(){
        self.$box.css('opacity',0).removeClass('box-hide');
        self.$box.find('p').animate({
          opacity: 1,
        },400);
        if(self.$label) {
          self.$label.animate({
            opacity: 1,
          },400);
        }
        self.$box.animate({
          opacity: 1,
        },400);
      },50+150*self._num);
    }

    setTimeout(function(){
      self.$box.removeClass('box-hide box-show');
      if(!self.$box.is('.box-shoadow') && self.$box.find('a').length > 0){
        self.$box.addClass('box-noShadowOn');
      }
      if(self.$box.is('.box-shoadow') && self.$box.find('a').length > 0){
        self.$box.addClass('box-shadowOn');
      }
    },self._num*150+1000);
  } else {
    setTimeout(function(){
      self.$box.find('p').animate({
        opacity: 1,
      },4,'easeInOutSine');
      self.$box.animate({
        opacity: 1,
      },4,'easeInOutSine');
      if(self.$label) {
        self.$label.animate({
          opacity: 1,
        },4,'easeInOutSine');
      }
      self.$box.removeClass('box-hide').addClass('box-show');
    },50+150);
    setTimeout(function(){
      self.$box.removeClass('box-hide box-show');
      if(!self.$box.is('.box-shoadow') && self.$box.find('a').length > 0){
        self.$box.addClass('box-noShadowOn');
      }
      if(self.$box.is('.box-shoadow') && self.$box.find('a').length > 0){
        self.$box.addClass('box-shadowOn');
      }
    },150+1000);
  }

  self.windowH = $(window).innerHeight();
  var scrT;
  if(self.$video.length > 0 && $.browser.pc && !$.browser.ie8){
    scrT = $(window).scrollTop();
    if(scrT + self.windowH >= self._top - 10 && scrT - 20 < self._top + self.boxH) {
      self.$video[0].play();
    } else {
      self.$video[0].pause();
    }
  }
};

EachCell.prototype.videoControl = function(){
  var self = this;

  $(window).on('scroll resize',function(){
    var scrT = $(window).scrollTop();

    if(scrT + self.windowH >= self._top - 10 && scrT - 20 < self._top + self.boxH) {
      if(self.$video[0].paused || self.$video[0].ended) self.$video[0].play();
    } else {
      if(!self.$video[0].paused) self.$video[0].pause();
    }
  });
};