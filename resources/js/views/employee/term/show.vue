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
                            <div class="table-responsive" v-if="employee_term.id">
                                <table class="table custom-show-table">
                                    <tbody>
                                        <tr>
                                            <td>{{trans('employee.date_of_joining')}}</td>
                                            <td>{{employee_term.date_of_joining | moment}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('employee.joining_remarks')}}</td>
                                            <td>{{employee_term.joining_remarks}}</td>
                                        </tr>
                                        <tr v-if="employee_term.date_of_leaving">
                                            <td>{{trans('employee.date_of_leaving')}}</td>
                                            <td>{{employee_term.date_of_leaving | moment}}</td>
                                        </tr>
                                        <tr v-if="employee_term.date_of_leaving">
                                            <td>{{trans('employee.leaving_remarks')}}</td>
                                            <td>{{employee_term.leaving_remarks}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div v-if="attachments.length">
                                <ul class="m-t-10 upload-file-list">
                                    <li class="upload-file-list-item" v-for="attachment in attachments">
                                        <a :href="`/employee/${employee.uuid}/term/${employee_term.id}/attachment/${attachment.uuid}/download?token=${authToken}`" class="no-link-color"><i :class="['file-icon', 'fas', 'fa-lg', attachment.file_info.icon]"></i> <span class="upload-file-list-item-size">{{attachment.file_info.size}}</span> {{attachment.user_filename}}</a>
                                    </li>
                                </ul>
                            </div>
                            <hr />
                            <p>
                                <i class="far fa-clock"></i> <small>{{trans('general.created_at')}} {{employee_term.created_at | momentDateTime}}</small>
                                <span class="pull-right">
                                    <i class="far fa-clock"></i> <small>{{trans('general.updated_at')}} {{employee_term.updated_at | momentDateTime}}</small>
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
        props: ['employee','tid'],
        mounted(){
            if(this.tid)
                this.getEmployeeTerm();
        },
        data(){
            return {
                employee_term: [],
                attachments: []
            }
        },
        methods: {
            getEmployeeName(){
                return helper.getEmployeeName(this.employee);
            },
            getEmployeeTerm(){
                let loader = this.$loading.show();
                axios.get('/api/employee/'+this.employee.uuid+'/term/'+this.tid)
                    .then(response => {
                        this.employee_term = response.employee_term;
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