<template>
    <div>
        <div class="page-title">
            <div class="fix-width fix-width-mobile">
                <h2>{{ page.title }}</h2>
            </div>
        </div>

        <div v-if="page.body" class="fix-width fix-width-mobile p-t-80">
            <div class="page-body" v-html="page.body"></div>

            <div v-if="attachments.length">
                <ul class="m-t-10 upload-file-list">
                    <li class="upload-file-list-item" v-for="attachment in attachments">
                        <a :href="`/frontend/page/${page.uuid}/attachment/${attachment.uuid}/download?token=${authToken}`" class="no-link-color"><i :class="['file-icon', 'fas', 'fa-lg', attachment.file_info.icon]"></i> <span class="upload-file-list-item-size">{{attachment.file_info.size}}</span> {{attachment.user_filename}}</a>
                    </li>
                </ul>
            </div>
        </div>

        <template v-if="page.options">
            <row-blocks v-if="page.options.show_blocks" :blocks="blocks"></row-blocks>
            <row-articles v-if="page.options.show_latest_articles" :articles="articles"></row-articles>
        </template>
    </div>
</template>

<script>
    import RowBlocks from '@views/pages/partials/row-blocks'
    import RowArticles from '@views/pages/partials/row-articles'

    export default {
        components: {
            RowBlocks,
            RowArticles
        },
        data(){
            return {
                slug:this.$route.params.page,
                page: {},
                attachments: [],
                blocks: [],
                articles: {},
            }
        },
        mounted(){
            this.getData();

            helper.showDemoNotification(['frontend_custom']);
        },
        methods: {
            getData(){
                let loader = this.$loading.show();
                axios.get('/api/frontend/page/'+this.$route.params.page+'/content')
                    .then(response => {
                        this.page = response.page;
                        this.attachments = response.attachments;
                        this.blocks = response.blocks;
                        this.articles = response.articles;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);

                        if (error.response.status == 422)
                            this.$router.push('/');
                    })
            },
            getConfig(config) {
                return helper.getConfig(config)
            },
        },
        filters: {
          moment(date) {
            return helper.formatDate(date);
          },
          momentDateTime(date) {
            return helper.formatDateTime(date);
          }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        },
        watch: {
            '$route.params.page': function (page) {
              this.getData()
            }
        }
    }
</script>