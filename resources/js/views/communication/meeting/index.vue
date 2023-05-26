<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('communication.meeting')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="meetings.total">{{trans('general.total_result_found',{count : meetings.total, from: meetings.from, to: meetings.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="meetings.total && !showCreatePanel && hasPermission('create-meeting')" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('communication.add_new_meeting')}}</span></button>
                        <button class="btn btn-info btn-sm" v-if="!showFilterPanel" @click="showFilterPanel = !showFilterPanel"><i class="fas fa-filter"></i> <span class="d-none d-sm-inline">{{trans('general.filter')}}</span></button>
                        <sort-by :order-by-options="orderByOptions" :sort-by="filter.sort_by" :order="filter.order" @updateSortBy="value => {filter.sort_by = value}"  @updateOrder="value => {filter.order = value}"></sort-by>
                        <!-- <div class="btn-group">
                            <button type="button" class="btn btn-info btn-sm dropdown-toggle no-caret " role="menu" id="moreOption" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-tooltip="trans('general.more_option')">
                                <i class="fas fa-ellipsis-h"></i> <span class="d-none d-sm-inline"></span>
                            </button>
                            <div :class="['dropdown-menu',getConfig('direction') == 'ltr' ? 'dropdown-menu-right' : '']" aria-labelledby="moreOption">
                                <button class="dropdown-item custom-dropdown" @click="print"><i class="fas fa-print"></i> {{trans('general.print')}}</button>
                                <button class="dropdown-item custom-dropdown" @click="pdf"><i class="fas fa-file-pdf"></i> {{trans('general.generate_pdf')}}</button>
                            </div>
                        </div> -->
                        <help-button @clicked="help_topic = 'meeting'"></help-button>
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
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('academic.course')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_courses" group-values="courses" group-label="course_group" :group-select="false" name="course_id" id="course_id" :options="courses" :placeholder="trans('academic.select_course')" @select="onCourseSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onCourseRemove" :selected="selected_courses">
                                        <div class="multiselect__option" slot="afterList" v-if="!courses.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('academic.batch')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_batches" group-values="batches" group-label="course_group" :group-select="false" name="batch_id" id="batch_id" :options="batches" :placeholder="trans('academic.select_batch')" @select="onBatchSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onBatchRemove" :selected="selected_batches">
                                        <div class="multiselect__option" slot="afterList" v-if="!batches.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('employee.department')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_departments" name="department_id" id="department_id" :options="departments" :placeholder="trans('employee.select_department')" @select="onDepartmentSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onDepartmentRemove" :selected="selected_departments">
                                        <div class="multiselect__option" slot="afterList" v-if="!departments.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('employee.category')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_employee_categories" name="employee_category_id" id="employee_category_id" :options="employee_categories" :placeholder="trans('employee.select_category')" @select="onEmployeeCategorySelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onEmployeeCategoryRemove" :selected="selected_employee_categories">
                                        <div class="multiselect__option" slot="afterList" v-if="!employee_categories.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('communication.meeting_keyword')}}</label>
                                    <input class="form-control" name="keyword" v-model="filter.keyword">
                                </div>
                            </div>
                        </div>

                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getMeetings">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="fade" v-if="hasPermission('create-meeting')">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('communication.add_new_meeting')}}</h4>
                        <meeting-form @completed="getMeetings" @cancel="showCreatePanel = !showCreatePanel"></meeting-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">

                    <p class="alert alert-info m-4" v-if="isDemo">{{trans('communication.demo_mode_meeting_description')}}</p>

                    <div class="table-responsive" v-if="meetings.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('communication.meeting_title')}}</th>
                                    <th>{{trans('communication.meeting_duration')}}</th>
                                    <th>{{trans('communication.meeting_audience')}}</th>
                                    <th>{{trans('communication.meeting_created_by')}}</th>
                                    <th>{{trans('general.created_at')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="meeting in meetings.data">
                                    <td>
                                        {{meeting.title}}
                                        <span v-if="meeting.is_live" class="badge badge-success">{{trans('communication.live')}}</span>

                                        <span v-if="meeting.is_expired" class="badge badge-danger">{{trans('communication.expired')}}</span>
                                    </td>
                                    <td>
                                        {{meeting.date | moment}} <span v-if="meeting.start_time">{{meeting.start_time | momentTime }}</span> 
                                        <span v-if="meeting.end_time"> {{trans('general.to')}} 
                                        {{meeting.end_time | momentTime }}</span>
                                    </td>
                                    <td>
                                        <meeting-audience :meeting="meeting" />
                                    </td>
                                    <td>{{getEmployeeName(meeting.user.employee)}} <br > {{getEmployeeDesignationOnDate(meeting.user.employee, meeting.date)}}</td>
                                    <td>{{meeting.created_at | momentDateTime}}</td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-success btn-sm" v-tooltip="trans('general.view_detail')" @click.prevent="showMeeting(meeting)"><i class="fas fa-arrow-circle-right"></i></button>
                                            <button class="btn btn-info btn-sm" v-if="hasPermission('edit-meeting')" v-tooltip="trans('communication.edit_meeting')" @click.prevent="editMeeting(meeting)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" v-if="hasPermission('delete-meeting')" :key="meeting.id" v-confirm="{ok: confirmDelete(meeting)}" v-tooltip="trans('communication.delete_meeting')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!meetings.total" module="communication" title="meeting_module_title" description="meeting_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel && hasPermission('create-meeting')" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="meetings" @updateRecords="getMeetings"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    import meetingForm from './form'
    import meetingAudience from './audience'

    export default {
        components : { meetingForm, meetingAudience},
        data() {
            return {
                meetings: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'date',
                    order: 'desc',
                    keyword: '',
                    course_id: [],
                    batch_id: [],
                    department_id: [],
                    employee_category_id: [],
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'created_at',
                        translation: i18n.general.created_at
                    },
                    {
                        value: 'date',
                        translation: i18n.communication.meeting_date
                    },
                    {
                        value: 'title',
                        translation: i18n.communication.meeting_title
                    }
                ],
                courses: [],
                selected_courses: null,
                batches: [],
                selected_batches: null,
                departments: [],
                selected_departments: null,
                employee_categories: [],
                selected_employee_categories: null,
                showFilterPanel: false,
                showCreatePanel: false,
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('list-meeting')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getMeetings();
            helper.showDemoNotification(['communication']);
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getEmployeeName(employee){
                return helper.getEmployeeName(employee);
            },
            getEmployeeDesignationOnDate(employee, date){
                return helper.getEmployeeDesignationOnDate(employee, date);
            },
            getMeetings(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/meeting?page=' + page + url)
                    .then(response => {
                        this.meetings = response.meetings;
                        this.courses = response.filters.courses;
                        this.batches = response.filters.batches;
                        this.departments = response.filters.departments;
                        this.employee_categories = response.filters.employee_categories;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            showMeeting(meeting){
                this.$router.push('/communication/meeting/'+meeting.uuid);
            },
            editMeeting(meeting){
                this.$router.push('/communication/meeting/'+meeting.uuid+'/edit');
            },
            confirmDelete(meeting){
                return dialog => this.deleteMeeting(meeting);
            },
            deleteMeeting(meeting){
                let loader = this.$loading.show();
                axios.delete('/api/meeting/'+meeting.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        this.getMeetings();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getConfig(config) {
                return helper.getConfig(config)
            },
            onCourseSelect(selectedOption){
                this.filter.course_id.push(selectedOption.id);
            },
            onCourseRemove(removedOption){
                this.filter.course_id.splice(this.filter.course_id.indexOf(removedOption.id), 1);
            },
            onBatchSelect(selectedOption){
                this.filter.batch_id.push(selectedOption.id);
            },
            onBatchRemove(removedOption){
                this.filter.batch_id.splice(this.filter.batch_id.indexOf(removedOption.id), 1);
            },
            onDepartmentSelect(selectedOption){
                this.filter.department_id.push(selectedOption.id);
            },
            onDepartmentRemove(removedOption){
                this.filter.department_id.splice(this.filter.department_id.indexOf(removedOption.id), 1);
            },
            onEmployeeCategorySelect(selectedOption){
                this.filter.employee_category_id.push(selectedOption.id);
            },
            onEmployeeCategoryRemove(removedOption){
                this.filter.employee_category_id.splice(this.filter.employee_category_id.indexOf(removedOption.id), 1);
            }
        },
        filters: {
          moment(date) {
            return helper.formatDate(date);
          },
          momentDateTime(date) {
            return helper.formatDateTime(date);
          },
          momentTime(time) {
            return helper.formatTime(time);
          }
        },
        watch: {
            'filter.sort_by': function(val){
                this.getMeetings();
            },
            'filter.order': function(val){
                this.getMeetings();
            },
            'filter.page_length': function(val){
                this.getMeetings();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            },
            isDemo() {
                return ! helper.getConfig('mode') ? true : false;
            }
        }
    }
</script>