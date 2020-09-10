<template>
  <div class="index">
      <div class="header">
          <div class="logo">
              <span class="iconfont iconnew"></span>
          </div>
          <div class="search">
              <div class="search-box" @click="$router.push('/search')">
                  <span class="iconfont iconsearch"></span>
                  <span>搜索新闻</span>
              </div>
          </div>
          <div class="user">
              <span class="iconfont iconwode"></span>
          </div>
      </div>
      <van-sticky>
          <div class="more" @click="$router.push('/manage')">
            <span class="iconfont iconlianjie"></span>
          </div>
      </van-sticky>
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-tabs v-model="active" sticky animated swipeable>
            <van-tab :title="tab.name" v-for="tab in tabList" :key="tab.id">
                <van-list
                  v-model="loading"
                  :finished="finished"
                  finished-text="没有更多了"
                  @load="onLoad"
                >
                  <hm-post :post="item" v-for="item in newsList" :key="item.id"></hm-post>
                </van-list>
            </van-tab>
          </van-tabs>
      </van-pull-refresh>
  </div>
</template>

<script>
export default {
  // ==如果某个组件需要被缓存，一定要给该组件提供name属性==
  name: 'index',
  data() {
    return {
      active: 0,
      // 存放当前栏目列表
      tabList: [],
      newsList: [],
      pageIndex: 1,
      pageSize: 5,
      // 加载状态
      loading: false,
      // 是否加载完成
      finished: false,
      refreshing: false
    }
  },
  created() {
    this.getTabLlst()
  },
  methods: {
    async getTabLlst() {
      // 先判断缓存是否存在
      const activeList = JSON.parse(localStorage.getItem('activeList'))
      if (activeList) {
        this.tabList = activeList
        // 发送请求获取第一个tab栏数据
        this.getNewsList(this.tabList[0].id)
        return
      }
      const res = await this.$axios.get('/category')
      console.log(res)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.tabList = data
        // console.log(this.tabList)
        this.getNewsList(this.tabList[0].id)
      }
    },
    async getNewsList(id) {
      const res = await this.$axios.get('/post', {
        params: {
          category: id,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
      })
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        if (this.pageIndex === 1) {
          this.newsList = []
        }
        // this.newsList = data
        this.newsList = [...this.newsList, ...data]
        console.log(this.newsList)
        // 数据加载完成， 需要把loading改成false
        this.loading = false
        // 下拉刷新加载完成后， 需要隐藏加载状态
        this.refreshing = false
        // 判断是否更多数据‘
        if (data.length < this.pageSize) {
          this.finished = true
        }
      }
    },
    onLoad() {
      setTimeout(() => {
        console.log('需要加载更多')
        // 加载下页的数据
        this.pageIndex++
        this.getNewsList(this.tabList[this.active].id)
      }, 1000)
    },
    onRefresh() {
      this.newsList = []
      this.pageIndex = 1
      this.loading = true
      this.finished = false
      setTimeout(() => {
        // 重新加载当前分类下的数据
        this.getNewsList(this.tabList[this.active].id)
      }, 1000)
    }
  },
  watch: {
    active(value) {
      this.newsList = []
      this.pageIndex = 1
      this.finished = false
      this.loading = true
      setTimeout(() => {
        // 重新加载当前分类下的数据
        this.getNewsList(this.tabList[value].id)
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  display: flex;
  height: 50px;
  background-color: #ff0000;
  line-height: 50px;
  text-align: center;
  color: #fff;
  .logo,
  .user {
    width: 70px;
  }
  .logo {
    span {
      font-size: 50px;
    }
  }
  .user {
    span {
      font-size: 24px;
    }
  }
  .search {
    flex: 1;
    .search-box {
      height: 34px;
      line-height: 34px;
      background-color: rgba(255, 255, 255, .5);
      margin-top: 8px;
      border-radius: 17px;
      font-size: 14px;
      span:first-child {
        margin-right: 5px;
      }
    }
  }
}
 /deep/ .van-tabs__wrap {
  width: 85%;
}
.more {
  width: 15%;
  height: 44px;
  line-height: 44px;
  position: absolute;
  right: 0;
  z-index: 999;
  background-color: #fff;
  text-align: center;
}
</style>
