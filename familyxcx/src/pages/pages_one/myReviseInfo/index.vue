<template>
  <div id="myReviseInfo" :style="{'height':height + 'rpx'}">
    <div class="tip">为方便核实您孩子的信息，请上传孩子身份证信息和头像，将用于考勤时人脸识别等情况（请务必上传孩子正式头像照片，否则人脸识别无法正常进行，将会统计成缺勤。）我司承诺不会以任何形式泄露您孩子的信息。</div>
    <div class="myReviseInfo_container">
      <div class="myReviseInfo_container_item" @click="uploadFile">
        <div class="title">学生正脸照</div>
        <div class="photo">
          <img :src="userStudentInfo.studentImg" alt="">
          <div><img src="http://test.admin.school.mseenet.com/html/img/iOS切图/next@3x.png" alt=""></div>
        </div>
      </div>
      <div class="myReviseInfo_container_item info">
        <div class="title_one">学生姓名</div>
        <div class="name"><input placeholder="请输入姓名" v-model="userStudentInfo.studentName" disabled='true' /></div>
      </div>
      <!-- <div class="myReviseInfo_container_item info">
        <div class="title_one">学生班级</div>
        <div class="name"><input placeholder="请输入班级" v-model="userStudentInfo.communityName" disabled='true' /></div>
      </div> -->
      <div class="myReviseInfo_container_item info">
        <div class="title_one">学生身份证号码</div>
        <div class="name"><input placeholder="请输入身份证号码" v-model="userStudentInfo.idCard" /></div>
      </div>
    </div>

    <!-- <div class="buttonGroup">
      <button @click="submit"> 保存 </button>
    </div>
     -->

  </div>
</template>

<script>
import { userCenter, updateStudent } from '@/api/api'
import utils from '@/utils/index'
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      height: '',
      userStudentInfo: ''
    }
  },
  computed: {
    ...mapState(['family', 'token'])
  },
  mounted() {
    // 高度自适应
    var _this = this
    wx.getSystemInfo({
      success: function(res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth
        _this.height = clientHeight * rpxR
      }
    })

    // this.students.forEach(item => {
    //   if (item.studentId == this.family.studentId) {
    //     item.studentImg = utils.formatImgUrl(item.studentImg)
    //     this.userStudentInfo = item
    //   }
    // })

    //console.log(utils.wxGetStorage("students"));

    var studentList = utils.wxGetStorage('students')
    if (studentList.length > 0) {
      console.log(studentList)
      studentList.forEach(function(item) {
        if (item.studentId == _this.family.studentId) {
          item.studentImg = utils.formatImgUrl(item.studentImg)
          _this.userStudentInfo = item
        }
      })
    } else {
      console.log(studentList)
    }
  },
  methods: {
    ...mapActions(['setStudents']),
    uploadFile() {
      if (!utils.required(this.userStudentInfo.idCard)) {
        utils.showDialog('请输入身份证号码')
        return
      }

      var _this = this
      wx.chooseImage({
        success: function(res) {
          var tempFilePaths = res.tempFilePaths
          wx.uploadFile({
            url:
              'https://admin.school.mseenet.com/api/storage/uploadSingleFile',
            filePath: tempFilePaths[0],
            name: 'file',
            header: {
              Authorization: 'Bearer  ' + _this.token
            },
            formData: {},
            success: function(res) {
              var data = JSON.parse(res.data)
              console.log(data)
              updateStudent({
                id: _this.family.studentId,
                studentImg: data.data.url,
                idCard: _this.userStudentInfo.idCard
              }).then(res => {
                utils.showDialog(res.data.message)
                var StorageStudents = utils.wxGetStorage('students')
                StorageStudents.forEach((item, index) => {
                  if (item.studentId == _this.family.studentId) {
                    StorageStudents.splice(index, 1, res.data.data)
                  }
                })
                utils.wxSetStorage('students', StorageStudents, function() {
                  _this.userStudentInfo = res.data.data
                  for (const key in res.data.data) {
                    if (res.data.data.hasOwnProperty(key)) {
                      if (key == 'studentImg') {
                        res.data.data[key] = utils.formatImgUrl(
                          res.data.data[key]
                        )
                      }
                    }
                  }
                })
                setTimeout(() => {
                  wx.navigateBack()
                }, 2000)
              })
            }
          })
        }
      })
    }
    // submit() {
    //   updateStudent({ id: utils.wxGetStorage('studentId') }).then(res => {
    //     console.log(res)
    //   })
    // }
  }
}
</script>

<style lang="scss" scoped>
#myReviseInfo {
  background: rgb(242, 244, 245);
  .tip {
    padding: 40rpx 30rpx;
    color: #333333;
    font-size: 26rpx;
  }
  .myReviseInfo_container {
    background: white;

    .myReviseInfo_container_item {
      padding: 25rpx 30rpx;

      &::after {
        display: block;
        content: '';
        clear: both;
      }
      .title {
        font-size: 34rpx;
        color: #808080;
        line-height: 100rpx;
        float: left;
      }
      .photo {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;

        > img {
          width: 100rpx;
          height: 100rpx;
          border-radius: 50rpx;
          overflow: hidden;
        }
        > div {
          margin-left: 20rpx;
          > img {
            width: 15rpx;
            height: 26rpx;
          }
        }
        float: right;
      }
      &.info {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
      }
      .title_one {
        margin-right: 20rpx;
        width: 300rpx;
        display: inline-block;
        font-size: 34rpx;
        color: #808080;
      }
      .name {
        > input {
          font-size: 34rpx;
          color: #333;
          display: inline-block;
        }
      }
    }
  }
  .buttonGroup {
    margin-top: 100rpx;
    text-align: center;
    > button {
      width: 690rpx;
    }
  }
}
</style>
