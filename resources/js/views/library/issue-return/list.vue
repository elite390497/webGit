<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{title}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="book_logs.total">{{trans('general.total_result_found',{count : book_logs.total, from: book_logs.from, to: book_logs.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
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
                        <help-button @clicked="help_topic = 'library-issue-return'"></help-button>
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
                                    <label for="">{{trans('library.issue_to')}}</label>
                                    <select v-model="filter.issue_to" class="custom-select col-12">
                                      <option value=null selected>{{trans('general.select_one')}}</option>
                                      <option v-for="option in issue_to" v-bind:value="option.value">
                                        {{ option.text }}
                                      </option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('library.return_status')}}</label>
                                    <select v-model="filter.return_status" class="custom-select col-12">
                                      <option value=null selected>{{trans('general.select_one')}}</option>
                                      <option v-for="option in return_statuses" v-bind:value="option.value">
                                        {{ option.text }}
                                      </option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-5">
                                <div class="form-group">
                                    <date-range-picker :start-date.sync="filter.date_of_issue_start_date" :end-date.sync="filter.date_of_issue_end_date" :label="trans('library.date_of_issue_between')"></date-range-picker>
                                </div>
                            </div>
                            <div class="col-12 col-sm-5">
                                <div class="form-group">
                                    <date-range-picker :start-date.sync="filter.due_date_start" :end-date.sync="filter.due_date_end" :label="trans('library.due_date_between')"></date-range-picker>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getBookLogs">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="book_logs.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('library.date_of_issue')}}</th>
                                    <th>{{trans('library.due_date')}}</th>
                                    <th>{{trans('library.issue_to')}}</th>
                                    <th></th>
                                    <th>{{trans('library.no_of_books_issued')}}</th>
                                    <th>{{trans('library.no_of_books_returned')}}</th>
                                    <th>{{trans('library.issue_remarks')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="book_log in book_logs.data">
                                    <td>{{book_log.date_of_issue | moment}}</td>
                                    <td>
                                        <span v-if="book_log.due_date">
                                            {{book_log.due_date | moment}}
                                            <template v-if="isOverDue(book_log)">
                                                <br />
                                                <span class="label label-danger">{{trans('library.overdue_by_days', {day: overdueDay(book_log)})}}</span>
                                            </template>
                                        </span>
                                        </span>
                                        <span v-else>-</span>
                                    </td>
                                    <td>
                                        <span v-if="book_log.student_record_id">{{trans('student.student')}}</span>
                                        <span v-if="book_log.employee_id">{{trans('employee.employee')}}</span>
                                    </td>
                                    <td>
                                        <template v-if="book_log.student_record_id">
                                            <span>{{trans('student.name')+': '+getStudentName(book_log.student_record.student)}}</span> <br />
                                            <span>{{trans('academic.batch')+': '+getStudentBatch(book_log.student_record.batch)}}</span><br />
                                            <span>{{trans('student.first_guardian_name')+': '+book_log.student_record.student.parent.first_guardian_name}}</span>
                                        </template>
                                        <template v-if="book_log.employee_id">
                                            <span>{{trans('employee.name')+': '+getEmployeeName(book_log.employee)}}</span> <br />
                                            <span>{{trans('employee.father_name')+': '+book_log.employee.father_name}}</span><br />
                                            <span>{{trans('employee.contact_number')+': '+book_log.employee.contact_number}}</span>
                                        </template>
                                    </td>
                                    <td v-text="book_log.book_issue_count"></td>
                                    <td v-text="book_log.book_return_count"></td>
                                    <td v-text="book_log.issue_remarks"></td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-info btn-sm" v-tooltip="trans('general.view_detail')" @click="$router.push('/library/issue/'+book_log.uuid)">
                                                <i class="fas fa-arrow-circle-right"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!book_logs.total" module="library" title="issue_module_title" description="issue_module_description" icon="list">
                        <div slot="btn">
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="book_logs" @updateRecords="getBookLogs"></pagination-record>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        components : {  },
        props: ['title','returnStatus'],
        data() {
            return {
                book_logs: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'date_of_issue',
                    order: 'desc',
                    date_of_issue_start_date: '',
                    date_of_issue_end_date: '',
                    due_date_start: '',
                    due_date_end: '',
                    issue_to: '',
                    return_status: '',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'date_of_issue',
                        translation: i18n.library.book_title
                    }
                ],
                showFilterPanel: false,
                help_topic: '',
                issue_to: [
                    {
                        text: i18n.student.student,
                        value: 'student'
                    },
                    {
                        text: i18n.employee.employee,
                        value: 'employee'
                    }
                ],
                return_statuses: [
                    {
                        text: i18n.library.return_complete,
                        value: 'complete'
                    },
                    {
                        text: i18n.library.return_due,
                        value: 'due'
                    },
                    {
                        text: i18n.library.return_overdue,
                        value: 'overdue'
                    }
                ]
            };
        },
        mounted(){
            if(!helper.hasPermission('issue-book') && !helper.hasPermission('return-book')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.filter.return_status = this.returnStatus;
            this.getBookLogs();
            helper.showDemoNotification(['library']);
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getStudentName(student){
                return helper.getStudentName(student);
            },
            getEmployeeName(employee){
                return helper.getEmployeeNameWithCode(employee);
            },
            getStudentBatch(batch){
                return batch.course.name+' '+batch.name;
            },
            getBookLogs(page){
                let loader = this.$loading.show();

                if (typeof page !== 'number') {
                    page = 1;
                }
                this.filter.date_of_issue_start_date = helper.toDate(this.filter.date_of_issue_start_date);
                this.filter.date_of_issue_end_date = helper.toDate(this.filter.date_of_issue_end_date);
                this.filter.due_date_start = helper.toDate(this.filter.due_date_start);
                this.filter.due_date_end = helper.toDate(this.filter.due_date_end);
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/book/log?page=' + page + url)
                    .then(response => {
                        this.book_logs = response.book_logs;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getConfig(config) {
                return helper.getConfig(config)
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/book/log/print',{filter: this.filter})
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
                axios.post('/api/book/log/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            isOverDue(book_log){
                if(book_log.book_issue_count > book_log.book_return_count && helper.toDate(book_log.due_date) < helper.today())
                    return true;

                return false;
            },
            overdueDay(book_log){
                let date = helper.today();

                if(this.isOverDue(book_log))
                    return helper.getDateDiff(book_log.due_date, date);

                return 0;
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
                this.getBookLogs();
            },
            'filter.order': function(val){
                this.getBookLogs();
            },
            'filter.page_length': function(val){
                this.getBookLogs();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>