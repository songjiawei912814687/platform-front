<template>
<img style="height: 100vh;width: 100%" src="../../../assets/screen/杭州e融.jpg"/>
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
                    path: '/screen17',
                    name: 'screen17',
                });
            },
        }
    }
</script>

<style scoped>

</style>
