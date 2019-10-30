<template>
    <a-header class="header">
        <div class="logo">
            <!-- <img src="../../assets/logo.png"/> -->
            <span>压缩企业开办数据交换平台</span>

        </div>

        <div class="action">
            <div class="icon">
                <a-dropdown placement="bottomCenter" :trigger="['click']">
                    <a-icon type="setting"/>
                    <a-menu slot="overlay">

                        <a-menu-item>
                            <a href="javascript:;" @click="updatePassword">修改密码</a>
                        </a-menu-item>
                        <a-menu-item>
                            <a href="javascript:;" @click="logout">退出</a>
                        </a-menu-item>
                    </a-menu>
                </a-dropdown>
            </div>
        </div>
        <update-password
                :updatePasswordVisible="updatePasswordVisible"
                @cancel="handleUpdateData('updatePasswordVisible', false)"
                @ok="handleSelectStaffOk"
        >

        </update-password>

    </a-header>
</template>

<script>
    import {Layout, Icon, Dropdown, Menu, Modal, Row, Col, Form, Input, message} from 'ant-design-vue';
    import {logout} from '@/remote/user';
    import {autoDoFn} from "../../utils/util";
    import UpdatePassword from '../UpdatePassword'
    import { updatePassword } from "../../remote/userRole";
    const {Header} = Layout;
    const {Item} = Menu;
    const { FormItem }  = Form;
    export default {
        name: 'GlobalHeader',
        components: {
            AHeader: Header,
            AIcon: Icon,
            ADropdown: Dropdown,
            AMenu: Menu,
            AMenuItem: Item,
            AModal: Modal,
            ARow: Row,
            ACol: Col,
            AForm: Form,
            AInput: Input,
            AFormItem: FormItem,
            UpdatePassword
        },
        data() {
            return {
                updatePasswordVisible: false
            }
        },
        methods: {
            logout() {
                autoDoFn(async () => {
                    let res = await logout();
                    if (res) {
                        localStorage.clear();
                        // window.location.href="http://118.31.3.79:8094";
                        this.$router.push('/login');
                    }
                });
            },
            updatePassword(){
                this.updatePasswordVisible = true
            },
            handleUpdateData(type,visible){
                this[type] = visible
            },
            handleSelectStaffOk(oldPassword,newPassword){
                console.log("w我的新密码："+newPassword)
                console.log("w我的旧密码："+oldPassword)

                if(newPassword !== oldPassword){

                    autoDoFn( async () => {
                        let res = await updatePassword({
                            oldPassword: oldPassword,
                            newPassword1: newPassword
                        });
                        if(res.success){
                            this.updatePasswordVisible = false
                            message.info("修改成功")
                            this.logout();
                        }else {
                            this.updatePasswordVisible = false
                        }
                    })
                }else {
                    this.updatePasswordVisible = false
                }
            }

        }
    };
</script>

<style lang="less">
    @import "../../common/base.less";

    .header {
        position: relative;
        background-color: @main-color;
        padding-top: 20px;
        padding-left: 20px;
        height: 80px;

        .logo {
            font-size: 34px;
            height: 40px;
            line-height: 40px;
            color: #fff;

            img {
                width: 40px;
                height: 40px;
                margin-right: 10px;
            }
        }

        .action {
            position: absolute;
            right: 0;
            top: 10px;
            height: 40px;

            .icon {
                vertical-align: top;
                height: 40px;
                display: inline-block;

                .anticon {
                    font-size: 24px;
                    color: #fff;
                    margin-right: 20px;
                    cursor: pointer;
                }
            }
        }
    }

</style>



