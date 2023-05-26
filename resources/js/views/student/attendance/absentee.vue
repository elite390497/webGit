<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('student.absentee')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="student_records.total">{{trans('general.total_result_found',{count : student_records.total, from: student_records.from, to: student_records.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/student/attendance')"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('student.attendance')}}</span></button>
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
                        <help-button @clicked="help_topic = 'student-absentee'"></help-button>
                        
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <transition name="fade">
                <div class="card card-form" v-if="showFilterPanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('general.filter')}}
                        </h4>
                        <div class="row">
                            <div class="col-12 col-sm-2">
                                <div class="form-group">
                                    <label for="">{{trans('student.first_name')}}</label>
                                    <input class="form-control" name="first_name" v-model="filter.first_name">
                                </div>
                            </div>
                            <div class="col-12 col-sm-2">
                                <div class="form-group">
                                    <label for="">{{trans('student.last_name')}}</label>
                                    <input class="form-control" name="last_name" v-model="filter.last_name">
                                </div>
                            </div>
                            <div class="col-12 col-sm-2">
                                <div class="form-group">
                                    <label for="">{{trans('student.father_name')}}</label>
                                    <input class="form-control" name="father_name" v-model="filter.father_name">
                                </div>
                            </div>
                            <div class="col-12 col-sm-2">
                                <div class="form-group">
                                    <label for="">{{trans('student.mother_name')}}</label>
                                    <input class="form-control" name="mother_name" v-model="filter.mother_name">
                                </div>
                            </div>
                            <div class="col-12 col-sm-4">
                                <div class="form-group">
                                    <label for="">{{trans('student.date_of_attendance')}}</label>
                                    <datepicker v-model="filter.date" :bootstrapStyling="true" :placeholder="trans('student.date_of_attendance')"></datepicker>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('academic.batch')}}</label>
                                    <v-select label="name" track-by="id" group-values="batches" group-label="course_group" :group-select="false" v-model="selected_batch" name="batch_id" id="batch_id" :options="batches" :placeholder="trans('academic.select_batch')" @select="onBatchSelect" @remove="filter.batch_id = ''">
                                        <div class="multiselect__option" slot="afterList" v-if="!batches.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3" v-if="filter.batch_id">
                                <div class="form-group">
                                    <label for="">{{trans('academic.subject')}} </label>
                                    <select v-model="filter.subject_id" class="custom-select col-12" name="subject_id">
                                      <option value="" selected>{{trans('general.select_one')}}</option>
                                      <option v-for="option in subjects" v-bind:value="option.id">
                                        {{ option.name }}
                                      </option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('student.attendance_session')}}</label>
                                    <select v-model="filter.session" class="custom-select col-12" name="session">
                                      <option value="" selected>{{trans('general.select_one')}}</option>
                                      <option v-for="option in attendance_method_more_than_once_types" v-bind:value="option.value">
                                        {{ option.text }}
                                      </option>
                                    </select>
                                </div>
                            </div>
                            <!-- <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('student.attendance_method')}}</label>
                                    <select v-model="filter.attendance_method" class="custom-select col-12" name="attendance_method">
                                      <option value="" selected>{{trans('general.select_one')}}</option>
                                      <option v-for="option in attendance_methods" v-bind:value="option.value">
                                        {{ option.text }}
                                      </option>
                                    </select>
                                </div>
                            </div> -->
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getStudentRecords">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="student_records.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th class="select-all">
                                        <label class="custom-control custom-checkbox">
                                            <input type="checkbox" class="custom-control-input" value="1" v-model="selectAll" @change="toggleSelectAll">
                                            <span class="custom-control-label"></span>
                                        </label>
                                    </th>
                                    <th>{{trans('student.admission_number_short')}}</th>
                                    <th>{{trans('student.name')}}</th>
                                    <th>{{trans('student.father_name')}}</th>
                                    <th>{{trans('student.mother_name')}}</th>
                                    <th>{{trans('student.date_of_admission')}}</th>
                                    <th>{{trans('academic.batch')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="student_record in student_records.data">
                                    <td class="select-all">
                                        <label class="custom-control custom-checkbox">
                                            <input type="checkbox" class="custom-control-input" :value="student_record.id" v-model="smsForm.ids">
                                            <span class="custom-control-label"></span>
                                        </label>
                                    </td>
                                    <td v-text="getAdmissionNumber(student_record.admission)"></td>
                                    <td v-text="getStudentName(student_record.student)"></td>
                                    <td v-text="student_record.student.parent.father_name"></td>
                                    <td v-text="student_record.student.parent.mother_name"></td>
                                    <td>{{student_record.admission.date_of_admission | moment}}</td>
                                    <td v-text="student_record.batch.course.name+' '+student_record.batch.name"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!student_records.total" module="student" title="absentee_module_title" description="absentee_module_description" icon="list">
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="student_records" @updateRecords="getStudentRecords"></pagination-record>
                </div>

                <div class="m-t-10 card-body border-top p-4" v-if="smsForm.ids.length">
                    <h4>{{trans('student.send_sms_to_absentee')}}
                        <span class="card-subtitle">{{trans('student.no_of_student_selected',{no: smsForm.ids.length})}}</span>
                    </h4>
                    <form @submit.prevent="submit" @keydown="smsForm.errors.clear($event.target.name)">
                        <div class="row">
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label for="">{{trans('communication.sms')}} {{trans('communication.character_count', {count: characterCount})}} </label>
                                    <textarea class="form-control" v-model="smsForm.sms" rows="2" name="sms" :placeholder="trans('communication.sms')"></textarea>
                                    <p class="help-block font-80pc">{{trans('communication.template_variable_tip')}}</p>
                                    <p class="help-block font-90pc">{{trans('communication.available_variables')}}: NAME, BATCH, FATHER_NAME, DATE</p>
                                    <show-error :form-name="smsForm" prop-name="sms"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label for="">{{trans('communication.sample_sms')}}</label>
                                    <p>{{sampleMessage}}</p>
                                </div>
                            </div>
                        </div>
                        <button type="button" class="btn btn-info waves-effect waves-light" key="send-sms" v-confirm="{ok: confirmSMS()}">{{trans('general.send')}}</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        components : {},
        data() {
            return {
                student_records: {
                    total: 0,
                    data: []
                },
                selectAll: false,
                smsForm: new Form({
                    sms: '',
                    ids: [],
                    filter: {}
                }),
                filter: {
                    sort_by : 'created_at',
                    order: 'asc',
                    date: helper.today(),
                    batch_id: '',
                    subject_id: '',
                    attendance_method: '',
                    session: '',
                    first_name: '',
                    last_name: '',
                    father_name: '',
                    mother_name: '',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'created_at',
                        translation: i18n.general.created_at
                    }
                ],
                batches: [],
                subjects: [],
                batch_with_subjects: [],
                attendance_methods: [],
                attendance_method_more_than_once_types: [],
                selected_batch: null,
                showFilterPanel: true
            };
        },
        mounted(){
            if(!helper.hasPermission('list-student-attendance')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            helper.showDemoNotification(['student']);
            this.getStudentRecords();
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getConfig(config){
                return helper.getConfig(config);
            },
            getStudentRecords(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                this.selectAll = false;
                this.filter.date = helper.toDate(this.filter.date);
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/student/attendance/absentee?page=' + page + url)
                    .then(response => {
                        this.batches = response.filters.batches;
                        this.attendance_method_more_than_once_types = response.filters.attendance_method_more_than_once_types;
                        this.attendance_methods = response.filters.attendance_methods;
                        this.batch_with_subjects = response.filters.batch_with_subjects;
                        this.student_records = response.student_records;
                        let ids = [];
                        this.student_records.data.forEach(student_record => {
                            ids.push(student_record.id);
                        })
                        this.selectAll = ids.every(elem => this.smsForm.ids.indexOf(elem) > -1) ? 1 : 0;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            toggleSelectAll(){
                if(this.selectAll) {
                    this.student_records.data.forEach(student_record => {
                        if (this.smsForm.ids.indexOf(student_record.id) < 0)
                            this.smsForm.ids.push(student_record.id);
                    });
                } else {
                    this.student_records.data.forEach(student_record => {
                        let index = this.smsForm.ids.indexOf(student_record.id);
                        if (index >= 0) {
                            this.smsForm.ids.splice(index, 1);
                        }
                    });
                }
            },
            getStudentName(student){
                return helper.getStudentName(student);
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/student/attendance/absentee/print',{filter: this.filter})
                    .then(response => {
                        let print = window.open("/print");
                        print.document.write(response);
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            pdf(){
                let loader = this.$loading.show();
                axios.post('/api/student/attendance/absentee/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onBatchSelect(selectedOption){
                this.filter.batch_id = selectedOption.id;
                let batch = this.batch_with_subjects.find(o => o.id == this.filter.batch_id);

                if (typeof batch == 'undefined') {
                    return;
                }

                this.filter.subject_id = '';
                this.subjects = [];

                batch.subjects.forEach(subject => {
                    this.subjects.push({
                        id: subject.id,
                        name: subject.name+' ('+subject.code+')'
                    });
                });
            },
            onBatchRemove(removedOption){
                this.filter.batch_id.splice(this.filter.batch_id.indexOf(removedOption.id), 1);
            },
            submit(){

            },
            confirmSMS(){
                return dialog => this.sendSMS();
            },
            sendSMS(){
                let loader = this.$loading.show();
                this.smsForm.filter = this.filter;
                this.smsForm.post('/api/student/attendance/absentee')
                    .then(response => {
                        toastr.success(response.message);
                        this.getStudentRecords();
                        this.smsForm.ids = [];
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            getAdmissionNumber(admission){
                return helper.getAdmissionNumber(admission);
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
                this.getStudentRecords();
            },
            'filter.order': function(val){
                this.getStudentRecords();
            },
            'filter.page_length': function(val){
                this.getStudentRecords();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            },
            sampleMessage(){
                let item = this.student_records.data[0];

                let sms = this.smsForm.sms;

                return sms.replace("#NAME#", this.getStudentName(item.student))
                    .replace("#BATCH#", item.batch.course.name+' '+item.batch.name)
                    .replace("#FATHER_NAME#", item.student.parent.father_name)
                    .replace("#DATE#", helper.formatDate(this.filter.date));
            },
            characterCount(){
                return this.smsForm.sms.length;
            }
        }
    }
</script>