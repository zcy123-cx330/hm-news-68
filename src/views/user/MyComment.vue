<template>
  <div class="mycomment">
      <hm-header>我的评论</hm-header>
       <div class="list">
         <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <van-list
              v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad"
              >
              <div class="item" v-for="item in commentList" :key="item.id">
                <div class="time">{{item.create_date | time('YYYY-MM-DD HH:mm')}}</div>
                <div class="comment" v-if="item.parent">
                    <div class="name">回复：{{item.parent.user.nickname}}</div>
                    <div class="comment_content">{{item.parent.content}}</div>
                </div>
                <div class="content">{{item.content}}</div>
                <div class="origin">
                   <span class="one-txt-cut" @click="$router.push(`/post-detail/${item.post.id}`)">原文：{{item.post.title}}</span>
                   <span class="iconfont iconjiantou1"></span>
                </div>
              </div>
            </van-list>
         </van-pull-refresh>
       </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 存放跟帖的数据
      commentList: [],
      // 当前页
      pageIndex: 1,
      // 每一项是条数
      pageSize: 5,
      //   - 默认loading为false
      // - 加载数据的时候loading会自动改成true
      // - 加载数据完成，需要把loading改成false
      loading: false,
      finished: false,
      // 代表是否正在下拉刷新
      refreshing: false

    }
  },
  created() {
    this.getCommentList()
  },
  methods: {
    async getCommentList() {
      const res = await this.$axios.get('/user_comments', {
        // get请求的参数必须放到params中或者拼接到url地址中
        params: {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
      })
      //   console.log(res.data)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        //   吧data传给commentList
        // this.commentList = data

        // 追加
        this.commentList = [...this.commentList, ...data]
        console.log(this.commentList)
        // 吧loading改成false, 加载完成
        this.loading = false

        // 判断如果没有更多数据了， 需要吧finished 改成true
        if (data.length < this.pageSize) {
          this.finished = true
        }
      }
    },
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        // console.log('ddd')
        // 加载下页的数据
        this.pageIndex++
        this.getCommentList()
      }, 1000)
    },
    onRefresh() {
    //   console.log('下拉刷新')
      setTimeout(() => {
        console.log('下拉刷新')
        // 下拉刷新需要清除原来的数据
        this.commentList = []
        // 防止之前已经没有数据了
        this.loading = true
        this.finished = false
        // 重新加载第一页数据
        this.pageIndex = 1
        this.getCommentList()
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.item {
  border-bottom: 1px solid #ccc;
  padding: 10px 20px;
  .time {
    color: #666;
    padding: 10px 0;
  }
  .comment {
    background-color: #ddd;
    padding: 10px;
    .name {
      color: #666;
      font-size: 14px;
    }
    .comment_content {
      color: #999;
      line-height: 30px;
      margin-top: 10px;
    }
  }
  .content {
    margin: 10px 0;
  }
  .origin {
    font-size: 14px;
    color: #999;
    display: flex;
    justify-content: space-between;
  }
}
</style>
