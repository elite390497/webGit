<template>
    <div class="p-t-20">
        <form @submit.prevent="proceed" @keydown="payrollTemplateForm.errors.clear($event.target.name)">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('employee.payroll_template_name')}}</label>
                        <input class="form-control" type="text" v-model="payrollTemplateForm.name" name="name" :placeholder="trans('employee.payroll_template_name')">
                        <show-error :form-name="payrollTemplateForm" prop-name="name"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('employee.payroll_template_is_active')}}</label>
                        <br />
                        <switches class="" v-model="payrollTemplateForm.is_active" theme="bootstrap" color="success"></switches> 
                    </div>
                </div>
                <div class="col-12">
                    <div class="form-group">
                        <label for="">{{trans('employee.payroll_template_description')}}</label>
                        <input class="form-control" type="text" v-model="payrollTemplateForm.description" name="description" :placeholder="trans('employee.payroll_template_description')">
                        <show-error :form-name="payrollTemplateForm" prop-name="description"></show-error>
                    </div>
                </div>
            </div>
            <draggable v-model="payrollTemplateForm.pay_heads" @start="drag=true" @end="drag=false" class="list-group">
                <div class="row" v-for="(pay_head,index) in payrollTemplateForm.pay_heads" :key="pay_head.id">
                    <div class="col-12 col-sm-3">
                        <i class="fas fa-arrows-alt pointer m-r-20"></i> <span :class="pay_head.type == 'earning' ? 'text-success' : 'text-danger'">{{getPayHeadNameWithAlias(pay_head)}}</span>
                    </div>
                    <div class="col-12 col-sm-3">
                        <div class="form-group">
                            <select v-model="pay_head.category" class="custom-select col-12" :name="getCategoryName(index)" @change="payrollTemplateForm.errors.clear(getCategoryName(index))">
                              <option value="null">{{trans('general.select_one')}}</option>
                              <option v-for="option in categories" v-bind:value="option.value">
                                {{ option.text }}
                              </option>
                            </select>
                            <show-error :form-name="payrollTemplateForm" :prop-name="getCategoryName(index)"></show-error>
                        </div>
                    </div>
                    <div class="col-12 col-sm-4" v-if="pay_head.category == 'production'">
                        <div class="form-group">
                            <select v-model="pay_head.attendance_type_id" class="custom-select col-12" :name="getAttendanceTypeName(index)" @change="payrollTemplateForm.errors.clear(getAttendanceTypeName(index))">
                              <option value="null">{{trans('employee.select_attendance_type')}}</option>
                              <option v-for="option in attendance_types" v-bind:value="option.id">
                                {{ option.name }} ({{option.unit}})
                              </option>
                            </select>
                            <show-error :form-name="payrollTemplateForm" :prop-name="getAttendanceTypeName(index)"></show-error>
                        </div>
                    </div>
                    <div class="col-12 col-sm-6" v-if="pay_head.category == 'computation'">
                        <div class="form-group">
                            <input class="form-control" type="text" v-model="pay_head.computation" :name="getComputationName(index)" :placeholder="trans('employee.pay_head_computation')">
                            <show-error :form-name="payrollTemplateForm" :prop-name="getComputationName(index)"></show-error>
                        </div>
                    </div>
                </div>
            </draggable>
            <div class="card-footer">
                <div class="text-right">
                    <router-link to="/employee/payroll/template" class="btn btn-danger waves-effect waves-light " v-show="uuid">{{trans('general.cancel')}}</router-link>
                    <button type="submit" class="btn btn-info waves-effect waves-light">{{trans('general.save')}}</button>
                </div>
            </div> 
        </form>
    </div>
</template>

<script>
    export default {
        components: {},
        props: ['uuid'],
        data(){
            return {
                payrollTemplateForm: new Form({
                    name: '',
                    is_active: '',
                    description: '',
                    pay_heads: []
                }),
                pay_heads: [],
                attendance_types: [],
                categories: [
                    {
                        text: i18n.employee.pay_head_category_not_applicable,
                        value: 'not_applicable'
                    },
                    {
                        text: i18n.employee.pay_head_category_attendance,
                        value: 'attendance'
                    },
                    {
                        text: i18n.employee.pay_head_category_flat_rate,
                        value: 'flat_rate'
                    },
                    {
                        text: i18n.employee.pay_head_category_user_defined,
                        value: 'user_defined'
                    },
                    {
                        text: i18n.employee.pay_head_category_computation,
                        value: 'computation'
                    },
                    {
                        text: i18n.employee.pay_head_category_production,
                        value: 'production'
                    }
                ]
            }
        },
        mounted(){
            this.getPreRequisite();
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getPayHeadNameWithAlias(pay_head){
                return helper.getPayHeadNameWithAlias(pay_head);
            },
            getCategoryName(index){
                return 'pay_head_category_'+index;
            },
            getComputationName(index){
                return 'pay_head_computation_'+index;
            },
            getAttendanceTypeName(index){
                return 'attendance_type_'+index;
            },
            populatePayHeads(){
                this.pay_heads.forEach(pay_head => {
                    this.payrollTemplateForm.pay_heads.push({
                        id: pay_head.id,
                        name: pay_head.name,
                        alias: pay_head.alias,
                        type: pay_head.type,
                        category: null,
                        attendance_type_id: null,
                        computation: ''
                    })
                })
            },
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/employee/payroll/template/pre-requisite')
                    .then(response => {
                        loader.hide();
                        this.pay_heads = response.pay_heads;
                        this.attendance_types = response.attendance_types;
                        this.payrollTemplateForm.pay_heads = [];
                        if(this.uuid)
                            this.get();
                        else {
                            this.populatePayHeads();
                        }
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
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
                this.payrollTemplateForm.post('/api/employee/payroll/template')
                    .then(response => {
                        toastr.success(response.message);
                        this.payrollTemplateForm.pay_heads = [];
                        this.populatePayHeads();
                        loader.hide();
                        this.$emit('completed');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            get(){
                let loader = this.$loading.show();
                axios.get('/api/employee/payroll/template/'+this.uuid)
                    .then(response => {
                        let payroll_template = response.payroll_template;
                        this.payrollTemplateForm.name = payroll_template.name;
                        this.payrollTemplateForm.is_active = payroll_template.is_active;
                        this.payrollTemplateForm.description = payroll_template.description;
                        payroll_template.payroll_template_details.forEach(payroll_template_detail => {
                            this.payrollTemplateForm.pay_heads.push({
                                id: payroll_template_detail.pay_head.id,
                                name: payroll_template_detail.pay_head.name,
                                alias: payroll_template_detail.pay_head.alias,
                                type: payroll_template_detail.pay_head.type,
                                category: payroll_template_detail.category,
                                computation: payroll_template_detail.computation,
                                attendance_type_id: payroll_template_detail.employee_attendance_type_id
                            })
                        });

                        this.pay_heads.forEach(pay_head => {
                            const detail = this.payrollTemplateForm.pay_heads.find(o => o.id == pay_head.id);

                            if (typeof detail == 'undefined') {
                                this.payrollTemplateForm.pay_heads.push({
                                    id: pay_head.id,
                                    name: pay_head.name,
                                    alias: pay_head.alias,
                                    type: pay_head.type,
                                    category: null,
                                    computation: '',
                                    attendance_type_id: null
                                })
                            }
                        })
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/employee/payroll/template');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.payrollTemplateForm.patch('/api/employee/payroll/template/'+this.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/employee/payroll/template');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            }
        }
    }
</script>