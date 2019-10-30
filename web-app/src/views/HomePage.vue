<template>
    <div class="content-wrap">
        <a-button class="actionBtn" @click="linkto('guide')">用户指南</a-button>
        <a-button class="actionBtn" @click="linkto('question')">咨询问题</a-button>
    </div>
</template>

<script>
import { Button } from 'ant-design-vue';

export default {
    name: 'HomePage',
    components:{
        AButton: Button
    },
    methods:{
        linkto(froms){
            let _url = ''
            if(froms == 'guide'){
                _url = '/index/userguide'
            }else if(froms == 'question'){
                _url = '/index/consultquestion'
            }
            this.$router.push(_url)
        }
    }
};
</script>

<style scoped>
    .actionBtn{
        width:50%;
        height:150px;
        margin:60px auto;
        display: block;
        background: #41a5f8d1;
        color:#fff;
        font-size: 30px;
    }
</style>
