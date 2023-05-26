<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('exam.assessment')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="assessments.total">{{trans('general.total_result_found',{count : assessments.total, from: assessments.from, to: assessments.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/configuration/exam/assessment/create')" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('exam.add_new_assessment')}}</span></button>
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
                        <help-button @clicked="help_topic = 'configuration.exam.assessment'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="assessments.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('exam.assessment_name')}}</th>
                                    <th>{{trans('exam.assessment_type')}}</th>
                                    <th>{{trans('exam.assessment_description')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="assessment in assessments.data">
                                    <td v-text="assessment.name"></td>
                                    <td>
                                        <ul style="list-style:none;padding:0;margin:0;">
                                            <li v-for="detail in assessment.details">
                                                {{detail.name}} ({{trans('exam.assessment_detail', {max_mark: detail.max_mark, pass_percentage: detail.pass_percentage})}})
                                            </li>
                                        </ul>
                                    </td>
                                    <td v-text="assessment.description"></td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button v-if="assessment.details" class="btn btn-success btn-sm" v-tooltip="trans('exam.reorder_assessment')" @click.prevent="showReorderAction(assessment)"><i class="fas fa-arrows-alt"></i></button>
                                            <button class="btn btn-info btn-sm" v-tooltip="trans('exam.edit_assessment')" @click.prevent="editAssessment(assessment)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" :key="assessment.id" v-confirm="{ok: confirmDelete(assessment)}" v-tooltip="trans('exam.delete_assessment')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!assessments.total" module="exam" title="assessment_module_title" description="assessment_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" @click="$router.push('/configuration/exam/assessment/create')"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="assessments" @updateRecords="getAssessments" @change.native="getAssessments"></pagination-record>
                </div>
            </div>
        </div>

        <transition name="modal" v-if="showReorderModal">
            <div class="modal-mask">
                <div class="modal-wrapper">
                    <div class="modal-container modal-lg">
                        <div class="modal-header">
                            <slot name="header">
                                {{trans('exam.reorder_assessment')}}
                                <span class="float-right pointer" @click="showReorderModal = false">x</span>
                            </slot>
                        </div>
                        <div class="modal-body">
                            <slot name="body">
                                <draggable v-model="assessment_detail_list" @start="drag=true" @end="drag=false" class="list-group">
                                    <div class="list-group-item pointer" v-for="item in assessment_detail_list" :key="item.id"><i class="fas fa-arrows-alt"></i> {{item}}</div>
                                </draggable>
                                <button type="button" class="btn btn-info pull-right m-t-10" @click="reorderAssessment">{{trans('general.save')}}</button>
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
    import assessmentForm from './form'
    import draggable from 'vuedraggable'

    export default {
        components : { assessmentForm,draggable },
        data() {
            return {
                assessments: {
                    total: 0,
                    data: []
                },
                assessment: {},
                filter: {
                    sort_by: 'name',
                    order: 'asc',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'name',
                        translation: i18n.exam.assessment_name
                    }
                ],
                showReorderModal: false,
                assessment_detail_list: [],
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('access-configuration')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getAssessments();
        },
        methods: {
            getConfig(config){
                return helper.getConfig(config);
            },
            showReorderAction(course){
                this.showReorderModal = true;
                this.getAssessmentDetailList(course);
            },
            getAssessmentDetailList(assessment){
                this.assessment_detail_list = [];
                this.assessment = assessment;
                assessment.details.forEach(detail => {
                    this.assessment_detail_list.push(detail.name);
                })
            },
            getAssessments(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/exam/assessment?page=' + page + url)
                    .then(response => {
                        this.assessments = response;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editAssessment(assessment){
                this.$router.push('/configuration/exam/assessment/'+assessment.id+'/edit');
            },
            confirmDelete(assessment){
                return dialog => this.deleteAssessment(assessment);
            },
            deleteAssessment(assessment){
                let loader = this.$loading.show();
                axios.delete('/api/exam/assessment/'+assessment.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getAssessments();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/exam/assessment/print',{filter: this.filter})
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
                axios.post('/api/exam/assessment/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            reorderAssessment(){
                axios.post('/api/exam/assessment/'+this.assessment.id+'/reorder',{list: this.assessment_detail_list})
                    .then(response => {
                        toastr.success(response.message);
                        this.showReorderModal = false;
                        this.getAssessments();
                    })
                    .catch(error => {
                        helper.showErrorMsg(error);
                    })
            }
        },
        filters: {
          momentDateTime(date) {
            return helper.formatDateTime(date);
          }
        },
        watch: {
            'filter.sort_by': function(val){
                this.getAssessments();
            },
            'filter.order': function(val){
                this.getAssessments();
            },
            'filter.page_length': function(val){
                this.getAssessments();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>
