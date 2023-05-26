<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container modal-lg">
                    <div class="modal-header">
                        <slot name="header">
                            {{trans('student.view_qualification')}}
                            <span class="float-right pointer" @click="$emit('close')">x</span>
                        </slot>
                    </div>
                    <div class="modal-body">
                        <slot name="body">
                            <div class="table-responsive">
                                <table class="table table-sm custom-show-table">
                                    <tbody>
                                        <tr>
                                            <td>{{trans('student.qualification_standard')}}</td>
                                            <td>{{student_qualification.standard}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('student.institute_name')}}</td>
                                            <td>{{student_qualification.institute_name}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('student.board_name')}}</td>
                                            <td>{{student_qualification.board_name}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('student.qualification_start_period')}}</td>
                                            <td>{{student_qualification.start_period}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('student.qualification_end_period')}}</td>
                                            <td>{{student_qualification.end_period}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('student.qualification_result')}}</td>
                                            <td>{{student_qualification.result}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('student.qualification_description')}}</td>
                                            <td>{{student_qualification.description}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div v-if="attachments.length">
                                <ul class="m-t-10 upload-file-list">
                                    <li class="upload-file-list-item" v-for="attachment in attachments">
                                        <a :href="`/student/${student.uuid}/qualification/${student_qualification.id}/attachment/${attachment.uuid}/download?token=${authToken}`" class="no-link-color"><i :class="['file-icon', 'fas', 'fa-lg', attachment.file_info.icon]"></i> <span class="upload-file-list-item-size">{{attachment.file_info.size}}</span> {{attachment.user_filename}}</a>
                                    </li>
                                </ul>
                            </div>
                            <hr />
                            <p>
                                <i class="far fa-clock"></i> <small>{{trans('general.created_at')}} {{student_qualification.created_at | momentDateTime}}</small>
                                <span class="pull-right">
                                    <i class="far fa-clock"></i> <small>{{trans('general.updated_at')}} {{student_qualification.updated_at | momentDateTime}}</small>
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
    import qualificationForm from './form'

    export default {
        components: {qualificationForm},
        props: ['student','qid'],
        mounted(){
            if(this.qid)
                this.getStudentQualification();
        },
        data(){
            return {
                student_qualification: [],
                attachments: []
            }
        },
        methods: {
            getStudentQualification(){
                let loader = this.$loading.show();
                axios.get('/api/student/'+this.student.uuid+'/qualification/'+this.qid)
                    .then(response => {
                        this.student_qualification = response.student_qualification;
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
          }
        }
    }
</script>