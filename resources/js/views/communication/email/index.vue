<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('communication.email')}}</h3>
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
                    <h4 class="card-title">{{trans('communication.send_email')}}</h4>
                    <form @submit.prevent="submit" @keydown="sendEmailForm.errors.clear($event.target.name)">
                        <div class="row">
                            <div class="col-12">
                                <div class="form-group">
                                    <label for="">{{trans('communication.subject')}}</label>
                                    <input class="form-control" type="text" v-model="sendEmailForm.subject" name="subject" :placeholder="trans('communication.subject')">
                                    <show-error :form-name="sendEmailForm" prop-name="subject"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label for="">{{trans('communication.audience')}}</label>
                                    <select v-model="sendEmailForm.audience" class="custom-select col-12" name="audience" @change="sendEmailForm.errors.clear('audience')">
                                      <option value=null selected>{{trans('general.select_one')}}</option>
                                      <option v-for="option in audiences" v-bind:value="option.value">
                                        {{ option.text }}
                                      </option>
                                    </select>
                                    <show-error :form-name="sendEmailForm" prop-name="audience"></show-error>
                                </div>
                                <template v-if="sendEmailForm.audience == 'selected_course'">
                                    <div class="form-group">
                                        <label for="">{{trans('academic.course')}}</label>
                                        <v-select label="name" track-by="id" v-model="selected_courses" group-values="courses" group-label="course_group" :group-select="false" name="course_id" id="course_id" :options="courses" :placeholder="trans('academic.select_course')" @select="onCourseSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onCourseRemove" :selected="selected_courses">
                                            <div class="multiselect__option" slot="afterList" v-if="!courses.length">
                                                {{trans('general.no_option_found')}}
                                            </div>
                                        </v-select>
                                        <show-error :form-name="sendEmailForm" prop-name="course_id"></show-error>
                                    </div>
                                </template>
                                <template v-if="sendEmailForm.audience == 'selected_batch'">
                                    <div class="form-group">
                                        <label for="">{{trans('academic.batch')}}</label>
                                        <v-select label="name" track-by="id" v-model="selected_batches" group-values="batches" group-label="course_group" :group-select="false" name="batch_id" id="batch_id" :options="batches" :placeholder="trans('academic.select_batch')" @select="onBatchSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onBatchRemove" :selected="selected_batches">
                                            <div class="multiselect__option" slot="afterList" v-if="!batches.length">
                                                {{trans('general.no_option_found')}}
                                            </div>
                                        </v-select>
                                        <show-error :form-name="sendEmailForm" prop-name="batch_id"></show-error>
                                    </div>
                                </template>
                                <template v-if="sendEmailForm.audience == 'selected_department'">
                                    <div class="form-group">
                                        <label for="">{{trans('employee.department')}}</label>
                                        <v-select label="name" track-by="id" v-model="selected_departments" name="department_id" id="department_id" :options="departments" :placeholder="trans('employee.select_department')" @select="onDepartmentSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onDepartmentRemove" :selected="selected_departments">
                                            <div class="multiselect__option" slot="afterList" v-if="!departments.length">
                                                {{trans('general.no_option_found')}}
                                            </div>
                                        </v-select>
                                        <show-error :form-name="sendEmailForm" prop-name="department_id"></show-error>
                                    </div>
                                </template>
                                <template v-if="sendEmailForm.audience == 'selected_employee_category'">
                                    <div class="form-group">
                                        <label for="">{{trans('employee.category')}}</label>
                                        <v-select label="name" track-by="id" v-model="selected_employee_categories" name="employee_category_id" id="employee_category_id" :options="employee_categories" :placeholder="trans('employee.select_category')" @select="onEmployeeCategorySelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onEmployeeCategoryRemove" :selected="selected_employee_categories">
                                            <div class="multiselect__option" slot="afterList" v-if="!employee_categories.length">
                                                {{trans('general.no_option_found')}}
                                            </div>
                                        </v-select>
                                        <show-error :form-name="sendEmailForm" prop-name="employee_category_id"></show-error>
                                    </div>
                                </template>
                                <div class="form-group">
                                    <label class="custom-control custom-checkbox">
                                        <input type="checkbox" class="custom-control-input" value="1" v-model="sendEmailForm.include_alternate_email" name="include_alternate_email">
                                        <span class="custom-control-label">{{trans('communication.include_alternate_email')}}</span>
                                    </label>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label for="">{{trans('communication.include_list')}} ({{trans('communication.email_count', {count: includedNumberCount})}}) </label>
                                    <textarea class="form-control" v-model="sendEmailForm.includes" rows="4" name="includes" :placeholder="trans('communication.tip_email_include_list')"></textarea>
                                    <show-error :form-name="sendEmailForm" prop-name="includes"></show-error>
                                </div>
                                <div class="form-group">
                                    <label for="">{{trans('communication.exclude_list')}} ({{trans('communication.email_count', {count: excludedNumberCount})}}) </label>
                                    <textarea class="form-control" v-model="sendEmailForm.excludes" rows="4" name="excludes" :placeholder="trans('communication.tip_email_exclude_list')"></textarea>
                                    <show-error :form-name="sendEmailForm" prop-name="excludes"></show-error>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="form-group">
                                    <html-editor name="body" :model.sync="sendEmailForm.body" height="300" :isUpdate="false" @clearErrors="sendEmailForm.errors.clear('body')"></html-editor>
                                    <show-error :form-name="sendEmailForm" prop-name="body"></show-error>
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
    export default {
        components : {  },
        data() {
            return {
                sendEmailForm: new Form({
                    type: 'email',
                    audience: null,
                    subject: '',
                    include_alternate_email: 0,
                    body: '',
                    course_id: [],
                    batch_id: [],
                    employee_category_id: [],
                    department_id: [],
                    includes: '',
                    excludes: ''
                }),
                audiences: [],
                courses: [],
                batches: [],
                employee_categories: [],
                departments: [],
                selected_courses: null,
                selected_batches: null,
                selected_departments: null,
                selected_employee_categories: null
            };
        },
        mounted(){
            if(!helper.hasPermission('send-email')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }
            this.getPreRequisite();
            helper.showDemoNotification(['email']);
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
                this.sendEmailForm.post('/api/email')
                    .then(response => {
                        toastr.success(response.message);
                        this.sendEmailForm.type = 'email';
                        this.sendEmailForm.audience = null;
                        this.sendEmailForm.course_id = [];
                        this.sendEmailForm.batch_id = [];
                        this.sendEmailForm.department_id = [];
                        this.sendEmailForm.employee_category_id = [];
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
                this.sendEmailForm.errors.clear('course_id');
                this.sendEmailForm.course_id.push(selectedOption.id);
            },
            onCourseRemove(removedOption){
                this.sendEmailForm.course_id.splice(this.sendEmailForm.course_id.indexOf(removedOption.id), 1);
            },
            onBatchSelect(selectedOption){
                this.sendEmailForm.errors.clear('batch_id');
                this.sendEmailForm.batch_id.push(selectedOption.id);
            },
            onBatchRemove(removedOption){
                this.sendEmailForm.batch_id.splice(this.sendEmailForm.batch_id.indexOf(removedOption.id), 1);
            },
            onDepartmentSelect(selectedOption){
                this.sendEmailForm.errors.clear('department_id');
                this.sendEmailForm.department_id.push(selectedOption.id);
            },
            onDepartmentRemove(removedOption){
                this.sendEmailForm.department_id.splice(this.sendEmailForm.department_id.indexOf(removedOption.id), 1);
            },
            onEmployeeCategorySelect(selectedOption){
                this.sendEmailForm.errors.clear('employee_category_id');
                this.sendEmailForm.employee_category_id.push(selectedOption.id);
            },
            onEmployeeCategoryRemove(removedOption){
                this.sendEmailForm.employee_category_id.splice(this.sendEmailForm.employee_category_id.indexOf(removedOption.id), 1);
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
            includedNumberCount(){
                return this.sendEmailForm.includes.length ? this.sendEmailForm.includes.split(/\r\n|\r|\n/).length : 0;
            },
            excludedNumberCount(){
                return this.sendEmailForm.excludes.length ? this.sendEmailForm.excludes.split(/\r\n|\r|\n/).length : 0;
            }
        }
    }
</script>