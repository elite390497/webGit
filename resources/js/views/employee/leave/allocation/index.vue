<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('employee.leave_allocation')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="leave_allocations.total">{{trans('general.total_result_found',{count : leave_allocations.total, from: leave_allocations.from, to: leave_allocations.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="leave_allocations.total && !showCreatePanel" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('employee.add_new_leave_allocation')}}</span></button>
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
                        <help-button @clicked="help_topic = 'employee.leave.allocation'"></help-button>
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
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getLeaveAllocations">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="fade">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('employee.add_new_leave_allocation')}}</h4>
                        <leave-allocation-form @completed="getLeaveAllocations" @cancel="showCreatePanel = !showCreatePanel"></leave-allocation-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="leave_allocations.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('employee.name')}}</th>
                                    <th>{{trans('employee.designation')}}</th>
                                    <th>{{trans('employee.leave_allocation_period')}}</th>
                                    <th>
                                        {{trans('employee.leave_allotted')}}
                                    </th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="leave_allocation in leave_allocations.data">
                                    <td v-text="getEmployeeName(leave_allocation.employee)+' ('+getEmployeeCode(leave_allocation.employee)+')'"></td>
                                    <td v-text="getEmployeeDesignationOnDate(leave_allocation.employee, leave_allocation.end_date)"></td>
                                    <td>{{leave_allocation.start_date | moment}} {{trans('general.to')}} {{leave_allocation.end_date | moment}}</td>
                                    <td>
                                        <ul style="list-style:none;padding:0;margin:0;">
                                            <li v-for="leave_allocation_detail in leave_allocation.leave_allocation_details">{{leave_allocation_detail.leave_type.name+': '+leave_allocation_detail.used+'/'+leave_allocation_detail.allotted}}</li>
                                        </ul>
                                    </td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-info btn-sm" v-tooltip="trans('employee.edit_leave_allocation')" @click.prevent="editLeaveAllocation(leave_allocation)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" :key="leave_allocation.id" v-confirm="{ok: confirmDelete(leave_allocation)}" v-tooltip="trans('employee.delete_leave_allocation')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!leave_allocations.total" module="employee" title="leave_allocation_module_title" description="leave_allocation_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="leave_allocations" @updateRecords="getLeaveAllocations"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    import leaveAllocationForm from './form'

    export default {
        components : { leaveAllocationForm},
        data() {
            return {
                leave_allocations: {
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
                        translation: i18n.employee.leave_allocation_start_date
                    },
                    {
                        value: 'end_date',
                        translation: i18n.employee.leave_allocation_end_date
                    }
                ],
                employees: [],
                selected_employees: null,
                showFilterPanel: false,
                showCreatePanel: false,
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('manage-leave-allocation')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getLeaveAllocations();
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
            getLeaveAllocations(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/employee/leave/allocation?page=' + page + url)
                    .then(response => {
                        this.leave_allocations = response.leave_allocations;
                        this.employees = response.filters.employees;
                        this.leave_types = response.filters.leave_types;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editLeaveAllocation(leave_allocation){
                this.$router.push('/employee/leave/allocation/'+leave_allocation.uuid+'/edit');
            },
            confirmDelete(leave_allocation){
                return dialog => this.deleteLeaveAllocation(leave_allocation);
            },
            deleteLeaveAllocation(leave_allocation){
                let loader = this.$loading.show();
                axios.delete('/api/employee/leave/allocation/'+leave_allocation.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        this.getLeaveAllocations();
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
                axios.post('/api/employee/leave/allocation/print',{filter: this.filter})
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
                axios.post('/api/employee/leave/allocation/pdf',{filter: this.filter})
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
                this.getLeaveAllocations();
            },
            'filter.order': function(val){
                this.getLeaveAllocations();
            },
            'filter.page_length': function(val){
                this.getLeaveAllocations();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>