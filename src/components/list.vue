<template>
  <main class="box1920">

    <carosuel
      :list="list"
      :pageItem="apiObj.page_item"
      :parentClass="'swiper-parent'"
      :containerClass="'swiper-container'"
      :slideClass="'swiper-slide'"
      :wrapperClass="'swiper-wrapper'"
      :pageWidth="pageWidth"
      :pageHeight="pageHeight"
      :trigger="'touch'"
      :prevLoadNumber="5"
      @reload="notifyFromCarosuel"
      @handler="getCarosuelHandler"
      @prevData="updatePrevData"
      @centerData="updateCenterData"
      @nextData="updateNextData"
      @pageTurning="pageTurning"
    >
      <div slot="prevPage">
        <div v-if="prevData" class="song-block">
          <!--视图块 BEGIN-->
          <div class="song-item"
               :key="item" v-for='item in  apiObj.page_item'
               @touchstart.stop.prevent=""
               @touchmove.stop.prevent=""
               @touchend.stop.prevent=""
          >
            {{ prevData.data[item - 1] }}
            <!--<songItem :item="prevData.data[item - 1]" ></songItem>-->
            <!--<div class="songbox" v-songBox="{width: 763, height: 168,data: prevData.data[item - 1]?prevData.data[item - 1]: null}"></div>-->

          </div>
          <!--视图块 END-->
        </div>
      </div>
      <div slot="centerPage">

        <div v-if="centerData" class="song-block">
          <!--视图块 BEGIN-->
          <div class="song-item"
               :key="item" v-for='item in apiObj.page_item'
               @touchstart.stop.prevent=""
               @touchmove.stop.prevent=""
               @touchend.stop.prevent=''
          >
            {{ centerData.data[item - 1] }}
            <!--<songItem :item="centerData.data[item - 1]"></songItem>-->
            <!--<div class="songbox" v-songBox="{width: 763, height: 168,data: centerData.data[item - 1]?centerData.data[item - 1]: null}"></div>-->

          </div>
          <!--视图块 END-->
        </div>

      </div>
      <div slot="nextPage">
        <div v-if="nextData" class="song-block">
          <!--视图块 BEGIN-->
          <div class="song-item"
               :key="item" v-for='item in apiObj.page_item'
               @touchstart.stop.prevent=""
               @touchmove.stop.prevent=""
               @touchend.stop.prevent=""
          >
            {{ nextData.data[item - 1] }}
            <!--<songItem :item="nextData.data[item - 1]"></songItem>-->
            <!--<div class="songbox" v-songBox="{width: 763, height: 168,data: nextData.data[item - 1]?nextData.data[item - 1]:null}"></div>-->

          </div>
          <!--视图块 END-->
        </div>
      </div>

    </carosuel>
    <div class="carosuel-pagination" v-if='totalPage>0'>{{currentPage}} / {{totalPage>999?'999+':totalPage}}</div>
    <div class="carosuel-button-prev"
         :class='{"carosuel-button-disabled": currentPage == 1}'
         @touchstart.stop.prevent.capture=""
         @touchmove.stop.prevent.capture=""
         @touchend.stop.prevent.capture="prev();"
         >
               上一页
    </div>
    <div class="carosuel-button-next"
         style="left: 100px;"
         :class='{"carosuel-button-disabled": currentPage == totalPage}'
         @touchstart.stop.prevent.capture=""
         @touchmove.stop.prevent.capture=""
         @touchend.stop.prevent.capture="next();"
         >
      下一页
    </div>
  </main>
</template>

<script>
  import carosuel from "@/components/carosuel";

  export default {
    components: {
      carosuel
    },
    name: "list",
    data() {
      return {
        pageWidth: 500,
        pageHeight: 500,
        handler: null,
        isReload: true,
        list: {
          addType: 'tail',
          data: [],
        },
        currentPage: 1,
        cur_page: 1,
        apiObj: {
          song_label: 0,
          page_item: 8,
          pagecount: 20, // 获取数据页数
          cur_page: 1, // 起始页码
        },
        totalPage: 0,
        listType: 0, // 歌曲分类 默认为全部
        prevData: {
          data: [],
        },
        centerData: {
          data: [],
        },
        nextData: {
          data: [],
        },
        // 限制翻页频率
        canTurning: true,
        // 判断点击次数
        // touchStartTime: null,
        touchQueue: [],
        // 判断是否正在点击中
        touchTimer: null,
        quickTouch: false,
      }
    },
    mounted(){
      this.cur_page = 1;
      this.apiObj.cur_page = 1;
      this.requestNewPage('tail', true);
    },
    computed: {

    },
    methods: {
      /*
            走马灯反射API开始
            */
      // 获取新页面的数据
      requestNewPage(addType, isInitial) {
        // TODO: 获取新页面数据
        this.$http.get(`/static/mock-data${this.apiObj.cur_page}.json`)
          .then((ret) => {
					  console.log('this.apiObj.cur_page',this.apiObj.cur_page, ret.data.cur_page,ret.data.list.length);
            // 获取的数据存储为数据队列，翻页时抽取新一条直至队列头或尾
            let data;
            if(ret.data) {
              data = ret.data;
            }
            if(data && data.list && data.list.length > 0) {
              // 存储获取的数据队列
              this.cur_page = data.cur_page;
              this.totalPage = data.total_page;
              // console.log('totalPage',data)
              let endFlag = false;

              // TODO：需要更新到项目中
              if(data.list.length < this.apiObj.page_item * this.apiObj.pagecount
                || (this.apiObj.pagecount+this.apiObj.cur_page >=this.totalPage) ) {
                endFlag = true;
              }

              this.list = {
                // 获取的数据起始页
                cur_page: data.cur_page,
                // 数据
                data: data.list,
                // 选择添加到页头/尾
                addType: addType,
                // 是否初始化
                isInitial,
                // 是否是最后一页
                endFlag
              }

              // 测试单个数据
              // this.list = {
              //     // 获取的数据起始页
              //     cur_page: ret.body.cur_page,
              //     // 数据
              //     data: [ {} ],
              //     // 选择添加到页头/尾
              //     addType: addType,
              //     // 是否初始化
              //     isInitial,
              //     // 是否是最后一页
              //     endFlag
              // }
            }
          })
      },
      // 走马灯组件通知需要获取新页面
      notifyFromCarosuel(obj) {
        if(!obj) return;
        let page;
        if(obj.type == 'prev') {
          // 请求前面页的数据
          if( (obj.page>> 0) == 1) {
            return;
          }
          page = (obj.page >> 0) - 1;
          page = page > 0? page: 1;
          this.cur_page = page;
          this.apiObj.cur_page = this.cur_page;
          this.requestNewPage('prev');
        }
        else {
          // 请求后面页的数据
          if( (obj.page >> 0) > this.totalPage) {
            return;
          }
          page = (obj.page >> 0) + 1;
          this.cur_page = page;
          this.apiObj.cur_page = this.cur_page;
          this.requestNewPage('tail');
        }
      },

      // 警告：走马灯反射的数据默认为只读方式，请勿对数据进行修改
      updatePrevData(data) {
        this.prevData = data;

        // if(this.prevData && this.prevData.getPageNumber && this.prevData.getPageNumber() == 3) {
        // 	this.$forceUpdate();
        // 	// console.log('update prev view');
        // }
        // console.log('update prev', data)

      },
      updateCenterData(data) {
        this.centerData = data;
      },
      updateNextData(data) {
        this.nextData = data;
      },
      // 获取走马灯句柄
      getCarosuelHandler(handler) {
        this.handler = handler;
      },
      //  切换上一页
      prev() {
        this.addTurning();
        if(!this.canTurning) {
          return;
        }
        if(this.handler) {
          this.handler.prev();
          this.limitTurning();
          // this.throttle(500,1000);
        }
      },
      next() {
        this.addTurning();
        if(!this.canTurning) {
          return;
        }
        if(this.handler) {
          this.handler.next();
          this.limitTurning();
          // this.throttle(500,1000);
        }
      },
      // 限制翻页频率
      limitTurning() {
        // this.canTurning = false;
        const self = this;
        setTimeout(() => {
          // self.canTurning = true;
        }, 250);
      },
      // 翻页回调
      pageTurning(direction) {
        // direction: prev:上一页 next:下一页
        // console.log('正在翻页', direction);
        this.currentPage =  direction.pageNumber;
      },
      addTurning() {
        if(this.touchTimer) {
          clearTimeout(this.touchTimer);
          this.touchTimer = null;
        }
        const self = this;
        this.touchTimer = setTimeout(() => {
          // 取消快速点击状态
          self.touchQueue.length = 0;
          self.quickTouch = false;
          console.log('退出快速翻页状态');
        }, 1000);
        if(this.quickTouch) {
          return;
        }

        let time = Date.now();
        this.touchQueue.push(time);
        // 只保留600毫秒以内的点击数
        for(let i = 0; i < this.touchQueue.length; i ++) {
          if(time - this.touchQueue[i] > 600) {
            this.touchQueue.splice(i ,1);
            i--;
          }
        }
        // 当600毫秒中点击数超过3个则进入快速翻页模式
        if(this.touchQueue.length > 3 ) {
          console.log('进入快速翻页状态');
          this.quickTouch = true;
        }
      },
      // 切换分类
      category(type) {
        if (this.listType == type) return false;
        this.listType = type;
        this.apiObj.song_label = type;
        this.cur_page = 1;
        this.apiObj.cur_page = 1;
        this.requestNewPage('tail', true);
      },

      /*
            走马灯反射API结束
            */
    },
    destroyed() {
      // 清除图片缓存
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
<style lang="scss" type="text/scss"  scoped>
  .swiper-parent {
    width: 500px;
    height: 500px;
    overflow:hidden;
    position: absolute;
    padding: 50px;
    .swiper-container {

      .swiper-wrapper {
        .swiper-slide {
          background: antiquewhite;
          border: aqua;
          display: inline-block;
        }
      }
    }
  }
  .carosuel-button-prev,.carosuel-button-next {
    position: absolute;
    top:0px;
    height:50px;
    background: black;
  }
</style>
