<template>
    <div>


        <iframe id="ifr" class="weather"
                src="//www.seniverse.com/weather/weather.aspx?uid=UEEB8B8E47&cid=CHZJ000700&l=zh-CHS&p=SMART&a=0&u=C&s=3&m=0&x=1&d=5&fc=FFFFFF&bgc=&bc=&ti=0&in=0&li="
                frameborder="0" scrolling="no" width="600" height="100" fontsize="340"
                allowTransparency="true"></iframe>
    </div>
</template>

<script>
    export default {
        name: "index",
        components: {},
        created() {
            this.ifrCss()
        },
        methods: {
            ifrCss() {



            }
        }
    }
</script>

<style scoped>

    #ifr {

        body {
            font-size: 54px;
        }
    }

    .weather {

        font-size: 400px;

    }
</style>
