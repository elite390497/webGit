<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('employee.leave_request')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="leave_requests.total">{{trans('general.total_result_found',{count : leave_requests.total, from: leave_requests.from, to: leave_requests.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="leave_requests.total" v-tooltip="trans('general.add_new')" @click="$router.push('/employee/leave/request/create')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('employee.request_leave')}}</span></button>
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
                        <help-button @clicked="help_topic = 'employee.leave.request'"></help-button>
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
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('employee.leave_type')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_leave_types" name="leave_type_id" id="leave_type_id" :options="leave_types" :placeholder="trans('employee.select_leave_type')" @select="onLeaveTypeSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onLeaveTypeRemove" :selected="selected_leave_types">
                                        <div class="multiselect__option" slot="afterList" v-if="!leave_types.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getLeaveRequests">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="leave_requests.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('employee.name')}}</th>
                                    <th>{{trans('employee.designation')}}</th>
                                    <th>{{trans('employee.leave_type')}}</th>
                                    <th>{{trans('employee.leave_request_period')}}</th>
                                    <th>{{trans('employee.leave_request_count')}}</th>
                                    <th>{{trans('employee.leave_request_status')}}</th>
                                    <th>{{trans('employee.leave_requested_by')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="leave_request in leave_requests.data">
                                    <td v-text="getEmployeeName(leave_request.employee)+' ('+getEmployeeCode(leave_request.employee)+')'"></td>
                                    <td v-text="getEmployeeDesignationOnDate(leave_request.employee, leave_request.end_date)"></td>
                                    <td v-text="leave_request.leave_type.name"></td>
                                    <td>{{leave_request.start_date | moment}} {{trans('general.to')}} {{leave_request.end_date | moment}}</td>
                                    <td>{{getLeaveRequestCount(leave_request)}}</td>
                                    <td>
                                        <span v-for="status in getLeaveRequestStatus(leave_request)" :class="['label','label-'+status.color,'m-r-5']">{{status.label}}</span>
                                    </td>
                                    <td v-text="getEmployeeName(leave_request.requester_user.employee)+' ('+getEmployeeCode(leave_request.requester_user.employee)+')'"></td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-success btn-sm" v-tooltip="trans('general.view')" @click="$router.push('/employee/leave/request/'+leave_request.uuid)"><i class="fas fa-arrow-circle-right"></i></button>
                                            <template v-if="leave_request.status == 'pending'">
                                                <button class="btn btn-info btn-sm" v-tooltip="trans('employee.edit_leave_request')" @click.prevent="editLeaveRequest(leave_request)"><i class="fas fa-edit"></i></button>
                                                <button class="btn btn-danger btn-sm" :key="leave_request.id" v-confirm="{ok: confirmDelete(leave_request)}" v-tooltip="trans('employee.delete_leave_request')"><i class="fas fa-trash"></i></button>
                                            </template>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!leave_requests.total" module="employee" title="leave_request_module_title" description="leave_request_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md"  @click="$router.push('/employee/leave/request/create')"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="leave_requests" @updateRecords="getLeaveRequests"></pagination-record>
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
                leave_requests: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'created_at',
                    order: 'desc',
                    employee_id: [],
                    leave_type_id: [],
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'created_at',
                        translation: i18n.general.created_at
                    },
                    {
                        value: 'start_date',
                        translation: i18n.employee.leave_request_start_date
                    },
                    {
                        value: 'end_date',
                        translation: i18n.employee.leave_request_end_date
                    }
                ],
                employees: [],
                leave_types: [],
                selected_employees: null,
                selected_leave_types: null,
                showFilterPanel: false,
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('request-leave')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getLeaveRequests();
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getEmployeeName(employee){
                return helper.getEmployeeName(employee);
            },
            getEmployeeCode(employee){
                return helper.getEmployeeCode(employee);
            },
            getEmployeeDesignationOnDate(employee, date){
                return helper.getEmployeeDesignationOnDate(employee, date);
            },
            getLeaveRequests(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/employee/leave/request?page=' + page + url)
                    .then(response => {
                        this.leave_requests = response.leave_requests;
                        this.employees = response.filters.employees;
                        this.leave_types = response.filters.leave_types;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getLeaveRequestCount(leave_request)
            {
                let excluded_holiday = leave_request.options.holidays.excluded || [];
                let included_holiday = leave_request.options.holidays.included || [];
                let day = helper.getDateDiff(leave_request.start_date, leave_request.end_date) + 1;
                return day - excluded_holiday.length;
            },
            getLeaveRequestStatus(leave_request){
                return helper.getLeaveRequestStatus(leave_request);
            },
            editLeaveRequest(leave_request){
                this.$router.push('/employee/leave/request/'+leave_request.uuid+'/edit');
            },
            confirmDelete(leave_request){
                return dialog => this.deleteLeaveRequest(leave_request);
            },
            deleteLeaveRequest(leave_request){
                let loader = this.$loading.show();
                axios.delete('/api/employee/leave/request/'+leave_request.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        this.getLeaveRequests();
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
                axios.post('/api/employee/leave/request/print',{filter: this.filter})
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
                axios.post('/api/employee/leave/request/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onEmployeeSelect(selectedOption){
                this.filter.employee_id.push(selectedOption.id);
            },
            onEmployeeRemove(removedOption){
                this.filter.employee_id.splice(this.filter.employee_id.indexOf(removedOption.id), 1);
            },
            onLeaveTypeSelect(selectedOption){
                this.filter.leave_type_id.push(selectedOption.id);
            },
            onLeaveTypeRemove(removedOption){
                this.filter.leave_type_id.splice(this.filter.leave_type_id.indexOf(removedOption.id), 1);
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
                this.getLeaveRequests();
            },
            'filter.order': function(val){
                this.getLeaveRequests();
            },
            'filter.page_length': function(val){
                this.getLeaveRequests();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>