<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('communication.communication_history')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="communications.total">{{trans('general.total_result_found',{count : communications.total, from: communications.from, to: communications.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
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
                        <help-button @clicked="help_topic = 'communication'"></help-button>
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
                            <div class="col-12 col-sm-2">
                                <div class="form-group">
                                    <label for="">{{trans('communication.types')}}</label>
                                    <select v-model="filter.type" class="custom-select col-12">
                                      <option value=null selected>{{trans('general.select_one')}}</option>
                                      <option v-for="type in types" v-bind:value="type.value">
                                        {{ type.text }}
                                      </option>
                                    </select>
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
                                    <label for="">{{trans('communication.subject')}}</label>
                                    <input class="form-control" name="subject" v-model="filter.subject">
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <date-range-picker :start-date.sync="filter.start_date" :end-date.sync="filter.end_date" :label="trans('general.date_between')"></date-range-picker>
                            </div>
                        </div>

                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getCommunications">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="communications.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('communication.type')}}</th>
                                    <th>{{trans('communication.subject')}}</th>
                                    <th>{{trans('communication.audience')}}</th>
                                    <th>{{trans('communication.recipient_count')}}</th>
                                    <th>{{trans('communication.sent_by')}}</th>
                                    <th>{{trans('general.created_at')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="communication in communications.data">
                                    <td>{{trans('communication.'+communication.type)}}</td>
                                    <td v-text="communication.subject"></td>
                                    <td>
                                        <span v-if="communication.audience == 'everyone'">{{trans('communication.communication_for_everyone')}}</span>
                                        <template v-if="communication.audience == 'selected_course'">
                                            {{trans('academic.course')}} <br />
                                            <ul style="list-style:none;padding:0;margin:0;">
                                                <li v-for="course in communication.courses">{{course.name+'('+course.course_group.name+')'}}</li>
                                            </ul>
                                        </template>
                                        <template v-else-if="communication.audience == 'selected_batch'">
                                            {{trans('academic.batch')}} <br />
                                            <ul style="list-style:none;padding:0;margin:0;">
                                                <li v-for="batch in communication.batches">{{batch.name+'('+batch.course.name+')'}}</li>
                                            </ul>
                                        </template>
                                        <template v-else-if="communication.audience == 'selected_department'">
                                            {{trans('employee.department')}} <br />
                                            <ul style="list-style:none;padding:0;margin:0;">
                                                <li v-for="department in communication.departments">{{department.name}}</li>
                                            </ul>
                                        </template>
                                        <template v-else-if="communication.audience == 'selected_employee_category'">
                                            {{trans('employee.category')}} <br />
                                            <ul style="list-style:none;padding:0;margin:0;">
                                                <li v-for="employee_category in communication.employee_categorys">{{employee_category.name}}</li>
                                            </ul>
                                        </template>
                                    </td>
                                    <td>{{communication.recipient_count}}</td>
                                    <td>{{getEmployeeName(communication.user.employee)}} <br > {{getEmployeeDesignationOnDate(communication.user.employee, communication.start_date)}}</td>
                                    <td>{{communication.created_at | momentDateTime}}</td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-success btn-sm" v-tooltip="trans('general.view_detail')" @click.prevent="showAction(communication)"><i class="fas fa-arrow-circle-right"></i></button>
                                            <button class="btn btn-danger btn-sm" v-if="hasPermission('delete-communication-history')" :key="communication.id" v-confirm="{ok: confirmDelete(communication)}" v-tooltip="trans('general.delete')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!communications.total" module="communication" title="communication_module_title" description="communication_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="hasPermission('send-sms')" @click="$router.push('/communication/sms')"><i class="fas fa-paper-plan"></i> {{trans('communication.send_sms')}}</button>
                            <button class="btn btn-info btn-md" v-if="hasPermission('send-email')" @click="$router.push('/communication/email')"><i class="fas fa-envelop"></i> {{trans('communication.send_email')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="communications" @updateRecords="getCommunications"></pagination-record>
                </div>
            </div>
        </div>

        <transition name="modal" v-if="showModal">
            <div class="modal-mask">
                <div class="modal-wrapper">
                    <div class="modal-container modal-lg">
                        <div class="modal-header">
                            <slot name="header">
                                {{communication.subject}}
                                <span class="float-right pointer" @click="showModal = false">x</span>
                            </slot>
                        </div>
                        <div class="modal-body">
                            <slot name="body">
                                <div class="m-t-20" v-html="communication.body"></div>
                                <hr />
                                <p>
                                    <i class="far fa-clock"></i> <small>{{trans('general.created_at')}} {{communication.created_at | momentDateTime}}</small>
                                    <span class="pull-right">
                                        <i class="far fa-clock"></i> <small>{{trans('general.updated_at')}} {{communication.updated_at | momentDateTime}}</small>
                                    </span>
                                </p>
                                <div class="clearfix"></div>
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
    import communicationDetail from './show'

    export default {
        components : { communicationDetail},
        data() {
            return {
                communications: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'created_at',
                    order: 'desc',
                    subject: '',
                    type: '',
                    course_id: [],
                    batch_id: [],
                    department_id: [],
                    employee_category_id: [],
                    start_date: '',
                    end_date: '',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'created_at',
                        translation: i18n.general.created_at
                    },
                    {
                        value: 'subject',
                        translation: i18n.communication.subject
                    }
                ],
                types: [],
                courses: [],
                selected_courses: null,
                batches: [],
                selected_batches: null,
                departments: [],
                selected_departments: null,
                employee_categories: [],
                selected_employee_categories: null,
                showFilterPanel: false,
                help_topic: '',
                communication: {},
                showModal: false
            };
        },
        mounted(){
            if(!helper.hasAnyPermission(['send-sms', 'send-email'])){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getCommunications();
            helper.showDemoNotification(['communication']);
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            hasAnyPermission(permissions){
                return helper.hasAnyPermission(permissions);
            },
            showAction(communication){
                this.communication = communication;
                this.showModal = true;
            },
            getEmployeeName(employee){
                return helper.getEmployeeName(employee);
            },
            getEmployeeDesignationOnDate(employee, date){
                return helper.getEmployeeDesignationOnDate(employee, date);
            },
            getCommunications(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                this.filter.start_date = helper.toDate(this.filter.start_date);
                this.filter.end_date = helper.toDate(this.filter.end_date);
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/communication?page=' + page + url)
                    .then(response => {
                        this.communications = response.communications;
                        this.courses = response.filters.courses;
                        this.batches = response.filters.batches;
                        this.departments = response.filters.departments;
                        this.employee_categories = response.filters.employee_categories;
                        this.types = response.filters.types;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            confirmDelete(communication){
                return dialog => this.deleteCommunication(communication);
            },
            deleteCommunication(communication){
                let loader = this.$loading.show();
                axios.delete('/api/communication/'+communication.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        this.getCommunications();
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
                axios.post('/api/communication/print',{filter: this.filter})
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
                axios.post('/api/communication/pdf',{filter: this.filter})
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
                this.getCommunications();
            },
            'filter.order': function(val){
                this.getCommunications();
            },
            'filter.page_length': function(val){
                this.getCommunications();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>