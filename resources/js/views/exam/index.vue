<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('exam.exam')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="exams.total">{{trans('general.total_result_found',{count : exams.total, from: exams.from, to: exams.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="exams.total && !showCreatePanel && hasPermission('create-exam')" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('exam.add_new_exam')}}</span></button>
                        <button class="btn btn-info btn-sm" v-if="hasPermission('edit-exam') && exams.total" @click="showReorderModal = true" v-tooltip="trans('exam.reorder_exam')"><i class="fas fa-arrows-alt"></i> <span class="d-none d-sm-inline">{{trans('exam.reorder_exam')}}</span></button>
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
                        <help-button @clicked="help_topic = 'exam.exam'"></help-button>
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
                                    <label for="">{{trans('exam.exam_name')}}</label>
                                    <input class="form-control" type="text" v-model="filter.name" name="name" :placeholder="trans('exam.exam_name')">
                                </div>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getExams">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="fade" v-if="hasPermission('create-exam')">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('exam.add_new_exam')}}</h4>
                        <exam-form @completed="getExams" @cancel="showCreatePanel = !showCreatePanel"></exam-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="exams.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('exam.exam_name')}}</th>
                                    <th>{{trans('exam.term')}}</th>
                                    <th>{{trans('exam.exam_description')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="exam in exams.data">
                                    <td v-text="exam.name"></td>
                                    <td>
                                        {{exam.exam_term_id ? exam.term.name+' ('+exam.term.course_group.name+')' : ''}}
                                    </td>
                                    <td v-text="exam.description"></td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-info btn-sm" v-if="hasPermission('edit-exam')" v-tooltip="trans('exam.edit_exam')" @click.prevent="editExam(exam)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" v-if="hasPermission('delete-exam')" :key="exam.id" v-confirm="{ok: confirmDelete(exam)}" v-tooltip="trans('exam.delete_exam')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!exams.total" module="exam" title="exam_module_title" description="exam_module_description" icon="check-circle">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel && hasPermission('create-exam')" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="exams" @updateRecords="getExams"></pagination-record>
                </div>
            </div>
        </div>

        <transition name="modal" v-if="hasPermission('edit-exam') && showReorderModal">
            <div class="modal-mask">
                <div class="modal-wrapper">
                    <div class="modal-container modal-lg">
                        <div class="modal-header">
                            <slot name="header">
                                {{trans('exam.reorder_exam')}}
                                <span class="float-right pointer" @click="showReorderModal = false">x</span>
                            </slot>
                        </div>
                        <div class="modal-body">
                            <slot name="body">
                                <draggable v-model="list" @start="drag=true" @end="drag=false" class="list-group">
                                    <div class="list-group-item pointer" v-for="item in list" :key="item.id"><i class="fas fa-arrows-alt"></i> {{item}}</div>
                                </draggable>
                                <button type="button" class="btn btn-info pull-right m-t-10" @click="reorderExam">{{trans('general.save')}}</button>
                            </slot>
                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    import examForm from './form'

    export default {
        components : { examForm },
        data() {
            return {
                exams: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'position',
                    order: 'asc',
                    name: '',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'position',
                        translation: i18n.general.position
                    },
                    {
                        value: 'name',
                        translation: i18n.exam.exam_name
                    }
                ],
                showCreatePanel: false,
                showFilterPanel: false,
                showReorderModal: false,
                list:[],
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('list-exam')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getExams();
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getExams(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/exam?page=' + page + url)
                    .then(response => {
                        this.list = [];
                        this.exams = response;
                        this.exams.data.forEach(exam => {
                            this.list.push(exam.name);
                        })
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editExam(exam){
                this.$router.push('/exam/'+exam.id+'/edit');
            },
            confirmDelete(exam){
                return dialog => this.deleteExam(exam);
            },
            deleteExam(exam){
                let loader = this.$loading.show();
                axios.delete('/api/exam/'+exam.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getExams();
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
                axios.post('/api/exam/print',{filter: this.filter})
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
                axios.post('/api/exam/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            reorderExam(){
                axios.post('/api/exam/reorder',{list: this.list})
                    .then(response => {
                        toastr.success(response.message);
                        this.showReorderModal = false;
                        this.getExams();
                    })
                    .catch(error => {
                        helper.showErrorMsg(error);
                    })
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
                this.getExams();
            },
            'filter.order': function(val){
                this.getExams();
            },
            'filter.page_length': function(val){
                this.getExams();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>