<template>
    <div>
        <form @submit.prevent="proceed" @keydown="eventForm.errors.clear($event.target.name)">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('calendar.event_title')}}</label>
                        <input class="form-control" type="text" v-model="eventForm.title" name="title" :placeholder="trans('calendar.event_title')">
                        <show-error :form-name="eventForm" prop-name="title"></show-error>
                    </div>
                    <div class="row">
                        <div class="col-12 col-sm-6">
                            <div class="form-group">
                                <label for="">{{trans('calendar.event_type')}} </label> <button type="button" class="btn btn-xs btn-info pull-right" v-if="hasPermission('access-configuration')" @click="showEventTypeModal = true">{{trans('general.add_new')}}</button>
                                <v-select label="name" v-model="selected_event_type" name="event_type_id" id="event_type_id" :options="event_types" :placeholder="trans('calendar.select_event_type')" @select="onEventTypeSelect" @close="eventForm.errors.clear('event_type_id')" @remove="eventForm.event_type_id = ''">
                                    <div class="multiselect__option" slot="afterList" v-if="!event_types.length">
                                        {{trans('general.no_option_found')}}
                                    </div>
                                </v-select>
                                <show-error :form-name="eventForm" prop-name="event_type_id"></show-error>
                            </div>
                        </div>
                        <div class="col-12 col-sm-6">
                            <div class="form-group">
                                <label for="">{{trans('calendar.event_venue')}}</label>
                                <input class="form-control" type="text" v-model="eventForm.venue" name="venue" :placeholder="trans('calendar.event_venue')">
                                <show-error :form-name="eventForm" prop-name="venue"></show-error>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 col-sm-6">
                            <div class="form-group">
                                <label for="">{{trans('calendar.event_start_date')}}</label>
                                <label class="custom-control custom-checkbox float-right">
                                    <input type="checkbox" class="custom-control-input" v-model="eventForm.no_time" value="1">
                                    <span class="custom-control-label">{{trans('calendar.event_no_time')}}</span>
                                </label>
                                <datepicker v-model="eventForm.start_date" :bootstrapStyling="true" @selected="eventForm.errors.clear('start_date')" :placeholder="trans('calendar.event_start_date')"></datepicker>
                                <show-error :form-name="eventForm" prop-name="start_date"></show-error>
                            </div>
                        </div>
                        <div class="col-12 col-sm-6" v-if="!eventForm.no_time">
                            <div class="form-group">
                                <label for="">{{trans('calendar.event_start_time')}}</label>
                                <timepicker :hour.sync="start_time.hour" :minute.sync="start_time.minute" :meridiem.sync="start_time.meridiem"></timepicker>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 col-sm-6">
                            <div class="form-group">
                                <label for="">{{trans('calendar.event_end_date')}}</label>
                                <datepicker v-model="eventForm.end_date" :bootstrapStyling="true" @selected="eventForm.errors.clear('end_date')" :placeholder="trans('calendar.event_end_date')"></datepicker>
                                <show-error :form-name="eventForm" prop-name="end_date"></show-error>
                            </div>
                        </div>
                        <div class="col-12 col-sm-6" v-if="!eventForm.no_time">
                            <div class="form-group">
                                <label for="">{{trans('calendar.event_end_time')}}</label>
                                <timepicker :hour.sync="end_time.hour" :minute.sync="end_time.minute" :meridiem.sync="end_time.meridiem"></timepicker>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 col-sm-6">
                            <div class="form-group">
                                <label for="">{{trans('calendar.event_audience')}}</label>
                                <select v-model="eventForm.audience" class="custom-select col-12" name="audience" @change="eventForm.errors.clear('audience')">
                                  <option value=null selected>{{trans('general.select_one')}}</option>
                                  <option v-for="option in audiences" v-bind:value="option.value">
                                    {{ option.text }}
                                  </option>
                                </select>
                                <show-error :form-name="eventForm" prop-name="audience"></show-error>
                            </div>
                        </div>
                        <div class="col-12 col-sm-6" v-if="eventForm.audience == 'selected_course'">
                            <div class="form-group">
                                <label for="">{{trans('academic.course')}}</label>
                                <v-select label="name" track-by="id" v-model="selected_courses" group-values="courses" group-label="course_group" :group-select="false" name="course_id" id="course_id" :options="courses" :placeholder="trans('academic.select_course')" @select="onCourseSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onCourseRemove" :selected="selected_courses">
                                    <div class="multiselect__option" slot="afterList" v-if="!courses.length">
                                        {{trans('general.no_option_found')}}
                                    </div>
                                </v-select>
                                <show-error :form-name="eventForm" prop-name="course_id"></show-error>
                            </div>
                        </div>
                        <div class="col-12 col-sm-6" v-if="eventForm.audience == 'selected_batch'">
                            <div class="form-group">
                                <label for="">{{trans('academic.batch')}}</label>
                                <v-select label="name" track-by="id" v-model="selected_batches" group-values="batches" group-label="course_group" :group-select="false" name="batch_id" id="batch_id" :options="batches" :placeholder="trans('academic.select_batch')" @select="onBatchSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onBatchRemove" :selected="selected_batches">
                                    <div class="multiselect__option" slot="afterList" v-if="!batches.length">
                                        {{trans('general.no_option_found')}}
                                    </div>
                                </v-select>
                                <show-error :form-name="eventForm" prop-name="batch_id"></show-error>
                            </div>
                        </div>
                        <div class="col-12 col-sm-6" v-if="eventForm.audience == 'selected_department'">
                            <div class="form-group">
                                <label for="">{{trans('employee.department')}}</label>
                                <v-select label="name" track-by="id" v-model="selected_departments" name="department_id" id="department_id" :options="departments" :placeholder="trans('employee.select_department')" @select="onDepartmentSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onDepartmentRemove" :selected="selected_departments">
                                    <div class="multiselect__option" slot="afterList" v-if="!departments.length">
                                        {{trans('general.no_option_found')}}
                                    </div>
                                </v-select>
                                <show-error :form-name="eventForm" prop-name="department_id"></show-error>
                            </div>
                        </div>
                        <div class="col-12 col-sm-6" v-if="eventForm.audience == 'selected_employee_category'">
                            <div class="form-group">
                                <label for="">{{trans('employee.category')}}</label>
                                <v-select label="name" track-by="id" v-model="selected_employee_categories" name="employee_category_id" id="employee_category_id" :options="employee_categories" :placeholder="trans('employee.select_category')" @select="onEmployeeCategorySelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onEmployeeCategoryRemove" :selected="selected_employee_categories">
                                    <div class="multiselect__option" slot="afterList" v-if="!employee_categories.length">
                                        {{trans('general.no_option_found')}}
                                    </div>
                                </v-select>
                                <show-error :form-name="eventForm" prop-name="employee_category_id"></show-error>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <file-upload-input :button-text="trans('general.upload_document')" :token="eventForm.upload_token" module="event" :clear-file="clearAttachment" :module-id="module_id"></file-upload-input>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <html-editor name="description" :model.sync="eventForm.description" height="300" :isUpdate="uuid ? true : false" @clearErrors="eventForm.errors.clear('description')"></html-editor>
                        <show-error :form-name="eventForm" prop-name="description"></show-error>
                    </div>
                </div>
            </div>

            <div class="card-footer text-right">
                <router-link to="/calendar/event" class="btn btn-danger waves-effect waves-light " v-show="uuid">{{trans('general.cancel')}}</router-link>
                <button v-if="!uuid" type="button" class="btn btn-danger waves-effect waves-light " @click="$emit('cancel')">{{trans('general.cancel')}}</button>
                <button type="submit" class="btn btn-info waves-effect waves-light">
                    <span v-if="uuid">{{trans('general.update')}}</span>
                    <span v-else>{{trans('general.save')}}</span>
                </button>
            </div>
        </form>

        <transition name="modal" v-if="showEventTypeModal">
            <div class="modal-mask">
                <div class="modal-wrapper">
                    <div class="modal-container modal-lg">
                        <div class="modal-header">
                            <slot name="header">
                                {{trans('calendar.add_new_event_type')}}
                                <span class="float-right pointer" @click="showEventTypeModal = false">x</span>
                            </slot>
                        </div>
                        <div class="modal-body">
                            <slot name="body">
                                <event-type-form @completed="getPreRequisite" @cancel="showEventTypeModal = false"></event-type-form>
                                <div class="clearfix"></div>
                            </slot>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>


<script>
    import eventTypeForm from '../../configuration/calendar/event-type/form'

    export default {
        components: {eventTypeForm},
        data() {
            return {
                eventForm: new Form({
                    event_type_id: '',
                    title: '',
                    no_time: 0,
                    venue: '',
                    start_date: '',
                    end_date: '',
                    start_time: '',
                    end_time: '',
                    audience: 'everyone',
                    course_id: [],
                    batch_id: [],
                    department_id: [],
                    employee_category_id: [],
                    description: '',
                    upload_token: ''
                }),
                start_time: {
                    hour: '',
                    minute: '',
                    meridiem: 'am'
                },
                end_time: {
                    hour: '',
                    minute: '',
                    meridiem: 'am'
                },
                audiences: [],
                event_types: [],
                selected_event_type: null,
                courses: [],
                selected_courses: null,
                batches: [],
                selected_batches: null,
                departments: [],
                selected_departments: null,
                employee_categories: [],
                selected_employee_categories: null,
                module_id: '',
                clearAttachment: true,
                showEventTypeModal: false
            };
        },
        props: ['uuid'],
        mounted() {
            if(!helper.hasPermission('create-event') && !helper.hasPermission('edit-event')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getPreRequisite();
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getPreRequisite(){
                let loader = this.$loading.show();
                this.showEventTypeModal = false;
                axios.get('/api/event/pre-requisite')
                    .then(response => {
                        this.event_types = response.event_types;
                        this.audiences = response.audiences;
                        this.courses = response.courses;
                        this.batches = response.batches;
                        this.departments = response.departments;
                        this.employee_categories = response.employee_categories;
                        
                        if(this.uuid)
                            this.get();
                        else
                            this.eventForm.upload_token = this.$uuid.v4();

                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            proceed(){
                if(this.uuid)
                    this.update();
                else
                    this.store();
            },
            store(){
                this.eventForm.start_time = helper.toTime(this.start_time);
                this.eventForm.end_time   = helper.toTime(this.end_time);
                let loader = this.$loading.show();
                this.eventForm.post('/api/event')
                    .then(response => {
                        toastr.success(response.message);
                        this.clearAttachment = !this.clearAttachment;
                        this.eventForm.upload_token = this.$uuid.v4();
                        this.selected_event_type = null;
                        this.selected_courses = null;
                        this.selected_batches = null;
                        this.selected_departments = null;
                        this.selected_employee_categories = null;
                        this.$emit('completed');
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            get(){
                let loader = this.$loading.show();
                axios.get('/api/event/'+this.uuid)
                    .then(response => {
                        this.eventForm.title = response.event.title;
                        this.eventForm.venue = response.event.venue;
                        this.eventForm.start_date = response.event.start_date;
                        this.eventForm.end_date = response.event.end_date;
                        this.eventForm.description = response.event.description;
                        this.eventForm.event_type_id = response.event.event_type_id;
                        this.selected_event_type = response.event.event_type_id ? {id: response.event.event_type_id, name: response.event.event_type.name} : null;
                        this.eventForm.audience = response.event.audience;
                        this.eventForm.no_time = response.event.start_time ? 0 : 1;
                        this.selected_courses = response.event.audience == 'selected_course' ? response.selected_audience : [];
                        this.eventForm.course_id = response.event.audience == 'selected_course' ? this.setMultiSelect(response.selected_audience) : [];
                        this.selected_batches = response.event.audience == 'selected_batch' ? response.selected_audience : [];
                        this.eventForm.batch_id = response.event.audience == 'selected_batch' ? this.setMultiSelect(response.selected_audience) : [];
                        this.selected_departments = response.event.audience == 'selected_department' ? response.selected_audience : [];
                        this.eventForm.department_id = response.event.audience == 'selected_department' ? this.setMultiSelect(response.selected_audience) : [];
                        this.selected_employee_categories = response.event.audience == 'selected_employee_category' ? response.selected_audience : [];
                        this.eventForm.employee_category_id = response.event.audience == 'selected_employee_category' ? this.setMultiSelect(response.selected_audience) : [];
                        this.start_time = response.start_time;
                        this.end_time = response.end_time;
                        this.eventForm.upload_token = response.event.upload_token;
                        this.module_id = response.event.id;

                        if (! response.is_editable) {
                            toastr.error(i18n.user.permission_denied);
                            loader.hide();
                            this.$router.push('/calendar/event');
                        }
                        
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/calendar/event');
                    });
            },
            update(){
                this.eventForm.start_time = helper.toTime(this.start_time);
                this.eventForm.end_time   = helper.toTime(this.end_time);
                let loader = this.$loading.show();
                this.eventForm.patch('/api/event/'+this.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/calendar/event');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onEventTypeSelect(selectedOption){
                this.eventForm.event_type_id = selectedOption.id;
            },
            onCourseSelect(selectedOption){
                this.eventForm.errors.clear('course_id');
                this.eventForm.course_id.push(selectedOption.id);
            },
            onCourseRemove(removedOption){
                this.eventForm.course_id.splice(this.eventForm.course_id.indexOf(removedOption.id), 1);
            },
            onBatchSelect(selectedOption){
                this.eventForm.errors.clear('batch_id');
                this.eventForm.batch_id.push(selectedOption.id);
            },
            onBatchRemove(removedOption){
                this.eventForm.batch_id.splice(this.eventForm.batch_id.indexOf(removedOption.id), 1);
            },
            onDepartmentSelect(selectedOption){
                this.eventForm.errors.clear('department_id');
                this.eventForm.department_id.push(selectedOption.id);
            },
            onDepartmentRemove(removedOption){
                this.eventForm.department_id.splice(this.eventForm.department_id.indexOf(removedOption.id), 1);
            },
            onEmployeeCategorySelect(selectedOption){
                this.eventForm.errors.clear('employee_category_id');
                this.eventForm.employee_category_id.push(selectedOption.id);
            },
            onEmployeeCategoryRemove(removedOption){
                this.eventForm.employee_category_id.splice(this.eventForm.employee_category_id.indexOf(removedOption.id), 1);
            },
            setMultiSelect(options) {
                let data = [];
                options.forEach(option => {
                    data.push(option.id);
                })

                return data;
            }
        }
    }
</script>

<style>
.loading-overlay.is-full-page{
    z-index: 1060;
}
</style>