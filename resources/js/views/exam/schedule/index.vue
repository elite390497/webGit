<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('exam.schedule')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="exam_schedules.total">{{trans('general.total_result_found',{count : exam_schedules.total, from: exam_schedules.from, to: exam_schedules.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="exam_schedules.total && hasPermission('create-exam-schedule')" @click="$router.push('/exam/schedule/create')" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('exam.add_new_schedule')}}</span></button>
                        <button class="btn btn-info btn-sm" v-if="!showFilterPanel" @click="showFilterPanel = !showFilterPanel"><i class="fas fa-filter"></i> <span class="d-none d-sm-inline">{{trans('general.filter')}}</span></button>
                        <button class="btn btn-info btn-sm" @click="showDetail = !showDetail"><i class="fas fa-arrows-alt"></i> <span class="d-none d-sm-inline">
                            <span v-if="showDetail">{{trans('general.hide_detail')}}</span>
                            <span v-else>{{trans('general.view_detail')}}</span>
                        </span></button>
                        <sort-by :order-by-options="orderByOptions" :sort-by="filter.sort_by" :order="filter.order" @updateSortBy="value => {filter.sort_by = value}"  @updateOrder="value => {filter.order = value}"></sort-by>
                        <div class="btn-group">
                            <button type="button" class="btn btn-info btn-sm dropdown-toggle no-caret " role="menu" id="moreOption" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-tooltip="trans('general.more_option')">
                                <i class="fas fa-ellipsis-h"></i> <span class="d-none d-sm-inline"></span>
                            </button>
                            <div :class="['dropdown-menu',getConfig('direction') == 'ltr' ? 'dropdown-menu-right' : '']" aria-labelledby="moreOption">
                                <button class="dropdown-item custom-dropdown" @click="$router.push('/exam')" v-if="hasPermission('list-exam')"><i class="fas fa-file-alt"></i> {{trans('exam.exam')}}</button>
                                <button class="dropdown-item custom-dropdown" @click="print"><i class="fas fa-print"></i> {{trans('general.print')}}</button>
                                <button class="dropdown-item custom-dropdown" @click="pdf"><i class="fas fa-file-pdf"></i> {{trans('general.generate_pdf')}}</button>
                            </div>
                        </div>
                        <help-button @clicked="help_topic = 'exam.schedule'"></help-button>
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
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getExamSchedules">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive p-2" v-if="exam_schedules.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('exam.exam')}}</th>
                                    <th>{{trans('academic.batch')}}</th>
                                    <th>{{trans('exam.schedule')}}</th>
                                    <th>{{trans('exam.assessment')}}</th>
                                    <template v-if="hasNotAnyRole(['student','parent'])">
                                        <th>{{trans('exam.grade')}}</th>
                                        <th class="table-option">{{trans('general.action')}}</th>
                                    </template>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="exam_schedule in exam_schedules.data">
                                    <td>
                                        {{exam_schedule.exam.name}}
                                        <span v-if="exam_schedule.exam.exam_term_id">
                                            ({{exam_schedule.exam.term.course_group.name}})
                                        </span>
                                    </td>
                                    <td v-text="exam_schedule.batch.course.name+' '+exam_schedule.batch.name"></td>
                                    <td>
                                        <span v-if="! showDetail">
                                            {{trans('exam.schedule_date_range', {start_date: getStartDate(exam_schedule), end_date: getEndDate(exam_schedule)})}}
                                        </span>
                                        <span v-else>
                                            <div class="row" v-for="record in exam_schedule.records" v-if="record.date">
                                                <div class="col-6">{{record.subject.name+' ('+record.subject.code+')'}}</div>
                                                <div class="col-6">{{record.date | moment}}</div>
                                            </div>
                                        </span>
                                    </td>
                                    <td>
                                        <span v-if="! showDetail">{{exam_schedule.assessment.name}}</span>
                                        <span v-else>
                                            <div class="row" v-for="detail in exam_schedule.assessment.details">
                                                <div class="col-4">{{detail.name}}</div>
                                                <div class="col-8">{{trans('exam.assessment_detail', {max_mark: detail.max_mark, pass_percentage: detail.pass_percentage})}}</div>
                                            </div>
                                        </span>
                                    </td>
                                    <template v-if="hasNotAnyRole(['student','parent'])">
                                        <td>{{exam_schedule.exam_grade_id ? exam_schedule.grade.name : '-'}}</td>
                                        <td class="table-option">
                                            <div class="btn-group">
                                                <a :href="`/exam/schedule/${exam_schedule.id}/admit-card/print?token=${authToken}`" target="_blank" class="btn btn-success btn-sm" v-tooltip="trans('exam.admit_card')"><i class="fas fa-file-alt"></i></a>
                                                <button class="btn btn-info btn-sm" v-if="hasPermission('edit-exam-schedule')" v-tooltip="trans('exam.edit_schedule')" @click.prevent="editExamSchedule(exam_schedule)"><i class="fas fa-edit"></i></button>
                                                <button class="btn btn-danger btn-sm" v-if="hasPermission('delete-exam-schedule')" :key="exam_schedule.id" v-confirm="{ok: confirmDelete(exam_schedule)}" v-tooltip="trans('exam.delete_schedule')"><i class="fas fa-trash"></i></button>
                                            </div>
                                        </td>
                                    </template>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!exam_schedules.total" module="exam" title="schedule_module_title" description="schedule_module_description" icon="check-circle">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="hasPermission('create-exam-schedule')" @click="$router.push('/exam/schedule/create')"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="exam_schedules" @updateRecords="getExamSchedules"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    export default {
        components : { },
        data() {
            return {
                exam_schedules: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'created_at',
                    order: 'desc',
                    name: '',
                    batch_id: [],
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'created_at',
                        translation: i18n.general.created_at
                    }
                ],
                batches: [],
                selected_batches: null,
                showFilterPanel: false,
                showDetail: true,
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('list-exam-schedule')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getExamSchedules();
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            hasNotAnyRole(roles){
                return helper.hasNotAnyRole(roles);
            },
            getExamSchedules(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/exam/schedule?page=' + page + url)
                    .then(response => {
                        this.batches = response.filters.batches;
                        this.exam_schedules = response.exam_schedules;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editExamSchedule(exam_schedule){
                this.$router.push('/exam/schedule/'+exam_schedule.id+'/edit');
            },
            confirmDelete(exam_schedule){
                return dialog => this.deleteExam(exam_schedule);
            },
            deleteExam(exam_schedule){
                let loader = this.$loading.show();
                axios.delete('/api/exam/schedule/'+exam_schedule.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getExamSchedules();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getConfig(config){
                return helper.getConfig(config);
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/exam/schedule/print',{filter: this.filter})
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
                axios.post('/api/exam/schedule/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getStartDate(exam_schedule){
                let records = exam_schedule.records.filter(o => o.date != null);

                if (! records.length) {
                    return '-';
                }

                return helper.formatDate(records[0].date);
            },
            getEndDate(exam_schedule){
                let records = exam_schedule.records.filter(o => o.date != null);

                if (! records.length) {
                    return '-';
                }

                return helper.formatDate(records[records.length - 1].date);
            },
            onBatchSelect(selectedOption){
                this.filter.batch_id.push(selectedOption.id);
            },
            onBatchRemove(removedOption){
                this.filter.batch_id.splice(this.filter.batch_id.indexOf(removedOption.id), 1);
            },
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
                this.getExamSchedules();
            },
            'filter.order': function(val){
                this.getExamSchedules();
            },
            'filter.page_length': function(val){
                this.getExamSchedules();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>