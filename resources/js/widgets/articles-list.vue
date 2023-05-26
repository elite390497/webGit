<template>
    <div class="card widget articles-widget">
        <div :class="['card-body', bodyClass]">
            <h4 class="card-title">
                <template v-if="type">{{ type }}</template>
                <template v-else>{{trans('post.recent_articles')}}</template>
                <router-link v-if="viewMoreLink" :to="viewMoreLink" class="btn btn-default btn-sm">{{trans('general.view_more')}}</router-link>
            </h4>
            <a class="list-item" v-for="article in articles" @click.prevent="showArticle(article)">
                <h5>{{article.title}}</h5>
                <div class="meta-data">
                    <span class="type">{{article.article_type.name}}</span>
                    <span class="date"><i class="far fa-clock"></i> {{article.date_of_article | moment}}</span>
                </div>
            </a>
        </div>
        <article-detail v-if="showArticleModal" @close="showArticleModal = false" :uuid="showArticleUuid" :url="`/frontend/article/${showArticleUuid}/detail`"></article-detail>
    </div>
</template>

<script>
    import ArticleDetail from '@views/post/article/show'

    export default {
        props: { 
            articles: {
              type: Array,
              default: function () {
                return []
              }
            },
            type: String,
            bodyClass: String,
            viewMoreLink: String,
            source: {
                type: String,
                default: "dashboard"
            }
        },
        components: {
            ArticleDetail
        },
        data() {
            return {
                showArticleModal: false
            }
        },
        methods: {
            showArticle(article){
                this.showArticleUuid = article.uuid;
                this.showArticleModal = true;
            },
        },
        filters: {
          momentDateTime(date) {
            return helper.formatDateTime(date);
          },
          moment(date) {
            return helper.formatDate(date);
          },
          momentTime(time) {
            return helper.formatTime(time);
          }
        },
    }
</script>