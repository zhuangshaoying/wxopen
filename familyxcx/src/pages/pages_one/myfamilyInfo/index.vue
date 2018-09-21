<template>
  <div id="myfamilyInfo">
    <div class="familyInfo_item">
      <div class="item_title">头像</div>
      <div class="item_info">
        <div class="item_info_img"><img :src="familyInfo.avatarImg" alt=""></div>
        <div class="icon"><img src="http://test.admin.school.mseenet.com/html/img/iOS切图/next@3x.png" alt=""></div>
      </div>
    </div>
    <div class="familyInfo_item" @click="selectName">
      <div class="item_title">家长姓名</div>
      <div class="item_info">
        <div class="item_info_center">{{familyInfo.realName}}</div>
        <div class="icon"><img src="http://test.admin.school.mseenet.com/html/img/iOS切图/next@3x.png" alt=""></div>
      </div>
    </div>
    <div class="familyInfo_item">
      <div class="item_title">学生姓名</div>
      <div class="item_info">
        <div class="item_info_center">{{family.studentName}}</div>
        <div class="icon"><img src="http://test.admin.school.mseenet.com/html/img/iOS切图/next@3x.png" alt=""></div>
      </div>
    </div>

    <picker @change="bindPickerChange" :value="index" :range="array">
      <div class="familyInfo_item">
        <div class="item_title">性别</div>
        <div class="item_info">
          <div class="item_info_center">{{array[index]}}</div>
          <div class="icon"><img src="http://test.admin.school.mseenet.com/html/img/iOS切图/next@3x.png" alt=""></div>
        </div>
      </div>
    </picker>

    <div class="modal" v-if="modal_show">
      <div class="modal_container">
        <div class="modal_title">修改名字</div>
        <div class="modal_tip">请输入您的真实名字</div>
        <div class="modal_input">
          <input type="text" placeholder="请输入您的真实姓名" v-model="modal_value">
        </div>
        <div class="modal_group">
          <button type="button" @click="modal_cancel">取消</button>
          <button type="button" @click="modal_confirm">提交</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { modifyUserInfo } from '@/api/api'
import { mapState, mapActions } from 'vuex'
import utils from '@/utils/index'
export default {
  data() {
    return {
      familyInfo: utils.wxGetStorage('familyInfo'),
      index: 0,
      array: ['男', '女'],
      modal_show: false,
      modal_value: ''
    }
  },
  computed: {
    ...mapState(['family'])
  },
  mounted() {
    console.log(this.familyInfo)
    this.index = this.familyInfo.sex
    console.log(this.index)
  },
  methods: {
    bindPickerChange(value) {
      this.index = value.mp.detail.value
      modifyUserInfo({ sex: this.index }).then(res => {
        console.log(res)
      })
    },
    selectName() {
      this.modal_show = true
    },
    modal_cancel() {
      this.modal_show = false
    },
    modal_confirm() {
      modifyUserInfo({ realName: this.modal_value }).then(res => {
        this.familyInfo.realName = this.modal_value
        utils.wxSetStorageSync('familyInfo', this.familyInfo)
        console.log(res)
        this.modal_show = false
      })
    }
  }
}
</script>

<style lang="scss">
page {
  height: 100%;
  padding-top: 20rpx;
  box-sizing: border-box;
  background: rgba(243, 244, 246, 1);
}

#myfamilyInfo {
  background: white;
  // margin-top: 20rpx;
  width: 100%;
  .familyInfo_item {
    & + .familyInfo_item {
      border-top: 1px solid #e6e6e6;
    }
    width: 100%;
    display: flex;
    padding: 30rpx 30rpx;
    box-sizing: border-box;
    color: #333333;
    justify-content: space-between;
    align-items: center;
    .item_title {
      color: inherit;
    }
    .item_info {
      display: flex;
      align-items: center;
      .item_info_img {
        border-radius: 30rpx;
        overflow: hidden;
        width: 70rpx;
        height: 70rpx;
        margin-right: 20rpx;
        img {
          width: 70rpx;
          height: 70rpx;
        }
      }
      .item_info_center {
        color: #808080;
        font-size: 30rpx;
        margin-right: 20rpx;
      }
      .icon {
        img {
          width: 15rpx;
          height: 26rpx;
        }
      }
    }
  }
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 9999;
    .modal_container {
      border-radius: 20rpx;
      // padding: 0 40rpx;
      // border: 1px solid red;
      background: #f8f8f8;
      display: flex;
      flex-direction: column;

      .modal_title {
        font-weight: bold;
        text-align: center;
        padding: 20rpx 0;
        // border: 1px solid red;
      }
      .modal_tip {
        font-size: 15px;
        padding: 20rpx 0;
        text-align: center;
        // border: 1px solid red;
      }
      .modal_input {
        padding: 10rpx 20rpx;
        // border: 1px solid red;
        > input {
          background: white;
          padding: 10rpx 0 10rpx 20rpx;
          border: 1px solid #ccc;
          border-radius: 12rpx;
        }
      }
      .modal_group {
        margin-top: 20rpx;
        display: flex;
        // border: 1px solid red;
        button {
          flex: 1;
          &:first-child {
            color: #ccc;
          }
          &:last-child {
            color: #000;
          }
        }
      }
    }
  }
}
</style>
