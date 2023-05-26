<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('employee.salary_structure')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="salaries.total">{{trans('general.total_result_found',{count : salaries.total, from: salaries.from, to: salaries.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="salaries.total" @click="$router.push('/employee/payroll/salary/create')" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('employee.add_new_salary_structure')}}</span></button>
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
                        <help-button @clicked="help_topic = 'employee.payroll.salary'"></help-button>
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
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getSalaries">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="salaries.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('employee.employee')}}</th>
                                    <th>{{trans('employee.payroll_template')}}</th>
                                    <th>{{trans('employee.salary_structure_date_effective')}}</th>
                                    <th>{{trans('employee.net_salary')}}</th>
                                    <th>{{trans('employee.salary_structure_description')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="salary in salaries.data">
                                    <td>
                                        {{getEmployeeNameWithCode(salary.employee)}} <br />
                                        <span class="font-90pc">{{getEmployeeDesignationOnDate(salary.employee, salary.date_effective)}}</span>
                                    </td>
                                    <td v-text="salary.payroll_template.name"></td>
                                    <td>{{salary.date_effective | moment}}</td>
                                    <td>{{formatCurrency(salary.net_salary)}}</td>
                                    <td v-text="salary.description">
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-success btn-sm" v-tooltip="trans('general.view')" @click.prevent="showAction(salary)"><i class="fas fa-arrow-circle-right"></i></button>
                                            <button class="btn btn-info btn-sm" v-tooltip="trans('employee.edit_salary_structure')" @click.prevent="editSalary(salary)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" :key="salary.id" v-confirm="{ok: confirmDelete(salary)}" v-tooltip="trans('employee.delete_salary_structure')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!salaries.total" module="employee" title="salary_structure_module_title" description="salary_structure_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" @click="$router.push('/employee/payroll/salary/create')"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="salaries" @updateRecords="getSalaries"></pagination-record>
                </div>
            </div>
        </div>
        <salary-detail v-if="showModal" @close="showModal = false" :uuid="showUuid"></salary-detail>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    import salaryDetail from './show'

    export default {
        components : {salaryDetail},
        data() {
            return {
                salaries: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'date_effective',
                    order: 'desc',
                    employee_id: [],
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'date_effective',
                        translation: i18n.employee.salary_structure_date_effective
                    },
                    {
                        value: 'created_at',
                        translation: i18n.general.created_at
                    }
                ],
                employees: [],
                selected_employees: null,
                showFilterPanel: false,
                showUuid: '',
                help_topic: '',
                showModal: false
            };
        },
        mounted(){
            if(!helper.hasPermission('define-employee-salary')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getSalaries();
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
            showAction(salary){
                this.showUuid = salary.uuid;
                this.showModal = true;
            },
            getSalaries(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/employee/payroll/salary?page=' + page + url)
                    .then(response => {
                        this.salaries = response.salaries;
                        this.employees = response.filters.employees;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editSalary(salary){
                this.$router.push('/employee/payroll/salary/'+salary.uuid+'/edit');
            },
            confirmDelete(salary){
                return dialog => this.deleteSalary(salary);
            },
            deleteSalary(salary){
                let loader = this.$loading.show();
                axios.delete('/api/employee/payroll/salary/'+salary.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        this.getSalaries();
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
                axios.post('/api/employee/payroll/salary/print',{filter: this.filter})
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
                axios.post('/api/employee/payroll/salary/pdf',{filter: this.filter})
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
            },
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
                this.getSalaries();
            },
            'filter.order': function(val){
                this.getSalaries();
            },
            'filter.page_length': function(val){
                this.getSalaries();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>