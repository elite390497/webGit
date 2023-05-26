<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container modal-lg">
                    <div class="modal-header">
                        <slot name="header">
                            {{trans('student.view_account')}}
                            <span class="float-right pointer" @click="$emit('close')">x</span>
                        </slot>
                    </div>
                    <div class="modal-body">
                        <slot name="body">
                            <div class="table-responsive">
                                <table class="table table-sm custom-show-table">
                                    <tbody>
                                        <tr>
                                            <td>{{trans('student.account_name')}}</td>
                                            <td>{{student_account.name}}
                                                <span v-if="student_account.options && student_account.options.is_primary" class="label label-info">{{trans('student.account_primary')}}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('student.account_number')}}</td>
                                            <td>{{student_account.account_number}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('student.bank_name')}}</td>
                                            <td>{{student_account.bank_name}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('student.branch_name')}}</td>
                                            <td>{{student_account.branch_name}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('student.bank_identification_code')}}</td>
                                            <td>{{student_account.bank_identification_code}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('student.account_description')}}</td>
                                            <td>{{student_account.description}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p>
                                <i class="far fa-clock"></i> <small>{{trans('general.created_at')}} {{student_account.created_at | momentDateTime}}</small>
                                <span class="pull-right">
                                    <i class="far fa-clock"></i> <small>{{trans('general.updated_at')}} {{student_account.updated_at | momentDateTime}}</small>
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
    import accountForm from './form'

    export default {
        components: {accountForm},
        props: ['student','aid'],
        mounted(){
            if(this.aid)
                this.getStudentAccount();
        },
        data(){
            return {
                student_account: {}
            }
        },
        methods: {
            getStudentAccount(){
                let loader = this.$loading.show();
                axios.get('/api/student/'+this.student.uuid+'/account/'+this.aid)
                    .then(response => {
                        this.student_account = response;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });

            }
        },
        filters: {
          momentDateTime(date) {
            return helper.formatDateTime(date);
          }
        }
    }
</script>