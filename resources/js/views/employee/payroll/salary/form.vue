<template>
    <div>
        <form @submit.prevent="proceed" @keydown="salaryStructureForm.errors.clear($event.target.name)">
            <div class="row">
                <div class="col-12 col-sm-4">
                    <div class="form-group">
                        <label for="">{{trans('employee.employee')}}</label>
                        <v-select label="name" v-model="selected_employee" name="employee_id" id="employee_id" :options="employees" :placeholder="trans('employee.select_employee')" @select="onEmployeeSelect" @close="salaryStructureForm.errors.clear('employee_id')" @remove="salaryStructureForm.employee_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!employees.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="salaryStructureForm" prop-name="employee_id"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-4">
                    <div class="form-group">
                        <label for="">{{trans('employee.payroll_template')}}</label>
                        <v-select label="name" v-model="selected_payroll_template" name="payroll_template_id" id="payroll_template_id" :options="payroll_templates" :placeholder="trans('employee.select_payroll_template')" @select="onPayrollTemplateSelect" @close="salaryStructureForm.errors.clear('payroll_template_id')" @remove="salaryStructureForm.payroll_template_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!payroll_templates.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="salaryStructureForm" prop-name="payroll_template_id"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-4">
                    <div class="form-group">
                        <label for="">{{trans('employee.salary_structure_date_effective')}}</label>
                        <datepicker v-model="salaryStructureForm.date_effective" :bootstrapStyling="true" @selected="salaryStructureForm.errors.clear('date_effective')" :placeholder="trans('employee.salary_structure_date_effective')"></datepicker>
                        <show-error :form-name="salaryStructureForm" prop-name="date_effective"></show-error>
                    </div>
                </div>
            </div>
            <div class="row" v-for="(payroll_template_detail,index) in salaryStructureForm.payroll_template_details">
                <div class="col-12 col-sm-4">
                    <span :class="[payroll_template_detail.type == 'earning' ? 'text-success' : 'text-danger']" >{{payroll_template_detail.name}} ({{payroll_template_detail.alias}})</span> <br />
                    <span class="font-80pc">{{trans('employee.pay_head_category_'+payroll_template_detail.category)}}</span>
                    <span class="font-80pc" v-if="payroll_template_detail.category != 'production'">
                        ({{trans('employee.salary_structure_per_month')}})
                    </span>
                    <span class="font-80pc" v-else>
                        ({{trans('employee.salary_structure_per_unit', {unit: payroll_template_detail.unit})}})
                    </span> 
                </div>
                <div class="col-12 col-sm-4">
                    <div class="form-group">
                        <currency-input :position="default_currency.position" :symbol="default_currency.symbol" :name="getAmountName(index)" :placeholder="trans('employee.salary_structure_amount')" v-model="payroll_template_detail.amount" @input.native="salaryStructureForm.errors.clear(getAmountName(index))"></currency-input>
                        <show-error :form-name="salaryStructureForm" :prop-name="getAmountName(index)"></show-error>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <div class="form-group">
                        <label for="">{{trans('employee.salary_structure_description')}}</label>
                        <input class="form-control" type="text" v-model="salaryStructureForm.description" name="description" :placeholder="trans('employee.salary_structure_description')">
                        <show-error :form-name="salaryStructureForm" prop-name="description"></show-error>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <div class="text-right">
                    <router-link to="/employee/payroll/salary" class="btn btn-danger waves-effect waves-light " v-show="uuid">{{trans('general.cancel')}}</router-link>
                    <button type="submit" class="btn btn-info waves-effect waves-light">{{trans('general.save')}}</button>
                </div>
            </div> 
        </form>
    </div>
</template>

<script>
    export default {
        components : {},
        props:['uuid'],
        data() {
            return {
                salaryStructureForm: new Form({
                    employee_id: '',
                    date_effective: '',
                    payroll_template_id: '',
                    description: '',
                    payroll_template_details: []
                }),
                employees: [],
                payroll_templates: [],
                selected_employee: null,
                selected_payroll_template: null,
                payroll_template_with_details: [],
                default_currency: helper.getConfig('default_currency')
            }
        },
        mounted(){
            this.getPreRequisite();
        },
        methods: {
            getAmountName(index){
                return 'amount_'+index;
            },
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/employee/payroll/salary/pre-requisite')
                    .then(response => {
                        loader.hide();
                        this.employees = response.employees;
                        this.payroll_templates = response.payroll_templates;
                        this.payroll_template_with_details = response.payroll_template_with_details;
                        if(this.uuid)
                            this.get();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            onEmployeeSelect(selectedOption){
                this.salaryStructureForm.employee_id = selectedOption.id;
            },
            onPayrollTemplateSelect(selectedOption){
                this.salaryStructureForm.payroll_template_id = selectedOption.id;
                this.salaryStructureForm.payroll_template_details = [];
                let payroll_template_with_detail = this.payroll_template_with_details.find(o => o.id == selectedOption.id);
                let payroll_details = payroll_template_with_detail.payroll_template_details.filter(o => (o.category == 'attendance' || o.category == 'flat_rate' || o.category == 'production'));
                payroll_details.forEach(payroll_detail => {
                    this.salaryStructureForm.payroll_template_details.push({
                        id: payroll_detail.id,
                        name: payroll_detail.pay_head.name,
                        alias: payroll_detail.pay_head.alias,
                        type: payroll_detail.pay_head.type,
                        category: payroll_detail.category,
                        unit: payroll_detail.attendance_type ? payroll_detail.attendance_type.unit : null,
                        amount: ''
                    })
                })
            },
            proceed(){
                if(this.uuid)
                    this.update();
                else
                    this.store();
            },
            store(){
                let loader = this.$loading.show();
                this.salaryStructureForm.post('/api/employee/payroll/salary')
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.salaryStructureForm.payroll_template_details = [];
                        this.selected_employee = null;
                        this.selected_payroll_template = null;
                        this.$emit('completed');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            get(){
                let loader = this.$loading.show();
                axios.get('/api/employee/payroll/salary/'+this.uuid)
                    .then(response => {
                        let salary = response.salary;
                        this.salaryStructureForm.employee_id = salary.employee_id;
                        this.salaryStructureForm.payroll_template_id = salary.payroll_template_id;
                        this.salaryStructureForm.date_effective = salary.date_effective;
                        this.salaryStructureForm.description = salary.description;
                        this.selected_payroll_template = salary.payroll_template_id ? {id: salary.payroll_template_id, name: salary.payroll_template.name} : null;
                        this.onPayrollTemplateSelect(this.selected_payroll_template);
                        salary.salary_details.forEach(salary_detail => {
                            let detail = this.salaryStructureForm.payroll_template_details.find(o => o.id == salary_detail.payroll_template_detail_id);
                            if (typeof detail != 'undefined') {
                                detail.amount = salary_detail.amount;
                            }
                        });
                        this.selected_employee = response.selected_employee;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/employee/payroll/salary');
                    });

            },
            update(){
                let loader = this.$loading.show();
                this.salaryStructureForm.patch('/api/employee/payroll/salary/'+this.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/employee/payroll/salary');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            }
        }
    }
</script>