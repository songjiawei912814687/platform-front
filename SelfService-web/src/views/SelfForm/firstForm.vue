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
        >《建设工程规划许可证》申请表</div>
        <div
          style="display:flex;justify-content:center;font-size: 14px;font-weight: 800;font-family: 宋体;height:36px;"
        >建筑类项目</div>
        <div style="display:flex;justify-content:space-between;height:36px;">
          <div
            class="baseBorder"
            style="width:20%;border:none;text-align: right;font-weight: bolder;"
          >编号：</div>
          <div class="baseBorder left" style="width:30%;border:none">
            <a-form-item
              fieldDecoratorId="cell11"
              :fieldDecoratorOptions="{rules: [{ required: true, message: ' ' }]}"
            >
              <a-input placeholder="请填写编号"></a-input>
            </a-form-item>
          </div>
          <div
            class="baseBorder"
            style="width:25%;border:none;text-align: right;font-weight: bolder;"
          >项目代码（涉及投资项目）：</div>
          <div class="baseBorder left" style="width:25%;border:none;">
            <a-form-item
              fieldDecoratorId="cell12"
              :fieldDecoratorOptions="{rules: [{ required: true, message: ' ' }]}"
            >
              <a-input placeholder="请填写项目代码"></a-input>
            </a-form-item>
          </div>
        </div>
        <div class="outerDiv">
          <div class="baseBorder center" style="width:20%;">申请人</div>
          <div class="baseBorder left" style="border-right: 1px solid #000;width:80%;">
            <a-form-item
              fieldDecoratorId="cell21"
              :fieldDecoratorOptions="{rules: [{ required: true, message: ' ' }]}"
            >
              <a-input placeholder="请填写申请人"></a-input>
            </a-form-item>
          </div>
        </div>
        <div class="outerDiv">
          <div class="baseBorder center" style="width:20%;border-bottom: 1px solid #000;">法定代表人</div>
          <div class="baseBorder left" style="width:30%;border-bottom: 1px solid #000;">
            <a-form-item
              fieldDecoratorId="cell31"
              :fieldDecoratorOptions="{rules: [{ required: true, message: ' ' }]}"
            >
              <a-input placeholder="请填写法定代表人"></a-input>
            </a-form-item>
          </div>
          <div class="baseBorder center" style="width:20%;border-bottom: 1px solid #000;">联系电话</div>
          <div
            class="baseBorder left"
            style="width:30%;border-bottom: 1px solid #000;border-right: 1px solid #000;"
          >
            <a-form-item
              fieldDecoratorId="cell32"
              :fieldDecoratorOptions="{rules: [{ required: true, message: ' ' },{pattern: /^1[3456789]\d{9}$/,message:' '}]}"
            >
              <a-input placeholder="请填写联系电话"></a-input>
            </a-form-item>
          </div>
        </div>
        <div class="outerDiv" style="margin-top:-1px">
          <div class="baseBorder center" style="width:12%;border-bottom: 1px solid #000;">委托代理人（选填）</div>
          <div class="baseBorder left" style="width:21%;border-bottom: 1px solid #000;">
            <a-form-item
              fieldDecoratorId="cell41"
              :fieldDecoratorOptions="{rules: [{ required: false, message: ' ' }]}"
            >
              <a-input placeholder="请填写委托代理人"></a-input>
            </a-form-item>
          </div>
          <div class="baseBorder center" style="width:12%;border-bottom: 1px solid #000;">联系电话（选填）</div>
          <div class="baseBorder left" style="width:21%;border-bottom: 1px solid #000;">
            <a-form-item
              fieldDecoratorId="cell42"
              :fieldDecoratorOptions="{rules: [{ required: false, message: ' ' },{pattern: /^1[3456789]\d{9}$/,message:' '}]}"
            >
              <a-input placeholder="请填写联系电话"></a-input>
            </a-form-item>
          </div>
          <div class="baseBorder center" style="width:12%;border-bottom: 1px solid #000;">身份证号码（选填）</div>
          <div
            class="baseBorder left"
            style="width:22%;border-bottom: 1px solid #000;border-right: 1px solid #000;"
          >
            <a-form-item
              fieldDecoratorId="cell43"
              :fieldDecoratorOptions="{rules: [{ required: false, message: ' ' }, { len: 18, message: ' ' }]}"
            >
              <a-input placeholder="请填写身份证号码"></a-input>
            </a-form-item>
          </div>
        </div>
        <div class="outerDiv" style="margin-top:-1px">
          <div class="baseBorder center" style="width:20%">项目名称</div>
          <div class="baseBorder left" style="width:80%;border-right: 1px solid #000;">
            <a-form-item
              fieldDecoratorId="cell51"
              :fieldDecoratorOptions="{rules: [{ required: true, message: ' ' }]}"
            >
              <a-input placeholder="请填写项目名称"></a-input>
            </a-form-item>
          </div>
        </div>
        <div class="outerDiv">
          <div class="baseBorder center" style="width:20%">用地位置</div>
          <div class="baseBorder left" style="width:80%;border-right: 1px solid #000;">
            <a-form-item
              fieldDecoratorId="cell61"
              :fieldDecoratorOptions="{rules: [{ required: true, message: ' ' }]}"
            >
              <a-input placeholder="请填写用地位置"></a-input>
            </a-form-item>
          </div>
        </div>
        <div class="outerDiv">
          <div class="baseBorder center" style="width:20%">用地性质</div>
          <div class="baseBorder left" style="width:80%;border-right: 1px solid #000;">
            <a-form-item
              fieldDecoratorId="cell71"
              :fieldDecoratorOptions="{rules: [{ required: true, message: ' ' }]}"
            >
              <a-input placeholder="请填写用地性质"></a-input>
            </a-form-item>
          </div>
        </div>
        <div class="outerDiv">
          <div class="baseBorder center" style="width:20%">用地规模（M²）</div>
          <div class="baseBorder left" style="width:80%;border-right: 1px solid #000;">
            <a-form-item
              fieldDecoratorId="cell81"
              :fieldDecoratorOptions="{rules: [{ required: true, message: ' ' },{pattern: /^([1-9][0-9]*)+(.[0-9]{1,5})?$/,message:' '}]}"
            >
              <a-input placeholder="请填写用地规模"></a-input>
            </a-form-item>
          </div>
        </div>
        <div class="outerDiv">
          <div class="baseBorder center" style="width:20%;height:72px;line-height:72px;">设计单位</div>
          <div class="baseBorder left" style="width:30%;height:72px;line-height:72px;">
            <a-form-item
              fieldDecoratorId="cell91"
              :fieldDecoratorOptions="{rules: [{ required: true, message: ' ' }]}"
            >
              <a-input placeholder="请填写设计单位" style="margin-top: 20px;"></a-input>
            </a-form-item>
          </div>
          <div class="baseBorder center" style="width:50%;">
            <div class="outerDiv" style="margin-top:-1px;margin-left:-1px">
              <div class="baseBorder center" style="width:30%">设计负责人</div>
              <div
                class="baseBorder left"
                style="width:70%;border-right: 1px solid #000;text-align: left;"
              >
                <a-form-item
                  fieldDecoratorId="cell92"
                  :fieldDecoratorOptions="{rules: [{ required: true, message: ' ' }]}"
                >
                  <a-input placeholder="请填写设计负责人"></a-input>
                </a-form-item>
              </div>
            </div>
            <div class="outerDiv" style="margin-top:-1px;margin-left:-1px">
              <div class="baseBorder center" style="width:30%">联系电话</div>
              <div
                class="baseBorder left"
                style="width:70%;border-right: 1px solid #000;text-align: left;"
              >
                <a-form-item
                  fieldDecoratorId="cell101"
                  :fieldDecoratorOptions="{rules: [{ required: true, message: ' ' },{pattern: /^1[3456789]\d{9}$/,message:' '}]}"
                >
                  <a-input placeholder="请填写联系电话"></a-input>
                </a-form-item>
              </div>
            </div>
          </div>
        </div>
        <div class="outerDiv" style="position: relative;top: 36px;">
          <div class="baseBorder center" style="width:20%">建设规模（M²）</div>
          <div class="baseBorder left" style="width:80%;border-right: 1px solid #000;">
            <a-form-item
              fieldDecoratorId="cell111"
              :fieldDecoratorOptions="{rules: [{ required: true, message: ' ' },{pattern: /^([1-9][0-9]*)+(.[0-9]{1,5})?$/,message:' '}]}"
            >
              <a-input placeholder="请填写建设规模"></a-input>
            </a-form-item>
          </div>
        </div>
        <div class="outerDiv" style="position: relative;top: 36px;">
          <div class="baseBorder center" style="width:12%;height:108px;line-height:108px">行政许可申请人</div>
          <div class="baseBorder" style="width:88%">
            <div class="outerDiv" style="margin-top:-1px;margin-left:-1px">
              <div class="baseBorder" style="width:30%;text-align:right;font-weight: bolder;">申请人：</div>
              <div class="baseBorder left" style="width:70%;border-right: 1px solid #000;">
                <a-form-item
                  fieldDecoratorId="cell121"
                  :fieldDecoratorOptions="{rules: [{ required: true, message: ' ' }]}"
                >
                  <a-input placeholder="请填写申请人"></a-input>
                </a-form-item>
              </div>
            </div>
            <div class="outerDiv" style="margin-left:-1px">
              <div
                class="baseBorder"
                style="width:30%;text-align:right;font-weight: bolder;"
              >法定代表人（或委托代理人）：</div>
              <div class="baseBorder left" style="width:70%;border-right: 1px solid #000;">
                <a-form-item
                  fieldDecoratorId="cell131"
                  :fieldDecoratorOptions="{rules: [{ required: true, message: ' ' }]}"
                >
                  <a-input placeholder="请填写法定代表人（或委托代理人）"></a-input>
                </a-form-item>
              </div>
            </div>
            <div class="outerDiv" style="margin-left:-1px">
              <div
                class="baseBorder"
                style="width:30%;text-align:right;padding-right: 10px;font-weight: bolder;"
              >(签名、公章)</div>
              <div
                class="baseBorder"
                style="width:70%;border-right: 1px solid #000;text-align:right"
              >
                <span>年</span>
                <span style="margin-left:30px">月</span>
                <span style="margin:0 30px">日</span>
              </div>
            </div>
          </div>
        </div>
        <div
          class="outerDiv"
          style="position: relative;top: 108px;border-right:1px solid #000;border-left:1px solid #000;border-top:1px solid #000;line-height:36px;padding-left:10px;font-weight: bolder;"
        >申报材料、附件及附图名称：</div>
        <div
          class="outerDiv left"
          style="position: relative;top: 108px;border-left:1px solid #000;border-bottom:1px solid #000;border-right:1px solid #000;margin-top:-1px;height:100px;width:100%"
        >
          <a-form-item
            style="width:100%"
            fieldDecoratorId="cell151"
            :fieldDecoratorOptions="{rules: [{ required: true, message: ' ' }]}"
          >
            <a-text-area placeholder="请填写申报材料、附件及附图名称" style="height:94px;width:100%"></a-text-area>
          </a-form-item>
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
import { add } from "@/remote/formapplication";
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
            let obj = { ...values, name: "firstForm", ip: this.ip };
            debugger;
            const res = await add(obj);
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

<style lang="less">
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
#table input {
  width: 100%;
  padding: 0px;
  border: none;
}
#table {
  height: calc(100vh - 180px);
}

#table textarea {
  width: 100%;
  padding: 0px;
  border: none;
}

.ant-form-item-control-wrapper {
  margin-top: 2px;
}

.ant-table-thead > tr > th {
  background: #159bd4;
  color: #fff;
  font-size: 14px;
}
.detailBox .ant-layout-content {
  overflow-y: scroll;
}

.detailBox .infoBox .titles {
  color: #4088c7;
  font-size: 16px;
  text-align: center;
}

.detailBox {
  .resBox {
    .detail-label {
      background-color: #159bd4;
      color: #fff;
      padding-left: 15px;
      font-size: 14px;
      line-height: 30px;
    }
    .detail-content {
      background-color: #fff;
      > p {
        font-size: 14px;
        line-height: 25px;
        min-height: 25px;
        padding-left: 15px;
        margin-bottom: 2px;
        background-color: #e9e9e9;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
  .footer-info {
    text-align: center;
    position: sticky;
    width: 100%;
    bottom: 0px;
    background: #ffffff;
    .download-button {
      display: inline-block;
      width: 60%;
      background-color: #ff6600;
      color: #fff;
      font-size: 16px;
      line-height: 35px;
      border: none;
    }
    .download-info {
      color: #1890ff;
      font-size: 12px;
      text-align: center;
      margin-top: 20px;
    }
  }
}

.detailBox .resBox table {
  width: 100%;
}

.detailBox .resBox table td {
  border: 1px solid #dbe9f4;

  padding: 10px 15px;
}

.detailBox .resBox table .first,
.detailBox .resBox table .third {
  background-color: rgb(233, 242, 249);
}

.detailBox .resBox table .threeCols {
  color: rgb(161, 161, 161);
}

.detailBox .resBox table .threeCols span {
  color: rgb(61, 61, 61);
}

.detailBox .tabBox {
  width: 100%;
  margin-top: 20px;
  border-top: 2px solid #469ef7;
}

.detailBox .tabBox table {
  width: 100%;
}

.detailBox .tabBox table tr {
  border: 0 !important;
  border-top: 1px solid #e8e8e8 !important;
  background: #e9f0f6 !important;
}

.detailBox .tabBox td.active {
  background: #fff !important;
}

.detailBox .tabBox table tr:last-child {
  min-height: 200px;
  border: 0 !important;
}

.detailBox .tabBox td {
  min-width: 100px;
  width: 16.6%;
  text-align: center;
  cursor: pointer;
  font-size: 14px;
  line-height: 40px;
}
</style>
