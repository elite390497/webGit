<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans(filter.type+'.'+filter.type+'_birthday')}} 
                        <span class="card-subtitle" v-if="birthdays.total"><span class="d-none d-sm-inline">{{ trans('general.total_result_found',{count: birthdays.total, from: birthdays.from, to: birthdays.to}) }}</span></span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="filter.type == 'employee'" @click="filter.type = 'student'"><i class="fas fa-graduation-cap"></i> <span class="d-none d-sm-inline"> {{trans('student.student_birthday')}}</span></button>
                        <button class="btn btn-info btn-sm" v-if="filter.type == 'student'" @click="filter.type = 'employee'"><i class="fas fa-users"></i> <span class="d-none d-sm-inline"> {{trans('employee.employee_birthday')}}</span></button>
                        <button class="btn btn-info btn-sm" v-if="!showFilterPanel" @click="showFilterPanel = !showFilterPanel"><i class="fas fa-filter"></i> <span class="d-none d-sm-inline"> {{trans('general.filter')}}</span></button>
                        <div class="btn-group">
                            <button type="button" class="btn btn-info btn-sm dropdown-toggle no-caret " role="menu" id="moreOption" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-tooltip="trans('general.more_option')">
                                <i class="fas fa-ellipsis-h"></i> <span class="d-none d-sm-inline"></span>
                            </button>
                            <div :class="['dropdown-menu',getConfig('direction') == 'ltr' ? 'dropdown-menu-right' : '']" aria-labelledby="moreOption">
                                <button class="dropdown-item custom-dropdown" @click="print"><i class="fas fa-print"></i> {{trans('general.print')}}</button>
                                <button class="dropdown-item custom-dropdown" @click="pdf"><i class="fas fa-file-pdf"></i> {{trans('general.generate_pdf')}}</button>
                                <button class="dropdown-item custom-dropdown" @click="$router.push('/calendar/celebration/anniversary')"><i class="fas fa-heartbeat"></i> {{trans('calendar.anniversary')}}</button>
                                <button class="dropdown-item custom-dropdown" @click="$router.push('/calendar/celebration/work/anniversary')"><i class="fas fa-gift"></i> {{trans('calendar.work_anniversary')}}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <transition name="fade">
                <div class="card border-left border-bottom" v-if="showFilterPanel">
                    <div class="card-body p-4">
                        <h4 class="card-title">{{trans('general.filter')}}
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger btn-sm pull-right">{{trans('general.cancel')}}</button>
                        </h4>
                        <div class="row">
                            <div class="col-12 col-sm-8">
                                <div class="form-group">
                                    <date-range-picker :start-date.sync="filter.start_date" :end-date.sync="filter.end_date" :label="trans('general.date_between')"></date-range-picker>
                                </div>
                            </div>
                        </div>
                        <button type="button" class="btn btn-info waves-effect waves-light pull-right" @click="getBirthdays">{{trans('general.filter')}}</button>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <h6 class="p-3" v-if="filter.start_date && filter.end_date">{{trans('calendar.birthday_between', {start_date: showDate(filter.start_date), end_date : showDate(filter.end_date)})}}</h6>
                    <div class="table-responsive" v-if="birthdays.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{filter.type == 'student' ? trans('student.date_of_birth') : trans('employee.date_of_birth')}}</th>
                                    <th>{{trans('general.age')}}</th>
                                    <th v-if="filter.type == 'student'">{{trans('student.name')}}</th>
                                    <th v-if="filter.type == 'student'">{{trans('academic.batch')}}</th>
                                    <th v-if="filter.type == 'student'">{{trans('student.first_guardian_name')}}</th>
                                    <th v-if="filter.type == 'student'">{{trans('student.contact_number')}}</th>
                                    <th v-if="filter.type == 'employee'">{{trans('employee.name')}}</th>
                                    <th v-if="filter.type == 'employee'">{{trans('employee.code')}}</th>
                                    <th v-if="filter.type == 'employee'">{{trans('employee.designation')}}</th>
                                    <th v-if="filter.type == 'employee'">{{trans('employee.contact_number')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="birthday in birthdays.data">
                                    <td>{{birthday.date_of_birth | moment}}</td>
                                    <td>{{getAge(birthday.date_of_birth)+' '+trans('general.years')}}</td>
                                    <td v-if="filter.type == 'student'">{{getStudentName(birthday)}}</td>
                                    <td v-if="filter.type == 'student'">{{getStudentBatchOnDate(birthday)}}</td>
                                    <td v-if="filter.type == 'student'">{{birthday.parent.first_guardian_name}}</td>
                                    <td v-if="filter.type == 'student'">{{birthday.contact_number}}</td>
                                    <td v-if="filter.type == 'employee'">{{getEmployeeName(birthday)}}</td>
                                    <td v-if="filter.type == 'employee'">{{getEmployeeCode(birthday)}}</td>
                                    <td v-if="filter.type == 'employee'">{{getEmployeeDesignationOnDate(birthday)}}</td>
                                    <td v-if="filter.type == 'employee'">{{birthday.contact_number}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!birthdays.total" module="calendar" title="birthday_module_title" description="birthday_module_description" icon="list"></module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="birthdays" @updateRecords="getBirthdays"></pagination-record>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        components : { },
        data() {
            return {
                birthdays: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'date',
                    order: 'asc',
                    type: 'student',
                    start_date: '',
                    end_date: '',
                    page_length: helper.getConfig('page_length')
                },
                showFilterPanel: false,
            };
        },
        mounted(){
            if(!helper.hasPermission('list-birthday')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }
            this.getBirthdays();
            helper.showDemoNotification(['calendar']);
        },
        created(){
            this.filter.start_date = helper.today();
            this.filter.end_date = moment().add(1, 'weeks').format('YYYY-MM-DD');
        },
        methods: {
            getConfig(config){
                return helper.getConfig(config);
            },
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getStudentName(student){
                return helper.getStudentName(student);
            },
            getEmployeeName(employee){
                return helper.getEmployeeName(employee);
            },
            getEmployeeCode(employee){
                return helper.getEmployeeCode(employee);
            },
            getAge(date){
                return moment().diff(date, 'years');
            },
            getStudentBatchOnDate(student){
                return helper.getStudentBatchOnDate(student, helper.today());
            },
            getEmployeeDesignationOnDate(employee){
                return helper.getEmployeeDesignationOnDate(employee, helper.today());
            },
            getBirthdays(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                this.filter.start_date = helper.toDate(this.filter.start_date);
                this.filter.end_date = helper.toDate(this.filter.end_date);
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/birthday?page=' + page + url)
                    .then(response => {
                        this.birthdays = response;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/birthday/print',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        let print = window.open("/print");
                        print.document.write(response);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            pdf(){
                let loader = this.$loading.show();
                axios.post('/api/birthday/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            showDate(date){
                return helper.formatDate(date);
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
            'filter.sort_by': function(val) {
                this.getBirthdays();
            },
            'filter.order': function(val) {
                this.getBirthdays();
            },
            'filter.page_length': function(val) {
                this.getBirthdays();
            },
            'filter.type': function(val) {
                this.getBirthdays();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>
