<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('exam.online_exam')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="online_exams.total">{{trans('general.total_result_found',{count : online_exams.total, from: online_exams.from, to: online_exams.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="online_exams.total && hasPermission('create-online-exam')" @click="$router.push('/online-exam/create')" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('exam.add_new_online_exam')}}</span></button>
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
                        <help-button @clicked="help_topic = 'exam.online_exam'"></help-button>
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
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getOnlineExams">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive p-2" v-if="online_exams.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('exam.online_exam_name')}}</th>
                                    <th>{{trans('academic.batch')}}</th>
                                    <th>{{trans('academic.subject')}}</th>
                                    <th>{{trans('exam.online_exam_date')}}</th>
                                    <th>{{trans('exam.online_exam_questions')}}</th>
                                    <th>{{trans('exam.online_exam_max_mark')}}</th>
                                    <th v-if="hasNotAnyRole(['student','parent'])">{{trans('exam.online_exam_is_published')}}</th>
                                    <th v-if="hasAnyRole(['student','parent'])">{{trans('exam.online_exam_status')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="online_exam in online_exams.data">
                                    <td v-text="online_exam.name"></td>
                                    <td v-text="online_exam.batch.course.name+' '+online_exam.batch.name"></td>
                                    <td v-text="online_exam.subject.name"></td>
                                    <td>
                                        {{online_exam.date | moment}}
                                        {{online_exam.start_time | momentTime}} {{trans('general.to')}}
                                        {{online_exam.end_time | momentTime}}
                                    </td>
                                    <td>{{online_exam.questions_count}}</td>
                                    <td>{{online_exam.max_mark}}</td>
                                    <td v-if="hasNotAnyRole(['student','parent'])">
                                        <span v-if="online_exam.is_published"><i class="fas fa-check"></i></span>
                                        <span v-else><i class="fas fa-times"></i></span>
                                    </td>
                                    <td v-if="hasAnyRole(['student','parent'])">
                                        <span :class="['label', 'label-'+online_exam.status_detail.type]">{{online_exam.status_detail.text}}</span>
                                    </td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <router-link :to="`/online-exam/${online_exam.uuid}/questions`" class="btn btn-success btn-sm" v-if="hasPermission('edit-online-exam')" v-tooltip="trans('exam.manage_online_exam_questions')"><i class="fas fa-arrow-circle-right"></i></router-link>
                                            <router-link :to="`/online-exam/${online_exam.uuid}/exam`" class="btn btn-success btn-sm" v-if="hasAnyRole(['student']) && online_exam.status != 'upcoming'" v-tooltip="trans('general.view')"><i class="fas fa-arrow-circle-right"></i></router-link>
                                            <button class="btn btn-info btn-sm" v-if="hasPermission('edit-online-exam') && online_exam.is_editable" v-tooltip="trans('exam.edit_online_exam')" @click.prevent="editOnlineExam(online_exam)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" v-if="hasPermission('delete-online-exam') && online_exam.is_editable" :key="online_exam.id" v-confirm="{ok: confirmDelete(online_exam)}" v-tooltip="trans('exam.delete_schedule')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!online_exams.total" module="exam" title="online_exam_module_title" description="online_exam_module_description" icon="check-circle">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="hasPermission('create-online-exam')" @click="$router.push('/online-exam/create')"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="online_exams" @updateRecords="getOnlineExams"></pagination-record>
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
                online_exams: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'date',
                    order: 'desc',
                    name: '',
                    batch_id: [],
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'created_at',
                        translation: i18n.general.created_at
                    },
                    {
                        value: 'date',
                        translation: i18n.exam.online_exam_date
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
            if(!helper.hasPermission('list-online-exam')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getOnlineExams();
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            hasNotAnyRole(roles){
                return helper.hasNotAnyRole(roles);
            },
            hasAnyRole(roles) {
                return helper.hasAnyRole(roles);
            },
            getOnlineExams(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/online-exam?page=' + page + url)
                    .then(response => {
                        this.batches = response.filters.batches;
                        this.online_exams = response.online_exams;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editOnlineExam(online_exam){
                this.$router.push('/online-exam/'+online_exam.uuid+'/edit');
            },
            confirmDelete(online_exam){
                return dialog => this.deleteExam(online_exam);
            },
            deleteExam(online_exam){
                let loader = this.$loading.show();
                axios.delete('/api/online-exam/'+online_exam.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        this.getOnlineExams();
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
                axios.post('/api/online-exam/print',{filter: this.filter})
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
                axios.post('/api/online-exam/pdf',{filter: this.filter})
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
        },
        filters: {
          moment(date) {
            return helper.formatDate(date);
          },
          momentTime(time) {
            return helper.formatTime(time);
          },
          momentDateTime(date) {
            return helper.formatDateTime(date);
          }
        },
        watch: {
            'filter.sort_by': function(val){
                this.getOnlineExams();
            },
            'filter.order': function(val){
                this.getOnlineExams();
            },
            'filter.page_length': function(val){
                this.getOnlineExams();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>