<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container modal-lg">
                    <div class="modal-header">
                        <slot name="header">
                            {{trans('employee.view_account')}}
                            <span class="float-right pointer" @click="$emit('close')">x</span>
                        </slot>
                    </div>
                    <div class="modal-body">
                        <slot name="body">
                            <div class="table-responsive">
                                <table class="table table-sm custom-show-table">
                                    <tbody>
                                        <tr>
                                            <td>{{trans('employee.account_name')}}</td>
                                            <td>{{employee_account.name}}
                                                <span v-if="employee_account.options && employee_account.options.is_primary" class="label label-info">{{trans('employee.account_primary')}}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('employee.account_number')}}</td>
                                            <td>{{employee_account.account_number}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('employee.bank_name')}}</td>
                                            <td>{{employee_account.bank_name}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('employee.branch_name')}}</td>
                                            <td>{{employee_account.branch_name}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('employee.bank_identification_code')}}</td>
                                            <td>{{employee_account.bank_identification_code}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('employee.account_description')}}</td>
                                            <td>{{employee_account.description}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p>
                                <i class="far fa-clock"></i> <small>{{trans('general.created_at')}} {{employee_account.created_at | momentDateTime}}</small>
                                <span class="pull-right">
                                    <i class="far fa-clock"></i> <small>{{trans('general.updated_at')}} {{employee_account.updated_at | momentDateTime}}</small>
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
        props: ['employee','aid'],
        mounted(){
            if(this.aid)
                this.getEmployeeAccount();
        },
        data(){
            return {
                employee_account: {}
            }
        },
        methods: {
            getEmployeeAccount(){
                let loader = this.$loading.show();
                axios.get('/api/employee/'+this.employee.uuid+'/account/'+this.aid)
                    .then(response => {
                        this.employee_account = response;
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