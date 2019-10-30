<template>
<img style="height: 100vh;width: 100%" src="../../../assets/screen/轮2.jpg"/>
</template>

<script>
    export default {
        name: "index",
        data() {
            return{
                timer4: null,
            }
        },
        created(){
            this.timer4 = setTimeout(() => {
                this.jump();
            }, 8 * 1000)
        },
        methods: {
            jump() {
                this.$router.push({
                    path: '/screen14',
                    name: 'screen14',
                });
            },
        }
    }
</script>

<style scoped>

</style>
