<template>
    <article class="card card-box with-shadow article-card">
        <div class="card-body">
            <header>
                <h5 class="h5 card-title">{{ article.title }}</h5>
                <div class="article-meta">
                    <small class="type text-muted"><i class="fas fa-hashtag"></i> {{ article.article_type.name }}</small>
                    <small class="date text-muted"><i class="far fa-clock"></i> {{ article.date_of_article | moment }}</small>
                </div>
            </header>
            <div class="article-content">
                <p class="card-text" v-html="article.excerpt"></p>
            </div>
            <footer>
                <div class="row">
                    <div class="col-8">
                        <div class="article-author">
                            <span class="author-thumb pull-left">
                                <template v-if="!article.user.employee.photo">
                                    <i class="fas fa-user"></i>
                                </template>
                                <template v-else>
                                    <img :src="getEmployeePhoto(article.user.employee)" class="img-circle">
                                </template>
                            </span>
                            <p>
                                <span class="author">{{ getEmployeeName(article.user.employee) }}</span>
                                <span class="designation small text-muted">{{ getEmployeeDesignationOnly(article.user.employee) }}</span>
                            </p>
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="cta text-right">
                            <button type="button" class="btn btn-info">{{trans('general.read_more')}}</button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    </article>
</template>

<script>
    export default {
        props: { 
            article: {
              type: Object,
              default: function () {
                return {}
              }
            },
            bodyClass: String
        },
        components: {
        },
        data() {
            return {
            }
        },
        methods: {
            getEmployeePhoto(employee){
                return '/' + employee.photo;
            },
            getEmployeeName(employee){
                return helper.getEmployeeName(employee);
            },
            getEmployeeDesignationOnly(employee){
                return helper.getEmployeeDesignationOnly(employee);
            },
            getExcerpts(content){
                return helper.getExcerpts(content);
            },
            truncateWords(text, length, suffix){
                return helper.truncateWords(text, length, suffix);
            }
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

<style scoped lang="scss">
    .card.article-card {
        opacity: 0.9;
        transition: all 0.3s ease-in-out;
        cursor: pointer;

        header {
            margin-bottom: 0.75rem;
            padding-bottom: 0.75rem;
            border-bottom: 1px dotted #f1f2f3;

            .h5 {
                margin-bottom: 0.75rem;
                display: block;
            }
            .article-meta small + small{
                margin-left: 0.5rem;
            }
        }
        .article-content {
            font-size: 95%;
            margin-bottom: 1rem;
        }
        footer {
            margin-top: 0.75rem;
            padding-top: 0.75rem;
            border-top: 1px dotted #f1f2f3;

            .article-author {
                .author-thumb {
                    float: left;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background: #f1f2f3;
                    margin-right: 10px;
                    text-align: center;
                    i {
                        padding-top: 15px;
                    }
                    img {
                        width: 100%;
                    }
                }
                p{
                    margin-bottom: 0;

                    span {
                        display: block;

                        &.author{
                            font-weight: 500;
                        }
                    }
                }
            }

            .cta {
                display: flex;
                justify-content: flex-end;
                align-items: flex-end;
                height: 50px;
            }
        }
    }
</style>