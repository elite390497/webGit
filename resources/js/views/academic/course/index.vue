<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('academic.course')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="courses.total">{{trans('general.total_result_found',{count : courses.total, from: courses.from, to: courses.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="courses.total && !showCreatePanel && hasPermission('create-course')" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('academic.add_new_course')}}</span></button>
                        <button class="btn btn-info btn-sm" v-if="hasPermission('edit-course') && courses.total" @click="showReorderModal = true" v-tooltip="trans('academic.reorder_course')"><i class="fas fa-arrows-alt"></i> <span class="d-none d-sm-inline">{{trans('academic.reorder_course')}}</span></button>
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
                        <help-button @clicked="help_topic = 'academic.course'"></help-button>
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
                                    <v-select label="name" track-by="id" v-model="selected_course_groups" name="course_group_id" id="course_group_id" :options="course_groups" :placeholder="trans('academic.select_course_group')" @select="onCourseGroupSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onCourseGroupRemove" :selected="selected_course_groups">
                                        <div class="multiselect__option" slot="afterList" v-if="!course_groups.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                        </div>

                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getCourses">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="fade" v-if="hasPermission('create-course')">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('academic.add_new_course')}}</h4>
                        <course-form @completed="getCourses" @cancel="showCreatePanel = !showCreatePanel"></course-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="courses.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('academic.course_name')}}</th>
                                    <th>{{trans('academic.course_group')}}</th>
                                    <th>{{trans('academic.batch')}}</th>
                                    <th>{{trans('general.option')}}</th>
                                    <th>{{trans('academic.course_description')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="course in courses.data">
                                    <td v-text="course.name"></td>
                                    <td v-text="course.course_group.name"></td>
                                    <td>
                                        <ul style="list-style:none;padding:0;margin:0;">
                                            <li v-for="batch in course.batches">{{batch.name}}</li>
                                        </ul>
                                    </td>
                                    <td>
                                        <template v-if="course.options">
                                            <span class="badge badge-success" v-if="course.options.enable_registration">{{trans('student.registration_enabled')}}</span>
                                            <br />
                                            <span class="badge badge-success" v-if="course.options.enable_registration_fee">{{trans('student.registration_fee_enabled')}} ({{formatCurrency(course.options.registration_fee)}}) </span>
                                        </template>
                                        <template v-else>
                                            <span class="badge badge-success" v-if="getConfig('enable_registration')">{{trans('student.registration_enabled')}}</span>
                                            <br />
                                            <span class="badge badge-success" v-if="getConfig('enable_registration_fee')">{{trans('student.registration_fee_enabled')}} ({{formatCurrency(course.options.registration_fee)}}) </span>
                                        </template>
                                    </td>
                                    <td v-text="course.description"></td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button v-if="course.batches" class="btn btn-success btn-sm" v-tooltip="trans('academic.reorder_batch')" @click.prevent="showBatchReorderAction(course)"><i class="fas fa-arrows-alt"></i></button>
                                            <button class="btn btn-info btn-sm" v-if="hasPermission('edit-course')" v-tooltip="trans('academic.edit_course')" @click.prevent="editCourse(course)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" v-if="hasPermission('delete-course')" :key="course.id" v-confirm="{ok: confirmDelete(course)}" v-tooltip="trans('academic.delete_course')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!courses.total" module="academic" title="course_module_title" description="course_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel && hasPermission('create-course')" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="courses" @updateRecords="getCourses"></pagination-record>
                </div>
            </div>
        </div>

        <transition name="modal" v-if="hasPermission('edit-course') && showReorderModal">
            <div class="modal-mask">
                <div class="modal-wrapper">
                    <div class="modal-container modal-lg">
                        <div class="modal-header">
                            <slot name="header">
                                {{trans('academic.reorder_course')}}
                                <span class="float-right pointer" @click="showReorderModal = false">x</span>
                            </slot>
                        </div>
                        <div class="modal-body">
                            <slot name="body">
                                <draggable v-model="list" @start="drag=true" @end="drag=false" class="list-group">
                                    <div class="list-group-item pointer" v-for="item in list" :key="item.id"><i class="fas fa-arrows-alt"></i> {{item}}</div>
                                </draggable>
                                <button type="button" class="btn btn-info pull-right m-t-10" @click="reorderCourse">{{trans('general.save')}}</button>
                            </slot>
                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <transition name="modal" v-if="hasPermission('edit-course') && showBatchReorderModal">
            <div class="modal-mask">
                <div class="modal-wrapper">
                    <div class="modal-container modal-lg">
                        <div class="modal-header">
                            <slot name="header">
                                {{trans('academic.reorder_batch')}}
                                <span class="float-right pointer" @click="showBatchReorderModal = false">x</span>
                            </slot>
                        </div>
                        <div class="modal-body">
                            <slot name="body">
                                <draggable v-model="batch_list" @start="drag=true" @end="drag=false" class="list-group">
                                    <div class="list-group-item pointer" v-for="item in batch_list" :key="item.id"><i class="fas fa-arrows-alt"></i> {{item}}</div>
                                </draggable>
                                <button type="button" class="btn btn-info pull-right m-t-10" @click="reorderBatch">{{trans('general.save')}}</button>
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
    import courseForm from './form'

    export default {
        components : { courseForm },
        data() {
            return {
                courses: {
                    total: 0,
                    data: []
                },
                course: {},
                filter: {
                    sort_by : 'position',
                    order: 'asc',
                    course_group_id: [],
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'position',
                        translation: i18n.academic.course_order
                    },
                    {
                        value: 'name',
                        translation: i18n.academic.course_name
                    }
                ],
                course_groups: [],
                selected_course_groups: null,
                showFilterPanel: false,
                showCreatePanel: false,
                showReorderModal: false,
                showBatchReorderModal: false,
                list: [],
                batch_list: [],
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('list-course')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getCourses();
            helper.showDemoNotification(['academic']);
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            showBatchReorderAction(course){
                this.showBatchReorderModal = true;
                this.getBatchList(course);
            },
            getBatchList(course){
                this.batch_list = [];
                this.course = course;
                course.batches.forEach(batch => {
                    this.batch_list.push(batch.name);
                })
            },
            getCourses(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/course?page=' + page + url)
                    .then(response => {
                        this.list = [];
                        this.courses = response.courses;
                        this.course_groups = response.filters.course_groups;
                        this.courses.data.forEach(course_group => {
                            this.list.push(course_group.name);
                        })
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editCourse(course){
                this.$router.push('/academic/course/'+course.id+'/edit');
            },
            confirmDelete(course){
                return dialog => this.deleteCourse(course);
            },
            deleteCourse(course){
                let loader = this.$loading.show();
                axios.delete('/api/course/'+course.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getCourses();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getConfig(config){
                return helper.getConfig(config);
            },
            formatCurrency(price){
                return helper.formatCurrency(price);
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/course/print',{filter: this.filter})
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
                axios.post('/api/course/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onCourseGroupSelect(selectedOption){
                this.filter.course_group_id.push(selectedOption.id);
            },
            onCourseGroupRemove(removedOption){
                this.filter.course_group_id.splice(this.filter.course_group_id.indexOf(removedOption.id), 1);
            },
            reorderCourse(){
                axios.post('/api/course/reorder',{list: this.list})
                    .then(response => {
                        toastr.success(response.message);
                        this.showReorderModal = false;
                        this.getCourses();
                    })
                    .catch(error => {
                        helper.showErrorMsg(error);
                    })
            },
            reorderBatch(){
                axios.post('/api/course/'+this.course.id+'/batch/reorder',{list: this.batch_list})
                    .then(response => {
                        toastr.success(response.message);
                        this.showBatchReorderModal = false;
                        this.getCourses();
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
                this.getCourses();
            },
            'filter.order': function(val){
                this.getCourses();
            },
            'filter.page_length': function(val){
                this.getCourses();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>