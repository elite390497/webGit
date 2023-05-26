<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('communication.push_notification')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <router-link to="/communication" class="btn btn-info btn-sm"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('communication.history')}}</span></router-link>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card card-form">
                <div class="card-body">
                    <h4 class="card-title">{{trans('communication.send_push_notification')}}</h4>
                    <form @submit.prevent="submit" @keydown="sendPushNotificationForm.errors.clear($event.target.name)">
                        <div class="row">
                            <div class="col-12">
                                <div class="form-group">
                                    <label for="">{{trans('communication.title')}}</label>
                                    <input class="form-control" type="text" v-model="sendPushNotificationForm.title" name="title" :placeholder="trans('communication.title')">
                                    <show-error :form-name="sendPushNotificationForm" prop-name="title"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label for="">{{trans('communication.audience')}}</label>
                                    <select v-model="sendPushNotificationForm.audience" class="custom-select col-12" name="audience" @change="sendPushNotificationForm.errors.clear('audience')">
                                      <option value=null selected>{{trans('general.select_one')}}</option>
                                      <option v-for="option in audiences" v-bind:value="option.value">
                                        {{ option.text }}
                                      </option>
                                    </select>
                                    <show-error :form-name="sendPushNotificationForm" prop-name="audience"></show-error>
                                </div>
                                <template v-if="sendPushNotificationForm.audience == 'selected_course'">
                                    <div class="form-group">
                                        <label for="">{{trans('academic.course')}}</label>
                                        <v-select label="name" track-by="id" v-model="selected_courses" group-values="courses" group-label="course_group" :group-select="false" name="course_id" id="course_id" :options="courses" :placeholder="trans('academic.select_course')" @select="onCourseSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onCourseRemove" :selected="selected_courses">
                                            <div class="multiselect__option" slot="afterList" v-if="!courses.length">
                                                {{trans('general.no_option_found')}}
                                            </div>
                                        </v-select>
                                        <show-error :form-name="sendPushNotificationForm" prop-name="course_id"></show-error>
                                    </div>
                                </template>
                                <template v-if="sendPushNotificationForm.audience == 'selected_batch'">
                                    <div class="form-group">
                                        <label for="">{{trans('academic.batch')}}</label>
                                        <v-select label="name" track-by="id" v-model="selected_batches" group-values="batches" group-label="course_group" :group-select="false" name="batch_id" id="batch_id" :options="batches" :placeholder="trans('academic.select_batch')" @select="onBatchSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onBatchRemove" :selected="selected_batches">
                                            <div class="multiselect__option" slot="afterList" v-if="!batches.length">
                                                {{trans('general.no_option_found')}}
                                            </div>
                                        </v-select>
                                        <show-error :form-name="sendPushNotificationForm" prop-name="batch_id"></show-error>
                                    </div>
                                </template>
                                <template v-if="sendPushNotificationForm.audience == 'selected_department'">
                                    <div class="form-group">
                                        <label for="">{{trans('employee.department')}}</label>
                                        <v-select label="name" track-by="id" v-model="selected_departments" name="department_id" id="department_id" :options="departments" :placeholder="trans('employee.select_department')" @select="onDepartmentSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onDepartmentRemove" :selected="selected_departments">
                                            <div class="multiselect__option" slot="afterList" v-if="!departments.length">
                                                {{trans('general.no_option_found')}}
                                            </div>
                                        </v-select>
                                        <show-error :form-name="sendPushNotificationForm" prop-name="department_id"></show-error>
                                    </div>
                                </template>
                                <template v-if="sendPushNotificationForm.audience == 'selected_employee_category'">
                                    <div class="form-group">
                                        <label for="">{{trans('employee.category')}}</label>
                                        <v-select label="name" track-by="id" v-model="selected_employee_categories" name="employee_category_id" id="employee_category_id" :options="employee_categories" :placeholder="trans('employee.select_category')" @select="onEmployeeCategorySelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onEmployeeCategoryRemove" :selected="selected_employee_categories">
                                            <div class="multiselect__option" slot="afterList" v-if="!employee_categories.length">
                                                {{trans('general.no_option_found')}}
                                            </div>
                                        </v-select>
                                        <show-error :form-name="sendPushNotificationForm" prop-name="employee_category_id"></show-error>
                                    </div>
                                </template>
                                <user-search @searched="addToSearchResult"></user-search>
    
                                <div class="form-group">
                                    <ul class="font-80pc">
                                        <li v-for="result in searchResults" :key="result.key">
                                            {{result.name+' '+result.description_1}} <span class="text-right text-danger" @click="deleteResult(result)"><i class="fas fa-times-circle"></i></span>
                                            <span class="d-block">{{result.description_2}} {{result.contact_number}}</span>
                                        </li>
                                    </ul>
                                </div>
                                <div class="form-group">
                                    <label class="custom-control custom-checkbox">
                                        <input type="checkbox" class="custom-control-input" value="1" v-model="sendPushNotificationForm.send_to_admin">
                                        <span class="custom-control-label">{{trans('communication.send_to_admin')}}</span>
                                    </label>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label for="">{{trans('communication.body')}} ({{trans('communication.character_count', {count: characterCount})}}) </label>
                                    <textarea class="form-control" v-model="sendPushNotificationForm.body" rows="4" name="body" :placeholder="trans('communication.body')"></textarea>
                                    <show-error :form-name="sendPushNotificationForm" prop-name="body"></show-error>
                                </div>
                            </div>
                        </div>

                        <div class="card-footer text-right">
                            <button type="submit" class="btn btn-info waves-effect waves-light">{{trans('general.submit')}}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import userSearch from "@components/user-search"

    export default {
        components : { userSearch },
        data() {
            return {
                sendPushNotificationForm: new Form({
                    type: 'push_notification',
                    audience: null,
                    title: '',
                    body: '',
                    send_to_admin: 0,
                    course_id: [],
                    batch_id: [],
                    employee_category_id: [],
                    department_id: [],
                    individual_students: [],
                    individual_employees: []
                }),
                audiences: [],
                courses: [],
                batches: [],
                employee_categories: [],
                departments: [],
                selected_courses: null,
                selected_batches: null,
                selected_departments: null,
                selected_employee_categories: null,
                searchResults: []
            };
        },
        mounted(){
            if(!helper.hasPermission('send-push-notification')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }
            this.getPreRequisite();
            helper.showDemoNotification(['push-notification']);
        },
        methods: {
            getConfig(config){
                return helper.getConfig(config);
            },
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/communication/pre-requisite')
                    .then(response => {
                        this.employee_categories = response.employee_categories;
                        this.departments = response.departments;
                        this.courses = response.courses;
                        this.batches = response.batches;
                        this.audiences = response.audiences;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            submit(){
                let loader = this.$loading.show();
                this.searchResults.forEach(result => {
                    if (result.type === 'student') {
                        this.sendPushNotificationForm.individual_students.push(result.id)
                    } else {
                        this.sendPushNotificationForm.individual_employees.push(result.id)
                    }
                })
                this.sendPushNotificationForm.post('/api/push-notification')
                    .then(response => {
                        toastr.success(response.message);
                        this.sendPushNotificationForm.type = 'push_notification';
                        this.sendPushNotificationForm.audience = null;
                        this.sendPushNotificationForm.course_id = [];
                        this.sendPushNotificationForm.batch_id = [];
                        this.sendPushNotificationForm.department_id = [];
                        this.sendPushNotificationForm.employee_category_id = [];
                        this.sendPushNotificationForm.individual_students = [];
                        this.sendPushNotificationForm.individual_employees = [];
                        this.searchResults = [];
                        this.selected_courses = null;
                        this.selected_batches = null;
                        this.selected_departments = null;
                        this.selected_employee_categories = null;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            onCourseSelect(selectedOption){
                this.sendPushNotificationForm.errors.clear('course_id');
                this.sendPushNotificationForm.course_id.push(selectedOption.id);
            },
            onCourseRemove(removedOption){
                this.sendPushNotificationForm.course_id.splice(this.sendPushNotificationForm.course_id.indexOf(removedOption.id), 1);
            },
            onBatchSelect(selectedOption){
                this.sendPushNotificationForm.errors.clear('batch_id');
                this.sendPushNotificationForm.batch_id.push(selectedOption.id);
            },
            onBatchRemove(removedOption){
                this.sendPushNotificationForm.batch_id.splice(this.sendPushNotificationForm.batch_id.indexOf(removedOption.id), 1);
            },
            onDepartmentSelect(selectedOption){
                this.sendPushNotificationForm.errors.clear('department_id');
                this.sendPushNotificationForm.department_id.push(selectedOption.id);
            },
            onDepartmentRemove(removedOption){
                this.sendPushNotificationForm.department_id.splice(this.sendPushNotificationForm.department_id.indexOf(removedOption.id), 1);
            },
            onEmployeeCategorySelect(selectedOption){
                this.sendPushNotificationForm.errors.clear('employee_category_id');
                this.sendPushNotificationForm.employee_category_id.push(selectedOption.id);
            },
            onEmployeeCategoryRemove(removedOption){
                this.sendPushNotificationForm.employee_category_id.splice(this.sendPushNotificationForm.employee_category_id.indexOf(removedOption.id), 1);
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
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            },
            characterCount(){
                return this.sendPushNotificationForm.body.length;
            }
        }
    }
</script>