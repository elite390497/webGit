<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container modal-lg">
                    <div class="modal-header">
                        <slot name="header">
                            {{trans('employee.view_qualification')}}
                            <span class="float-right pointer" @click="$emit('close')">x</span>
                        </slot>
                    </div>
                    <div class="modal-body">
                        <slot name="body">
                            <div class="table-responsive">
                                <table class="table table-sm custom-show-table">
                                    <tbody>
                                        <tr>
                                            <td>{{trans('employee.qualification_standard')}}</td>
                                            <td>{{employee_qualification.standard}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('employee.institute_name')}}</td>
                                            <td>{{employee_qualification.institute_name}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('employee.board_name')}}</td>
                                            <td>{{employee_qualification.board_name}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('employee.qualification_start_period')}}</td>
                                            <td>{{employee_qualification.start_period}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('employee.qualification_end_period')}}</td>
                                            <td>{{employee_qualification.end_period}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('employee.qualification_result')}}</td>
                                            <td>{{employee_qualification.result}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('employee.qualification_description')}}</td>
                                            <td>{{employee_qualification.description}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div v-if="attachments.length">
                                <ul class="m-t-10 upload-file-list">
                                    <li class="upload-file-list-item" v-for="attachment in attachments">
                                        <a :href="`/employee/${employee.uuid}/qualification/${employee_qualification.id}/attachment/${attachment.uuid}/download?token=${authToken}`" class="no-link-color"><i :class="['file-icon', 'fas', 'fa-lg', attachment.file_info.icon]"></i> <span class="upload-file-list-item-size">{{attachment.file_info.size}}</span> {{attachment.user_filename}}</a>
                                    </li>
                                </ul>
                            </div>
                            <hr />
                            <p>
                                <i class="far fa-clock"></i> <small>{{trans('general.created_at')}} {{employee_qualification.created_at | momentDateTime}}</small>
                                <span class="pull-right">
                                    <i class="far fa-clock"></i> <small>{{trans('general.updated_at')}} {{employee_qualification.updated_at | momentDateTime}}</small>
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
        props: ['employee','qid'],
        mounted(){
            if(this.qid)
                this.getEmployeeQualification();
        },
        data(){
            return {
                employee_qualification: [],
                attachments: []
            }
        },
        methods: {
            getEmployeeQualification(){
                let loader = this.$loading.show();
                axios.get('/api/employee/'+this.employee.uuid+'/qualification/'+this.qid)
                    .then(response => {
                        this.employee_qualification = response.employee_qualification;
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