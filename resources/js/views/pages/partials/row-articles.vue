<template>
    <div class="row p-y-80">
        <div class="col-md-12">
            <div class="fix-width fix-width-mobile">
                
                <div class="row">
                    <template v-for="(articleList, index) in articles">
                        <div v-if="articleList.length" :class="getClass(articleList)">
                            <articles-list :type="index" :articles="articleList"></articles-list>
                        </div>
                    </template>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import ArticlesList from '@js/widgets/articles-list'

    export default {
        props: {
            articles: {
                type: Object,
                default() {
                    return {}
                }
            },
            bodyClass: String
        },
        components: {
            ArticlesList
        },
        data(){
            return {
                showEventModal: false
            }
        },
        methods: {
            getClass(articles){
                return this.articles.length > 1 ? (this.articles.length > 2 ? "col-12 col-sm-6 col-md-4" : "col-12 col-sm-6") : "col";
            }
        }
    }
</script>