<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('employee.employee')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="employees.total">{{trans('general.total_result_found',{count : employees.total, from: employees.from, to: employees.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/employee/list')" v-tooltip="trans('general.list_view')"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('general.list_view')}}</span></button>
                        <button class="btn btn-info btn-sm" v-if="employees.total && !showCreatePanel && hasPermission('create-employee')" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('employee.add_new_employee')}}</span></button>
                        <button class="btn btn-info btn-sm" v-if="!showFilterPanel" @click="showFilterPanel = !showFilterPanel"><i class="fas fa-filter"></i> <span class="d-none d-sm-inline">{{trans('general.filter')}}</span></button>
                        <sort-by :order-by-options="orderByOptions" :sort-by="filter.sort_by" :order="filter.order" @updateSortBy="value => {filter.sort_by = value}"  @updateOrder="value => {filter.order = value}"></sort-by>
                        <div class="btn-group">
                            <button type="button" class="btn btn-info btn-sm dropdown-toggle no-caret " role="menu" id="moreOption" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-tooltip="trans('general.more_option')">
                                <i class="fas fa-ellipsis-h"></i> <span class="d-none d-sm-inline"></span>
                            </button>
                            <div :class="['dropdown-menu',getConfig('direction') == 'ltr' ? 'dropdown-menu-right' : '']" aria-labelledby="moreOption">
                                <button class="dropdown-item custom-dropdown" @click="print"><i class="fas fa-print"></i> {{trans('general.print')}}</button>
                                <button class="dropdown-item custom-dropdown" @click="pdf"><i class="fas fa-file-pdf"></i> {{trans('general.generate_pdf')}}</button>
                                <a class="dropdown-item custom-dropdown" :href="exportExcel()"><i class="fas fa-file-excel"></i> {{trans('general.generate_excel')}}</a>
                            </div>
                        </div>
                        <help-button @clicked="help_topic = 'employee'"></help-button>
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
                                    <label for="">{{trans('employee.first_name')}}</label>
                                    <input class="form-control" name="first_name" v-model="filter.first_name" :placeholder="trans('employee.first_name')">
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('employee.middle_name')}}</label>
                                    <input class="form-control" name="middle_name" v-model="filter.middle_name" :placeholder="trans('employee.middle_name')">
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('employee.last_name')}}</label>
                                    <input class="form-control" name="last_name" v-model="filter.last_name" :placeholder="trans('employee.last_name')">
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('employee.father_name')}}</label>
                                    <input class="form-control" name="father_name" v-model="filter.father_name" :placeholder="trans('employee.father_name')">
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('employee.department')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_departments" name="department_id" id="department_id" :options="departments" :placeholder="trans('employee.select_department')" @select="onDepartmentSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onDepartmentRemove" :selected="selected_departments">
                                        <div class="multiselect__option" slot="afterList" v-if="!departments.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('employee.designation')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_designations" group-values="designations" group-label="employee_category" :group-select="false" name="designation_id" id="designation_id" :options="designations" :placeholder="trans('employee.select_designation')" @select="onDesignationSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onDesignationRemove" :selected="selected_designations">
                                        <div class="multiselect__option" slot="afterList" v-if="!designations.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('employee.employee_group')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_employee_groups" name="employee_group_id" id="employee_group_id" :options="employee_groups" :placeholder="trans('employee.select_employee_group')" @select="onEmployeeGroupSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onEmployeeGroupRemove" :selected="selected_employee_groups">
                                        <div class="multiselect__option" slot="afterList" v-if="!employee_groups.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('employee.status')}}</label>
                                    <select v-model="filter.status" class="custom-select col-12">
                                      <option value=null selected>{{trans('general.select_one')}}</option>
                                      <option v-for="option in statuses" v-bind:value="option.value">
                                        {{ option.text }}
                                      </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getEmployees">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="fade">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('employee.add_new_employee')}}</h4>
                        <employee-form @completed="getEmployees" @cancel="showCreatePanel = !showCreatePanel"></employee-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body p-4">
                    <div class="row">
                        <div class="col-md-3 col-12" v-for="employee in employees.data" :key="employee.uuid">
                            <div class="card card-box with-shadow employee-card">
                                <div class="card-body">
                                    <div class="ribbon ribbon-top-left" v-if="isToday(employee.date_of_birth)"><span class="ribbon-red"><i class="fas fa-birthday-cake"></i> {{trans('calendar.birthday')}}</span></div>
                                    <div class="ribbon ribbon-top-left" v-if="isToday(employee.date_of_anniversary)"><span class="ribbon-red"><i class="fas fa-birthday-cake"></i> {{trans('calendar.anniversary')}}</span></div>
                                    <div class="ribbon ribbon-top-left" v-if="employee.employee_terms[0] && isToday(employee.employee_terms[0].date_of_joining)"><span class="ribbon-red"><i class="fas fa-birthday-cake"></i> {{trans('calendar.work_anniversary_short')}}</span></div>
                                    <div class="employee-info" @click="navigateToEmployee(employee)">
                                        <span class="employee-thumb pull-left">
                                            <template v-if="!employee.photo">
                                                <img v-if="employee.gender == 'female'" src="/images/avatar_female.png" class="img-circle">
                                                <img v-else src="/images/avatar_male.png" class="img-circle">
                                            </template>
                                            <template v-else>
                                                <img :src="`/${employee.photo}`" style="height: inherit; width: auto;">
                                            </template>
                                        </span>
                                        <p>
                                            <span class="other small text-muted">{{employee.employee_code}} 
                                                <template v-if="employee.age">({{ employee.age.years+' '+trans('list.year')+' '+employee.age.months+' '+trans('list.month')}})</template>
                                            </span>
                                            <span class="employee-name">{{ employee.name }} <span style="display: inline-block;" v-html="getStatus(employee)"></span></span>
                                            <span class="other small text-muted">
                                                <template v-if="employee.employee_designations.length && employee.employee_designations[0].department_id">{{employee.employee_designations[0].department.name}}</template>
                                                <template v-if="employee.employee_designations.length">
                                                    {{employee.employee_designations[0].designation.name+' ('+employee.employee_designations[0].designation.employee_category.name+')'}}
                                                </template>
                                            </span>
                                            <span class="other small text-muted">
                                                <template v-if="employee.employee_terms[0]">{{trans('general.since')}} {{employee.employee_terms[0].date_of_joining | moment}}</template>
                                                <i class="fas fa-mobile"></i> {{ employee.contact_number }}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <module-info v-if="!employees.total" module="employee" title="employee_module_title" description="employee_module_description" icon="check-circle">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :show-page-length="false" :page-length.sync="filter.page_length" :records="employees" @updateRecords="getEmployees"></pagination-record>
                </div>
                <div class="m-t-10 card-body border-top p-4" v-if="employeeGroupForm.ids.length && hasPermission('edit-employee')">
                    <h4 class="card-title"></h4>
                    <form @submit.prevent="submit" @keydown="employeeGroupForm.errors.clear($event.target.name)">
                        <div class="row">
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('employee.employee_group')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_group" name="group_id" id="group_id" :options="employee_groups" :placeholder="trans('employee.select_employee_group')" @select="onGroupSelect" @remove="employeeGroupForm.employee_group_id = ''">
                                        <div class="multiselect__option" slot="afterList" v-if="!employee_groups.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                    <show-error :form-name="employeeGroupForm" prop-name="group_id"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-md-6">
                                <div class="form-group">
                                    <div class="radio radio-success m-t-20">
                                        <input type="radio" value="attach" id="type_attach" v-model="employeeGroupForm.action" :checked="employeeGroupForm.action == 'attach'" name="action" @click="employeeGroupForm.errors.clear('action')">
                                        <label for="type_attach">{{trans('general.add')}}</label>
                                    </div>
                                    <div class="radio radio-success">
                                        <input type="radio" value="detach" id="type_detach" v-model="employeeGroupForm.action" :checked="employeeGroupForm.action == 'detach'" name="action" @click="employeeGroupForm.errors.clear('action')">
                                        <label for="type_detach">{{trans('general.remove')}}</label>
                                    </div>
                                    <show-error :form-name="employeeGroupForm" prop-name="action"></show-error>
                                </div>
                            </div>
                        </div>
                        <button type="button" class="btn btn-info waves-effect waves-light" key="group-action" v-confirm="{ok: confirmGroupAction()}">{{trans('general.save')}}</button>
                    </form>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>


<script>
    import employeeForm from './form'

    export default {
        components : { employeeForm },
        data() {
            return {
                employees: {
                    total: 0,
                    data: []
                },
                selectAll: false,
                employeeGroupForm: new Form({
                    ids: [],
                    employee_group_id: '',
                    action: 'attach'
                }),
                employee_groups: [],
                selected_group: null,
                filter: {
                    sort_by : 'first_name',
                    order: 'asc',
                    page_length: 12,
                    first_name: '',
                    middle_name: '',
                    last_name: '',
                    father_name: '',
                    department_id: [],
                    designation_id: [],
                    employee_group_id: [],
                    status: 'active'
                },
                orderByOptions: [
                    {
                        value: 'first_name',
                        translation: i18n.employee.first_name
                    }
                ],
                showFilterPanel: false,
                showCreatePanel: false,
                help_topic: '',
                departments: [],
                selected_departments: null,
                designations: [],
                selected_designations: null,
                selected_employee_groups: null,
                statuses: [
                    {
                        text: i18n.employee.status_active,
                        value: 'active'
                    },
                    {
                        text: i18n.employee.status_inactive,
                        value: 'inactive'
                    }
                ]
            };
        },
        mounted(){
            if(!helper.hasPermission('list-employee')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getEmployees();
            helper.showDemoNotification(['employee']);
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getConfig(config) {
                return helper.getConfig(config)
            },
            getEmployeeName(employee){
                return helper.getEmployeeName(employee);
            },
            getEmployeeCode(employee){
                return helper.getEmployeeCode(employee);
            },
            getEmployees(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                this.selectAll = false;
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/employee?page=' + page + url)
                    .then(response => {
                        this.employees = response.employees;
                        this.departments = response.filters.departments;
                        this.designations = response.filters.designations;
                        this.employee_categories = response.filters.employee_categories;
                        this.employee_groups = response.filters.employee_groups;
                        let ids = [];
                        this.employees.data.forEach(employee => {
                            ids.push(employee.id);
                        })
                        this.selectAll = ids.every(elem => this.employeeGroupForm.ids.indexOf(elem) > -1) ? 1 : 0;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            toggleSelectAll(){
                if(this.selectAll) {
                    this.employees.data.forEach(employee => {
                        if (this.employeeGroupForm.ids.indexOf(employee.id) < 0)
                            this.employeeGroupForm.ids.push(employee.id);
                    });
                } else {
                    this.employees.data.forEach(employee => {
                        let index = this.employeeGroupForm.ids.indexOf(employee.id);
                        if (index >= 0) {
                            this.employeeGroupForm.ids.splice(index, 1);
                        }
                    });
                }
            },
            getStatus(employee){
                let term = employee.employee_terms;
                if (term.length && term[0].date_of_joining <= helper.today() && (!term[0].date_of_leaving || term[0].date_of_leaving >= helper.today()))
                    return '<span class="label label-success">'+i18n.employee.status_active+'</span>';
                else
                    return '<span class="label label-danger">'+i18n.employee.status_inactive+'</span>';
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/employee/print',{filter: this.filter})
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
                axios.post('/api/employee/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            exportExcel(){
                let url = helper.getFilterURL(this.filter);
                return '/api/employee?action=excel' + url + '&token=' + this.authToken;
            },
            onDepartmentSelect(selectedOption){
                this.filter.department_id.push(selectedOption.id);
            },
            onDepartmentRemove(removedOption){
                this.filter.department_id.splice(this.filter.department_id.indexOf(removedOption.id), 1);
            },
            onDesignationSelect(selectedOption){
                this.filter.designation_id.push(selectedOption.id);
            },
            onDesignationRemove(removedOption){
                this.filter.designation_id.splice(this.filter.designation_id.indexOf(removedOption.id), 1);
            },
            onEmployeeGroupSelect(selectedOption){
                this.filter.employee_group_id.push(selectedOption.id);
            },
            onEmployeeGroupRemove(removedOption){
                this.filter.employee_group_id.splice(this.filter.employee_group_id.indexOf(removedOption.id), 1);
            },
            onGroupSelect(selectedOption){
                this.employeeGroupForm.employee_group_id = selectedOption.id;
            },
            confirmGroupAction(){
                return dialog => this.groupAction();
            },
            groupAction(){
                let loader = this.$loading.show();
                this.employeeGroupForm.post('/api/employee/action/group')
                    .then(response => {
                        toastr.success(response.message);
                        this.getEmployees();
                        this.employeeGroupForm.action = 'attach';
                        this.selected_group = null;
                        this.employeeGroupForm.ids = [];
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            navigateToEmployee(employee){
                this.$router.push('/employee/'+employee.uuid)
            },
            isToday(date) {
                return moment(date).format('MM-DD') == moment(helper.today()).format('MM-DD') ? true : false
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
                this.getEmployees();
            },
            'filter.order': function(val){
                this.getEmployees();
            },
            'filter.page_length': function(val){
                this.getEmployees();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>

<style scoped lang="scss">
    .card.employee-card {
        opacity: 0.9;
        transition: all 0.3s ease-in-out;
        cursor: pointer;

        .employee-info {
            .employee-thumb {
                float: left;
                width: 100px;
                height: 100px;
                border-radius: 50%;
                background: #e1e2e3;
                margin-right: 20px;
                text-align: center;
                overflow: hidden;
                i {
                    padding-top: 25px;
                    font-size: 50px;
                }
                img {
                    width: 100%;
                }
            }
            p{
                padding-top: 10px;
                margin-bottom: 0;
                min-height: 100px;

                span {
                    display: block;

                    &.employee-name{
                        font-size: 120%;
                        font-weight: 500;
                    }
                    &.batch{
                        font-size: 100%;
                    }
                    &.other{
                        font-size: 90%;
                    }
                }
            }
        }
    }
</style>