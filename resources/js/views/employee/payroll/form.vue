<template>
    <form @submit.prevent="proceed" @keydown="payrollForm.errors.clear($event.target.name)">

        <template v-if="!employee_salary.payroll_template">
            <div class="row p-4">
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('employee.employee')}}</label>
                        <v-select label="name" track-by="id" v-model="selected_employee" name="employee_id" id="employee_id" :options="employees" :placeholder="trans('employee.select_employee')" @select="onEmployeeSelect" @close="payrollForm.errors.clear('employee_id')" @remove="payrollForm.employee_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!employees.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="payrollForm" prop-name="employee_id"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('employee.payroll_start_date')}}</label>
                        <datepicker v-model="payrollForm.start_date" :bootstrapStyling="true" @selected="payrollForm.errors.clear('start_date')" :placeholder="trans('employee.payroll_start_date')"></datepicker>
                        <show-error :form-name="payrollForm" prop-name="start_date"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('employee.payroll_end_date')}}</label>
                        <datepicker v-model="payrollForm.end_date" :bootstrapStyling="true" @selected="payrollForm.errors.clear('end_date')" :placeholder="trans('employee.payroll_end_date')"></datepicker>
                        <show-error :form-name="payrollForm" prop-name="end_date"></show-error>
                    </div>
                </div>
            </div>
            <button type="button" class="btn btn-info m-r-10 pull-right" @click="fetch" v-if="!employee_salary.payroll_template">{{trans('general.submit')}}</button>
        </template>

        <div class="row" v-if="employee_salary.payroll_template">
            <div class="col-12 col-sm-4">
                <div class="table-responsive">
                    <table class="table table-sm custom-show-table">
                        <tbody>
                            <tr v-for="attendance in attendance_summary">
                                <td>{{attendance.name+' ('+attendance.alias+')'}}</td>
                                <td>
                                    {{attendance.count}}
                                    <span v-if="(attendance.type == 'production_based_earning' || attendance.type == 'production_based_deduction') && attendance.count">
                                        ({{attendance.value+' '+attendance.unit}})
                                    </span> 
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="col-12 col-sm-8 border-left">
                <div class="card widget">
                    <div class="card-body">
                        <div class="row border-bottom">
                            <div class="col p-4 b-r">
                                {{getEmployeeNameWithCode(employee_salary.employee)}}<br />
                                <span class="font-90pc">{{getEmployeeDesignationOnDate(employee_salary.employee, employee_salary.start_date)}}</span>
                            </div>
                            <div class="col p-4 b-r">
                                {{payrollForm.start_date | moment}} {{trans('general.to')}} {{payrollForm.end_date | moment}}
                            </div>
                        </div>
                    </div>
                </div>
                <table class="payroll-table">
                    <tr>
                        <td class="font-weight-bold">{{trans('employee.pay_head_type_earning')}}</td>
                        <td class="font-weight-bold">{{trans('employee.pay_head_type_deduction')}}</td>
                    </tr>
                    <tr>
                        <td valign="top" class="border-right">
                            <table class="payroll-table">
                                <tr v-for="pay_head in payrollForm.pay_heads" v-if="pay_head.type == 'earning'">
                                    <td>{{pay_head.name}}</td>
                                    <td class="text-right">
                                        <template v-if="editPayrollAmount">
                                            <input class="borderless-input" type="text" v-model="pay_head.amount" :placeholder="trans('employee.salary_structure_amount')">
                                        </template>
                                        <template v-else>
                                            {{pay_head.amount}}
                                        </template>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td valign="top">
                            <table class="payroll-table">
                                <tr v-for="pay_head in payrollForm.pay_heads" v-if="pay_head.type == 'deduction'">
                                    <td>{{pay_head.name}}</td>
                                    <td class="text-right">
                                        <template v-if="editPayrollAmount">
                                            <input class="borderless-input" type="text" v-model="pay_head.amount" :placeholder="trans('employee.salary_structure_amount')">
                                        </template>
                                        <template v-else>
                                            {{pay_head.amount}}
                                        </template>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <table class="payroll-table">
                                <tr>
                                    <td>{{trans('employee.earning_salary')}}</td>
                                    <td align="right">{{formatCurrency(getTotalEarningSalary)}}</td>
                                </tr>
                            </table>
                        </td>
                        <td valign="top">
                            <table class="payroll-table">
                                <tr>
                                    <td>{{trans('employee.deduction_salary')}}</td>
                                    <td align="right">{{formatCurrency(getTotalDeductionSalary)}}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td class="font-weight-bold">{{trans('employee.net_salary')}}</td>
                        <td align="right" class="font-weight-bold">{{formatCurrency(getNetSalary)}}</td>
                    </tr>
                </table>

                <div class="form-group">
                    <label for="">{{trans('employee.payroll_remarks')}}</label>
                    <autosize-textarea v-model="payrollForm.remarks" rows="2" name="remarks" :placeholder="trans('employee.payroll_remarks')"></autosize-textarea>
                </div>
            </div>
        </div>

        <div class="form-group" v-if="employee_salary.payroll_template">
            <button type="submit" class="btn btn-info pull-right">{{trans('general.save')}}</button>
            <button type="button" class="btn btn-danger pull-right m-r-10" @click="reset" v-if="!uuid">{{trans('employee.payroll_reset_query')}}</button>
        </div>
    </form>
</template>

<script>
    export default {
        props: ['uuid'],
        components: {},
        data() {
            return {
                payrollForm: new Form({
                    employee_id: '',
                    start_date: '',
                    end_date: '',
                    pay_heads: [],
                    remarks: ''
                },false),
                payroll: {},
                employee_salary: {},
                attendance_summary: {},
                employees: [],
                selected_employee: null,
                editPayrollAmount: false
            }
        },
        mounted(){
            if(!helper.hasAnyPermission(['generate-payroll','edit-payroll'])){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.editPayrollAmount = helper.hasPermission('edit-payroll-amount') ? true : false;

            this.getPreRequisite();
        },
        methods: {
            getEmployeeNameWithCode(employee){
                return helper.getEmployeeNameWithCode(employee);
            },
            getEmployeeDesignationOnDate(employee, date){
                return helper.getEmployeeDesignationOnDate(employee, date);
            },
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/employee/payroll/pre-requisite')
                    .then(response => {
                        this.employees = response.employees;

                        if (this.uuid) 
                            this.get();

                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            onEmployeeSelect(selectedOption){
                this.payrollForm.employee_id = selectedOption.id;
            },
            reset(){
                this.employee_salary = {};
                this.payrollForm.pay_heads = [];
            },
            fetch(){
                let loader = this.$loading.show();
                this.payrollForm.post('/api/employee/payroll/fetch')
                    .then(response => {
                        this.employee_salary = response.salary;
                        this.attendance_summary = response.attendance_types;
                        this.payrollForm.pay_heads = [];
                        response.salary.payroll_template.payroll_template_details.forEach(payroll_template_detail => {
                            if (payroll_template_detail.category != 'not_applicable') {
                                this.payrollForm.pay_heads.push({
                                    payroll_template_detail_id: payroll_template_detail.id,
                                    pay_head_id: payroll_template_detail.pay_head_id,
                                    type: payroll_template_detail.pay_head.type,
                                    name: payroll_template_detail.pay_head.name,
                                    amount: payroll_template_detail.amount
                                })
                            }
                        });
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            get(){
                let loader = this.$loading.show();
                axios.get('/api/employee/payroll/'+this.uuid)
                    .then(response => {
                        this.payroll = response.payroll;

                        this.payrollForm.start_date = this.payroll.start_date;
                        this.payrollForm.end_date = this.payroll.end_date;
                        this.payrollForm.employee_id = this.payroll.employee_id;
                        this.payrollForm.remarks = this.payroll.remarks;
                        this.employee_salary = response.salary;
                        this.attendance_summary = response.attendance_types;
                        this.payrollForm.pay_heads = [];
                        response.salary.payroll_template.payroll_template_details.forEach(payroll_template_detail => {
                            let amount = payroll_template_detail.amount;
                            let payroll_detail = this.payroll.payroll_details.find(o => o.pay_head_id == payroll_template_detail.pay_head_id);
                            amount = (typeof payroll_detail != 'undefined') ? payroll_detail.amount : amount;
                            this.payrollForm.pay_heads.push({
                                payroll_template_detail_id: payroll_template_detail.id,
                                pay_head_id: payroll_template_detail.pay_head_id,
                                type: payroll_template_detail.pay_head.type,
                                name: payroll_template_detail.pay_head.name,
                                amount: amount
                            })
                        });
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            formatCurrency(amount){
                return helper.formatCurrency(amount);
            },
            proceed(){
                if(this.uuid)
                    this.update();
                else
                    this.store();
            },
            store(){
                let loader = this.$loading.show();
                this.payrollForm.post('/api/employee/payroll/generate')
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/employee/payroll/list');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            update(){
                let loader = this.$loading.show();
                this.payrollForm.patch('/api/employee/payroll/'+this.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/employee/payroll/list');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            }
        },
        computed: {
            getTotalEarningSalary(){
                let total = 0;
                this.payrollForm.pay_heads.forEach(pay_head => {
                    total += pay_head.type == 'earning' ? (pay_head.amount || 0) : 0;
                });
                return total;
            },
            getTotalDeductionSalary(){
                let total = 0;
                this.payrollForm.pay_heads.forEach(pay_head => {
                    total += pay_head.type == 'deduction' ? (pay_head.amount || 0) : 0;
                });
                return total;
            },
            getNetSalary(){
                return this.getTotalEarningSalary - this.getTotalDeductionSalary;
            }
        },
        watch: {
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

<style lang="scss">
    .payroll-table {
        width: 100%;
        font-size:13px;

        th, td {
            width:50%;
            padding:5px 10px;
        }

        tr + tr{
            border-top: 1px solid #f3f1f1;
        }

        .borderless-input{
            text-align:right;
            border:0;
            height: auto;
            width:100%;
            color: #54667a;
        }
    }
</style>