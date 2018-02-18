<!--<template>-->
<!--<div>-->
<!--<div class="carosuel-parent"-->
<!--:style="{width: pageWidth + 'px', height:pageHeight + 'px'}"-->
<!--:class="parentClass" >-->
<!--<div class="carosuel-container" :class="containerClass">-->
<!--<div class="carosuel-wrapper" :class="wrapperClass"-->
<!--:style="{width: pageWidth * 3 + 'px', height:pageHeight + 'px'}"-->
<!--v-carosuel="{-->
<!--chain: chainHead,-->
<!--isInit: chainIsInit,-->
<!--width: pageWidth,-->
<!--height: pageHeight,-->
<!--refresh: carosuelRefresh,-->
<!--scope,-->
<!--endPageNumber,-->
<!--trigger,-->
<!--}">-->
<!--<div :class="slideClass" class="carosuel-item"-->
<!--:style="{width: pageWidth + 'px', height:pageHeight + 'px'}"-->
<!--@touchstart.stop.prevent.capture=""-->
<!--@touchmove.stop.prevent.capture=""-->
<!--@touchend.prevent.capture="enableTouch($event)">-->

<!--<slot name="prevPage"></slot>-->
<!--&lt;!&ndash;{{prevData && prevData.pageNumber}}&ndash;&gt;-->

<!--</div>-->
<!--<div :class="slideClass" class="carosuel-item"-->
<!--:style="{width: pageWidth + 'px', height:pageHeight + 'px'}"-->
<!--@touchstart.stop.prevent.capture=""-->
<!--@touchmove.stop.prevent.capture=""-->
<!--@touchend.prevent.capture="enableTouch($event)">-->

<!--<slot name="centerPage"></slot>-->
<!--&lt;!&ndash;{{centerData && centerData.pageNumber}}&ndash;&gt;-->

<!--</div>-->
<!--<div :class="slideClass" class="carosuel-item"-->
<!--:style="{width: pageWidth + 'px', height:pageHeight + 'px'}"-->
<!--@touchstart.stop.prevent.capture=""-->
<!--@touchmove.stop.prevent.capture=""-->
<!--@touchend.prevent.capture="enableTouch($event)">-->


<!--<slot name="nextPage"></slot>-->
<!--&lt;!&ndash;{{nextData && nextData.pageNumber}}&ndash;&gt;-->

<!--</div>-->
<!--</div>-->
<!--</div>-->


<!--</div>-->
<!--</div>-->
<!--</template>-->

<script>
  import Vue from 'vue';
  import { PageData } from '@/service/carosuel';

  let renderTemplate = `
        <div class="carosuel-parent"
         :style="{width: pageWidth + 'px', height:pageHeight + 'px'}"
         :class="parentClass" >
      <div class="carosuel-container" :class="containerClass">
        <div class="carosuel-wrapper" :class="wrapperClass"
             :style="{width: pageWidth * 3 + 'px', height:pageHeight + 'px'}"
             v-carosuel="{
                    chain: chainHead,
                    isInit: chainIsInit,
                    width: pageWidth,
                    height: pageHeight,
                    refresh: carosuelRefresh,
                    scope,
                    endPageNumber,
                    trigger,
                }">
          <div :class="slideClass" class="carosuel-item"
               :style="{width: pageWidth + 'px', height:pageHeight + 'px'}"
               @touchstart.stop.prevent.capture=""
               @touchmove.stop.prevent.capture=""
               @touchend.prevent.capture="enableTouch($event)">

            {{prev-slot}}
    </div>
    <div :class="slideClass" class="carosuel-item"
    :style="{width: pageWidth + 'px', height:pageHeight + 'px'}"
    @touchstart.stop.prevent.capture=""
    @touchmove.stop.prevent.capture=""
    @touchend.prevent.capture="enableTouch($event)">

    {{center-slot}}
    </div>
    <div :class="slideClass" class="carosuel-item"
    :style="{width: pageWidth + 'px', height:pageHeight + 'px'}"
    @touchstart.stop.prevent.capture=""
    @touchmove.stop.prevent.capture=""
    @touchend.prevent.capture="enableTouch($event)">

    {{next-slot}}

    </div>
    </div>
    </div>
    </div>
    `;

  export default {
    name: "carosuel",
    components: {
    },
    render: function (createElement, context) {
      const self = this;
      const args = arguments;
      const nameArray = ['prevData', 'centerData', 'nextData'];

      return createElement(
        'div',   // tag name 标签名称
        {
          class: 'carosuel-parent ' + this.parentClass ,
          style: {
            width: this.pageWidth + 'px',
            height: this.pageHeight + 'px',
          }
        }, // 子组件中的阵列
        [
          createElement(
            'div',
            {
              class:  'carosuel-container ' + this.containerClass,
            },
            [
              createElement(
                'div',
                {
                  class: 'carosuel-wrapper ' + this.wrapperClass,
                  style: {
                    width: this.pageWidth * 3 + 'px',
                    height: this.pageHeight + 'px'
                  },
                  directives: [
                    {
                      name: 'carosuel',
                      value: {
                        chain: this.chainHead,
                        isInit: this.chainIsInit,
                        width: this.pageWidth,
                        height: this.pageHeight,
                        refresh: this.carosuelRefresh,
                        scope: this.scope,
                        endPageNumber: this.endPageNumber,
                        trigger: this.trigger,
                      }
                    }
                  ]
                },
                nameArray.map(function (index) {
                  return createElement('div',
                    {
                      class: self.slideClass + ' carosuel-item',
                      style: {
                        width: self.pageWidth + 'px',
                        height: self.pageHeight + 'px'
                      }
                    },
                    [
                      // TODO: 编辑数据模板
                      Vue.compile(self.template.replace(/CAROSUEL_DATA/g, index))
                        .render
                        .apply(self.$parent, args)
                    ]
                  )
                })

              )
            ]
          )
        ]
      )
    },
    props: {
      template: {
        type: String,
        default: ""
      },
      prevLoadNumber: {
        type: Number,
        defualt: 5
      },
      trigger: {
        type: String,
        default: "click"
      },
      pageWidth: {
        type: Number,
        defualt: 0
      },
      pageHeight: {
        type: Number,
        defualt: 0
      },
      parentClass: {
        type: String,
        default: ''
      },
      containerClass: {
        type: String,
        default: ''
      },
      slideClass: {
        type: String,
        default: ''
      },
      wrapperClass: {
        type: String,
        default: ''
      },
      list: {
        type: Object,
        default: {
          list: [],
          addType: 'tail'
        }
      },
      pageItem: {
        type: Number,
        default: 1
      },
    },
    data() {
      return {
        endPageNumber: null,
        enableTouches:[1,1,1],
        scope: this,
        chainIsInit: false,
        carosuelRefresh: false,
        chain: null,
        chainHead: null,
        chainTail: null,
        chainLength: 0,
        carosuelHandler: null,
        pagePointer: null,
        prevData: {
          data: [],
        },
        centerData: {
          data: [],
        },
        nextData: {
          data: [],
        },
        // 数据更新定时器
        prevDataTimer: null,
        centerDataTimer: null,
        nextDataTimer: null,
        // 当停止翻页后将需要更新的数据通知到页面
        updateQueue: [],
        updateTimer: null,
        // 设前 中 后页为 0 1 2，下一页轮转为 012 120 201 012 下一页赋值最左值 0 1 2 0， 上一页轮转为 012 201 120 012 上一页为赋值最右值2 1 0 2，
        pageTurn: [0, 1, 2],
        pageTurnPrevIndex: 2,
        pageTurnNextIndex: 0,
        // 判断是否滑动
        isSlide: false,
      }
    },

    mounted() {
      // console.log(this.template);

      this.$on('refresh', () => {
        this.carosuelRefresh = false;
      });
      this.$on('carosuelHandler', (obj) => {
        // 获取走马灯句柄与数据指针
        this.carosuelHandler = obj.handler;
        // this.scope = null;
        this.pagePointer = this.carosuelHandler.getPointers();
        this.centerData = this.pagePointer.centerPointer.getPageData();
        this.nextData = this.pagePointer.nextPointer.getPageData();
        this.prevData = this.pagePointer.prevPointer.getPageData();
        // console.log('init first page', this.centerData);
        this.$emit('centerData', this.centerData);
        this.$emit('nextData', this.nextData);
        this.$emit('handler', this.carosuelHandler);
        console.log('emit');
      });

      this.$on('carosuelPrevData', (data) => {
        // 通知走马灯翻到上一页，预渲染更上一页的内容
        // this.prevData = data;
        if(!data) {
          data = {
            data: []
          }
        }
        switch(this.pageTurnPrevIndex) {
          case 0:
            this.prevData = data;
            this.notifyPrevUpdate();
            break;
          case 1:
            this.centerData = data;
            this.notifyCenterUpdate();
            break;
          case 2:
            this.nextData = data;
            this.notifyNextUpdate();
            break;
        }

        // this.pageTurnNextIndex += 2;
        // this.pageTurnNextIndex %= 3;
        // this.pageTurnPrevIndex = 2 - this.pageTurnNextIndex;
        this.pageTurnPrevIndex = (this.pageTurnPrevIndex + 2) % 3;
        this.pageTurnNextIndex = (this.pageTurnNextIndex + 2) % 3;

        // console.log('set prev', this.pageTurnPrevIndex, this.pageTurnNextIndex);
      })
      this.$on('carosuelCenterAndPrevData', (data) => {
        // 通知走马灯翻到上一页，并且上一页没有数据，在刷新数据之后预渲染上一页和更上一页的内容
        if(!data) {
          data = {
            data: []
          }
        }
        switch(this.pageTurnPrevIndex) {
          case 0:
            this.prevData = data;
            this.notifyPrevUpdate();

            if(data && data.getNext) {
              this.centerData = data.getNext();
              this.notifyCenterUpdate();
            }
            break;
          case 1:
            this.centerData = data;
            this.notifyCenterUpdate();
            if(data && data.getNext) {
              this.nextData = data.getNext();
              this.notifyNextUpdate();
            }
            break;
          case 2:
            this.nextData = data;
            this.notifyNextUpdate();

            if(data && data.getNext) {
              this.prevData = data.getNext();
              this.notifyPrevUpdate();

            }
            break;
        }
        // this.pageTurnNextIndex += 2;
        // this.pageTurnNextIndex %= 3;
        // this.pageTurnPrevIndex = 2 - this.pageTurnNextIndex;

        this.pageTurnPrevIndex = (this.pageTurnPrevIndex + 2) % 3;
        this.pageTurnNextIndex = (this.pageTurnNextIndex + 2) % 3;
      })
      this.$on('carosuelNextData', (data) => {
        // 通知走马灯翻到下一页，预渲染更下一页的内容
        // this.nextData = data;
        if(!data) {
          data = {
            data: []
          }
        }
        switch(this.pageTurnNextIndex) {
          case 0:
            this.prevData = data;
            this.notifyPrevUpdate();
            break;
          case 1:
            this.centerData = data;
            this.notifyCenterUpdate();
            break;
          case 2:
            this.nextData = data;
            this.notifyNextUpdate();
            break;
        }
        this.pageTurnNextIndex = (this.pageTurnNextIndex + 1 ) % 3;
        this.pageTurnPrevIndex = (this.pageTurnPrevIndex + 1 ) % 3;
        // console.log('set next', this.pageTurnPrevIndex, this.pageTurnNextIndex);
      })
      this.$on('carosuelCenterAndNextData', (data) => {
        // 通知走马灯翻到下一页，并且下一页没有数据，在刷新数据之后预渲染下一页和更下一页的内容
        if(!data) {
          data = {
            data: []
          }
        }
        switch(this.pageTurnNextIndex) {
          case 0:
            this.prevData = data;
            this.notifyPrevUpdate();
            if(data && data.getPrev) {
              this.nextData = data.getPrev();
              this.notifyNextUpdate();
            }
            break;
          case 1:
            this.centerData = data;
            this.notifyCenterUpdate();

            if(data && data.getPrev) {
              this.prevData = data.getPrev();
              this.notifyPrevUpdate();
            }
            break;
          case 2:
            this.nextData = data;
            this.notifyNextUpdate();
            if(data && data.getPrev) {
              this.centerData = data.getPrev();
              this.notifyCenterUpdate();
            }
            break;
        }
        this.pageTurnNextIndex = (this.pageTurnNextIndex + 1 ) % 3;
        this.pageTurnPrevIndex = (this.pageTurnPrevIndex + 1 ) % 3;
      });

      this.$on('carosuelPrevNoData', (page) => {
        // 通知上一页无数据
        this.$emit('reload', {
          type: 'prev',
          page
        })
      });

      this.$on('carosuelNextNoData', (page) => {
        // 通知下一页无数据
        this.$emit('reload',  {
          type: 'next',
          page
        })
      });

      this.$on('page-turning', (direction) => {
        console.log();
        if(direction.pageNumber == this.chainTail.getPageNumber() - this.prevLoadNumber) {
          // 提前5页加载数据
          this.$emit('reload',  {
            type: 'next',
            page: this.chainTail.getPageNumber()
          })
        }
        this.$emit('pageTurning', direction);
      });
    },
    watch: {
      // chainHead(val) {
      // console.log('chainHead', val);
      // },
      list(newVal) {
        // 获取到新的页面数据后，加入到链表中
        if(!(newVal.data && newVal.data.length)) {
          console.log('没有数据');
          return;
        }

        const listData = newVal.data;
        let i;
        let pageItem;
        if(newVal.isInitial && this.carosuelHandler) {
          this.carosuelRefresh = true;
          // this.chainIsInit = false;
        }
        if(!newVal.isInitial && this.chainIsInit) {
          // 添加数据到链表头/尾
          // console.log(this.chainTail.getPageNumber(), newVal.cur_page);
          if(this.chainTail.getPageNumber() > newVal.cur_page) {
            // 返回的数据已经被缓存了
            return;
          }
          let totalPage = Math.ceil(listData.length / this.pageItem);
          for(i = 0; i < totalPage; i ++) {
            pageItem =  new PageData( listData.slice( this.pageItem * i, this.pageItem * (i + 1)), newVal.cur_page + i );
            this.chainAdd( pageItem, newVal.addType );

          }

          // 获取新加载的数据后自动翻页，暂时弃用
          // if(newVal.addType == 'prev') {
          // 	this.prev(true);
          // }
          // else {
          // 	this.next(true);
          // }
        }
        else {
          // 初始化链表
          this.chainInit(listData, newVal.cur_page);
          console.log('init', newVal.cur_page)
        }
        // 判断是否到最后数据页
        if( newVal.endFlag) {
          this.endPageNumber = this.chainTail.getPageNumber();
        }
        else {
          this.endPageNumber = 999;
        }

      },
    },
    methods: {
      // 链表重新加载
      chainReLoad() {
        while(this.chainTail && this.chainTail.getPrev()) {
          this.chainRemoveTail();
        }
        this.chainHead = this.chainTail = null;
      },
      // 链表初始化
      chainInit(array, curPage) {
        console.log('chain init');
        let i;
        let pageItem;
        // 计算页数
        let totalPage = Math.ceil(array.length / this.pageItem);
        this.chainReLoad();
        for(i = 0; i < totalPage; i ++) {
          // 按页添加数据
          pageItem =  new PageData( array.slice( this.pageItem * i, this.pageItem * (i + 1)), curPage + i );
          if(this.chainHead == null) {
            // 初始化链表头\尾指针
            this.chainHead = pageItem;
            this.chainTail = this.chainHead;
          }
          else {
            // 尾指针后移
            // console.log(pageItem.getData().length);
            pageItem.setPrev(this.chainTail);
            this.chainTail.setNext(pageItem);
            this.chainTail = this.chainTail.getNext();
          }
        }
        // console.log('头指针', this.chainHead);
        // console.log('尾指针', this.chainTail);
        this.chainIsInit = true;
        this.pageTurnPrevIndex = 2;
        this.pageTurnNextIndex = 0;
        this.carosuelHandler = null;
        this.pagePointer = null;
        clearTimeout(this.prevDataTimer);
        clearTimeout(this.centerDataTimer);
        clearTimeout(this.nextDataTimer);
        this.prevDataTimer = null;
        this.centerDataTimer = null;
        this.nextDataTimer = null;
        // 测试链表数据是否正确
        // let pointer = this.chainHead;
        // while(pointer != null) {
        // console.log(pointer.pageNumber);
        // pointer = pointer.next;
        // }
      },
      // 往页链表添加数据
      chainAdd(pageItem, addType) {
        // console.log('add', addType, pageItem);
        switch(addType) {
          case 'head':
            // 头指针前移
            this.chainAddHead(pageItem);
            break;
          case 'tail':
            // 尾指针后移
            this.chainAddTail(pageItem);
            break;
        }
      },
      // 链表头添加数据
      chainAddHead(page) {
        page.setNext(this.chainHead);
        this.chainHead.setPrev(page);
        this.chainHead = this.chainHead.getPrev();
        // 每当头指针前移一位，则尾指针也前移一位，确保链表长度不变
        // this.chainRemoveTail();
      },
      // 链表尾添加数据
      chainAddTail(page) {
        page.setPrev(this.chainTail);
        this.chainTail.setNext(page);
        this.chainTail = this.chainTail.getNext();
        // 每当尾指针后移一位，则头指针也后移一位，确保链表长度不变
        // this.chainRemoveHead();
      },
      // 链表头删除数据
      chainRemoveHead() {
        if(this.chainHead && this.chainHead.getNext()) {
          this.chainHead = this.chainHead.getNext();
          this.chainHead.getPrev().setNext(null);
          this.chainHead.setPrev(null);
        }
      },
      // 链表尾删除数据
      chainRemoveTail() {
        if(this.chainTail && this.chainTail.getPrev()) {
          this.chainTail = this.chainTail.getPrev();
          this.chainTail.getNext().setPrev(null);
          this.chainTail.setNext(null);
        }
      },
      // 翻前一页
      prev(type) {
        if(this.carosuelHandler) {
          this.carosuelHandler.prev(type);
        }
      },
      // 翻后一页
      next(type) {
        if(this.carosuelHandler) {
          this.carosuelHandler.next(type);
        }
      },
      // 通知页面更新数据
      updateAllData() {
        if(this.updateQueue['prev']) {
          this.$emit('prevData', this.prevData);
          this.enableTouches[0] = true;
          this.updateQueue['prev'] = false;
        }
        if(this.updateQueue['center']) {
          this.$emit('centerData', this.centerData);
          this.enableTouches[1] = true;
          this.updateQueue['center'] = false;
        }
        if(this.updateQueue['next']) {
          this.$emit('nextData', this.nextData);
          this.enableTouches[2] = true;
          this.updateQueue['next'] = false;
        }
      },
      // 通知对应页数据更新
      notifyPrevUpdate() {
        // 阻塞600ms后更新数据
        // let time = 600;
        //   const self = this;
        // this.enableTouches[0] = false;
        if(this.prevData && this.prevData.getPageNumber && this.prevData.getPageNumber() == 3) {
          this.$emit('prevData', this.prevData);
          // this.enableTouches[0] = true;
          return;
        }
        // if(this.prevDataTimer) {
        // 	clearTimeout(this.prevDataTimer);
        // 	// this.prevDataTimer = null;
        // }
        // this.prevDataTimer = setTimeout(() => {
        // 	self.$emit('prevData', self.prevData);
        // 	this.enableTouches[0] = true;
        // }, time);

        // 加入到更新队列中
        this.enableTouches[0] = false;
        this.updateQueue['prev'] = true;
        if(this.updateTimer) {
          clearTimeout(this.updateTimer);
          this.updateTimer = null;
        }
        const self = this;
        this.updateTimer = setTimeout(() => {
          self.updateAllData();
        }, 600);
      },
      notifyCenterUpdate() {
        // 阻塞600ms后更新数据
        // this.enableTouches[1] = false;
        // if(this.centerDataTimer) {
        // 	clearTimeout(this.centerDataTimer);
        // 	this.centerDataTimer = null;
        // }
        // const self = this;
        // this.centerDataTimer = setTimeout(() => {
        // 	self.$emit('centerData', self.centerData);
        // 	this.enableTouches[1] = true;
        // }, 600);

        // 加入到更新队列中
        this.enableTouches[1] = false;
        this.updateQueue['center'] = true;
        if(this.updateTimer) {
          clearTimeout(this.updateTimer);
          this.updateTimer = null;
        }
        const self = this;
        this.updateTimer = setTimeout(() => {
          self.updateAllData();
        }, 600);
      },
      notifyNextUpdate() {
        // 阻塞600ms后更新数据
        // this.enableTouches[2] = false;
        // if(this.nextDataTimer) {
        // clearTimeout(this.nextDataTimer);
        // this.nextDataTimer = null;
        // }
        // const self = this;
        // this.nextDataTimer = setTimeout(() => {
        // self.$emit('nextData', self.nextData);
        // this.enableTouches[2] = true;
        // }, 600);

        // 加入到更新队列中
        this.enableTouches[2] = false;
        this.updateQueue['next'] = true;
        if(this.updateTimer) {
          clearTimeout(this.updateTimer);
          this.updateTimer = null;
        }
        const self = this;
        this.updateTimer = setTimeout(() => {
          self.updateAllData();
        }, 600);
      },
      // 数据更新完成后允许事件冒泡
      enableTouch(event) {
        if(this.enableTouches[0] == true && this.enableTouches[1] == true && this.enableTouches[2] == true) {

        }
        else {
          event.stopPropagation();
        }
      },
      stopPropagation(event) {
        // console.log('阻止传递');
        event.stopPropagation();
      }
    },
    destroyed() {
      // 清除图片缓存
      console.log('销毁组件');
      if(this.carosuelHandler) {
        // 回收走马灯模块
        this.carosuelHandler.destroy();
        this.carosuelHandler = null;
      }
      // 回收数据链表
      while(this.chainHead && this.chainHead.getNext()) {
        this.chainRemoveHead();
      }
    }
  }
</script>

<style lang="scss" scoped type="text/scss" >
  .carosuel-parent {
    position:relative;
    /*margin-top: 60px;*/
    margin-left: auto;
    margin-right: auto;
    height: 500px;
    width: 500px;
    border: 1px solid #000;

    .carosuel-container{
      width: 100%;
      height:100%;
      position: absolute;
      overflow: hidden;
      .carosuel-wrapper{
        position: absolute;
        width: 1500px;
        .carosuel-item {
          position:absolute;
          left: 0;
          top: 0;
          height: 500px;
          width: 500px;
        }
      }
    }
  }

</style>
