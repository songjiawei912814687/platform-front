<template>
    <div id="appLoading">
        <img src="../../assets/loading.gif" alt="loading"/>
    </div>
</template>

<script>
    import {Form, Button, Input, Checkbox, Icon} from 'ant-design-vue';
    import {login} from '@/remote/user';
    import {getParameterByName, autoDoFn} from '@/utils/util';

    const {Item} = Form;
    export default {
        name: 'loginIndex',
        components: {
            AForm: Form,
            AButton: Button,
            AInput: Input,
            ACheckbox: Checkbox,
            AFormItem: Item,
            AIcon: Icon,
        },
        created() {
            autoDoFn(async () => {
                const res = await login();
                if (res) {
                    this.$message.success('登录成功');
                    this.$router.push(res.data.path);
                    const {
                        employeeId, employeesName, jobId, jobName, organId, organName, userName, icon,
                        actions, menuOutputs, adminLevel
                    } = res.data;
                    localStorage.setItem('employeeId', employeeId);
                    localStorage.setItem('employeesName', employeesName);
                    localStorage.setItem('jobId', jobId);
                    localStorage.setItem('jobName', jobName);
                    localStorage.setItem('organId', organId);
                    localStorage.setItem('organName', organName);
                    localStorage.setItem('userName', userName);
                    localStorage.setItem('icon', icon);
                    localStorage.setItem('authorityMenuList', JSON.stringify(menuOutputs.map(item => item.code)));
                    localStorage.setItem('authorityActionList', JSON.stringify(Object.keys(actions)));
                    localStorage.setItem('adminLevel', adminLevel);

                }
            });
        },
        data() {
            return {};
        },
        mounted() {
        },
        computed: {},
        props: [],
        methods: {
            handleLogin(e) {
                e.preventDefault();
                this.form.validateFields((err, values) => {
                    if (!err) {
                        autoDoFn(async () => {
                            this.loading = true;
                            const res = await login(values);
                            if (res) {
                                this.$message.success('登录成功');
                                this.$router.push(res.data.path);
                                const {
                                    employeeId, employeesName, jobId, jobName, organId, organName, userName, icon,
                                    actions, menuOutputs, adminLevel
                                } = res.data;
                                localStorage.setItem('employeeId', employeeId);
                                localStorage.setItem('employeesName', employeesName);
                                localStorage.setItem('jobId', jobId);
                                localStorage.setItem('jobName', jobName);
                                localStorage.setItem('organId', organId);
                                localStorage.setItem('organName', organName);
                                localStorage.setItem('userName', userName);
                                localStorage.setItem('icon', icon);
                                localStorage.setItem('authorityMenuList', JSON.stringify(menuOutputs.map(item => item.code)));
                                localStorage.setItem('authorityActionList', JSON.stringify(Object.keys(actions)));
                                localStorage.setItem('adminLevel', adminLevel);
                            }
                            this.loading = false;
                        });
                    }
                });
            },
        },
    };
</script>
<style>
    #appLoading {
        background-color: #0099ff;
        height: 100%;
    }

    #appLoading img {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 400px;
        height: 400px;
        -webkit-transform: translateY(-50%) translateX(-50%);
        transform: translateY(-50%) translateX(-50%);
    }
</style>
