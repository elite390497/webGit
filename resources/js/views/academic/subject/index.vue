<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('academic.batch_wise_subject')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="batches.total">{{trans('general.total_result_found',{count : batches.total, from: batches.from, to: batches.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="batches.total && !showCreatePanel && hasPermission('create-subject')" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('academic.add_new_subject')}}</span></button>
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
                        <help-button @clicked="help_topic = 'academic.subject'"></help-button>
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
                            <div class="col-12 col-sm-4">
                                <div class="form-group">
                                    <v-select label="name" track-by="id" group-values="courses" group-label="course_group" :group-select="false" v-model="selected_courses" name="course_id" id="course_id" :options="courses" :placeholder="trans('academic.select_course')" @select="onCourseSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onCourseRemove" :selected="selected_courses">
                                        <div class="multiselect__option" slot="afterList" v-if="!courses.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                        </div>

                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getSubjects">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="fade" v-if="hasPermission('create-subject')">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('academic.add_new_subject')}}</h4>
                        <subject-form @completed="getSubjects" @cancel="showCreatePanel = !showCreatePanel"></subject-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="batches.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('academic.course')}}</th>
                                    <th>{{trans('academic.batch')}}</th>
                                    <th>{{trans('academic.subject')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="batch in batches.data">
                                    <td>
                                        {{batch.course.name}} <br />
                                        <div class="dropdown" v-if="hasPermission('edit-subject')">
                                            <button type="button" class="btn btn-info btn-sm" href="#" role="button" id="moreSubOption" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-tooltip="trans('general.option')">
                                                <i class="fas fa-ellipsis-h"></i>
                                            </button>
                                            <div :class="['dropdown-menu',getConfig('direction') == 'ltr' ? 'dropdown-menu-right' : '']" aria-labelledby="moreSubOption">
                                                <button class="dropdown-item custom-dropdown" v-if="hasPermission('edit-subject')" :key="`reorder_${batch.id}`" v-tooltip="trans('academic.reorder_subject')" @click.prevent="showReorderAction(batch)"><i class="fas fa-arrows-alt"></i> {{trans('academic.reorder_subject')}}</button>
                                                <button class="dropdown-item custom-dropdown" v-if="hasPermission('create-subject')" :key="`copy_${batch.id}`" v-confirm="{ok: confirmCopyBatchSubject(batch)}" v-tooltip="trans('academic.copy_batch_subjects')"><i class="fas fa-copy"></i> {{trans('general.copy')}}</button>
                                                <button class="dropdown-item custom-dropdown" v-if="hasPermission('delete-subject')" :key="`delete_${batch.id}`" v-confirm="{ok: confirmDeleteBatchSubject(batch)}" v-tooltip="trans('academic.delete_batch_subjects')"><i class="fas fa-trash"></i> {{trans('general.delete')}}</button>
                                            </div>
                                        </div>
                                    </td>
                                    <td v-text="batch.name"></td>
                                    <td>
                                        <div class="table-responsive" v-if="batch.subjects">
                                            <table class="table table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>{{trans('academic.subject_name')}}</th>
                                                        <th>{{trans('academic.subject_code')}}</th>
                                                        <th>{{trans('academic.subject_max_class_per_week')}}</th>
                                                        <th>{{trans('academic.subject_is_elective')}}</th>
                                                        <th>{{trans('academic.subject_has_no_exam')}}</th>
                                                        <th class="table-option">{{trans('general.action')}}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="subject in batch.subjects">
                                                        <td v-text="subject.name"></td>
                                                        <td>
                                                            {{subject.code}} <span v-if="subject.shortcode">({{subject.shortcode}})</span>
                                                        </td>
                                                        <td v-text="subject.max_class_per_week"></td>
                                                        <td v-html="getElectiveData(subject)"></td>
                                                        <td v-html="getExamData(subject)"></td>
                                                        <td class="table-option">
                                                            <div class="btn-group">
                                                                <button class="btn btn-info btn-xs" v-if="hasPermission('edit-subject')" v-tooltip="trans('academic.edit_subject')" @click.prevent="editSubject(subject)"><i class="fas fa-edit"></i></button>
                                                                <button class="btn btn-danger btn-xs" v-if="hasPermission('delete-subject')" :key="subject.id" v-confirm="{ok: confirmDelete(subject)}" v-tooltip="trans('academic.delete_subject')"><i class="fas fa-trash"></i></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!batches.total" module="academic" title="subject_module_title" description="subject_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel && hasPermission('create-subject')" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="batches" @updateRecords="getSubjects"></pagination-record>
                </div>
            </div>
        </div>

        <transition name="modal" v-if="hasPermission('edit-subject') && showReorderModal">
            <div class="modal-mask">
                <div class="modal-wrapper">
                    <div class="modal-container modal-lg">
                        <div class="modal-header">
                            <slot name="header">
                                {{trans('academic.reorder_subject')}}
                                <span class="float-right pointer" @click="showReorderModal = false">x</span>
                            </slot>
                        </div>
                        <div class="modal-body">
                            <slot name="body">
                                <draggable v-model="subject_list" @start="drag=true" @end="drag=false" class="list-group">
                                    <div class="list-group-item pointer" v-for="item in subject_list" :key="item.id"><i class="fas fa-arrows-alt"></i> {{item}}</div>
                                </draggable>
                                <button type="button" class="btn btn-info pull-right m-t-10" @click="reorderSubject">{{trans('general.save')}}</button>
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
    import subjectForm from './form'

    export default {
        components : { subjectForm },
        data() {
            return {
                batches: {
                    total: 0,
                    data: []
                },
                batch: {},
                batch_id: null,
                filter: {
                    sort_by : 'name',
                    order: 'asc',
                    course_id: [],
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'name',
                        translation: i18n.academic.subject_name
                    }
                ],
                courses: [],
                selected_courses: null,
                showFilterPanel: false,
                showCreatePanel: false,
                subject_list: [],
                showReorderModal: false,
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('list-subject')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getSubjects();
            helper.showDemoNotification(['academic']);
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            showReorderAction(batch){
                this.showReorderModal = true;
                this.getSubjectList(batch);
            },
            getSubjectList(batch){
                this.subject_list = [];
                this.batch = batch;
                batch.subjects.forEach(batch => {
                    this.subject_list.push(batch.name);
                })
            },
            getSubjects(page){
                let loader = this.$loading.show();
                this.batch_id = null;
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/subject?page=' + page + url)
                    .then(response => {
                        this.batches = response.batches;
                        this.courses = response.filters.courses;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editSubject(subject){
                this.$router.push('/academic/subject/'+subject.id+'/edit');
            },
            confirmDelete(subject){
                return dialog => this.deleteSubject(subject);
            },
            deleteSubject(subject){
                let loader = this.$loading.show();
                axios.delete('/api/subject/'+subject.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getSubjects();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            confirmCopyBatchSubject(batch){
                return dialog => this.copySubject(batch);
            },
            copySubject(batch){
                let loader = this.$loading.show();
                axios.post('/api/subject/'+batch.id+'/copy')
                    .then(response => {
                        toastr.success(response.message);
                        this.getSubjects();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            confirmDeleteBatchSubject(batch){
                return dialog => this.deleteBatchSubject(batch);
            },
            deleteBatchSubject(batch){
                axios.delete('/api/subject/'+batch.id+'/delete')
                    .then(response => {
                        toastr.success(response.message);
                        this.getSubjects();
                    }).catch(error => {
                        helper.showErrorMsg(error);
                    });
            },
            getConfig(config){
                return helper.getConfig(config);
            },
            getElectiveData(subject){
                return subject.is_elective ? '<i class="fas fa-check"></i>' : '<i class="fas fa-times"></i>';
            },
            getExamData(subject){
                return subject.has_no_exam ? '<i class="fas fa-check"></i>' : '<i class="fas fa-times"></i>';
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/subject/print',{filter: this.filter})
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
                axios.post('/api/subject/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onCourseSelect(selectedOption){
                this.filter.course_id.push(selectedOption.id);
            },
            onCourseRemove(removedOption){
                this.filter.course_id.splice(this.filter.course_id.indexOf(removedOption.id), 1);
            },
            reorderSubject(){
                axios.post('/api/batch/'+this.batch.id+'/subject/reorder',{list: this.subject_list})
                    .then(response => {
                        toastr.success(response.message);
                        this.showReorderModal = false;
                        this.getSubjects();
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
                this.getSubjects();
            },
            'filter.order': function(val){
                this.getSubjects();
            },
            'filter.page_length': function(val){
                this.getSubjects();
            }
        }
    }
</script>