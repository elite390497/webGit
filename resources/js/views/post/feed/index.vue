<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('post.feed')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="articles.total">{{trans('general.total_result_found',{count : articles.total, from: articles.from, to: articles.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
            </div>
        </div>
        <div class="container-fluid container-body">
            <div class="article-feed card-columns" v-if="articles.total">
                <div class="article-item" v-for="article in articles.data" @click="showArticle(article)">
                    <article-card :article="article"></article-card>
                </div>
            </div>
            <pagination-record :page-length.sync="filter.page_length" :records="articles" @updateRecords="getArticles"></pagination-record>
        </div>
        <article-detail v-if="showModal" @close="showModal = false" :uuid="showUuid"></article-detail>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    import ArticleDetail from '../article/show'
    import ArticleCard from '@js/widgets/article-card'

    export default {
        components : { ArticleDetail, ArticleCard },
        data() {
            return {
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
                help_topic: '',
                showUuid: '',
                showModal: false
            };
        },
        mounted(){
            if(!helper.hasPermission('list-article')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getArticles();
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            showArticle(article){
                this.showUuid = article.uuid;
                this.showModal = true;
            },
            getArticles(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                this.filter.date_of_article_start_date = helper.toDate(this.filter.date_of_article_start_date);
                this.filter.date_of_end_start_date = helper.toDate(this.filter.date_of_end_start_date);
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/article?page=' + page + url)
                    .then(response => {
                        this.articles = response.articles;
                        this.article_types = response.filters.article_types;
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
            onArticleTypeSelect(selectedOption){
                this.filter.article_type_id.push(selectedOption.id);
            },
            onArticleTypeRemove(removedOption){
                this.filter.article_type_id.splice(this.filter.article_type_id.indexOf(removedOption.id), 1);
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
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>