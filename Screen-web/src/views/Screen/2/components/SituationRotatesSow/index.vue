<template>
    <div class="bg_div">
        <div class="bg_title">
            满意情况
        </div>
        <div class="bg_body">
            <div class="divSize">
                <ul>
                    <li v-for="item in evaluation"><p class="text_li">{{item}}</p></li>

                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import {autoDoFn} from "@/utils/util";
    import {getToken} from "@/remote/screen2";
    import {getEvaluation} from "@/remote/screen2";

    export default {

        name: "index",
        data() {
            return{
                token: '',
                timer2: null,
                evaluation: [],
            }
        },
        created() {
            autoDoFn(async () => {
                const res = await getToken();
                if(res) {
                    localStorage.screenToken = res.data;
                    this.token = res.data;
                    this.getEvaluation(res.data)
                }
            })
        },
        methods: {
            getEvaluation(token) {
                autoDoFn(async () => {
                    const res = await getEvaluation({token});
                    if (res.success) {
                        console.log(res.data)
                        var num = 6
                        if (res.data.length > num) {
                            this.evaluation = res.data.slice(0, num)
                            console.log("wo kankan" + this.evaluation)
                            this.timer2 = setInterval(() => {
                                this.evaluation.shift()
                                this.evaluation.push(res.data[num])
                                console.log("num" + num)
                                console.log("len" + res.data.length)
                                if (res.data.length >= num) {
                                    num++
                                } else {
                                    num = 0
                                }
                            }, 2000)
                        } else {
                            this.evaluation = res.data
                        }
                    }
                });
            },
        }

    }
</script>

<style lang="less" scoped>
    @import "../../../../../assets/less/bg_div.less";
    .bg_div > .bg_body .divSize ul li .text_li{
        font-size: 30px;

    }


</style>
