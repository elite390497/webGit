<template>
    <div>
        <form @submit.prevent="proceed" @keydown="meetingForm.errors.clear($event.target.name)">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('communication.meeting_title')}}</label>
                        <input class="form-control" type="text" v-model="meetingForm.title" name="title" :placeholder="trans('communication.meeting_title')">
                        <show-error :form-name="meetingForm" prop-name="title"></show-error>
                    </div>
                    <div class="row">
                        <div class="col-12 col-sm-6">
                            <div class="form-group">
                                <label for="">{{trans('communication.meeting_date')}}</label>
                                <datepicker v-model="meetingForm.date" :bootstrapStyling="true" @selected="meetingForm.errors.clear('date')" :placeholder="trans('communication.meeting_date')"></datepicker>
                                <show-error :form-name="meetingForm" prop-name="date"></show-error>
                            </div>
                        </div>
                        <div class="col-12 col-sm-6">
                            <div class="form-group">
                                <label for="">{{trans('communication.meeting_start_time')}}</label>
                                <timepicker :hour.sync="start_time.hour" :minute.sync="start_time.minute" :meridiem.sync="start_time.meridiem"></timepicker>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 col-sm-6">
                            <div class="form-group">
                                <label for="">{{trans('communication.meeting_end_time')}}</label>
                                <timepicker :hour.sync="end_time.hour" :minute.sync="end_time.minute" :meridiem.sync="end_time.meridiem"></timepicker>
                            </div>
                        </div>
                        <div class="col-12 col-sm-6">
                            <!-- <div class="form-group">
                                <label class="custom-control custom-checkbox">
                                    <input type="checkbox" class="custom-control-input" value="1" v-model="meetingForm.owner_video_preference">
                                    <span class="custom-control-label"><small>{{trans('communication.owner_video_preference')}}</small></span>
                                </label> 
                            </div> -->
                            <div class="form-group">
                                <label class="custom-control custom-checkbox">
                                    <input type="checkbox" class="custom-control-input" value="1" v-model="meetingForm.audience_video_preference">
                                    <span class="custom-control-label"><small>{{trans('communication.audience_video_preference')}}</small></span>
                                </label> 
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 col-sm-6">
                            <div class="form-group">
                                <label for="">{{trans('communication.meeting_audience')}}</label>
                                <select v-model="meetingForm.audience" class="custom-select col-12" name="audience" @change="meetingForm.errors.clear('audience')">
                                  <option value=null selected>{{trans('general.select_one')}}</option>
                                  <option v-for="option in audiences" v-bind:value="option.value">
                                    {{ option.text }}
                                  </option>
                                </select>
                                <show-error :form-name="meetingForm" prop-name="audience"></show-error>
                            </div>
                        </div>
                        <div class="col-12 col-sm-6" v-if="meetingForm.audience == 'selected_course'">
                            <div class="form-group">
                                <label for="">{{trans('academic.course')}}</label>
                                <v-select label="name" track-by="id" v-model="selected_courses" group-values="courses" group-label="course_group" :group-select="false" name="course_id" id="course_id" :options="courses" :placeholder="trans('academic.select_course')" @select="onCourseSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onCourseRemove" :selected="selected_courses">
                                    <div class="multiselect__option" slot="afterList" v-if="!courses.length">
                                        {{trans('general.no_option_found')}}
                                    </div>
                                </v-select>
                                <show-error :form-name="meetingForm" prop-name="course_id"></show-error>
                            </div>
                        </div>
                        <div class="col-12 col-sm-6" v-if="meetingForm.audience == 'selected_batch'">
                            <div class="form-group">
                                <label for="">{{trans('academic.batch')}}</label>
                                <v-select label="name" track-by="id" v-model="selected_batches" group-values="batches" group-label="course_group" :group-select="false" name="batch_id" id="batch_id" :options="batches" :placeholder="trans('academic.select_batch')" @select="onBatchSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onBatchRemove" :selected="selected_batches">
                                    <div class="multiselect__option" slot="afterList" v-if="!batches.length">
                                        {{trans('general.no_option_found')}}
                                    </div>
                                </v-select>
                                <show-error :form-name="meetingForm" prop-name="batch_id"></show-error>
                            </div>
                        </div>
                        <div class="col-12 col-sm-6" v-if="meetingForm.audience == 'selected_department'">
                            <div class="form-group">
                                <label for="">{{trans('employee.department')}}</label>
                                <v-select label="name" track-by="id" v-model="selected_departments" name="department_id" id="department_id" :options="departments" :placeholder="trans('employee.select_department')" @select="onDepartmentSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onDepartmentRemove" :selected="selected_departments">
                                    <div class="multiselect__option" slot="afterList" v-if="!departments.length">
                                        {{trans('general.no_option_found')}}
                                    </div>
                                </v-select>
                                <show-error :form-name="meetingForm" prop-name="department_id"></show-error>
                            </div>
                        </div>
                        <div class="col-12 col-sm-6" v-if="meetingForm.audience == 'selected_employee_category'">
                            <div class="form-group">
                                <label for="">{{trans('employee.category')}}</label>
                                <v-select label="name" track-by="id" v-model="selected_employee_categories" name="employee_category_id" id="employee_category_id" :options="employee_categories" :placeholder="trans('employee.select_category')" @select="onEmployeeCategorySelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onEmployeeCategoryRemove" :selected="selected_employee_categories">
                                    <div class="multiselect__option" slot="afterList" v-if="!employee_categories.length">
                                        {{trans('general.no_option_found')}}
                                    </div>
                                </v-select>
                                <show-error :form-name="meetingForm" prop-name="employee_category_id"></show-error>
                            </div>
                        </div>
                        <div class="col-12" v-if="! uuid">
                            <user-search @searched="addToSearchResult"></user-search>

                            <div class="form-group">
                                <ul class="font-80pc">
                                    <li v-for="result in searchResults" :key="result.key">
                                        {{result.name+' '+result.description_1}} <span class="text-right text-danger" @click="deleteResult(result)"><i class="fas fa-times-circle"></i></span>
                                        <span class="d-block">{{result.description_2}} {{result.contact_number}}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <file-upload-input :button-text="trans('general.upload_document')" :token="meetingForm.upload_token" module="meeting" :clear-file="clearAttachment" :module-id="module_id"></file-upload-input>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <html-editor name="description" :model.sync="meetingForm.description" height="300" :isUpdate="uuid ? true : false" @clearErrors="meetingForm.errors.clear('description')"></html-editor>
                        <show-error :form-name="meetingForm" prop-name="description"></show-error>
                    </div>
                </div>
            </div>

            <div class="card-footer text-right">
                <router-link to="/communication/meeting" class="btn btn-danger waves-effect waves-light " v-show="uuid">{{trans('general.cancel')}}</router-link>
                <button v-if="!uuid" type="button" class="btn btn-danger waves-effect waves-light " @click="$emit('cancel')">{{trans('general.cancel')}}</button>
                <button type="submit" class="btn btn-info waves-effect waves-light">
                    <span v-if="uuid">{{trans('general.update')}}</span>
                    <span v-else>{{trans('general.save')}}</span>
                </button>
            </div>
        </form>
    </div>
</template>


<script>
    import userSearch from "@components/user-search"

    export default {
        components: {userSearch},
        data() {
            return {
                meetingForm: new Form({
                    title: '',
                    date: '',
                    start_time: '',
                    end_time: '',
                    owner_video_preference: 0,
                    audience_video_preference: 0,
                    audience: null,
                    course_id: [],
                    batch_id: [],
                    department_id: [],
                    employee_category_id: [],
                    description: '',
                    upload_token: '',
                    individual_students: [],
                    individual_employees: []
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
                searchResults: []
            };
        },
        props: ['uuid'],
        mounted() {
            if(!helper.hasPermission('create-meeting') && !helper.hasPermission('edit-meeting')){
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
                axios.get('/api/meeting/pre-requisite')
                    .then(response => {
                        this.audiences = response.audiences;
                        this.courses = response.courses;
                        this.batches = response.batches;
                        this.departments = response.departments;
                        this.employee_categories = response.employee_categories;
                        
                        if(this.uuid)
                            this.get();
                        else
                            this.meetingForm.upload_token = this.$uuid.v4();

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
                this.meetingForm.individual_students = [];
                this.meetingForm.individual_employees = [];
                this.searchResults.forEach(result => {
                    if (result.type === 'student') {
                        this.meetingForm.individual_students.push(result.id)
                    } else {
                        this.meetingForm.individual_employees.push(result.id)
                    }
                })
                this.meetingForm.start_time = helper.toTime(this.start_time);
                this.meetingForm.end_time   = helper.toTime(this.end_time);
                let loader = this.$loading.show();
                this.meetingForm.post('/api/meeting')
                    .then(response => {
                        toastr.success(response.message);
                        this.clearAttachment = !this.clearAttachment;
                        this.meetingForm.upload_token = this.$uuid.v4();
                        this.selected_courses = null;
                        this.selected_batches = null;
                        this.selected_departments = null;
                        this.selected_employee_categories = null;
                        this.meetingForm.individual_students = [];
                        this.meetingForm.individual_employees = [];
                        this.searchResults = [];
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
                axios.get('/api/meeting/'+this.uuid)
                    .then(response => {

                        if (! response.is_editable) {
                            toastr.error(i18n.user.permission_denied);
                            loader.hide();
                            this.$router.push('/communication/meeting');
                        }

                        this.meetingForm.title = response.meeting.title;
                        this.meetingForm.date = response.meeting.date;
                        this.meetingForm.end_date = response.meeting.end_date;
                        this.meetingForm.description = response.meeting.description;
                        this.meetingForm.audience = response.meeting.audience;
                        this.selected_courses = response.meeting.audience == 'selected_course' ? response.selected_audience : [];
                        this.meetingForm.course_id = response.meeting.audience == 'selected_course' ? this.setMultiSelect(response.selected_audience) : [];
                        this.selected_batches = response.meeting.audience == 'selected_batch' ? response.selected_audience : [];
                        this.meetingForm.batch_id = response.meeting.audience == 'selected_batch' ? this.setMultiSelect(response.selected_audience) : [];
                        this.selected_departments = response.meeting.audience == 'selected_department' ? response.selected_audience : [];
                        this.meetingForm.department_id = response.meeting.audience == 'selected_department' ? this.setMultiSelect(response.selected_audience) : [];
                        this.selected_employee_categories = response.meeting.audience == 'selected_employee_category' ? response.selected_audience : [];
                        this.meetingForm.employee_category_id = response.meeting.audience == 'selected_employee_category' ? this.setMultiSelect(response.selected_audience) : [];
                        this.start_time = response.start_time;
                        this.end_time = response.end_time;
                        this.meetingForm.upload_token = response.meeting.upload_token;
                        this.module_id = response.meeting.id;
                        this.meetingForm.owner_video_preference = response.meeting.owner_video_preference;
                        this.meetingForm.audience_video_preference = response.meeting.audience_video_preference;
                        
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/communication/meeting');
                    });
            },
            update(){
                this.meetingForm.individual_students = [];
                this.meetingForm.individual_employees = [];
                this.searchResults.forEach(result => {
                    if (result.type === 'student') {
                        this.meetingForm.individual_students.push(result.id)
                    } else {
                        this.meetingForm.individual_employees.push(result.id)
                    }
                })
                this.meetingForm.start_time = helper.toTime(this.start_time);
                this.meetingForm.end_time   = helper.toTime(this.end_time);
                let loader = this.$loading.show();
                this.meetingForm.patch('/api/meeting/'+this.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/communication/meeting');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onCourseSelect(selectedOption){
                this.meetingForm.errors.clear('course_id');
                this.meetingForm.course_id.push(selectedOption.id);
            },
            onCourseRemove(removedOption){
                this.meetingForm.course_id.splice(this.meetingForm.course_id.indexOf(removedOption.id), 1);
            },
            onBatchSelect(selectedOption){
                this.meetingForm.errors.clear('batch_id');
                this.meetingForm.batch_id.push(selectedOption.id);
            },
            onBatchRemove(removedOption){
                this.meetingForm.batch_id.splice(this.meetingForm.batch_id.indexOf(removedOption.id), 1);
            },
            onDepartmentSelect(selectedOption){
                this.meetingForm.errors.clear('department_id');
                this.meetingForm.department_id.push(selectedOption.id);
            },
            onDepartmentRemove(removedOption){
                this.meetingForm.department_id.splice(this.meetingForm.department_id.indexOf(removedOption.id), 1);
            },
            onEmployeeCategorySelect(selectedOption){
                this.meetingForm.errors.clear('employee_category_id');
                this.meetingForm.employee_category_id.push(selectedOption.id);
            },
            onEmployeeCategoryRemove(removedOption){
                this.meetingForm.employee_category_id.splice(this.meetingForm.employee_category_id.indexOf(removedOption.id), 1);
            },
            setMultiSelect(options) {
                let data = [];
                options.forEach(option => {
                    data.push(option.id);
                })

                return data;
            },
            addToSearchResult(result) {
                let existing_result = this.searchResults.findIndex(o => o.type === result.type && o.id === result.id)

                if (existing_result < 0) {
                    this.searchResults.push(result)
                }
            },
            deleteResult(result) {
                let idx = this.searchResults.findIndex(o => o.type === result.type && o.id === result.id)
                this.searchResults.splice(idx, 1);
            }
        }
    }
</script>

<style>
.loading-overlay.is-full-page{
    z-index: 1060;
}
</style>