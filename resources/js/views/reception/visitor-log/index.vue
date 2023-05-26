<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('reception.visitor_log')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="visitor_logs.total">{{trans('general.total_result_found',{count : visitor_logs.total, from: visitor_logs.from, to: visitor_logs.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="visitor_logs.total && !showCreatePanel && hasPermission('create-visitor-log')" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('reception.add_new_visitor_log')}}</span></button>
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
                        <help-button @clicked="help_topic = 'reception.visitor-log'"></help-button>
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
                                    <label for="">{{trans('reception.visitor_type')}}</label>
                                    <select v-model="filter.type" class="custom-select col-12">
                                      <option value=null selected>{{trans('general.select_one')}}</option>
                                      <option v-for="option in types" v-bind:value="option.value">
                                        {{ option.text }}
                                      </option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3" v-if="filter.type == 'parent'">
                                <div class="form-group">
                                    <label for="">{{trans('student.student')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_students" name="student_id" id="student_id" :options="students" :placeholder="trans('student.select_student')" @select="onStudentSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onStudentRemove" :selected="selected_students">
                                        <div class="multiselect__option" slot="afterList" v-if="!students.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3" v-if="filter.type == 'other'">
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
                                    <label for="">{{trans('reception.visiting_purpose')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_visiting_purposes" name="visiting_purpose_id" id="visiting_purpose_id" :options="visiting_purposes" :placeholder="trans('reception.select_visiting_purpose')" @select="onVisitingPurposeSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onVisitingPurposeRemove" :selected="selected_visiting_purposes">
                                        <div class="multiselect__option" slot="afterList" v-if="!visiting_purposes.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <date-range-picker :start-date.sync="filter.date_of_visit_start_date" :end-date.sync="filter.date_of_visit_end_date" :label="trans('general.date_between')"></date-range-picker>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getVisitorLogs">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="fade" v-if="hasPermission('create-visitor-log')">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('reception.add_new_visitor_log')}}</h4>
                        <visitor-log-form @completed="getVisitorLogs" @cancel="showCreatePanel = !showCreatePanel"></visitor-log-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="visitor_logs.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>{{trans('reception.visiting_purpose')}}</th>
                                    <th>{{trans('reception.visitor_detail')}}</th>
                                    <th>{{trans('reception.visitor_count')}}</th>
                                    <th>{{trans('reception.date_of_visit')}}</th>
                                    <th>{{trans('reception.entry_time')}}</th>
                                    <th>{{trans('reception.exit_time')}}</th>
                                    <th>{{trans('reception.whom_to_meet')}}</th>
                                    <th>{{trans('reception.visitor_remarks')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="visitor_log in visitor_logs.data">
                                    <td v-text="visitor_log.id"></td>
                                    <td v-text="visitor_log.visiting_purpose.name"></td>
                                    <td>
                                        <template v-if="visitor_log.type == 'parent'">
                                            <template v-if="visitor_log.name">{{trans('reception.visitor_name')+': '+visitor_log.name}} <br /></template>
                                            <template v-if="visitor_log.relation_with_student">{{trans('reception.relation_with_student')+': '+visitor_log.relation_with_student}} <br /></template>
                                            {{trans('student.name')+': '+getStudentName(visitor_log.student)}} <br />
                                            {{trans('student.first_guardian_name')+': '+visitor_log.student.parent.first_guardian_name}} <br />
                                            {{trans('student.mother_name')+': '+visitor_log.student.parent.mother_name}} <br />
                                            {{trans('student.contact_number')+': '+visitor_log.student.contact_number}} <br />
                                        </template>
                                        <template v-else>
                                            {{trans('reception.visitor_name')+': '+visitor_log.name}} <br />
                                            {{trans('reception.visitor_company_name')+': '+visitor_log.company_name}} <br />
                                            {{trans('reception.visitor_contact_number')+': '+visitor_log.contact_number}} <br />
                                            {{trans('reception.visitor_address')+': '+visitor_log.address}}
                                        </template>
                                    </td>
                                    <td v-text="visitor_log.visitor_count"></td>
                                    <td>{{visitor_log.date_of_visit | moment}}</td>
                                    <td>{{visitor_log.entry_time | momentTime}}</td>
                                    <td>{{visitor_log.exit_time | momentTime}}</td>
                                    <td>
                                        <span v-if="visitor_log.employee_id">
                                            {{getEmployeeName(visitor_log.employee)}} <br />
                                            {{getEmployeeDesignationOnDate(visitor_log.employee, visitor_log.date_of_visit)}}
                                        </span>
                                        <span v-else>
                                            -
                                        </span>
                                    </td>
                                    <td>
                                        {{visitor_log.remarks}}
                                    </td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <a :href="`/reception/visitor/pass/${visitor_log.uuid}/print?token=${authToken}`" target="_blank" class="btn btn-success btn-sm" v-tooltip="trans('general.print')"><i class="fas fa-print"></i></a>
                                            <button class="btn btn-info btn-sm" v-if="hasPermission('edit-visitor-log')" v-tooltip="trans('reception.edit_visitor_log')" @click.prevent="editVisitorLog(visitor_log)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" v-if="hasPermission('delete-visitor-log')" :key="visitor_log.id" v-confirm="{ok: confirmDelete(visitor_log)}" v-tooltip="trans('reception.delete_visitor_log')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!visitor_logs.total" module="reception" title="visitor_log_module_title" description="visitor_log_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel && hasPermission('create-visitor-log')" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="visitor_logs" @updateRecords="getVisitorLogs"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    import visitorLogForm from './form'

    export default {
        components : { visitorLogForm},
        data() {
            return {
                visitor_logs: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'entry_time',
                    order: 'desc',
                    type: '',
                    student_id: [],
                    employee_id: [],
                    visiting_purpose_id: [],
                    date_of_visit_start_date: '',
                    date_of_visit_end_date: '',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'entry_time',
                        translation: i18n.reception.entry_time
                    },
                    {
                        value: 'created_at',
                        translation: i18n.general.created_at
                    }
                ],
                types: [
                    {
                        text: i18n.reception.visitor_type_parent,
                        value: 'parent'
                    },
                    {
                        text: i18n.reception.visitor_type_other,
                        value: 'other'
                    }
                ],
                showFilterPanel: false,
                showCreatePanel: false,
                students: [],
                selected_students: null,
                employees: [],
                selected_employees: null,
                visiting_purposes: [],
                selected_visiting_purposes: null,
                help_topic: '',
                showUuid: '',
                showModal: false
            };
        },
        mounted(){
            if(!helper.hasPermission('list-visitor-log')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getVisitorLogs();
            helper.showDemoNotification(['reception']);
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            showAction(visitor_log){
                this.showUuid = visitor_log.uuid;
                this.showModal = true;
            },
            getStudentName(student){
                return helper.getStudentName(student);
            },
            getEmployeeName(employee){
                return helper.getEmployeeName(employee);
            },
            getVisitorLogs(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                this.filter.date_of_visit_start_date = helper.toDate(this.filter.date_of_visit_start_date);
                this.filter.date_of_visit_end_date = helper.toDate(this.filter.date_of_visit_end_date);
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/visitor/log?page=' + page + url)
                    .then(response => {
                        this.visitor_logs = response.visitor_logs;
                        this.students = response.filters.students;
                        this.employees = response.filters.employees;
                        this.visiting_purposes = response.filters.visiting_purposes;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editVisitorLog(visitor_log){
                this.$router.push('/reception/visitor/log/'+visitor_log.uuid+'/edit');
            },
            confirmDelete(visitor_log){
                return dialog => this.deleteVisitorLog(visitor_log);
            },
            deleteVisitorLog(visitor_log){
                let loader = this.$loading.show();
                axios.delete('/api/visitor/log/'+visitor_log.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        this.getVisitorLogs();
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
                axios.post('/api/visitor/log/print',{filter: this.filter})
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
                axios.post('/api/visitor/log/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onStudentSelect(selectedOption){
                this.filter.student_id.push(selectedOption.id);
            },
            onStudentRemove(removedOption){
                this.filter.student_id.splice(this.filter.student_id.indexOf(removedOption.id), 1);
            },
            onEmployeeSelect(selectedOption){
                this.filter.employee_id.push(selectedOption.id);
            },
            onEmployeeRemove(removedOption){
                this.filter.employee_id.splice(this.filter.employee_id.indexOf(removedOption.id), 1);
            },
            onVisitingPurposeSelect(selectedOption){
                this.filter.visiting_purpose_id.push(selectedOption.id);
            },
            onVisitingPurposeRemove(removedOption){
                this.filter.visiting_purpose_id.splice(this.filter.visiting_purpose_id.indexOf(removedOption.id), 1);
            },
            getEmployeeDesignationOnDate(employee, date){
                return helper.getEmployeeDesignationOnDate(employee, date);
            }
        },
        filters: {
          moment(date) {
            return helper.formatDate(date);
          },
          momentDateTime(date) {
            return helper.formatDateTime(date);
          },
          momentTime(time) {
            return helper.formatTime(time);
          }
        },
        watch: {
            'filter.sort_by': function(val){
                this.getVisitorLogs();
            },
            'filter.order': function(val){
                this.getVisitorLogs();
            },
            'filter.page_length': function(val){
                this.getVisitorLogs();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>