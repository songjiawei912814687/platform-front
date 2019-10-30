<template>
<img style="height: 100vh;width: 100%" src="../../../assets/screen/pa.jpg"/>
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
                    path: '/screen15',
                    name: 'screen15',
                });
            },
        }
    }
</script>

<style scoped>

</style>
