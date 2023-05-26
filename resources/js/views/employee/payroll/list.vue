<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('employee.payroll')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="payrolls.total">{{trans('general.total_result_found',{count : payrolls.total, from: payrolls.from, to: payrolls.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="payrolls.total && hasPermission('generate-payroll')" @click="$router.push('/employee/payroll/generate')" v-tooltip="trans('employee.generate_new_payroll')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('employee.generate_new_payroll')}}</span></button>
                        <button class="btn btn-info btn-sm" v-if="!showFilterPanel" @click="showFilterPanel = !showFilterPanel"><i class="fas fa-filter"></i> <span class="d-none d-sm-inline">{{trans('general.filter')}}</span></button>
                        <sort-by :order-by-options="orderByOptions" :sort-by="filter.sort_by" :order="filter.order" @updateSortBy="value => {filter.sort_by = value}"  @updateOrder="value => {filter.order = value}"></sort-by>
                        <div class="btn-group">
                            <button type="button" class="btn btn-info btn-sm dropdown-toggle no-caret " role="menu" id="moreOption" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-tooltip="trans('general.more_option')">
                                <i class="fas fa-ellipsis-h"></i> <span class="d-none d-sm-inline"></span>
                            </button>
                            <div :class="['dropdown-menu',getConfig('direction') == 'ltr' ? 'dropdown-menu-right' : '']" aria-labelledby="moreOption">
                                <button class="dropdown-item custom-dropdown" @click="print"><i class="fas fa-print"></i> {{trans('general.print')}}</button>
                                <button class="dropdown-item custom-dropdown" @click="pdf"><i class="fas fa-file-pdf"></i> {{trans('general.generate_pdf')}}</button>
                            </div>
                        </div>
                        <help-button @clicked="help_topic = 'employee.payroll'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <transition name="fade">
                <div class="card card-form" v-if="showFilterPanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('general.filter')}}</h4>
                        <div class="row">
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('employee.employee')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_employees" name="employee_id" id="employee_id" :options="employees" :placeholder="trans('employee.select_employee')" @select="onEmployeeSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onEmployeeRemove" :selected="selected_employees">
                                        <div class="multiselect__option" slot="afterList" v-if="!employees.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getPayrolls">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="payrolls.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('employee.payroll')}}</th>
                                    <th>{{trans('employee.employee')}}</th>
                                    <th>{{trans('employee.payroll_period')}}</th>
                                    <th>{{trans('employee.net_salary')}}</th>
                                    <th>{{trans('employee.payroll_status')}}</th>
                                    <th>{{trans('general.created_at')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="payroll in payrolls.data">
                                    <td>{{'#'+getPayrollNumber(payroll)}}</td>
                                    <td>
                                        {{getEmployeeNameWithCode(payroll.employee)}} <br />
                                        <span class="font-90pc">{{getEmployeeDesignationOnDate(payroll.employee, payroll.start_date)}}</span>
                                    </td>
                                    <td>{{payroll.start_date | moment}} {{trans('general.to')}} {{payroll.end_date | moment}}</td>
                                    <td>{{formatCurrency(payroll.total)}}</td>
                                    <td>
                                        <span v-for="status in getPayrollStatus(payroll)" :class="['label','label-'+status.color,'m-r-5']">{{status.label}}</span>
                                    </td>
                                    <td>{{payroll.created_at | momentDateTime}}</td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-success btn-sm" v-tooltip="trans('general.view')" @click="$router.push('/employee/payroll/'+payroll.uuid)"><i class="fas fa-arrow-circle-right"></i></button>
                                            <a :href="`/employee/payroll/${payroll.uuid}/print?token=${authToken}`" target="_blank" class="btn btn-secondary btn-sm" v-tooltip="trans('general.print')" ><i class="fas fa-print"></i></a>
                                            <button class="btn btn-info btn-sm" v-if="hasPermission('edit-payroll')" v-tooltip="trans('employee.edit_payroll')" @click.prevent="editPayroll(payroll)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" v-if="hasPermission('delete-payroll')" :key="payroll.id" v-confirm="{ok: confirmDelete(payroll)}" v-tooltip="trans('employee.delete_payroll')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!payrolls.total" module="employee" title="payroll_module_title" description="payroll_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="hasPermission('generate-payroll')" @click="$router.push('/employee/payroll/generate')"><i class="fas fa-plus"></i> {{trans('employee.generate_new_payroll')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="payrolls" @updateRecords="getPayrolls"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    export default {
        components : {},
        data() {
            return {
                payrolls: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'start_date',
                    order: 'desc',
                    employee_id: [],
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'start_date',
                        translation: i18n.employee.payroll_start_date
                    },
                    {
                        value: 'end_date',
                        translation: i18n.employee.payroll_end_date
                    },
                    {
                        value: 'created_at',
                        translation: i18n.general.created_at
                    }
                ],
                employees: [],
                selected_employees: null,
                showFilterPanel: false,
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('list-payroll')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getPayrolls();
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getEmployeeNameWithCode(employee){
                return helper.getEmployeeNameWithCode(employee);
            },
            getEmployeeDesignationOnDate(employee, date){
                return helper.getEmployeeDesignationOnDate(employee, date);
            },
            getPayrollStatus(payroll){
                return helper.getPayrollStatus(payroll);
            },
            getPayrollNumber(payroll){
                return helper.getPayrollNumber(payroll);
            },
            getPayrolls(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/employee/payroll/list?page=' + page + url)
                    .then(response => {
                        this.payrolls = response.payrolls;
                        this.employees = response.filters.employees;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editPayroll(payroll){
                this.$router.push('/employee/payroll/'+payroll.uuid+'/edit');
            },
            confirmDelete(payroll){
                return dialog => this.deletePayroll(payroll);
            },
            deletePayroll(payroll){
                let loader = this.$loading.show();
                axios.delete('/api/employee/payroll/'+payroll.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        this.getPayrolls();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getConfig(config) {
                return helper.getConfig(config)
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/employee/payroll/print',{filter: this.filter})
                    .then(response => {
                        let print = window.open("/print");
                        loader.hide();
                        print.document.write(response);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            pdf(){
                let loader = this.$loading.show();
                axios.post('/api/employee/payroll/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            formatCurrency(amount){
                return helper.formatCurrency(amount);
            },
            onEmployeeSelect(selectedOption){
                this.filter.employee_id.push(selectedOption.id);
            },
            onEmployeeRemove(removedOption){
                this.filter.employee_id.splice(this.filter.employee_id.indexOf(removedOption.id), 1);
            }
        },
        filters: {
          moment(date) {
            return helper.formatDate(date);
          },
          momentDateTime(date) {
            return helper.formatDateTime(date);
          }
        },
        watch: {
            'filter.sort_by': function(val){
                this.getPayrolls();
            },
            'filter.order': function(val){
                this.getPayrolls();
            },
            'filter.page_length': function(val){
                this.getPayrolls();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>