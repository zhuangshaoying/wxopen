import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()

export default{    
    config:{
        "navigationBarTitleText":"咪师校园",
        "enablePullDownRefresh": true,
        "backgroundTextStyle":"dark",
        
    }
}