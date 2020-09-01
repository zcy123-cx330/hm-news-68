<template>
  <div class="user-edit">
      <hm-header>编辑资料</hm-header>
      <!-- 头像 -->
      <div class="avater">
          <img :src="$axios.defaults.baseURL + user.head_img" alt="">
          <!-- //上传头像 -->
          <van-uploader :after-read="afterRead" />
      </div>
      <!-- 导航 -->
      <hm-navitem @click="showNickname">
          <template>昵称</template>
          <template #content>{{user.nickname}}</template>
      </hm-navitem>
      <hm-navitem @click="showPassword">
          <template>密码</template>
          <template #content>******</template>
      </hm-navitem>
      <hm-navitem  @click="showGender">
          <template>性别</template>
          <template #content>{{ user.gender === 1 ? '男' : '女'}}</template>
      </hm-navitem>
      <!-- dialog的基本使用 -->
      <van-dialog v-model="isShowNickname" title="用户名" show-cancel-button
       @confirm="updateNickname">
           <van-field v-model="nickname" ref="nickname" placeholder="请输入用户名" />
      </van-dialog>

      <van-dialog v-model="isShowPassword" title="修改密码" show-cancel-button
       @confirm="updatePassworw">
           <van-field v-model="password" placeholder="请输入密码" />
      </van-dialog>

      <van-dialog v-model="isShowGender" title="修改性别" show-cancel-button
      @confirm="updateGenter">
        <van-radio-group v-model="gender">
          <van-cell-group>
            <van-cell title="男" clickable @click="gender = 1">
              <template #right-icon>
                <van-radio :name="1" />
              </template>
            </van-cell>
            <van-cell title="女" clickable @click="gender = 0">
              <template #right-icon>
                <van-radio :name="0" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </van-dialog>
       <!-- 裁剪模态框 -->
      <div class="mask" v-show="isShowMask">
        <van-button type="primary" class="crop" @click="crop">裁剪</van-button>
        <van-button type="danger" class="cancel" @click="isShowMask=false">取消</van-button>
        <vue-cropper
        ref="aa"
        :img="img"
        autoCrop
        autoCropWidth="100"
        autoCropHeight="100"
        fixed
        ></vue-cropper>
      </div>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
export default {
  components: {
    VueCropper
  },
  data() {
    return {
      user: '',
      isShowNickname: false,
      nickname: '',
      isShowPassword: false,
      password: '',
      isShowGender: false,
      gender: 1,
      isShowMask: false,
      img: ''
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    async getUserInfo() {
    // 在送请求，获取个人信息
      const userId = localStorage.getItem('userId')
      const res = await this.$axios.get(`/user/${userId}`)
      // console.log(res)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.user = data
      }
    },
    async showNickname() {
      // 点击时显示单框
      this.isShowNickname = true
      // 昵称回显，把user.nickname 传给data 里的nickname  this.nickname
      this.nickname = this.user.nickname
      // 等待dom的更新
      await this.$nextTick()
      // 需要自动获取焦点
      this.$refs.nickname.focus()
    },

    // 封装
    async updateUser(data) {
      // console.log('123')
      // 获取id
      const userId = localStorage.getItem('userId')
      // 请求
      const res = await this.$axios.post(`/user_update/${userId}`, data)
      if (res.data.statusCode === 200) {
        //   重新渲染
        this.getUserInfo()
        this.$toast.success('修改成功')
      }
    },
    async updateNickname() {
      // console.log('123')
      // 获取id
    //   const userId = localStorage.getItem('userId')
    //   // 请求
    //   const res = await this.$axios.post(`/user_update/${userId}`, {
    //     nickname: this.nickname
    //   })
    //   if (res.data.statusCode === 200) {
    //     //   重新渲染
    //     this.getUserInfo()
    //     this.$toast.success('修改成功')
    //   }
      this.updateUser({
        nickname: this.nickname
      })
    },
    showPassword() {
      this.isShowPassword = true
      this.password = this.user.password
    },
    async updatePassworw() {
    // console.log('123')
      // 获取id
    //   const userId = localStorage.getItem('userId')
    //   // 请求
    //   const res = await this.$axios.post(`/user_update/${userId}`, {
    //     password: this.password
    //   })
    //   if (res.data.statusCode === 200) {
    //     //   重新渲染
    //     this.getUserInfo()
    //     this.$toast.success('修改成功')
    //   }
      this.updateUser({
        password: this.password
      })
    },
    showGender() {
      this.isShowGender = true
      this.gender = this.user.gender
    },
    updateGenter() {
      this.updateUser({
        gender: this.gender
      })
    },
    isImg(name) {
      if (name.endsWith('.gif') || name.endsWith('.jpg') || name.endsWith('.png') || name.endsWith('.jpeg')) {
        return true
      } else {
        return false
      }
    },
    async afterRead(file) {
      // 效验土拍你类型的大小 如果满足，才上传 如果不满足给个提示
      // console.log(file)
      if (!this.isImg(file.file.name)) {
        return this.$toast('请上传图片')
      }
      if (file.file.size >= 20 * 1024) {
        return this.$toast.fail('上传图片过大')
      }
      this.isShowMask = true
      // 设置图片的裁剪
      this.img = file.content
    },
    crop() {
      this.$refs.aa.getCropBlob(async blob => {
      // 此时可以自行将文件上传至服务器  file.file
      // console.log('文件读取完毕', file)
      // 发送请求，上传文件
      // 如果是通过ajax上传文件，请求体不能直接是一个普通对象，必须是一个formData对象
      // 创建一个空的formData对象
        const fd = new FormData()
        // 给formdata对象添加上传文件
        fd.append('file', blob)
        const res = await this.$axios.post('/upload', fd)
        const { statusCode, data } = res.data
        if (statusCode === 200) {
          console.log(data.url)
          // 修改用户头像
          this.updateUser({
            head_img: data.url
          })
        }
        // 隐藏裁剪框
        this.isShowMask = false
      })
    }
  }

}
</script>

<style lang="less" scoped>
.avater {
    padding: 40px 0;
    text-align: center;
    position: relative;
    img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
    }
  .van-uploader {
    position: absolute;
    left: 50%;
    top: 40px;
    transform: translate(-50%);
    width: 100px;
    height: 100px;
    opacity: 0;
  }
}
/deep/ .van-dialog__content {
    padding: 15px;
    .van-field {
        border: 1px solid #ccc;
    }
}
.mask {
  width: 100%;
  height: 100%;
  z-index: 999;
  position: fixed;
  left: 0;
  top: 0;
  .crop,
  .cancel {
    position: fixed;
    top: 0;
    z-index: 1;
  }
  .cancel {
    right: 0;
  }
}
</style>
