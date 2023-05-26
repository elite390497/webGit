<template>
    <div>
        <div class="page-title">
            <div class="fix-width fix-width-mobile">
                <h2>{{ page.title }}</h2>
            </div>
        </div>

        <div v-if="page.body" class="fix-width fix-width-mobile p-t-80">
            <div class="page-body" v-html="page.body"></div>
        </div>

        <div class="fix-width fix-width-mobile p-y-80">
            <div class="row">
                <div class="col-12">
                    <div class="article-feed card-columns" v-if="articles.total">
                        <router-link class="article-item" v-for="article in articles.data" :key="article.uuid" :to="`/articles/${article.uuid}`">
                            <article-card :article="article"></article-card>
                        </router-link>
                    </div>
                    <pagination-record :page-length.sync="filter.page_length" :records="articles" @updateRecords="getArticles"></pagination-record>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import ArticleCard from '@js/widgets/article-card'

    export default {
        components: {
            ArticleCard
        },
        data(){
            return {
                page: {},
                articles: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'date_of_article',
                    order: 'desc',
                    keyword: '',
                    article_type_id: [],
                    date_of_article_start_date: '',
                    date_of_article_end_date: '',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'date_of_article',
                        translation: i18n.post.date_of_article
                    },
                    {
                        value: 'title',
                        translation: i18n.post.article_title
                    }
                ],
                article_types: [],
                selected_article_types: null,
            }
        },
        mounted(){
            this.getData();
            this.getArticles();

            helper.showDemoNotification(['frontend_article']);
        },
        methods: {
            getData(){
                let loader = this.$loading.show();
                axios.get('/api/frontend/page/articles/content')
                    .then(response => {
                        this.page = response.page;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);

                        if (error.response.status == 422)
                            this.$router.push('/');
                    })
            },
            getArticles(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                this.filter.date_of_article_start_date = helper.toDate(this.filter.date_of_article_start_date);
                this.filter.date_of_article_end_date = helper.toDate(this.filter.date_of_article_end_date);
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/frontend/article/list?page=' + page + url)
                    .then(response => {
                        this.articles = response.articles;
                        this.article_types = response.article_types;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
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
        watch: {
            'filter.sort_by': function(val){
                this.getArticles();
            },
            'filter.order': function(val){
                this.getArticles();
            },
            'filter.page_length': function(val){
                this.getArticles();
            }
        },
    }
</script>