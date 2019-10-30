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
                >生育保险待遇申请表</div>

                <div class="outerDiv" style="height: 45px;">
                    <div class="baseBorder center" style="width:50%;">职工姓名</div>
                    <div class="baseBorder center" style="width:60%;">
                        <a-form-item fieldDecoratorId="cell12">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:90%;">社会保障号码</div>
                    <div class="baseBorder center" style="width:130%;border-right: 1px solid #000;">
                        <a-form-item fieldDecoratorId="cell14" :fieldDecoratorOptions="{rules: [{ required: false, message: ' ' }, { len: 18, message: ' ' }]}">
                            <a-input/>
                        </a-form-item>
                    </div>
                </div>

                <div class="outerDiv" style="height: 45px;">
                    <div class="baseBorder center" style="width:50%;">未就业配偶姓名</div>
                    <div class="baseBorder center" style="width:60%;">
                        <a-form-item fieldDecoratorId="cell21">
                            <a-input placeholder="此项不作填写"disabled></a-input>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:90%;">身份证号码</div>
                    <div class="baseBorder center" style="width:130%;border-right: 1px solid #000;">
                        <a-form-item fieldDecoratorId="cell23">
                            <a-input placeholder="此项不作填写" disabled></a-input>
                        </a-form-item>
                    </div>
                </div>

                <div class="outerDiv" style="height: 45px;">
                    <div class="baseBorder center" style="width:50%;">单位名称</div>
                    <div class="baseBorder center" style="width:280%;border-right: 1px solid #000;">
                        <a-form-item fieldDecoratorId="cell32">
                            <a-input/>
                        </a-form-item>
                    </div>
                </div>

                <div class="outerDiv" style="height: 45px;">
                    <div class="baseBorder center" style="width:50%;">联系人姓名</div>
                    <div class="baseBorder center" style="width:60%;">
                        <a-form-item fieldDecoratorId="cell42">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:90%;">联系电话</div>
                    <div class="baseBorder center" style="width:130%;border-right: 1px solid #000;">
                        <a-form-item fieldDecoratorId="cell44" :fieldDecoratorOptions="{rules: [{ required: false, message: ' ' },{pattern: /^1[3456789]\d{9}$/,message:' '}]}">
                        <a-input/>
                        </a-form-item>
                    </div>
                </div>

                <div class="outerDiv" style="height: 45px;">
                    <div class="baseBorder center" style="width:50%;">生育时间</div>
                    <div class="baseBorder center" style="width:60%;">
                        <a-form-item fieldDecoratorId="cell52">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:220%; border-right: 1px solid #000;">是否符合法定条件生育或者计划生育：是（&nbsp;&nbsp;&nbsp;）否（&nbsp;&nbsp;&nbsp; ）</div>
                </div>

                <div class="outerDiv" style="height: 100px;">
                    <div class="baseBorder center" style="width:50%;">生育类别</div>
                    <div class="baseBorder center" style="width:280%;border-right: 1px solid #000;">
                        <h4>□平产&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            □助娩产&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            □剖宫产</h4>
                        <h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            □不满3个月流产 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            □3-4个月流产&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            □满4个月流产</h4>
                        <h4>□上环&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            □取环&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            □结扎&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;□其他</h4>
                    </div>
                </div>

                <div class="outerDiv" style="height: 45px;">
                    <div class="baseBorder center" style="width:50%;">胎儿数</div>
                    <div class="baseBorder center" style="width:60%;">
                        <a-form-item fieldDecoratorId="cell72">
                            <a-input/>
                        </a-form-item>
                    </div>
                    <div class="baseBorder center" style="width:90%;">孩次</div>
                    <div class="baseBorder center" style="width:130%;border-right: 1px solid #000;">
                        <a-form-item fieldDecoratorId="cell74">
                            <a-input/>
                        </a-form-item>
                    </div>
                </div>

                <div class="outerDiv" style="height: 135px;">
                    <div class="baseBorder center" style="width:50%;">结果送达方式（勾选）</div>
                    <div class="baseBorder center" style="width:280%;border-right: 1px solid #000;">
                        <h4>□自取 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</h4>
                        <h4>□网上自助查询&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</h4>
                        <h4>□短信送达（请填写手机号码：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;）</h4>
                        <h4>□邮寄送达（请填写邮寄地址：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;）</h4>
                    </div>
                </div>

                <div class="outerDiv" style="height: 135px;">
                    <div class="baseBorder center" style="width:50%;">职工意见</div>
                    <div class="baseBorder center" style="width:60%;">
                        <h4>本人承诺以上信息真实有效，愿意承担由此产生的一切法律后果。
                            <br/>职工签字：
                            <br/>年
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;月
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日
                        </h4>
                    </div>
                    <div class="baseBorder center" style="width:90%;">单位意见</div>
                    <div class="baseBorder center" style="width:130%; border-right: 1px solid #000;">
                        <h4>本单位承诺以上信息真实有效，愿意<br/>承担由此产生的一切法律后果。
                            <br/>（盖章）
                            <br/>年
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;月
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日
                        </h4>
                    </div>
                </div>

                <div class="outerDiv" style="height: 135px;">
                    <div class="baseBorder center" style="width:50%;">社保经办机构核定意见</div>
                    <div class="baseBorder center" style="width:280%;border-right: 1px solid #000;">
                       <br/>
                       <br/>
                       <h4>经办人签字：
                           &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                           &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                           &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                           &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                           &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                           &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                           &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                           （盖章）</h4>
                       <h4>
                           &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                           &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                           &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                           &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                           &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                           &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                           &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                           &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                           年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日</h4>
                    </div>
                </div>
                <div class="baseBorder center" style="width:100%;"></div>
                <div style="display:flex;font-size: 12px;font-weight: bold;font-family: 宋体;"
                >备注：本表一式一份，由社保经办机构留存。</div>
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
    import { add4} from "@/remote/formapplication";
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
                            let obj = { ...values, name: "fourthForm", ip: this.ip };
                            debugger;
                            const res = await add4(obj);
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
