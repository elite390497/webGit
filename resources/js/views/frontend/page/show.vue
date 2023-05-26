<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container modal-lg">
                    <div class="modal-header" v-if="page.id">
                        <slot name="header">
                            <span>{{page.title}} <span class="label label-success" v-if="page.is_draft">{{trans('frontend.page_is_draft')}}</span></span>
                            <span class="float-right pointer" @click="$emit('close')">x</span>
                        </slot>
                    </div>
                    <div class="modal-body" v-if="page.id">
                        <slot name="body">
                            <div class="m-t-20" v-html="page.body"></div>
                            <div v-if="attachments.length">
                                <ul class="m-t-10 upload-file-list">
                                    <li class="upload-file-list-item" v-for="attachment in attachments">
                                        <a :href="`/frontend/page/${page.uuid}/attachment/${attachment.uuid}/download?token=${authToken}`" class="no-link-color"><i :class="['file-icon', 'fas', 'fa-lg', attachment.file_info.icon]"></i> <span class="upload-file-list-item-size">{{attachment.file_info.size}}</span> {{attachment.user_filename}}</a>
                                    </li>
                                </ul>
                            </div>
                            <hr />
                            <p>
                                <i class="far fa-clock"></i> <small>{{trans('general.created_at')}} {{page.created_at | momentDateTime}}</small>
                                <span class="pull-right">
                                    <i class="far fa-clock"></i> <small>{{trans('general.updated_at')}} {{page.updated_at | momentDateTime}}</small>
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
        props: ['uuid'],
        mounted(){
            if(!helper.frontendConfigurationAccessible()){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }
            
            if(this.uuid)
                this.get();
        },
        data(){
            return {
                page: [],
                attachments: []
            }
        },
        methods: {
            get(){
                let loader = this.$loading.show();
                axios.get('/api/frontend/page/'+this.uuid)
                    .then(response => {
                        this.page = response.page;
                        this.attachments = response.attachments;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
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