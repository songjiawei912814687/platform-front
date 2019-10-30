<template>
<img style="height: 100vh;width: 100%" src="../../../assets/screen/cx.jpg"/>
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
                    path: '/screen16',
                    name: 'screen16',
                });
            },
        }
    }
</script>

<style scoped>

</style>
