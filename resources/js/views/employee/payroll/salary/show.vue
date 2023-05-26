<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container modal-lg">
                    <div class="modal-header" v-if="salary.id">
                        <slot name="header">
                            <span>{{trans('employee.salary_structure')}}</span>
                            <span class="float-right pointer" @click="$emit('close')">x</span>
                        </slot>
                    </div>
                    <div class="modal-body" v-if="salary.id">
                        <slot name="body">
                            <p>{{getEmployeeNameWithCode(salary.employee)}}</p>
                            <p class="font-80pc">{{getEmployeeDesignationOnDate(salary.employee,salary.date_effective)}}</p>

                            <p>{{trans('employee.salary_structure_date_effective')}}: {{salary.date_effective | moment}}</p>
                            
                            <div class="row">
                                <div class="col-6">
                                    <div class="table-responsive">
                                        <table class="table table-sm">
                                            <thead>
                                                <tr>
                                                    <th width="50%">{{trans('employee.pay_head_type_earning')}}</th>
                                                    <th width="50%" class="text-right">{{trans('employee.salary_structure_amount')}}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="payroll_template_detail in salary.payroll_template.payroll_template_details" v-if="payroll_template_detail.pay_head.type == 'earning' && payroll_template_detail.category != 'not_applicable'">
                                                    <td class="text-success">
                                                        {{payroll_template_detail.pay_head.name}} ({{payroll_template_detail.pay_head.alias}})
                                                    </td>
                                                    <td class="text-right">{{ formatCurrency(payroll_template_detail.value)}}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="table-responsive">
                                        <table class="table table-sm">
                                            <thead>
                                                <tr>
                                                    <th width="50%">{{trans('employee.pay_head_type_deduction')}}</th>
                                                    <th width="50%" class="text-right">{{trans('employee.salary_structure_amount')}}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="payroll_template_detail in salary.payroll_template.payroll_template_details" v-if="payroll_template_detail.pay_head.type == 'deduction' && payroll_template_detail.category != 'not_applicable'">
                                                    <td class="text-danger">
                                                        {{payroll_template_detail.pay_head.name}} ({{payroll_template_detail.pay_head.alias}})
                                                    </td>
                                                    <td class="text-right">{{ formatCurrency(payroll_template_detail.value)}}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-6">
                                    <div class="table-responsive">
                                        <table class="table">
                                            <thead>
                                                <tr>
                                                    <th width="50%">{{trans('employee.total_earning')}}</th>
                                                    <th width="50%" class="text-right">{{formatCurrency(salary.earning)}}</th>
                                                </tr>
                                                <tr>
                                                    <th>{{trans('employee.net_salary')}}</th>
                                                    <th class="text-right">{{formatCurrency(salary.net_salary)}}</th>
                                                </tr>
                                            </thead>
                                        </table>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="table-responsive">
                                        <table class="table">
                                            <thead>
                                                <tr>
                                                    <th width="50%">{{trans('employee.total_deduction')}}</th>
                                                    <th width="50%" class="text-right">{{formatCurrency(salary.deduction)}}</th>
                                                </tr>
                                            </thead>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div class="m-b-20" v-html="salary.description"></div>
                            
                            <hr />
                            <p>
                                <i class="far fa-clock"></i> <small>{{trans('general.created_at')}} {{salary.created_at | momentDateTime}}</small>
                                <span class="pull-right">
                                    <i class="far fa-clock"></i> <small>{{trans('general.updated_at')}} {{salary.updated_at | momentDateTime}}</small>
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
            if(this.uuid)
                this.get();
        },
        data(){
            return {
                salary: {}
            }
        },
        methods: {
            get(){
                let loader = this.$loading.show();
                axios.get('/api/employee/payroll/salary/'+this.uuid)
                    .then(response => {
                        this.salary = response.salary;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            formatCurrency(amount){
                return helper.formatCurrency(amount);
            },
            getEmployeeNameWithCode(employee){
                return helper.getEmployeeNameWithCode(employee);
            },
            getEmployeeDesignationOnDate(employee, date){
                return helper.getEmployeeDesignationOnDate(employee, date)
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