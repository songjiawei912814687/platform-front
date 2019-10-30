<template>
<img style="height: 100vh;width: 100%" src="../../../assets/screen/轮播3.jpg"/>
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
            }, 10 * 1000)
        },
        methods: {
            jump() {
                this.$router.push({
                    path: '/screen1',
                    name: 'screen1',
                });
            },
        }
    }
</script>

<style scoped>

</style>
