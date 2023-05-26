<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('resource.lesson_plan')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="lesson_plans.total">{{trans('general.total_result_found',{count : lesson_plans.total, from: lesson_plans.from, to: lesson_plans.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="lesson_plans.total && hasPermission('create-lesson-plan')" @click="$router.push('/resource/lesson/plan/create')" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('resource.add_new_lesson_plan')}}</span></button>
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
                        <help-button @clicked="help_topic = 'resource.lesson_plan'"></help-button>
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
                                    <label for="">{{trans('academic.batch')}}</label>
                                    <v-select label="name" track-by="id" group-values="batches" group-label="course_group" :group-select="false" v-model="selected_batches" name="batch_id" id="batch_id" :options="batches" :placeholder="trans('academic.select_batch')" @select="onBatchSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onBatchRemove" :selected="selected_batches">
                                        <div class="multiselect__option" slot="afterList" v-if="!batches.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('resource.lesson_plan_topic')}}</label>
                                    <input class="form-control" name="topic" v-model="filter.topic">
                                </div>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getLessonPlans">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="lesson_plans.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('academic.subject')}}</th>
                                    <th>{{trans('academic.batch')}}</th>
                                    <th>{{trans('resource.lesson_plan_topic')}}</th>
                                    <th>{{trans('resource.lesson_plan_start_date')}}</th>
                                    <th>{{trans('resource.lesson_plan_end_date')}}</th>
                                    <th>{{trans('resource.lesson_plan_created_by')}}</th>
                                    <th>{{trans('general.created_at')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="lesson_plan in lesson_plans.data">
                                    <td v-text="lesson_plan.subject.name+' ('+lesson_plan.subject.code+')'"></td>
                                    <td v-text="lesson_plan.subject.batch.course.name+' '+lesson_plan.subject.batch.name"></td>
                                    <td v-text="lesson_plan.topic"></td>
                                    <td>{{lesson_plan.start_date | moment}}</td>
                                    <td>{{lesson_plan.end_date | moment}}</td>
                                    <td>{{getEmployeeName(lesson_plan.employee)}} <br > {{getEmployeeDesignationOnDate(lesson_plan.employee, lesson_plan.start_date)}}</td>
                                    <td>{{lesson_plan.created_at | momentDateTime}}</td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <a target="_blank" :href="`/resource/lesson/plan/${lesson_plan.uuid}/print?token=${authToken}`" v-tooltip="trans('general.print')" class="btn btn-secondary btn-sm">
                                                <i class="fas fa-print"></i>
                                            </a>
                                            <button class="btn btn-success btn-sm" v-tooltip="trans('resource.view_lesson_plan')" @click.prevent="showAction(lesson_plan)"><i class="fas fa-arrow-circle-right"></i></button>
                                            <button class="btn btn-info btn-sm" v-if="hasPermission('edit-lesson-plan')" v-tooltip="trans('resource.edit_lesson_plan')" @click.prevent="editLessonPlan(lesson_plan)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" v-if="hasPermission('delete-lesson-plan')" :key="lesson_plan.id" v-confirm="{ok: confirmDelete(lesson_plan)}" v-tooltip="trans('resource.delete_lesson_plan')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!lesson_plans.total" module="resource" title="lesson_plan_module_title" description="lesson_plan_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="hasPermission('create-lesson-plan')" @click="$router.push('/resource/lesson/plan/create')"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="lesson_plans" @updateRecords="getLessonPlans"></pagination-record>
                </div>
            </div>
        </div>
        <lesson-plan-detail v-if="showModal" @close="showModal = false" :uuid="showUuid"></lesson-plan-detail>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    import lessonPlanForm from './form'
    import lessonPlanDetail from './show'

    export default {
        components : { lessonPlanForm,lessonPlanDetail},
        data() {
            return {
                lesson_plans: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'start_date',
                    order: 'desc',
                    topic: '',
                    batch_id: [],
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'start_date',
                        translation: i18n.resource.lesson_plan_start_date
                    },
                    {
                        value: 'topic',
                        translation: i18n.resource.lesson_plan_topic
                    }
                ],
                batches: [],
                selected_batches: null,
                showFilterPanel: false,
                showCreatePanel: false,
                help_topic: '',
                showUuid: '',
                showModal: false
            };
        },
        mounted(){
            if(!helper.hasPermission('list-lesson-plan')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getLessonPlans();
            helper.showDemoNotification(['resource']);
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            showAction(lesson_plan){
                this.showUuid = lesson_plan.uuid;
                this.showModal = true;
            },
            getEmployeeName(employee){
                return helper.getEmployeeName(employee);
            },
            getEmployeeDesignationOnDate(employee, date){
                return helper.getEmployeeDesignationOnDate(employee, date);
            },
            getLessonPlans(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/lesson/plan?page=' + page + url)
                    .then(response => {
                        this.lesson_plans = response.lesson_plans;
                        this.batches = response.filters.batches;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editLessonPlan(lesson_plan){
                this.$router.push('/resource/lesson/plan/'+lesson_plan.uuid+'/edit');
            },
            confirmDelete(lesson_plan){
                return dialog => this.deleteLessonPlan(lesson_plan);
            },
            deleteLessonPlan(lesson_plan){
                let loader = this.$loading.show();
                axios.delete('/api/lesson/plan/'+lesson_plan.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        this.getLessonPlans();
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
                axios.post('/api/lesson/plan/print',{filter: this.filter})
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
                axios.post('/api/lesson/plan/pdf',{filter: this.filter})
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
                this.getLessonPlans();
            },
            'filter.order': function(val){
                this.getLessonPlans();
            },
            'filter.page_length': function(val){
                this.getLessonPlans();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>