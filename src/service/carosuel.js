import Vue from "vue";

const browser = {
  versions:function(){
    const u = navigator.userAgent;
    console.log(navigator.userAgent);
    // const app = navigator.appVersion;
    return {//移动终端浏览器版本信息
      trident: u.indexOf('Trident') > -1, //IE内核
      presto: u.indexOf('Presto') > -1, //opera内核
      webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
      android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
      iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
      iPad: u.indexOf('iPad') > -1, //是否iPad
      webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
      weixin: u.indexOf('MicroMessenger') > -1, //是否微信
      qq: u.match(/\sQQ/i) == " qq" //是否QQ
    };
  }(),
  language:(navigator.browserLanguage || navigator.language).toLowerCase()
};

// 页面数据
export class PageData {
  // data: { type: Array}
  // prev: { type: Object, class: PagaData }
  // next: { type: Object, class: PagaData }
  constructor(data, pageNumber) {
    // 链表指针
    this.next = null;
    this.prev = null;
    // 数据
    this.data = data;
    this.pageNumber = pageNumber;
  }
  getData() {
    return this.data;
  }
  setPrev(prevObj) {
    this.prev = prevObj;
  }
  setNext(nextObj) {
    this.next = nextObj;
  }
  getPrev() {
    return this.prev;
  }
  getNext() {
    return this.next;
  }
  getPageNumber() {
    return this.pageNumber;
  }
}

// 页面元素
class Page {
  static carosuel = [];
  // 设置页面拖动标记
  isDrag = false;
  // 设置页面是否正在翻页过程
  isSlide = false;
  isTouch = false;
  trigger = null;
  touchstartEvent = 'mousedown';
  touchmoveEvent = 'mousemove';
  touchendEvent = 'mouseup';
  // 触摸监听句柄
  touchstart = null;
  touchmove = null;
  touchend = null;
  // 动画结束句柄 warning: 若添加了除翻页外的动画
  transitionend = null;
  carosuelId = null;
  constructor(pageNumber, carosuelId, trigger) {
    this.page = pageNumber;
    // 设置页面转化关系
    this.prev = null;
    this.next = null;
    // 设置dom元素
    this.width = 0;
    this.height = 0;
    this.element = null;
    this.elementPosition = 0;
    this.carosuelId = carosuelId;
    this.trigger = trigger;
    console.log(trigger)
    // console.log('this.carosuelId', this.carosuelId)
  }
  setPage(element) {
    const self = this;
    let startX = null;
    let endX = null;
    let direction = null;
    this.element = element;
    this.element.style.transitionDuration = "300ms";
    this.element.style.display = "block";
    this.touchstart = function (event) {
      // 记录触摸点
      event.preventDefault();
      let touches = event.touches && event.touches[0] || event;
      self.isTouch = true;
      startX = touches.clientX;
    };
    this.touchmove = function (event) {
      // 设置滑动距离
      event.preventDefault();
      if(!self.isTouch) {
        return;
      }
      if ( self.isDrag || Page.carosuel[self.carosuelId].isLoading != 0) {
        // 若已有拖动/翻页加载事件，则阻止该拖动
        // console.log(self.isDrag , Page.carosuel[self.carosuelId].isLoading);
        console.log('已经在拖动过程或加载数据中，不能再次拖动');
        return;
      }
      if(typeof endX ==='number' && Math.abs(endX) > 120) {
        event.stopPropagation();
        return;
      }
      // Page.isDrag = true;
      let touches = event.touches && event.touches[0] || event;

      endX = touches.clientX - startX;
      // 暂时弃用，拖动页面
      // self.dragPosition(endX);
      // if(endX > 0 && self.getPrev() && self.getPageData() && self.getPageData().getPrev()) {
      // 	self.getPrev().dragPosition(endX);
      // }
      // if(endX < 0 && self.getNext() && self.getPageData() && self.getPageData().getNext()) {
      // 	self.getNext().dragPosition(endX);
      // }
    };
    this.touchend = function (event) {
      event.preventDefault();
      if(!self.isTouch) {
        return;
      }
      if ( self.isDrag ||  Page.carosuel[self.carosuelId].isLoading != 0) {
        // 若已有拖动/翻页加载事件，则阻止该拖动
        console.log('已经在拖动过程或加载数据中，不能再次拖动');
        return;
      }
      self.isTouch = false;

      let distance = endX;
      // 判断是否可以切换页面
      let canSwitchPage = true;
      endX = null;
      if( distance > 0) {
        direction = 'prev';
        // if(self.getPageData() && self.getPageData().getPrev()) {
        // 	direction = 'prev';
        // }
        // else {
        // 	canSwitchPage = false;
        // 	direction = null;
        // }
      }
      else {
        direction = 'next';
        // if(self.getPageData() && self.getPageData().getNext()) {
        // 	direction = 'next';
        // }
        // else {
        // 	canSwitchPage = false;
        // 	direction = null;
        // }
      }
      distance = Math.abs(distance);
      // 切换页面判断先放置在换页逻辑中
      if(distance > 120 /* && canSwitchPage*/ && Page.carosuel[self.carosuelId]) {
        // 滑动距离大于阈值，切换页面
        event.stopPropagation();
        if(direction) {
          // 通知翻页
          Page.carosuel[self.carosuelId][direction]();
          // 设置拖动标记为真
          // self.isDrag = true;
          // 	console.log(direction);

          // TODO:需要判断翻页是否成功，若翻页失败则移动位置要归零
        }
        // 暂时弃用，复原拖动页面
        // else {
        // 	// 元素返回原始位置
        // 	self.clearMove();
        // 	if(self.getPrev()) {
        // 		self.getPrev().clearMove();
        // 	}
        // 	if(self.getNext()) {
        // 		self.getNext().clearMove();
        // 	}
        // }
      }
      else {
        // 暂时弃用，复原拖动页面
        // 元素返回原始位置
        // self.clearMove();
        // if(self.getPrev()) {
        // 	self.getPrev().clearMove();
        // }
        // if(self.getNext()) {
        // 	self.getNext().clearMove();
        // }
      }
      direction = null;
      // Page.isDrag = false;
    };
    if(this.trigger == 'mouse') {
      // default event
      this.element.addEventListener('mouseover', this.touchend);
    }
    else if(this.trigger == 'touch' || browser.versions.mobile || browser.versions.ios || browser.versions.android ||
      browser.versions.iPhone || browser.versions.iPad){
      this.touchstartEvent = 'touchstart';
      this.touchmoveEvent = 'touchmove';
      this.touchendEvent = 'touchend';
    }
    else {
      this.element.addEventListener('mouseover', this.touchend);
    }
    this.element.addEventListener(this.touchstartEvent, this.touchstart, true);

    this.element.addEventListener(this.touchmoveEvent, this.touchmove, true);

    this.element.addEventListener(this.touchendEvent, this.touchend, true);
    this.element.addEventListener('transitionend', this.transitionend = function (event) {
      // 	console.log('transitionend', event);
      // 	console.log(self.isDrag ,self.isSlide)
      // 若拖动但是翻页失败，则位置清零
      if(event.propertyName !== 'transform') {
        return;
      }
      if(self.isDrag ) {
        setTimeout(function () {
          self.isDrag = false;
        }, 0);
        if(!self.isSlide) {
          self.clearMove();
        }
      }
      if(self.isSlide) {
        // 滑动结束，设置滑动标记为假
        self.isSlide = false;
        // self.clearMove();
      }
      // self.isSlide = false;

      // 加载数据状态机，暂时弃用
      // if(self.isSlide == false && Page.carosuel[self.carosuelId].isLoading > 0) {
      // 	Page.carosuel[self.carosuelId].isLoading -= 1;
      //
      // }

      // console.log(self.isDrag ,self.isSlide)
    })
  }
  setWidth(width) {
    this.width = width;
    if(this.element) {
      this.element.style.width = `${width}px`;
    }
  }
  getWidth() {
    return this.width;
  }
  setHeight(height) {
    this.height = height;
    if(this.element) {
      this.element.style.height = `${height}px`;
    }
  }
  getHeight() {
    return this.height;
  }
  getPage() {
    return this.element;
  }
  setElementPosition(number) {
    this.elementPosition = number;
  }
  getElementPosition() {
    return this.elementPosition;
  }
  stepWidth(stepNumber) {
    this.elementPosition = stepNumber * this.width + this.elementPosition;
    return this.elementPosition;
  }
  movePosition(direction, stepNumber, isHide) {
    // console.log('move', this.element);
    if(this.element) {
      // 设置滑动标记为真
      this.isSlide = true;
      if(isHide) {
        const self = this;
        let displayVal = this.element.style.display;
        displayVal = displayVal == '' ? 'block': displayVal;
        this.element.style.display = 'none';
        this.element.style.transitionDuration = '0ms';
        setTimeout(function () {
          if(displayVal == 'none') {
            displayVal = 'block';
          }
          self.element.style.display = displayVal;
          self.element.style.transitionDuration = '300ms';
          self.isSlide = false;
        }, 0)
      }
      switch(direction) {
        case 'left':
          this.element.style.transform = `translate3d(${this.stepWidth(stepNumber * -1)}px, 0, 0)`;
          // this.element.style.transform = `translateX(${this.stepWidth(stepNumber * -1)}px)`;
          break;
        case 'right':
          this.element.style.transform = `translate3d(${this.stepWidth(stepNumber)}px, 0, 0)`;
          // this.element.style.transform = `translateX(${this.stepWidth(stepNumber)}px)`;
          break;
      }

    }
  }
  dragPosition(distance) {
    if(this.element) {
      // 计算滑动距离
      let totalDistance = this.getElementPosition() + distance;
      this.element.style.transform = `translate3d(${totalDistance}px, 0, 0)`;
      // this.element.style.transform = `translateX(${totalDistance}px)`;
    }
  }
  clearMove() {
    this.movePosition('left', 0);
  }
  setPageNum(pageNumber) {
    this.page = pageNumber;
  }
  addPageNum() {
    this.page += 1;
  }
  minusPageNum() {
    this.page -= 1;
  }
  getPageNum() {
    return this.page;
  }
  setPrev(page) {
    this.prev = page;
  }
  getPrev() {
    return this.prev;
  }
  setNext(page) {
    this.next = page;
  }
  getNext() {
    return this.next;
  }
  setPageData(pageData) {
    this.pageData = pageData;
    // if(!pageData) {
    // 	return;
    // }
  }
  getPageData() {
    return this.pageData;
  }
  destroy() {
    this.element.removeEventListener(this.touchstartEvent, this.touchstart, true);
    this.element.removeEventListener(this.touchmoveEvent, this.touchmove, true);
    this.element.removeEventListener(this.touchendEvent, this.touchend, true);
    this.element.removeEventListener('transitionend', this.transitionend);
    this.isDrag = false;
    this.isSlide = false;
    this.touchstart = null;
    this.touchmove = null;
    this.touchend = null;
    this.transitionend = null;
  }
}

class Carosuel {
  // 走马灯id
  static id = 0;
  id = null;
  prevPointer = null;
  centerPointer = null;
  nextPointer = null;
  timer = null;
  isInit = false;
  enableNext = true;
  isLoading = 0;	// 加载状态机 0为加载并翻页完毕 1、2为加载数据后，翻页动画未完成的数量
  endPage = null;
  constructor(pageType, config) {
    // 初始化容器

    // const fragment = document.createDocumentFragment();
    // const parent = config.parent;
    // const container = document.createElement('div');
    // const wrapper = document.createElement('div');
    // 设置走马灯id
    this.id = Carosuel.id ;
    this.scope = config.scope;
    Carosuel.id ++;
    Page.carosuel[this.id] = this;

    console.log('走马灯id', this.id);
    // if(config.parentClass) {
    // 	parent.classList.add(config.parentClass);
    // }
    // if(config.containerClass) {
    // 	container.classList.add(config.containerClass);
    // }
    // if(config.wrapperClass) {
    // 	wrapper.classList.add(config.wrapperClass);
    // }
    // 创建页面元素
    this.prevPointer = new pageType(0, this.id, config.trigger);
    this.centerPointer = new pageType(1, this.id, config.trigger);
    this.nextPointer = new pageType(2, this.id, config.trigger);

    this.prevPointer.setPage(config.page[0]);
    this.centerPointer.setPage(config.page[1]);
    this.nextPointer.setPage(config.page[2]);
    /*
		* 测试数据
		* */
    // this.prevPointer.getPage().innerHTML =
    // this.centerPointer.getPage().innerHTML =
    // this.nextPointer.getPage().innerHTML = '123456789AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
    // if(config.slideClass) {
    // 	this.prevPointer.getPage().classList.add(config.slideClass);
    // 	this.centerPointer.getPage().classList.add(config.slideClass);
    // 	this.nextPointer.getPage().classList.add(config.slideClass);
    // }
    // 设置页面元素宽度/切换一页需要的距离
    if(config.width) {
      this.prevPointer.setWidth(config.width);
      this.centerPointer.setWidth(config.width);
      this.nextPointer.setWidth(config.width);
    }
    if(config.height) {
      this.prevPointer.setHeight(config.height);
      this.centerPointer.setHeight(config.height);
      this.nextPointer.setHeight(config.height);
    }
    // 初始化页面元素位置
    this.prevPointer.movePosition('left', 1, true);
    this.centerPointer.movePosition('left', 0, true);
    this.nextPointer.movePosition('right', 1, true);
    // 添加到页面文档中
    // wrapper.appendChild(this.prevPointer.getPage());
    // wrapper.appendChild(this.centerPointer.getPage());
    // wrapper.appendChild(this.nextPointer.getPage());
    // container.appendChild(wrapper);
    // fragment.appendChild(container);
    // parent.appendChild(fragment);

    // 设置链表关系
    this.prevPointer.setNext(this.centerPointer);
    this.centerPointer.setNext(this.nextPointer);

    this.centerPointer.setPrev(this.prevPointer);
    this.nextPointer.setPrev(this.centerPointer);
    this.pages = null;
  }
  setSize(width, height) {
    if(this.centerPointer.getWidth() != width) {
      this.prevPointer.setWidth(width);
      this.centerPointer.setWidth(width);
      this.nextPointer.setWidth(width);
      // 将位移也调整到对应距离
      let translateX;
      // let reg = new RegExp(/translate\((\d+)/);

      translateX = this.prevPointer.getElementPosition();
      console.log(translateX);
      if(translateX < 0) {
        this.prevPointer.setElementPosition(0);
        this.prevPointer.movePosition('left', 1, true);
      }
      else if(translateX > 0) {
        this.prevPointer.setElementPosition(0);
        this.prevPointer.movePosition('right', 1, true);
      }

      translateX = this.centerPointer.getElementPosition();
      console.log(translateX);
      if(translateX < 0) {
        this.centerPointer.setElementPosition(0);
        this.centerPointer.movePosition('left', 1, true);
      }
      else if(translateX > 0) {
        this.centerPointer.setElementPosition(0);
        this.centerPointer.movePosition('right', 1, true);
      }

      translateX = this.nextPointer.getElementPosition();
      console.log(translateX);
      if(translateX < 0) {
        this.nextPointer.setElementPosition(0);
        this.nextPointer.movePosition('left', 1, true);
      }
      else if(translateX > 0) {
        this.nextPointer.setElementPosition(0);
        this.nextPointer.movePosition('right', 1, true);
      }
      // this.prevPointer.setElementPosition(0);
      // this.centerPointer.setElementPosition(0);
      // this.nextPointer.setElementPosition(0);
      console.log('调整宽度');
    }
    if(this.centerPointer.getHeight() != height) {
      this.prevPointer.setHeight(height);
      this.centerPointer.setHeight(height);
      this.nextPointer.setHeight(height);
    }
  }
  setPages(pageChain) {
    // console.log('set pages', this.isInit)
    if(this.isInit) {
      return;
    }
    // console.log(pageChain);
    this.centerPointer.setPageData(pageChain);
    if(pageChain.getPrev()) {
      this.prevPointer.setPageData(pageChain.getPrev());
    }
    else {
      this.prevPointer.setPageData(null);
    }

    if(pageChain.getNext()) {
      this.nextPointer.setPageData(pageChain.getNext());
    }
    else {
      // 若初始化页面时只有一页内容，则不能进行翻页加载
      this.enableNext = false;
    }
    if(this.scope) {
      this.scope.$emit('carosuelHandler', {
        handler: this,
        id: this.id
      })
    }

    console.log(this.centerPointer, this.prevPointer, this.nextPointer)
    this.isInit = true;
  }

  getPointers() {
    return {
      prevPointer: this.prevPointer,
      centerPointer: this.centerPointer,
      nextPointer: this.nextPointer,
    }
  }

  setEndPageNumber(number) {
    if(this.endPage == number || this.endPage != null && this.endPage != 999) {
      return;
    }
    this.endPage = number;
    console.log('最后一页的页码为', number);
  }

  // 翻页原则：异步加载数据时只有一个翻页操作，其余的翻页操作会被省略，有缓存数据则可以多个翻页操作合并
  prev(type) {
    // 当前版本翻上一页不阻塞加载数据

    // center、prev页右移一位，next页左移两位，next页赋值prev页数的上一页内容
    // 暂时弃用，获取新加载数据后自动翻页
    // if(this.isLoading != 0 && !type) {
    // 	console.log('加载数据中，不能翻页')
    // 	return;
    // }

    // 若当前页已经是第一页，则无法翻页
    if(this.centerPointer.getPageData().getPageNumber() == 1) {
      console.log('当前是第一页');
      return;
    }


    if(this.prevPointer.getPageData()) {
      this.nextPointer.setPageData(this.prevPointer.getPageData().getPrev());
      // console.log(this.nextPointer.getPageData().getPageNumber());
      // console.log('first prev');
      // console.log(this.centerPointer, this.prevPointer, this.nextPointer);
      if(this.scope) {
        this.scope.$emit('carosuelPrevData', this.nextPointer.getPageData())
      }
    }
    // 动态更新数据后，上一页重新绑定数据
    else if(this.centerPointer.getPageData().getPrev()) {
      // 刷新prev页数据,刷新数据后重新绑定数据到上一页
      // console.log('second prev');
      this.prevPointer.setPageData(this.centerPointer.getPageData().getPrev());
      this.nextPointer.setPageData(this.prevPointer.getPageData().getPrev());

      if(this.scope) {
        this.scope.$emit('carosuelCenterAndPrevData', this.nextPointer.getPageData())
      }
    }
    // 暂时弃用，申请加载数据
    // else {
    // 	if(this.scope) {
    // 		this.isLoading = 2;
    // 		this.scope.$emit('carosuelPrevNoData', this.centerPointer.getPageData().getPageNumber());
    // 	}
    // 	return;
    // }
    let temp;
    this.centerPointer.setNext(null);
    this.prevPointer.setPrev(this.nextPointer);
    this.nextPointer.setNext(this.prevPointer);
    this.nextPointer.setPrev(null);

    // this.centerPointer.movePosition('right', 1);
    // this.prevPointer.movePosition('right', 1);
    // this.nextPointer.movePosition('left', 2, true);

    let centerTranslate = `translate3d(${this.centerPointer.stepWidth(1)}px, 0, 0)`;
    let prevTranslate = `translate3d(${this.prevPointer.stepWidth(1)}px, 0, 0)`;
    let nextTranslate = `translate3d(${this.nextPointer.stepWidth(-2)}px, 0, 0)`;
    const self = this;
    const changeElement = this.nextPointer.element;
    this.nextPointer.element.style.display = 'none';
    this.nextPointer.element.style.transitionDuration = '0ms';
    this.centerPointer.element.style.transform = centerTranslate;
    this.prevPointer.element.style.transform = prevTranslate;
    this.nextPointer.element.style.transform = nextTranslate;

    setTimeout(() => {
      // 由于指针指向改变，原先的next被prev指针指向
      changeElement.style.display = 'block';
      changeElement.style.transitionDuration = '300ms';
    }, 0);



    this.nextPointer.setPageNum(this.prevPointer.getPageNum() - 1);

    temp = this.centerPointer;
    this.centerPointer = this.prevPointer;
    this.prevPointer = this.nextPointer;
    this.nextPointer = temp;

    // 通知页面正在翻页
    if(this.scope) {
      this.scope.$emit('page-turning',  {
        type: 'prev',
        pageNumber: this.centerPointer.getPageData().getPageNumber(),
      });
    }
  }
  next(type) {
    // type: 判断是否为异步翻页操作，需要与同步翻页操作合并
    // center、next页左移一位，prev页右移两位，prev页赋值next页数的下一页内容

    // if(!type && this.centerPointer.isSlide) {
    // 	console.log('is slide');
    // 	return;
    // }

    // 暂时弃用，获取加载数据后自动翻页
    // if(this.isLoading != 0 && !type) {
    // 	console.log('加载数据中，不能翻页')
    // 	return;
    // }
    if(this.centerPointer.getPageData().getPageNumber() == this.endPage) {
      console.log('当前是最后一页');
      return;
    }
    // if(type) {
    // 	this.isLoading = 2;
    // }
    // console.log('slide flag', this.prevPointer.isSlide , this.centerPointer.isSlide , this.nextPointer.isSlide);
    // if(this.prevPointer.isSlide || this.centerPointer.isSlide || this.nextPointer.isSlide) {
    // 	return;
    // }

    // 若一开始只有一页内容，则不能进行翻页
    if(!this.enableNext) return;
    if(this.nextPointer.getPageData()) {
      this.prevPointer.setPageData(this.nextPointer.getPageData().getNext());
      // console.log(this.nextPointer.getPageData().getPageNum());
      // console.log('next first', this.prevPointer);
      if(this.scope) {
        this.scope.$emit('carosuelNextData', this.prevPointer.getPageData())
      }
    }
    // 动态更新数据后，下一页重新绑定数据
    else if(this.centerPointer.getPageData().getNext()) {
      // 刷新next页数据
      this.nextPointer.setPageData(this.centerPointer.getPageData().getNext());
      this.prevPointer.setPageData(this.nextPointer.getPageData().getNext());
      if(this.scope) {
        this.scope.$emit('carosuelCenterAndNextData', this.prevPointer.getPageData())
      }
    }
    // 暂时弃用，申请加载数据
    // else {
    // 	if(this.scope) {
    // 		// console.log(this.centerPointer.getPageData());
    // 		// console.log(this.nextPointer.getPageData());
    // 		// console.log('next')
    // 		const self = this;
    // 		// 等待上一个翻页动画完成后才能进行数据加载
    // 		if(this.centerPointer.isSlide) {
    //
    // 			let transitionEnd = function (event) {
    // 				console.log('判断上一个翻页动画完成');
    // 				self.isLoading = 2;
    // 				self.scope.$emit('carosuelNextNoData', self.centerPointer.getPageData().getPageNumber());
    // 				self.centerPointer.element.removeEventListener('transitionEnd', transitionEnd);
    // 			}
    // 			setTimeout(function () {
    // 				// 若无动画结束信号，则强制加载数据
    // 				self.isLoading = 2;
    // 				self.scope.$emit('carosuelNextNoData', self.centerPointer.getPageData().getPageNumber());
    // 				self.centerPointer.element.removeEventListener('transitionEnd', transitionEnd);
    // 			}, 300);
    // 			this.centerPointer.element.addEventListener('transitionEnd', transitionEnd)
    // 		}
    // 		else {
    // 			// 加载数据过程中阻塞所有动作，直至加载并翻页完成
    // 			this.isLoading = 2;
    // 			this.scope.$emit('carosuelNextNoData', this.centerPointer.getPageData().getPageNumber());
    // 		}
    //
    // 		// this.isLoading = 2;
    // 		// this.scope.$emit('carosuelNextNoData', this.centerPointer.getPageData().getPageNumber());
    // 		// setTimeout(function () {
    // 		// 	if(self.isLoading > 0) {
    // 		// 		// 已经到最后一页，无数据返回
    // 		// 		self.isLoading = 0;
    // 		// 	}
    // 		// }, 600)
    // 	}
    // 	return;
    // }
    let temp;
    this.centerPointer.setPrev(null);
    this.nextPointer.setNext(this.prevPointer);
    this.prevPointer.setPrev(this.nextPointer);
    this.prevPointer.setNext(null);

    // 将触发layout的代码集中到一块减少layout次数

    // this.centerPointer.movePosition('left', 1);
    // this.nextPointer.movePosition('left', 1);
    // this.prevPointer.movePosition('right', 2, true);

    let centerTranslate = `translate3d(${this.centerPointer.stepWidth(-1)}px, 0, 0)`;
    let nextTranslate = `translate3d(${this.nextPointer.stepWidth(-1)}px, 0, 0)`;
    let prevTranslate = `translate3d(${this.prevPointer.stepWidth(2)}px, 0, 0)`;
    const self = this;
    const changeElement = this.prevPointer.element;
    this.prevPointer.element.style.display = 'none';
    this.prevPointer.element.style.transitionDuration = '0ms';
    this.centerPointer.element.style.transform = centerTranslate;
    this.nextPointer.element.style.transform = nextTranslate;
    this.prevPointer.element.style.transform = prevTranslate;
    // self.prevPointer.element.style.display = 'block';
    // self.prevPointer.element.style.transitionDuration = '300ms';
    setTimeout(() => {
      // 由于指针指向改变，原先的prev被next指针指向
      changeElement.style.display = 'block';
      changeElement.style.transitionDuration = '300ms';
    }, 0);



    this.prevPointer.setPageNum(this.nextPointer.getPageNum() + 1);

    temp = this.centerPointer;
    this.centerPointer = this.nextPointer;
    this.nextPointer = this.prevPointer;
    this.prevPointer = temp;

    // 通知页面正在翻页
    if(this.scope) {
      this.scope.$emit('page-turning', {
        type: 'next',
        pageNumber: this.centerPointer.getPageData().getPageNumber(),
      });
    }
    // 测试代码
    // if(this.prevPointer.getPageData() && this.prevPointer.getPageNum() != this.prevPointer.getPageData().getPageNumber()) {
    // 	console.log('wrong page');
    // }
  }
  // animationQueue(array) {
  //
  // }
  destroy() {

    this.prevPointer.destroy();
    this.centerPointer.destroy();
    this.nextPointer.destroy();
    Page.carosuel[this.id].isLoading = 0;
    if(Carosuel.id != 0) {
      Carosuel.id = 0;
    }
    if(Page.carosuel[this.id]) {
      Page.carosuel[this.id] = null;
    }
    if(carosuelMap.get(this.id)) {
      carosuelMap.delete(this.id);
    }
    this.id = null;
    this.prevPointer = null;
    this.centerPointer = null;
    this.nextPointer = null;
    this.timer = null;
    this.isInit = false;
    this.enableNext = true;
    this.isLoading = 0;
    this.endPage = null;
  }
}

const carosuelMap = new Map();


function initCarosuel($el, binding, vnode, config) {

  const carosuel = new Carosuel(Page, config);
  $el.dataset.id = carosuel.id;
  carosuelMap.set(carosuel.id, carosuel);
  console.log('ca id', carosuel.id);
  console.log('初始化走马灯');

  return carosuel;
}

Vue.directive('carosuel', {
  bind($el, binding, vnode) {
    const defaultConfig = {
      parent: null,
      page: []
    }
    // let pages = [];
    defaultConfig.parent = $el;
    for(let i = 0; i< $el.childNodes.length ; i ++) {
      // console.log($el.childNodes[i].nodeType);
      if( $el.childNodes[i].nodeType === 1) {
        defaultConfig.page.push($el.childNodes[i]);
      }
    }

    const config = Object.assign(defaultConfig, binding.value);
    initCarosuel($el, binding, vnode, config);
  },
  update($el, binding, vnode) {

    if(binding.value.refresh) {
      const defaultConfig = {
        parent: null,
        page: []
      }
      const id = $el.dataset.id>>0;
      const oldCarosuel = carosuelMap.get(id);
      const config = Object.assign(defaultConfig, binding.value);
      defaultConfig.parent = $el;
      for(let i = 0; i< $el.childNodes.length ; i ++) {
        // console.log($el.childNodes[i].nodeType);
        if( $el.childNodes[i].nodeType === 1) {
          defaultConfig.page.push($el.childNodes[i]);
        }
      }
      oldCarosuel.destroy();
      binding.value.scope.$emit('reFresh');
      initCarosuel($el, binding, vnode, config)
    }

    else if(binding.value.isInit && binding.value.chain) {
      const id = $el.dataset.id>>0;
      const carosuel = carosuelMap.get(id);
      // 因为使用了箭头函数，不能使用this指针
      if(carosuel) {
        carosuel.setPages(binding.value.chain);
        if(binding.value.endPageNumber) {
          carosuel.setEndPageNumber(binding.value.endPageNumber);
        }
        carosuel.setSize(binding.value.width, binding.value.height);
      }
    }
  }
});

window.Page = Page;
