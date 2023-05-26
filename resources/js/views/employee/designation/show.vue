<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container modal-lg">
                    <div class="modal-header">
                        <slot name="header" v-if="employee.id">
                            {{getEmployeeName(employee)}}
                            <span class="float-right pointer" @click="$emit('close')">x</span>
                        </slot>
                    </div>
                    <div class="modal-body">
                        <slot name="body">
                            <div class="table-responsive" v-if="employee_designation.id">
                                <table class="table custom-show-table">
                                    <tbody>
                                        <tr>
                                            <td>{{trans('employee.designation')}}</td>
                                            <td>{{employee_designation.designation.name}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('employee.category')}}</td>
                                            <td>{{employee_designation.designation.employee_category.name}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('employee.department')}}</td>
                                            <td>{{employee_designation.department_id ? employee_designation.department.name : '-'}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('employee.date_effective')}}</td>
                                            <td>{{employee_designation.date_effective | moment}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('employee.remarks')}}</td>
                                            <td>{{employee_designation.remarks}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div v-if="attachments.length">
                                <ul class="m-t-10 upload-file-list">
                                    <li class="upload-file-list-item" v-for="attachment in attachments">
                                        <a :href="`/employee/${employee.uuid}/designation/${employee_designation.id}/attachment/${attachment.uuid}/download?token=${authToken}`" class="no-link-color"><i :class="['file-icon', 'fas', 'fa-lg', attachment.file_info.icon]"></i> <span class="upload-file-list-item-size">{{attachment.file_info.size}}</span> {{attachment.user_filename}}</a>
                                    </li>
                                </ul>
                            </div>
                            <hr />
                            <p>
                                <i class="far fa-clock"></i> <small>{{trans('general.created_at')}} {{employee_designation.created_at | momentDateTime}}</small>
                                <span class="pull-right">
                                    <i class="far fa-clock"></i> <small>{{trans('general.updated_at')}} {{employee_designation.updated_at | momentDateTime}}</small>
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
        props: ['employee','did'],
        mounted(){
            if(this.did)
                this.getEmployeeDesignation();
        },
        data(){
            return {
                employee_designation: [],
                attachments: []
            }
        },
        methods: {
            getEmployeeName(){
                return helper.getEmployeeName(this.employee);
            },
            getEmployeeDesignation(){
                let loader = this.$loading.show();
                axios.get('/api/employee/'+this.employee.uuid+'/designation/'+this.did)
                    .then(response => {
                        this.employee_designation = response.employee_designation;
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
          moment(date) {
            return helper.formatDate(date);
          },
          momentDateTime(date) {
            return helper.formatDateTime(date);
          }
        }
    }
</script>