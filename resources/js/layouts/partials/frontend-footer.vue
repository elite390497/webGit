<template>
    <footer class="frontend-footer">
        <div class="fix-width fix-width-mobile">
            <div class="row">
                <div class="col-12 col-md-6">
                    <span>{{trans('frontend.footer_copyright')}} &copy; {{ getYear() }} <router-link to="/">{{ getConfig('institute_name') }}</router-link></span><br><br>
                    <span>{{trans('frontend.footer_all_rights_reserved')}}</span>
                </div>
                <div class="col-12 col-md-6 text-right">
                    <ul class="list-inline">
                        <li class="list-inline-item" v-for="item in menus">
                            <router-link class="footer-nav-link" :key="item.slug" :to="`/page/${item.slug}`" exact>{{ item.name }}</router-link>
                        </li>
                    </ul>
                    <ul class="footer-link list-inline">
                        <li class="list-inline-item" v-if="getConfig('facebook_link')"><a target="_blank" :href="getConfig('facebook_link')"><i class="fab fa-facebook"></i></a></li>
                        <li class="list-inline-item" v-if="getConfig('twitter_link')"><a target="_blank" :href="getConfig('twitter_link')"><i class="fab fa-twitter"></i></a></li>
                        <li class="list-inline-item" v-if="getConfig('google_plus_link')"><a target="_blank" :href="getConfig('google_plus_link')"><i class="fab fa-google-plus"></i></a></li>
                        <li class="list-inline-item" v-if="getConfig('youtube_link')"><a target="_blank" :href="getConfig('youtube_link')"><i class="fab fa-youtube"></i></a></li>
                        <li class="list-inline-item" v-if="getConfig('linkedin_link')"><a target="_blank" :href="getConfig('linkedin_link')"><i class="fab fa-linkedin"></i></a></li>
                    </ul>
                </div>
            </div>
        </div>
    </footer>
</template>

<script>
    export default {
        props: [ 'menus' ],
        mounted() {
        },
        methods: {
            getConfig(config) {
                return helper.getConfig(config);
            },
            getYear() {
                return moment().format('Y');
            }
        },
        computed: {

        }
    }
</script>

<style lang="scss">
    
</style>