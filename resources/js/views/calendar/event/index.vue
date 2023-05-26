<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('calendar.event')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="events.total">{{trans('general.total_result_found',{count : events.total, from: events.from, to: events.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="events.total && !showCreatePanel && hasPermission('create-event')" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('calendar.add_new_event')}}</span></button>
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
                        <help-button @clicked="help_topic = 'event'"></help-button>
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
                                    <label for="">{{trans('calendar.event_type')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_event_types" name="event_type_id" id="event_type_id" :options="event_types" :placeholder="trans('calendar.select_event_type')" @select="onEventTypeSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onEventTypeRemove" :selected="selected_event_types">
                                        <div class="multiselect__option" slot="afterList" v-if="!event_types.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
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
                                    <label for="">{{trans('calendar.event_keyword')}}</label>
                                    <input class="form-control" name="keyword" v-model="filter.keyword">
                                </div>
                            </div>
                        </div>

                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getEvents">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="fade" v-if="hasPermission('create-event')">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('calendar.add_new_event')}}</h4>
                        <event-form @completed="getEvents" @cancel="showCreatePanel = !showCreatePanel"></event-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="events.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('calendar.event_type')}}</th>
                                    <th>{{trans('calendar.event_title')}}</th>
                                    <th>{{trans('calendar.event_venue')}}</th>
                                    <th>{{trans('calendar.event_duration')}}</th>
                                    <th>{{trans('calendar.event_audience')}}</th>
                                    <th>{{trans('calendar.event_posted_by')}}</th>
                                    <th>{{trans('general.created_at')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="event in events.data">
                                    <td v-text="event.event_type.name"></td>
                                    <td v-text="event.title"></td>
                                    <td v-text="event.venue"></td>
                                    <td>
                                        {{event.start_date | moment}} <span v-if="event.start_time">{{event.start_time | momentTime }}</span> <br /> {{trans('general.to')}}  <br />
                                        {{event.end_date | moment}} <span v-if="event.end_time">{{event.end_time | momentTime }}</span>
                                    </td>
                                    <td>
                                        <span v-if="event.audience == 'everyone'">{{trans('calendar.event_for_everyone')}}</span>
                                        <template v-if="event.audience == 'selected_course'">
                                            {{trans('academic.course')}} <br />
                                            <ul style="list-style:none;padding:0;margin:0;">
                                                <li v-for="course in event.courses">{{course.name+'('+course.course_group.name+')'}}</li>
                                            </ul>
                                        </template>
                                        <template v-else-if="event.audience == 'selected_batch'">
                                            {{trans('academic.batch')}} <br />
                                            <ul style="list-style:none;padding:0;margin:0;">
                                                <li v-for="batch in event.batches">{{batch.name+'('+batch.course.name+')'}}</li>
                                            </ul>
                                        </template>
                                        <template v-else-if="event.audience == 'selected_department'">
                                            {{trans('employee.department')}} <br />
                                            <ul style="list-style:none;padding:0;margin:0;">
                                                <li v-for="department in event.departments">{{department.name}}</li>
                                            </ul>
                                        </template>
                                        <template v-else-if="event.audience == 'selected_employee_category'">
                                            {{trans('employee.category')}} <br />
                                            <ul style="list-style:none;padding:0;margin:0;">
                                                <li v-for="employee_category in event.employee_categorys">{{employee_category.name}}</li>
                                            </ul>
                                        </template>
                                    </td>
                                    <td>{{getEmployeeName(event.user.employee)}} <br > {{getEmployeeDesignationOnDate(event.user.employee, event.start_date)}}</td>
                                    <td>{{event.created_at | momentDateTime}}</td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-success btn-sm" v-tooltip="trans('general.view_detail')" @click.prevent="showAction(event)"><i class="fas fa-arrow-circle-right"></i></button>
                                            <button class="btn btn-info btn-sm" v-if="hasPermission('edit-event')" v-tooltip="trans('calendar.edit_event')" @click.prevent="editEvent(event)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" v-if="hasPermission('delete-event')" :key="event.id" v-confirm="{ok: confirmDelete(event)}" v-tooltip="trans('calendar.delete_event')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!events.total" module="calendar" title="event_module_title" description="event_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel && hasPermission('create-event')" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="events" @updateRecords="getEvents"></pagination-record>
                </div>
            </div>
        </div>
        <event-detail v-if="showModal" @close="showModal = false" :uuid="showUuid"></event-detail>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    import eventForm from './form'
    import eventDetail from './show'

    export default {
        components : { eventForm,eventDetail},
        data() {
            return {
                events: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'start_date',
                    order: 'desc',
                    keyword: '',
                    event_type_id: [],
                    course_id: [],
                    batch_id: [],
                    department_id: [],
                    employee_category_id: [],
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'start_date',
                        translation: i18n.calendar.event_start_date
                    },
                    {
                        value: 'end_date',
                        translation: i18n.calendar.event_end_date
                    },
                    {
                        value: 'title',
                        translation: i18n.calendar.event_title
                    }
                ],
                event_types: [],
                selected_event_types: null,
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
                help_topic: '',
                showUuid: '',
                showModal: false
            };
        },
        mounted(){
            if(!helper.hasPermission('list-event')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getEvents();
            helper.showDemoNotification(['calendar']);
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            showAction(event){
                this.showUuid = event.uuid;
                this.showModal = true;
            },
            getEmployeeName(employee){
                return helper.getEmployeeName(employee);
            },
            getEmployeeDesignationOnDate(employee, date){
                return helper.getEmployeeDesignationOnDate(employee, date);
            },
            getEvents(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/event?page=' + page + url)
                    .then(response => {
                        this.events = response.events;
                        this.event_types = response.filters.event_types;
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
            editEvent(event){
                this.$router.push('/calendar/event/'+event.uuid+'/edit');
            },
            confirmDelete(event){
                return dialog => this.deleteEvent(event);
            },
            deleteEvent(event){
                let loader = this.$loading.show();
                axios.delete('/api/event/'+event.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        this.getEvents();
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
                axios.post('/api/event/print',{filter: this.filter})
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
                axios.post('/api/event/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onEventTypeSelect(selectedOption){
                this.filter.event_type_id.push(selectedOption.id);
            },
            onEventTypeRemove(removedOption){
                this.filter.event_type_id.splice(this.filter.event_type_id.indexOf(removedOption.id), 1);
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
                this.getEvents();
            },
            'filter.order': function(val){
                this.getEvents();
            },
            'filter.page_length': function(val){
                this.getEvents();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>