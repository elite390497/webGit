<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('student.termination')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="student_records.total">{{trans('general.total_result_found',{count : student_records.total, from: student_records.from, to: student_records.to})}}</span>
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
                        <help-button @clicked="help_topic = 'student-termination'"></help-button>
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
                                    <label for="">{{trans('academic.batch')}}</label>
                                    <v-select label="name" track-by="id" group-values="batches" group-label="course_group" :group-select="false" v-model="selected_batches" name="batch_id" id="batch_id" :options="batches" :placeholder="trans('academic.select_batch')" @select="onBatchSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onBatchRemove" :selected="selected_batches">
                                        <div class="multiselect__option" slot="afterList" v-if="!batches.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <date-range-picker :start-date.sync="filter.date_of_exit_start_date" :end-date.sync="filter.date_of_exit_end_date" :label="trans('student.date_of_termination_between')"></date-range-picker>
                                </div>
                            </div>
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
                                    <th>{{trans('student.admission_number_short')}}</th>
                                    <th>{{trans('student.name')}}</th>
                                    <th>{{trans('student.father_name')}}</th>
                                    <th>{{trans('student.mother_name')}}</th>
                                    <th>{{trans('student.date_of_admission')}}</th>
                                    <th>{{trans('academic.batch')}}</th>
                                    <th>{{trans('student.date_of_termination')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="student_record in student_records.data">
                                    <td v-text="getAdmissionNumber(student_record.admission)"></td>
                                    <td v-text="getStudentName(student_record.student)"></td>
                                    <td v-text="student_record.student.parent.father_name"></td>
                                    <td v-text="student_record.student.parent.mother_name"></td>
                                    <td>{{student_record.admission.date_of_admission | moment}}</td>
                                    <td v-text="student_record.batch.course.name+' '+student_record.batch.name"></td>
                                    <td>{{student_record.date_of_exit | moment}}</td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-info btn-sm" v-tooltip="trans('student.view_student_detail')" @click="$router.push('/student/'+student_record.student.uuid)">
                                                <i class="fas fa-arrow-circle-right"></i>
                                            </button>
                                            <button class="btn btn-success btn-sm" v-tooltip="trans('student.view_transfer_certificate')" @click="$router.push('/student/termination/'+student_record.student.uuid+'/'+student_record.id)">
                                                <i class="fas fa-file-alt"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!student_records.total" module="student" title="termination_module_title" description="termination_module_description" icon="list">
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="student_records" @updateRecords="getStudentRecords"></pagination-record>
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
                filter: {
                    sort_by : 'date_of_exit',
                    order: 'asc',
                    batch_id: [],
                    first_name: '',
                    last_name: '',
                    father_name: '',
                    mother_name: '',
                    date_of_exit_start_date: '',
                    date_of_exit_end_date: '',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'created_at',
                        translation: i18n.general.created_at
                    },
                    {
                        value: 'date_of_exit',
                        translation: i18n.student.date_of_termination
                    }
                ],
                batches: [],
                selected_batches: null,
                showFilterPanel: false
            };
        },
        mounted(){
            if(!helper.hasPermission('list-student')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getStudentRecords();
            helper.showDemoNotification(['student']);
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
                this.filter.date_of_exit_start_date = helper.toDate(this.filter.date_of_exit_start_date);
                this.filter.date_of_exit_end_date = helper.toDate(this.filter.date_of_exit_end_date);
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/student/terminated?page=' + page + url)
                    .then(response => {
                        this.student_records = response.student_records;
                        this.batches = response.filters.batches;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getStudentName(student){
                return helper.getStudentName(student);
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/student/terminated/print',{filter: this.filter})
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
                axios.post('/api/student/terminated/pdf',{filter: this.filter})
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
                this.filter.batch_id.push(selectedOption.id);
            },
            onBatchRemove(removedOption){
                this.filter.batch_id.splice(this.filter.batch_id.indexOf(removedOption.id), 1);
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
            }
        }
    }
</script>