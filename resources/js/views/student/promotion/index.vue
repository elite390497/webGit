<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('student.awaiting_promotion')}} 
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
                        <help-button @clicked="help_topic = 'student-promotion'"></help-button>
                        
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
                                    <label for="">{{trans('student.first_guardian_name')}}</label>
                                    <input class="form-control" name="first_guardian_name" v-model="filter.first_guardian_name">
                                </div>
                            </div>
                            <div class="col-12 col-sm-2">
                                <div class="form-group">
                                    <label for="">{{trans('student.second_guardian_name')}}</label>
                                    <input class="form-control" name="second_guardian_name" v-model="filter.second_guardian_name">
                                </div>
                            </div>
                            <div class="col-12 col-sm-4">
                                <div class="form-group">
                                    <label for="">{{trans('academic.batch')}}</label>
                                    <v-select label="name" track-by="id" group-values="batches" group-label="course_group" :group-select="false" v-model="selected_batch" name="batch_id" id="batch_id" :options="batches" :placeholder="trans('academic.select_batch')" @select="onBatchSelect" @remove="filter.batch_id = ''">
                                        <div class="multiselect__option" slot="afterList" v-if="!batches.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
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
                                    <th class="select-all">
                                        <label class="custom-control custom-checkbox">
                                            <input type="checkbox" class="custom-control-input" value="1" v-model="selectAll" @change="toggleSelectAll">
                                            <span class="custom-control-label"></span>
                                        </label>
                                    </th>
                                    <th>{{trans('student.admission_number_short')}}</th>
                                    <th>{{trans('student.name')}}</th>
                                    <th>{{trans('student.first_guardian_name')}}</th>
                                    <th>{{trans('student.second_guardian_name')}}</th>
                                    <th>{{trans('student.date_of_admission')}}</th>
                                    <th>{{trans('student.date_of_promotion')}}</th>
                                    <th>{{trans('academic.batch')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="student_record in student_records.data">
                                    <td class="select-all">
                                        <label class="custom-control custom-checkbox">
                                            <input type="checkbox" class="custom-control-input" :value="student_record.id" v-model="promotionForm.ids">
                                            <span class="custom-control-label"></span>
                                        </label>
                                    </td>
                                    <td v-text="getAdmissionNumber(student_record.admission)"></td>
                                    <td v-text="getStudentName(student_record.student)"></td>
                                    <td v-text="student_record.student.parent.first_guardian_name"></td>
                                    <td v-text="student_record.student.parent.second_guardian_name"></td>
                                    <td>{{student_record.admission.date_of_admission | moment}}</td>
                                    <td>{{getDateOfPromotion(student_record)}}</td>
                                    <td v-text="student_record.batch.course.name+' '+student_record.batch.name"></td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-info btn-sm" v-tooltip="trans('student.view_student_detail')" @click="$router.push('/student/'+student_record.student.uuid)">
                                                <i class="fas fa-arrow-circle-right"></i> {{trans('general.view')}}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!student_records.total" module="student" title="promotion_module_title" description="promotion_module_description" icon="list">
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="student_records" @updateRecords="getStudentRecords"></pagination-record>
                </div>

                <div class="m-t-10 card-body border-top p-4" v-if="promotionForm.ids.length">
                    <h4>{{trans('student.promote_to',{session: next_session.name})}}
                        <span class="card-subtitle">{{trans('student.no_of_student_selected',{no: promotionForm.ids.length})}}</span>
                    </h4>
                    <form @submit.prevent="submit" @keydown="promotionForm.errors.clear($event.target.name)">
                        <div class="row">
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('academic.batch')}}</label>
                                    <v-select label="name" v-model="selected_next_session_batch" group-values="batches" group-label="course_group" :group-select="false" name="next_session_batch_id" id="next_session_batch_id" :options="next_session_batches" :placeholder="trans('academic.select_batch')" @select="onNextSessionBatchSelect" @close="promotionForm.errors.clear('next_session_batch_id')" @remove="promotionForm.next_session_batch_id = ''">
                                        <div class="multiselect__option" slot="afterList" v-if="!next_session_batches.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                    <show-error :form-name="promotionForm" prop-name="next_session_batch_id"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('transport.circle')}}</label>
                                    <v-select label="name" v-model="selected_next_session_transport_circle" name="next_session_transport_circle_id" id="next_session_transport_circle_id" :options="next_session_transport_circles" :placeholder="trans('tansport.select_circle')" @select="onNextSessionTransportCircleSelect" @close="promotionForm.errors.clear('next_session_transport_circle_id')" @remove="promotionForm.next_session_transport_circle_id = ''">
                                        <div class="multiselect__option" slot="afterList" v-if="!next_session_transport_circles.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                    <show-error :form-name="promotionForm" prop-name="next_session_transport_circle_id"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('finance.fee_concession')}}</label>
                                    <v-select label="name" v-model="selected_next_session_fee_concession" name="next_session_fee_concession_id" id="next_session_fee_concession_id" :options="next_session_fee_concessions" :placeholder="trans('finance.select_fee_concession')" @select="onNextSessionFeeConcessionSelect" @close="promotionForm.errors.clear('next_session_fee_concession_id')" @remove="promotionForm.next_session_fee_concession_id = ''">
                                        <div class="multiselect__option" slot="afterList" v-if="!next_session_fee_concessions.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                    <show-error :form-name="promotionForm" prop-name="next_session_fee_concession_id"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('student.promotion_remarks')}}</label>
                                    <autosize-textarea v-model="promotionForm.promotion_remarks" rows="1" name="promotion_remarks" :placeholder="trans('academic.batch_promotion_remarks')"></autosize-textarea>
                                    <show-error :form-name="promotionForm" prop-name="promotion_remarks"></show-error>
                                </div>
                            </div>
                        </div>
                        <button type="button" class="btn btn-info waves-effect waves-light pull-right" key="promote-action" v-confirm="{ok: confirmPromotion()}">{{trans('general.save')}}</button>
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
                promotionForm: new Form({
                    next_session_batch_id: '',
                    next_session_transport_circle_id: '',
                    next_session_fee_concession_id: '',
                    promotion_remarks: '',
                    ids: []
                }),
                filter: {
                    sort_by : 'created_at',
                    order: 'asc',
                    batch_id: '',
                    first_name: '',
                    last_name: '',
                    first_guardian_name: '',
                    second_guardian_name: '',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'created_at',
                        translation: i18n.general.created_at
                    }
                ],
                batches: [],
                selected_batch: null,
                showFilterPanel: true,
                next_session: {},
                next_session_batches: [],
                selected_next_session_batch: null,
                next_session_transport_circles: [],
                selected_next_session_transport_circle: null,
                next_session_fee_concessions: [],
                selected_next_session_fee_concession: null
            };
        },
        mounted(){
            if(!helper.hasPermission('list-student')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getPreRequisite();
            helper.showDemoNotification(['student']);
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getConfig(config){
                return helper.getConfig(config);
            },
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/student/promotion/pre-requisite')
                    .then(response => {
                        this.next_session = response.next_session;
                        this.next_session_transport_circles = response.next_session_transport_circles;
                        this.next_session_batches = response.next_session_batches;
                        this.next_session_fee_concessions = response.next_session_fee_concessions;
                        this.batches = response.filters.batches;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            getStudentRecords(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                this.selectAll = false;
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/student/promotion?page=' + page + url)
                    .then(response => {
                        this.student_records = response.student_records;
                        let ids = [];
                        this.student_records.data.forEach(student_record => {
                            ids.push(student_record.id);
                        })
                        this.selectAll = ids.every(elem => this.promotionForm.ids.indexOf(elem) > -1) ? 1 : 0;
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
                        if (this.promotionForm.ids.indexOf(student_record.id) < 0)
                            this.promotionForm.ids.push(student_record.id);
                    });
                } else {
                    this.student_records.data.forEach(student_record => {
                        let index = this.promotionForm.ids.indexOf(student_record.id);
                        if (index >= 0) {
                            this.promotionForm.ids.splice(index, 1);
                        }
                    });
                }
            },
            getStudentName(student){
                return helper.getStudentName(student);
            },
            getDateOfPromotion(student_record){
                return (student_record.admission.date_of_admission == student_record.date_of_entry) ? '-' : helper.formatDate(student_record.date_of_entry);
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/student/promotion/print',{filter: this.filter})
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
                axios.post('/api/student/promotion/pdf',{filter: this.filter})
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
            },
            onBatchRemove(removedOption){
                this.filter.batch_id.splice(this.filter.batch_id.indexOf(removedOption.id), 1);
            },
            onNextSessionBatchSelect(selectedOption){
                this.promotionForm.next_session_batch_id = selectedOption.id;
            },
            onNextSessionTransportCircleSelect(selectedOption){
                this.promotionForm.next_session_transport_circle_id = selectedOption.id;
            },
            onNextSessionFeeConcessionSelect(selectedOption){
                this.promotionForm.next_session_fee_concession_id = selectedOption.id;
            },
            submit(){

            },
            confirmPromotion(){
                return dialog => this.promote();
            },
            promote(){
                let loader = this.$loading.show();
                this.promotionForm.post('/api/student/promotion')
                    .then(response => {
                        toastr.success(response.message);
                        this.getStudentRecords();
                        this.promotionForm.ids = [];
                        this.selected_next_session_batch = null;
                        this.selected_next_session_fee_concession = null;
                        this.selected_next_session_transport_circle = null;
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
            }
        }
    }
</script>