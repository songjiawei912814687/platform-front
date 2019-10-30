<template>
    <a-header class="header">
        <div class="logo">
            <img src="../../assets/logo.png"/>
            <span>杭州市富阳区行政服务中心知识库系统</span>
        </div>
        <div class="action">
            <div class="icon">
                <project-menu></project-menu>
            </div>
            <div class="icon">
                <a-dropdown placement="bottomCenter" :trigger="['click']">
                    <a-icon type="setting"/>
                    <a-menu slot="overlay">
                        <a-menu-item>
                            <a href="javascript:;" @click="logout">退出</a>
                        </a-menu-item>
                    </a-menu>
                </a-dropdown>
            </div>
        </div>
    </a-header>
</template>

<script>
    import {Layout, Icon, Dropdown, Menu} from 'ant-design-vue';
    import {logout} from '@/remote/user';
    import {autoDoFn} from "../../utils/util";
    import ProjectMenu from '../ProjectMenu';


    const {Header} = Layout;
    const {Item} = Menu;

    export default {
        name: 'GlobalHeader',
        components: {
            AHeader: Header,
            AIcon: Icon,
            ADropdown: Dropdown,
            AMenu: Menu,
            AMenuItem: Item,
            ProjectMenu

        },
        methods: {
            logout() {
                autoDoFn(async () => {
                    let res = await logout();
                    if (res) {
                        localStorage.clear();
                        window.location.href="http://10.32.250.84:80";
                        // this.$router.push('/login');
                    }
                });
            },
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
