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
                >基本医疗保险参保人员长住外地就医备案表</div>
                <div class="outerDiv">
                    <div class="baseBorder center" style="width:20%;">序号</div>
                    <div class="baseBorder center" style="width:45%;">姓名</div>
                    <div class="baseBorder center" style="width:100%;">社会保障号码(身份证号码)</div>
                    <div class="baseBorder center" style="width:70%;">登记类型(填代码)</div>
                    <div class="baseBorder center" style="width:60%;">联系电话</div>
                    <div class="baseBorder center" style="width:100%;">备案起止时间</div>
                    <div class="baseBorder center" style="width:100%;">异地联系地址</div>
                    <div class="baseBorder center" style="width:50%;border-right: 1px solid #000;">邮编</div>
                </div>
                <div class="outerDiv">
                    <div class="baseBorder " style="width:20%;">&nbsp;&nbsp;&nbsp;&nbsp;1</div>
                    <div class="baseBorder center" style="width:45%;">
                        <a-form-item fieldDecoratorId="cell21">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:100%;">
                        <a-form-item fieldDecoratorId="cell22" :fieldDecoratorOptions="{rules: [{ required: false, message: ' ' }, { len: 18, message: ' ' }]}">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:70%;">
                        <a-form-item fieldDecoratorId="cell23">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:60%;">
                        <a-form-item fieldDecoratorId="cell24" :fieldDecoratorOptions="{rules: [{ required: false, message: ' ' },{pattern: /^1[3456789]\d{9}$/,message:' '}]}">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:100%;">
                        <a-form-item fieldDecoratorId="cell25">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:100%;">
                        <a-form-item fieldDecoratorId="cell26">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:50%;border-right: 1px solid #000;">
                        <a-form-item fieldDecoratorId="cell27">
                            <a-input/>
                        </a-form-item>
                    </div>
                </div>
                <div class="outerDiv">
                    <div class="baseBorder " style="width:20%;">&nbsp;&nbsp;&nbsp;&nbsp;2</div>
                    <div class="baseBorder center" style="width:45%;">
                        <a-form-item fieldDecoratorId="cell31">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:100%;">
                        <a-form-item fieldDecoratorId="cell32" :fieldDecoratorOptions="{rules: [{ required: false, message: ' ' }, { len: 18, message: ' ' }]}">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:70%;">
                        <a-form-item fieldDecoratorId="cell33">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:60%;">
                        <a-form-item fieldDecoratorId="cell34" :fieldDecoratorOptions="{rules: [{ required: false, message: ' ' },{pattern: /^1[3456789]\d{9}$/,message:' '}]}">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:100%;">
                        <a-form-item fieldDecoratorId="cell35">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:100%;">
                        <a-form-item fieldDecoratorId="cell36">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:50%;border-right: 1px solid #000;">
                        <a-form-item fieldDecoratorId="cell37">
                            <a-input/>
                        </a-form-item>
                    </div>
                </div>
                <div class="outerDiv">
                    <div class="baseBorder " style="width:20%;">&nbsp;&nbsp;&nbsp;&nbsp;3</div>
                    <div class="baseBorder center" style="width:45%;">
                        <a-form-item fieldDecoratorId="cell41">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:100%;">
                        <a-form-item fieldDecoratorId="cell42" :fieldDecoratorOptions="{rules: [{ required: false, message: ' ' }, { len: 18, message: ' ' }]}">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:70%;">
                        <a-form-item fieldDecoratorId="cell43">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:60%;">
                        <a-form-item fieldDecoratorId="cell44" :fieldDecoratorOptions="{rules: [{ required: false, message: ' ' },{pattern: /^1[3456789]\d{9}$/,message:' '}]}">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:100%;">
                        <a-form-item fieldDecoratorId="cell45">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:100%;">
                        <a-form-item fieldDecoratorId="cell46">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:50%;border-right: 1px solid #000;">
                        <a-form-item fieldDecoratorId="cell47">
                            <a-input/>
                        </a-form-item>
                    </div>
                </div>
                <div class="outerDiv">
                    <div class="baseBorder " style="width:20%;">&nbsp;&nbsp;&nbsp;&nbsp;4</div>
                    <div class="baseBorder center" style="width:45%;">
                        <a-form-item fieldDecoratorId="cell51">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:100%;">
                        <a-form-item fieldDecoratorId="cell52" :fieldDecoratorOptions="{rules: [{ required: false, message: ' ' }, { len: 18, message: ' ' }]}">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:70%;">
                        <a-form-item fieldDecoratorId="cell53">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:60%;">
                        <a-form-item fieldDecoratorId="cell54" :fieldDecoratorOptions="{rules: [{ required: false, message: ' ' },{pattern: /^1[3456789]\d{9}$/,message:' '}]}">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:100%;">
                        <a-form-item fieldDecoratorId="cell55">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:100%;">
                        <a-form-item fieldDecoratorId="cell56">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:50%;border-right: 1px solid #000;">
                        <a-form-item fieldDecoratorId="cell57">
                            <a-input/>
                        </a-form-item>
                    </div>
                </div>
                <div class="outerDiv">
                    <div class="baseBorder " style="width:20%;">&nbsp;&nbsp;&nbsp;&nbsp;5</div>
                    <div class="baseBorder center" style="width:45%;">
                        <a-form-item fieldDecoratorId="cell61">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:100%;">
                        <a-form-item fieldDecoratorId="cell62" :fieldDecoratorOptions="{rules: [{ required: false, message: ' ' }, { len: 18, message: ' ' }]}">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:70%;">
                        <a-form-item fieldDecoratorId="cell63">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:60%;">
                        <a-form-item fieldDecoratorId="cell64" :fieldDecoratorOptions="{rules: [{ required: false, message: ' ' },{pattern: /^1[3456789]\d{9}$/,message:' '}]}">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:100%;">
                        <a-form-item fieldDecoratorId="cell65">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:100%;">
                        <a-form-item fieldDecoratorId="cell66">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:50%;border-right: 1px solid #000;">
                        <a-form-item fieldDecoratorId="cell67">
                            <a-input/>
                        </a-form-item>
                    </div>
                </div>
                <div class="outerDiv">
                    <div class="baseBorder " style="width:20%;">&nbsp;&nbsp;&nbsp;&nbsp;6</div>
                    <div class="baseBorder center" style="width:45%;">
                        <a-form-item fieldDecoratorId="cell71">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:100%;">
                        <a-form-item fieldDecoratorId="cell72" :fieldDecoratorOptions="{rules: [{ required: false, message: ' ' }, { len: 18, message: ' ' }]}">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:70%;">
                        <a-form-item fieldDecoratorId="cell73">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:60%;">
                        <a-form-item fieldDecoratorId="cell74" :fieldDecoratorOptions="{rules: [{ required: false, message: ' ' },{pattern: /^1[3456789]\d{9}$/,message:' '}]}">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:100%;">
                        <a-form-item fieldDecoratorId="cell75">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:100%;">
                        <a-form-item fieldDecoratorId="cell76">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:50%;border-right: 1px solid #000;">
                        <a-form-item fieldDecoratorId="cell77">
                            <a-input/>
                        </a-form-item>
                    </div>
                </div>
                <div class="outerDiv">
                    <div class="baseBorder " style="width:20%;">&nbsp;&nbsp;&nbsp;&nbsp;7</div>
                    <div class="baseBorder center" style="width:45%;">
                        <a-form-item fieldDecoratorId="cell81">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:100%;">
                        <a-form-item fieldDecoratorId="cell82" :fieldDecoratorOptions="{rules: [{ required: false, message: ' ' }, { len: 18, message: ' ' }]}">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:70%;">
                        <a-form-item fieldDecoratorId="cell83">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:60%;">
                        <a-form-item fieldDecoratorId="cell84" :fieldDecoratorOptions="{rules: [{ required: false, message: ' ' },{pattern: /^1[3456789]\d{9}$/,message:' '}]}">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:100%;">
                        <a-form-item fieldDecoratorId="cell85">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:100%;">
                        <a-form-item fieldDecoratorId="cell86">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:50%;border-right: 1px solid #000;">
                        <a-form-item fieldDecoratorId="cell87">
                            <a-input/>
                        </a-form-item>
                    </div>
                </div>
                <div class="outerDiv">
                    <div class="baseBorder " style="width:20%;">&nbsp;&nbsp;&nbsp;&nbsp;8</div>
                    <div class="baseBorder center" style="width:45%;">
                        <a-form-item fieldDecoratorId="cell91">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:100%;">
                        <a-form-item fieldDecoratorId="cell92" :fieldDecoratorOptions="{rules: [{ required: false, message: ' ' }, { len: 18, message: ' ' }]}">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:70%;">
                        <a-form-item fieldDecoratorId="cell93">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:60%;">
                        <a-form-item fieldDecoratorId="cell94" :fieldDecoratorOptions="{rules: [{ required: false, message: ' ' },{pattern: /^1[3456789]\d{9}$/,message:' '}]}">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:100%;">
                        <a-form-item fieldDecoratorId="cell95">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:100%;">
                        <a-form-item fieldDecoratorId="cell96">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:50%;border-right: 1px solid #000;">
                        <a-form-item fieldDecoratorId="cell97">
                            <a-input/>
                        </a-form-item>
                    </div>
                </div>
                <div class="lastDiv">
                    <div class="baseBorder left" style="position: relative;border-right:1px solid #000;border-left:1px solid #000;border-top:1px solid #000;line-height:36px;padding-left:10px;font-weight: bolder;">
                        <h4> &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;申请人住外信息真实有效并知晓医疗费用报销的政策，愿意承担由此产生的一切法律后果</h4>
                        <h4> &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;申请人(代办人)签名：&nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;
                            联系电话：&nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;
                            单位意见(盖章)：&nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;
                            申请时间：&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            年&nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;月&nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;日</h4>
                    </div>
                    <div class="baseBorder center" style="width:100%;"></div>

                </div>
                <div style="display:flex;font-size: 20px;font-weight: bold;font-family: 宋体;"
                >填表说明：</div>
                <div>1.登记类别填写代码：①新增 ②撤销 ③变更。</div>
                <div>2.本表适用于长住外地3个月以上的参保人员。个人办理时由本人或代办人签字。
                    单位在职人员办理的，应加盖单位公章，同时办理5人以上登记手续时，可选择通过电脑导盘，格式由市医保局提供。</div>
                <div>3.已办理长住外地备案人员在省、市一卡通定点医疗机构就医的,
                    及已办理跨省异地就医备案人员在长住地跨省异地定点医院机构住院治疗的,均可持本人社会保障卡刷卡就医并按规定结算费用</div>
                <div>4.长住外地期间在长住地定点医疗机构发生的自费医疗用可市区各医保经办机构按杭州医保规定报销。
                    申请医疗费报销时需携带本人社会保障卡(或身份证)本人银行卡,有效医疗费发票原件,报销门诊费用的，需提供当时就诊记载的病历、医疗费用清单原件或复印件；报销住院费用的,
                    需提供出院记录、住院费用汇总明细清单原件或复印件；报销外伤医疗费的，还需提供外伤经过情况说明，涉及责任认定或商业保险赔付的,需同时提供交警事故认定书、法院判决书、法院执行说明、调解协议书或保险理赔单原件及复印件各一份。
                    委托办理的还需同时携带代办人社会保障卡(或身份证)</div>
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
    import { add2} from "@/remote/formapplication";
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
                            let obj = { ...values, name: "secondForm", ip: this.ip };
                            debugger;
                            const res = await add2(obj);
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

    .lastDiv{
        height: 71px;
    }

    .baseBorder {
        border-left: 1px solid #000;
        border-top: 1px solid #000;
        line-height: 36px;
    }
    .center {
        text-align: center;
        font-weight: bolder;
    }
    .left {
        padding-left: 10px;
    }
    .outerDiv {
        display: flex;
        justify-content: space-between;
        height: 36px;
    }

</style>
