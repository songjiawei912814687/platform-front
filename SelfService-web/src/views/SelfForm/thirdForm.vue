<template>
    <div class="wrap-content detailBox" style="min-width:100px;">
        <div class="nowposition">
            <a-breadcrumb :routes="routes" separator=">">
                <template slot="itemRender" slot-scope="{route, params, routes, paths}">
                    <span v-if="routes.indexOf(route) === routes.length - 1">{{route.breadcrumbName}}</span>
                    <router-link v-else :to="paths.join('/')">{{route.breadcrumbName}}</router-link>
                </template>
            </a-breadcrumb>
            <a-button type="default" class="returnBack" @click="returnBack">返回</a-button>
            <a-button type="default" class="returnBack" @click="returnHome">首页</a-button>
        </div>
        <div style="top: 60px;position: relative;height:1000px">
            <a-form
                    layout="vertical"
                    :autoFormCreate="form => this.form = form"
                    style="top: 60px;position: relative;width:70%;margin-left:15%;"
                    id="table"
            >
                <div
                        style="display:flex;justify-content:center;font-size: 24px;font-weight: 800;font-family: 宋体;height:60px;"
                >基本医疗保险参保人员享受规定(特殊慢性)病种待遇备案表</div>
                <div>备案编号：</div>
                <div class="outerDiv" style="height: 45px;">
                    <div class="baseBorder center" style="width:50%;">姓名</div>
                    <div class="baseBorder center" style="width:60%;">
                        <a-form-item fieldDecoratorId="cell22">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:90%;">社会保障号码(身份证号码)</div>
                    <div class="baseBorder center" style="width:130%;">
                        <a-form-item fieldDecoratorId="cell24" :fieldDecoratorOptions="{rules: [{ required: false, message: ' ' }, { len: 18, message: ' ' }]}">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:49.15%;">联系电话</div>
                    <div class="baseBorder center" style="width:100%;border-right: 1px solid #000;">
                        <a-form-item fieldDecoratorId="cell26" :fieldDecoratorOptions="{rules: [{ required: false, message: ' ' },{pattern: /^1[3456789]\d{9}$/,message:' '}]}">
                            <a-input/>
                        </a-form-item>
                    </div>
                </div>

                <div class="outerDiv">
                    <div class="baseBorder center" style="width:50%;">病情诊断</div>
                    <div class="baseBorder center" style="width:430%;border-right: 1px solid #000;"></div>
                </div>

                <div class="outerDiv">
                    <div class="baseBorder center" style="width:50%;">门诊治疗建议</div>
                    <div class="baseBorder center" style="width:430%;border-right: 1px solid #000;">
                        <br/>
                        <h4>&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;
                            &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;
                            &nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;
                            &nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;
                            &nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;
                            &nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;医师签名:
                            &nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;年
                            &nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp; 月
                            &nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp; 日</h4>
                    </div>
                </div>

                <div class="outerDiv">
                    <div class="baseBorder center" style="width:50%;">定点医疗机构意见</div>
                    <div class="baseBorder center" style="width:430%;border-right: 1px solid #000;">
                        <br/>
                        <h4>&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;
                            &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;
                            &nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;
                            &nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;
                            &nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;
                            &nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;（盖章）:
                            &nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;年
                            &nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp; 月
                            &nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp; 日</h4>
                    </div>
                </div>

                <div class="outerDiv">
                    <div class="baseBorder center" style="width:50%;">备案就诊医院(根据参保地政策选填)</div>
                    <div class="baseBorder center" style="width:430%;border-right: 1px solid #000;"></div>
                </div>

                    <div class="baseBorder center" style="width:100%;"></div>

                <div style="display:flex;font-size: 20px;font-weight: bold;font-family: 宋体;"
                >填表须知：</div>
                <div>1. 此建议书适合对象为:各类恶性肿瘤、系统性红斑狼疮、血友病、再生障碍性贫血、精神分裂症、情感性精神病、儿童孤独症、艾滋病、耐多药肺结核以及慢性肾功能衰
                    竭的透析治疗和器官移植后的抗排异治疗的病人。</div>
                <div>2. 此建议书由市区二级及以上定点医疗机构(其中患有精神分裂症、情感性精神病、儿
                    童孤独症的,须持有精神病专科医院或三级医疗机构精神病专科出具的医疗证明)经
                    主治医生填写,经定点医疗机构主管科室签署意见并盖章。</div>
                <div>3. 办理规定病种专用门诊病历时,持此建议书、一寸免冠近照一张和市区二级及以上定
                    点医疗机构出具的出院小结或病理报告或疾病诊断证明书(长住外地人员由当地二级
                    及以上定点医疗机构出具)。
                </div>
                <div>4. 患慢性肾功能衰竭需进行门诊透析治疗的参保人员可选择一家门诊透析特约定点医
                    疗机构,并可根据本人需要怎三个月进行调整。
                </div>
                <div>
                    5. 规定病种备案有效期为5年,需延期的,应在期满前一个月重新办理备案手续。
                </div>
            </a-form>
        </div>
        <Button class="footer-info">
            <Button class="download-button" @click="clickHandle">打印本自助单</Button>
        </Button>
     </div>
</template>
<script src="http://pv.sohu.com/cityjson?ie=utf-8"></script>
<script>
    import { Row, Col, Input, Button, Form, Breadcrumb } from "ant-design-vue";
    import { add3} from "@/remote/formapplication";
    import { autoDoFn, transformTree } from "@/utils/util";
    import print from "print-js";
    const { Item } = Form;
    const { TextArea } = Input;
    export default {
        name: "index",
        components: {
            AInput: Input,
            ARow: Row,
            ACol: Col,
            AButton: Button,
            ABreadcrumb: Breadcrumb,
            AForm: Form,
            AFormItem: Item,

            ATextArea: TextArea
        },
        data() {
            return {
                form: null,
                addLoading: false,
                ip: "",
                routes: [
                    {
                        path: "../../../index/homepage",
                        breadcrumbName: "首页"
                    },
                    {
                        path: "../../../index/selfform",
                        breadcrumbName: "自助填单"
                    },
                    {
                        path: "../../index/itemdetail",
                        breadcrumbName: "填单"
                    }
                ]
            };
        },
        methods: {
            clickHandle(e) {
                e.preventDefault();
                this.form.validateFields((err, values) => {
                    if (err) {
                        for (var st in err) {
                            document.getElementById(st).focus();
                            this.$message.error("必填信息未填写或格式错误");
                            return;
                        }
                    } else {
                        autoDoFn(async () => {
                            this.addLoading = true;
                            let obj = { ...values, name: "thirdForm", ip: this.ip };
                            debugger;
                            const res = await add3(obj);
                            if (res.success) {
                                if (res.data) {
                                    const imageArr = ["JPG", "JPEG", "PNG", "GIF"];
                                    let type = "pdf";
                                    const nameArr = res.data.split(".");
                                    if (
                                        imageArr.indexOf(nameArr[nameArr.length - 1].toUpperCase()) >
                                        -1
                                    ) {
                                        type = "image";
                                    }
                                    print({
                                        printable: `/${res.data}`,
                                        type
                                    });
                                }
                            }
                            this.addLoading = false;
                        });
                    }
                });
            },
            returnBack() {
                // this.$router.back(-1);
                this.$router.push("/index/selfform");
            },
            returnHome() {
                this.$router.push("/index/homepage");
            }
        }
    };
</script>

<style lang="less" scoped>
    #table input {
        width: 99%;
        padding: 0px;
        border: none;
    }
    .outerDiv{
        height: 90px;
    }


</style>
