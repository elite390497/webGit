<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container modal-lg">
                    <div class="modal-header" v-if="article.id">
                        <slot name="header">
                            <span>{{article.title}} <span class="label label-success" v-if="article.is_public">{{trans('post.article_public')}}</span></span>
                            <span class="float-right pointer" @click="$emit('close')">x</span>
                        </slot>
                    </div>
                    <div class="modal-body" v-if="article.id">
                        <slot name="body">
                            <h6 class="card-title">
                                {{trans('post.date_of_article')}}: {{article.date_of_article | moment}} 
                                <p class="pull-right" v-if="article.user">
                                    <strong>{{trans('post.article_posted_by')}}:</strong> {{getEmployeeName(article.user.employee)}} {{getEmployeeDesignation(article.user.employee, article.date_of_article)}}
                                </p>
                            </h6>
                            <div class="m-t-20" v-html="article.description"></div>
                            <div v-if="attachments.length">
                                <ul class="m-t-10 upload-file-list">
                                    <li class="upload-file-list-item" v-for="attachment in attachments">
                                        <a :href="`/post/article/${article.uuid}/attachment/${attachment.uuid}/download?token=${authToken}`" class="no-link-color"><i :class="['file-icon', 'fas', 'fa-lg', attachment.file_info.icon]"></i> <span class="upload-file-list-item-size">{{attachment.file_info.size}}</span> {{attachment.user_filename}}</a>
                                    </li>
                                </ul>
                            </div>
                            <hr />
                            <p>
                                <i class="far fa-clock"></i> <small>{{trans('general.created_at')}} {{article.created_at | momentDateTime}}</small>
                                <span class="pull-right">
                                    <i class="far fa-clock"></i> <small>{{trans('general.updated_at')}} {{article.updated_at | momentDateTime}}</small>
                                </span>
                            </p>
                        </slot>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        components: {},
        props: ['uuid', 'url'],
        mounted(){
            if(this.uuid)
                this.get();
        },
        data(){
            return {
                article: [],
                attachments: []
            }
        },
        methods: {
            get(){
                let loader = this.$loading.show();
                let articleUrl = this.url ? '/api' + this.url : '/api/article/' + this.uuid;
                axios.get(articleUrl)
                    .then(response => {
                        this.article = response.article;
                        this.attachments = response.attachments;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getEmployeeName(employee){
                return helper.getEmployeeName(employee);
            },
            getEmployeeDesignation(employee, date){
                return helper.getEmployeeDesignation(employee, date);
            }
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