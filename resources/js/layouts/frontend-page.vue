<template>
    <div class="frontend-pages" id="main-wrapper">
        <tour-notification class="d-none d-sm-inline" />
        <frontend-header :menus="headerMenu"></frontend-header>
        <div class="page-wrapper">
            <router-view></router-view>
        </div>
        <frontend-footer :menus="footerMenu"></frontend-footer>
    </div>
</template>

<script>
    import FrontendHeader from './partials/frontend-header'
    import FrontendFooter from './partials/frontend-footer'

    export default {
        data() {
            return {
                menus: []
            }
        },
        mounted(){
            this.getData();
        },
        methods : {
            getData(){
                let loader = this.$loading.show();
                axios.get('/api/frontend/menu/list')
                    .then(response => {
                        this.menus = response.menus;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
        },
        components: {
            FrontendHeader, FrontendFooter
        },
        computed: {
            headerMenu(){
                return this.menus.filter(obj => obj.type == "header");
            },
            footerMenu(){
                return this.menus.filter(obj => obj.type == "footer");
            }
        }
    }
</script>

<style lang="scss">
  @import '~@sass/frontend.scss';
</style>
