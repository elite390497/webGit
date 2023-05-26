<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('reception.gate_pass')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="gate_passes.total">{{trans('general.total_result_found',{count : gate_passes.total, from: gate_passes.from, to: gate_passes.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="gate_passes.total && !showCreatePanel && hasPermission('create-gate-pass')" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('reception.add_new_gate_pass')}}</span></button>
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
                        <help-button @clicked="help_topic = 'reception.gate-pass'"></help-button>
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
                                    <label for="">{{trans('reception.gate_pass_type')}}</label>
                                    <select v-model="filter.type" class="custom-select col-12">
                                      <option value="" selected>{{trans('general.select_one')}}</option>
                                      <option v-for="option in types" v-bind:value="option.value">
                                        {{ option.text }}
                                      </option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3" v-if="filter.type == 'student'">
                                <div class="form-group">
                                    <label for="">{{trans('student.student')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_students" name="student_id" id="student_id" :options="students" :placeholder="trans('student.select_student')" @select="onStudentSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onStudentRemove" :selected="selected_students">
                                        <div class="multiselect__option" slot="afterList" v-if="!students.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3" v-if="filter.type == 'employee'">
                                <div class="form-group">
                                    <label for="">{{trans('employee.employee')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_employees" name="employee_id" id="employee_id" :options="employees" :placeholder="trans('employee.select_employee')" @select="onEmployeeSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onEmployeeRemove" :selected="selected_employees">
                                        <div class="multiselect__option" slot="afterList" v-if="!employees.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <date-range-picker :start-date.sync="filter.date_start_date" :end-date.sync="filter.date_end_date" :label="trans('general.date_between')"></date-range-picker>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getGatePasses">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="fade" v-if="hasPermission('create-gate-pass')">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('reception.add_new_gate_pass')}}</h4>
                        <gate-pass-form @completed="getGatePasses" @cancel="showCreatePanel = !showCreatePanel"></gate-pass-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="gate_passes.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>{{trans('reception.gate_pass_detail')}}</th>
                                    <th>{{trans('reception.gate_pass_date')}}</th>
                                    <th>{{trans('reception.gate_pass_time')}}</th>
                                    <th>{{trans('reception.gate_pass_reason')}}</th>
                                    <th>{{trans('general.entry_by')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="gate_pass in gate_passes.data">
                                    <td v-text="gate_pass.id"></td>
                                    <td>
                                        <template v-if="gate_pass.type == 'student'">
                                            {{trans('student.name')+': '+getStudentName(gate_pass.student)}} <br />
                                            {{trans('student.first_guardian_name')+': '+gate_pass.student.parent.first_guardian_name}} <br />
                                            {{trans('student.mother_name')+': '+gate_pass.student.parent.mother_name}} <br />
                                            {{trans('student.contact_number')+': '+gate_pass.student.contact_number}} <br />
                                        </template>
                                        <template v-if="gate_pass.type == 'employee'">
                                            {{getEmployeeName(gate_pass.employee)}} <br />
                                            {{getEmployeeDesignationOnDate(gate_pass.employee, gate_pass.date)}}
                                        </template>
                                    </td>
                                    <td>{{gate_pass.date | moment}}</td>
                                    <td>{{gate_pass.time | momentTime}}</td>
                                    <td>{{gate_pass.reason}}</td>
                                    <td>{{getEmployeeName(gate_pass.user.employee)}} <br > {{getEmployeeDesignationOnDate(gate_pass.user.employee, gate_pass.date)}}</td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <a :href="`/reception/gate/pass/${gate_pass.uuid}/print?token=${authToken}`" target="_blank" class="btn btn-success btn-sm" v-tooltip="trans('general.print')"><i class="fas fa-print"></i></a>
                                            <button class="btn btn-info btn-sm" v-if="hasPermission('edit-gate-pass')" v-tooltip="trans('reception.edit_gate_pass')" @click.prevent="editGatePass(gate_pass)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" v-if="hasPermission('delete-gate-pass')" :key="gate_pass.id" v-confirm="{ok: confirmDelete(gate_pass)}" v-tooltip="trans('reception.delete_gate_pass')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!gate_passes.total" module="reception" title="gate_pass_module_title" description="gate_pass_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel && hasPermission('create-gate-pass')" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="gate_passes" @updateRecords="getGatePasses"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    import gatePassForm from './form'

    export default {
        components : { gatePassForm},
        data() {
            return {
                gate_passes: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'created_at',
                    order: 'desc',
                    type: '',
                    student_id: [],
                    employee_id: [],
                    date_start_date: '',
                    date_end_date: '',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'date',
                        translation: i18n.reception.date
                    },
                    {
                        value: 'created_at',
                        translation: i18n.general.created_at
                    }
                ],
                types: [
                    {
                        text: i18n.student.student,
                        value: 'student'
                    },
                    {
                        text: i18n.employee.employee,
                        value: 'employee'
                    }
                ],
                showFilterPanel: false,
                showCreatePanel: false,
                students: [],
                selected_students: null,
                employees: [],
                selected_employees: null,
                help_topic: '',
                showUuid: '',
                showModal: false
            };
        },
        mounted(){
            if(!helper.hasPermission('list-gate-pass')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getGatePasses();
            helper.showDemoNotification(['reception']);
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            showAction(gate_pass){
                this.showUuid = gate_pass.uuid;
                this.showModal = true;
            },
            getStudentName(student){
                return helper.getStudentName(student);
            },
            getEmployeeName(employee){
                return helper.getEmployeeName(employee);
            },
            getGatePasses(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                this.filter.date_start_date = helper.toDate(this.filter.date_start_date);
                this.filter.date_end_date = helper.toDate(this.filter.date_end_date);
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/gate/pass?page=' + page + url)
                    .then(response => {
                        this.gate_passes = response.gate_passes;
                        this.students = response.filters.students;
                        this.employees = response.filters.employees;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editGatePass(gate_pass){
                this.$router.push('/reception/gate/pass/'+gate_pass.uuid+'/edit');
            },
            confirmDelete(gate_pass){
                return diapass => this.deleteGatePass(gate_pass);
            },
            deleteGatePass(gate_pass){
                let loader = this.$loading.show();
                axios.delete('/api/gate/pass/'+gate_pass.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        this.getGatePasses();
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
                axios.post('/api/gate/pass/print',{filter: this.filter})
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
                axios.post('/api/gate/pass/pdf',{filter: this.filter})
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
                this.getGatePasses();
            },
            'filter.order': function(val){
                this.getGatePasses();
            },
            'filter.page_length': function(val){
                this.getGatePasses();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>