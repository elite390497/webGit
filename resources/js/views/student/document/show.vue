<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container modal-lg">
                    <div class="modal-header">
                        <slot name="header">
                            {{trans('student.view_document')}}
                            <span class="float-right pointer" @click="$emit('close')">x</span>
                        </slot>
                    </div>
                    <div class="modal-body">
                        <slot name="body">
                            <h4 class="card-title" v-if="student_document.student_document_type">{{student_document.title}} ({{student_document.student_document_type.name}})</h4>
                            <div class="m-t-20" v-html="student_document.description"></div>
                            <div v-if="documents.length">
                                <ul class="m-t-10 upload-file-list">
                                    <li class="upload-file-list-item" v-for="document in documents">
                                        <a :href="`/student/${student.uuid}/document/${student_document.id}/attachment/${document.uuid}/download?token=${authToken}`" class="no-link-color"><i :class="['file-icon', 'fas', 'fa-lg', document.file_info.icon]"></i> <span class="upload-file-list-item-size">{{document.file_info.size}}</span> {{document.user_filename}}</a>
                                    </li>
                                </ul>
                            </div>
                            <hr />
                            <p>
                                <i class="far fa-clock"></i> <small>{{trans('general.created_at')}} {{student_document.created_at | momentDateTime}}</small>
                                <span class="pull-right">
                                    <i class="far fa-clock"></i> <small>{{trans('general.updated_at')}} {{student_document.updated_at | momentDateTime}}</small>
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
    import documentForm from './form'

    export default {
        components: {documentForm},
        props: ['student','did'],
        mounted(){
            if(this.did)
                this.getStudentDocument();
        },
        data(){
            return {
                student_document: [],
                documents: []
            }
        },
        methods: {
            getStudentDocument(){
                let loader = this.$loading.show();
                axios.get('/api/student/'+this.student.uuid+'/document/'+this.did)
                    .then(response => {
                        this.student_document = response.student_document;
                        this.documents = response.documents;
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
          }
        }
    }
</script>