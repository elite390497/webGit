<template>
    <div v-if="article.uuid">
        <div class="page-title">
            <div class="fix-width fix-width-mobile">
                <h1>{{ article.title }}</h1>
                <div class="article-meta">
                    <small class="type text-muted"><i class="fas fa-hashtag"></i> {{ article.article_type.name }}</small>
                    <small class="date text-muted"><i class="far fa-clock"></i> {{ article.date_of_article | moment }}</small>
                </div>
            </div>
        </div>

        <div class="fix-width fix-width-mobile p-t-80">
            <div class="page-body article-content" v-html="article.description"></div>

            <div v-if="attachments.length">
                <ul class="m-t-10 upload-file-list">
                    <li class="upload-file-list-item" v-for="attachment in attachments">
                        <a :href="`/post/article/${article.uuid}/attachment/${attachment.uuid}/download?token=${authToken}`" class="no-link-color"><i :class="['file-icon', 'fas', 'fa-lg', attachment.file_info.icon]"></i> <span class="upload-file-list-item-size">{{attachment.file_info.size}}</span> {{attachment.user_filename}}</a>
                    </li>
                </ul>
            </div>
            
            <footer>
                <div class="row">
                    <div class="col">
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
                </div>
            </footer>
        </div>
    </div>
</template>

<script>
    export default {
        components: {},
        mounted(){
            this.get();
        },
        data(){
            return {
                uuid: this.$route.params.uuid,
                article: [],
                attachments: []
            }
        },
        methods: {
            get(){
                let loader = this.$loading.show();
                let articleUrl = '/api/frontend/article/' + this.uuid + '/detail';
                axios.get(articleUrl)
                    .then(response => {
                        this.article = response.article;
                        this.attachments = response.attachments;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);

                        if (error.response.status == 422)
                            this.$router.push('/');
                    });
            },
            getEmployeeName(employee){
                return helper.getEmployeeName(employee);
            },
            getEmployeeDesignationOnly(employee){
                return helper.getEmployeeDesignationOnly(employee);
            },
            getEmployeePhoto(employee){
                return '/' + employee.photo;
            },
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        },
        filters: {
          momentDateTime(date) {
            return helper.formatDateTime(date);
          },
          moment(date) {
            return helper.formatDate(date);
          }
        }
    }
</script>

<style scoped lang="scss">
    .page-title {
        margin-bottom: 0.75rem;

        h1 {
            margin-bottom: 0.75rem;
            display: block;
            color: #ffffff;
        }

        .article-meta {
            font-size: 130%;
        }
        .article-meta small + small{
            margin-left: 0.5rem;
        }
    }
    .article-content {
        margin-bottom: 1rem;
        font-size: 110%;
        p {
            text-align: justify;
        }
        p + p {
            margin-top: 1rem;
        }
    }
    footer {
        margin-top: 2.5rem;
        padding-top: 2.5rem;
        border-top: 1px dotted #e1e2e3;

        .article-author {
            .author-thumb {
                float: left;
                width: 100px;
                height: 100px;
                border-radius: 50%;
                background: #e1e2e3;
                margin-right: 20px;
                text-align: center;
                i {
                    padding-top: 25px;
                    font-size: 50px;
                }
                img {
                    width: 100%;
                }
            }
            p{
                padding-top: 20px;
                margin-bottom: 0;

                span {
                    display: block;

                    &.author{
                        font-size: 140%;
                        font-weight: 500;
                    }
                    &.designation{
                        font-size: 100%;
                    }
                }
            }
        }
    }
</style>