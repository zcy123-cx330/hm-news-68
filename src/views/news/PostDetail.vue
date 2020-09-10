<template>
  <div class="post-detail">
      <!-- 粘性定位 -->
      <van-sticky>
        <div class="header">
            <div class="left">
                <span class="iconfont iconjiantou2" @click="$router.back()"></span>
            </div>
            <div class="center">
                <span class="iconfont iconnew"></span>
            </div>
            <div class="right">
                <div class="followed" v-if="post.has_follow"  @click="unfollow">已关注</div>
                <div class="follow" v-else @click="follow">关注</div>
            </div>
        </div>
       </van-sticky>
      <div class="content">
          <div class="title">{{post.title}}</div>
          <div class="name">
              <span>{{post.user.nickname}}</span>
              <span>{{post.create_date | time}}</span>
          </div>
           <div v-if="post.type === 1" class="info" v-html="post.content"></div>
           <video v-else :src="getUrl(post.content)" controls autoplay muted></video>
           <div class="buttons">
               <div class="good" @click="like">
                   <span class="iconfont icondianzan"></span>
                   <span>{{post.like_length}}</span>
               </div>
               <div class="share">
                   <span class="iconfont iconweixin"></span>
                   <span>微信</span>
               </div>
           </div>
      </div>
      <!-- 评论组件 -->
      <div class="comment-list">
        <h3>精彩跟帖</h3>
        <hm-comment
        :comment="comment"
         v-for="comment in commentList"
         :key="comment.id"
         @reply="onReply"
         ></hm-comment>
      </div>
      <div class="footer-textarea" v-if="isShowTextarea">
          <textarea :placeholder="'回复'+nickname" ref="textarea" @blur="onBlur"></textarea>
          <van-button type="primary" @click="publish">发送</van-button>
      </div>
      <div class="footer-input" v-else>
        <div class="search">
          <input type="text" placeholder="回复" @focus="onFocus">
        </div>
          <span class="iconfont iconpinglun-"><i>20</i></span>
          <span class="iconfont iconshoucang" :class="{now: post.has_star}" @click="star"></span>
          <span class="iconfont iconfenxiang"></span>
      </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      post: {
        user: {}
      },
      commentList: [],
      // 是否显示textarea
      isShowTextarea: false,
      content: '',
      nickname: '',
      replyId: ''
    }
  },
  created() {
    this.getInfo()
    // 获取文章列表
    this.getCommentList()
    // 给bus注册自定义事件
    // this.$bus.$on('reply', async(id, nickname) => {
    // console.log('bus', id, nickname)
    // this.isShowTextarea = true
    // await this.$nextTick()
    // this.$refs.textarea.focus()
    // // 回显nickname
    // this.nickname = '@' + nickname
    // this.replyId = id
    // })
    this.$bus.$on('reply', this.onReply)
  },
  destroyed() {
    // 移除$bus的自定义事件off
    this.$bus.$off('reply', this.onReply)
  },
  methods: {
    noLogin() {
      // 判断是否登录
      const token = localStorage.getItem('token')
      if (!token) {
        // 没有登录,跳转到登录页面
        this.$router.push({
          path: '/login',
          query: {
            back: true
          }
        })
        // 代表没有登录
        return true
      } else {
        return false
      }
    },
    async getInfo() {
      // 需要id
      const { id } = this.$route.params
      const res = await this.$axios.get(`/post/${id}`)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.post = data
        // console.log(this.post)
      }
    },
    getUrl(url) {
      const div = document.createElement('div')
      div.innerText = url
      return div.innerText
    },
    // 给关注按钮注册点击事件
    async follow() {
      // 判断是否登录
    //   const token = localStorage.getItem('token')
    //   if (!token) {
    //     // 没有登录,跳转到登录页面
    //     this.$router.push({
    //       path: '/login',
    //       query: {
    //         back: true
    //       }
    //     })
    //   }
      if (this.noLogin()) return
      //   如果登录了，直接发送ajax请求，进行关注了
      console.log('发送请求')
      const res = await this.$axios.get(`/user_follows/${this.post.user.id}`)
      console.log(res.data)
      if (res.data.statusCode === 200) {
        this.$toast.success('关注成功')
        this.getInfo()
      }
    },
    async unfollow() {
    // 发送请求取消关注
      const res = await this.$axios.get(`/user_unfollow/${this.post.user.id}`)
      const { statusCode } = res.data
      if (statusCode === 200) {
        this.$toast.success('取消关注成功')
        this.getInfo()
      }
    },
    async like() {
      /*
        1. 判断师傅登录
        2. 如没有登录， 也需要跳转到登录页
        3. 如果登了，直接发送请求
        */
      if (this.noLogin()) return
      // 说明登录了
      const res = await this.$axios.get(`/post_like/${this.post.id}`)
      console.log(res.data)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.getInfo()
      }
    },
    async star() {
      if (this.noLogin()) return
      // 说明登录了
      const res = await this.$axios.get(`/post_star/${this.post.id}`)
      console.log(res.data)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.getInfo()
      }
    },
    async getCommentList() {
      const id = this.$route.params.id
      const res = await this.$axios.get(`/post_comment/${id}`)
      // console.log(res.data)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.commentList = data
        console.log(this.commentList)
      }
    },
    async onFocus() {
      this.isShowTextarea = true
      // 等待dom更新
      await this.$nextTick()
      // 让textarea自动获取焦点
      this.$refs.textarea.focus()
    },
    // 给发布按钮注册点击事件
    // 发送ajax请求进行发表评论
    async publish() {
      const res = await this.$axios.post(`/post_comment/${this.post.id}`, {
        content: this.content,
        parent_id: this.replyId
      })
      console.log(res)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.getCommentList()
        this.content = ''
        this.nickname = ''
        this.replyId = ''
        this.isShowTextarea = false
      }
    },
    async onReply(id, nickname) {
      console.log('父组件', id, nickname)
      this.isShowTextarea = true
      await this.$nextTick()
      this.$refs.textarea.focus()
      // 回显nickname
      this.nickname = '@' + nickname
      this.replyId = id
    },
    onBlur() {
      if (!this.content) {
        this.isShowTextarea = false
        this.replyId = ''
        this.nickname = ''
      }
    }
  }

}
</script>

<style lang="less" scoped>
.post-detail {
  padding-bottom: 50px;
}
.header {
    display: flex;
    padding: 0 10px;
    border-bottom: 1px solid #ccc;
    height: 50px;
    align-items: center;
    background-color: #fff;
    .left {
        span {
            line-height: 50px;
        }
    }
    .center {
        flex: 1;
        span {
            font-size: 50px;
        }
    }
    .right {
        font-size: 14px;
        div {
            width: 60px;
            height: 30px;
            text-align: center;
            line-height: 30px;
            border-radius: 15px;
        }
        .followed {
            border: 1px solid #ccc;
        }
        .follow {
            color: #fff;
            background-color: #f00;
        }
    }
}
.content {
    padding: 10px;
    border-bottom: 1px solid #ccc;
    .title {
        font-size: 18px;
        font-weight: 700;
    }
    .name {
        font-size: 14px;
        color: #666;
        margin: 10px 0;
        span:first-child {
            margin-right: 20px;
        }
    }
    .info {
        font-size: 14px;
        /deep/ img {
            width: 100%;
        }
    }
    video {
        width: 100%;
    }
    .buttons {
        padding: 20px 0;
        display: flex;
        justify-content: space-around;
        > div {
            width: 120px;
            height: 40px;
            line-height: 40px;
            border-radius: 20px;
            border: 1px solid #ccc;
            text-align: center;
            font-size: 16px;
            .iconfont {
                font-size: 18px;
                margin-right: 5px;
            }
            .iconweixin {
                color: chartreuse;
            }
        }
    }
}
.comment-list {
  h3 {
    text-align: center;
    padding: 10px 0;
  }
}
.footer-input {
  // display: flex;
  background-color: #fff;
  display: flex;
  width: 100%;
  height: 50px;
  border-top: 1px solid #ccc;
  position: fixed;
  bottom: 0;
  align-items: center;
  justify-content: space-around;
  padding: 0 10px;
  .iconfont {
    font-size: 24px;
  }
  .now {
  //  background-color: red;
   color: red;
  }
  .iconpinglun- {
    position: relative;
    i {
      position: absolute;
      right: -5px;
      top: 0;
      background-color: red;
      font-size: 10px;
      color: #fff;
      padding: 0 3px;
      border-radius: 5px;
      font-style: normal;

    }
  }
  .search {
    width: 180px;
    padding-right: 10px;
    input {
      height: 30px;
      // margin-top: 10px;
      background-color: #ddd;
      border-radius: 15px;
      width: 100%;
      border: none;
      font-size: 14px;
      padding-left: 20px;
    }
  }
}
.footer-textarea {
  width: 100%;
  height: 100px;
  display: flex;
  position: fixed;
  z-index: 999;
  bottom: 0;
  padding: 10px;
  align-items: flex-end;
  background-color: #fff;
  border-top: 1px solid #ccc;
  justify-content: space-around;
  textarea {
    width: 260px;
    height: 80px;
    background-color: #ccc;
    border-radius: 5px;
    border: none;
    padding: 10px;
    font-size: 14px;
  }
}
</style>
