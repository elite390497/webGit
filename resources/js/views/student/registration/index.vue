<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('student.registration')}} ({{getSession}})
                        <span class="card-subtitle d-none d-sm-inline" v-if="registrations.total">{{trans('general.total_result_found',{count : registrations.total, from: registrations.from, to: registrations.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/student/registration/card-view')" v-tooltip="trans('general.card_view')"><i class="fas fa-th"></i> <span class="d-none d-sm-inline">{{trans('general.card_view')}}</span></button>
                        <button class="btn btn-info btn-sm" v-if="registrations.total && !showCreatePanel && hasPermission('new-registration')" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('student.add_new_registration')}}</span></button>
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
                        <help-button @clicked="help_topic = 'student-registration'"></help-button>
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
                            <div class="col-12 col-sm-2">
                                <div class="form-group">
                                    <label for="">{{trans('academic.course')}}</label>
                                    <v-select label="name" track-by="id" group-values="courses" group-label="course_group" :group-select="false" v-model="selected_courses" name="course_id" id="course_id" :options="courses" :placeholder="trans('academic.select_course')" @select="onCourseSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onCourseRemove" :selected="selected_courses">
                                        <div class="multiselect__option" slot="afterList" v-if="!courses.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-2">
                                <div class="form-group">
                                    <label for="">{{trans('student.previous_institute')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_institutes" name="previous_institute_id" id="previous_institute_id" :options="previous_institutes" :placeholder="trans('academic.select_institute')" @select="onPreviousInstituteSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onPreviousInstituteRemove" :selected="selected_institutes">
                                        <div class="multiselect__option" slot="afterList" v-if="!previous_institutes.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-2">
                                <div class="form-group">
                                    <label for="">{{trans('student.registration_status')}}</label>
                                    <select v-model="filter.status" class="custom-select col-12">
                                      <option value=null selected>{{trans('general.select_one')}}</option>
                                      <option v-for="status in statuses" v-bind:value="status.value">
                                        {{ status.text }}
                                      </option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-2">
                                <div class="form-group">
                                    <label for="">{{trans('student.registration_type')}}</label>
                                    <select v-model="filter.registration_type" class="custom-select col-12">
                                      <option value=null selected>{{trans('general.select_one')}}</option>
                                      <option v-for="registration_type in registration_types" v-bind:value="registration_type.value">
                                        {{ registration_type.text }}
                                      </option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <date-range-picker :start-date.sync="filter.date_of_registration_start_date" :end-date.sync="filter.date_of_registration_end_date" :label="trans('transport.date_of_registration_between')"></date-range-picker>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getRegistrations">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="fade" v-if="hasPermission('new-registration')">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('student.add_new_registration')}}</h4>
                        <registration-form @completed="getRegistrations" @cancel="showCreatePanel = !showCreatePanel"></registration-form>
                    </div>
                </div>
            </transition>
            <div class="card" v-if="hasPermission('list-registration')">
                <div class="card-body">
                    <div class="table-responsive" v-if="registrations.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('student.name')}}</th>
                                    <th>{{trans('student.first_guardian_name')}}</th>
                                    <th>{{trans('student.date_of_birth')}}</th>
                                    <th>{{trans('student.contact_number')}}</th>
                                    <th>{{trans('academic.course')}}</th>
                                    <th>{{trans('student.registration_status')}}</th>
                                    <th>{{trans('student.date_of_registration')}}</th>
                                    <th>{{trans('student.registration_fee')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="registration in registrations.data">
                                    <td>
                                        {{getStudentName(registration.student)}}
                                        <span v-if="registration.is_online">
                                            <span class="label label-info">{{trans('student.online_registration')}}</span>
                                        </span>
                                    </td>
                                    <td v-text="registration.student.parent ? registration.student.parent.first_guardian_name : ''"></td>
                                    <td>{{registration.student.date_of_birth | moment}}</td>
                                    <td v-text="registration.student.contact_number"></td>
                                    <td v-text="registration.course.name"></td>
                                    <td>
                                        <span v-for="status in getRegistrationStatus(registration)" :class="['label','label-'+status.color,'m-r-5']">{{status.label}}</span>
                                    </td>
                                    <td>{{registration.date_of_registration | moment}}</td>
                                    <td>
                                        <span v-if="registration.registration_fee">
                                            {{formatCurrency(registration.registration_fee)}}
                                            <span v-if="registration.registration_fee_status == 'paid'" class="label label-success">{{trans('student.registration_fee_status_paid')}}</span>
                                            <span v-else class="label label-danger">{{trans('student.registration_fee_status_unpaid')}}</span>
                                        </span>
                                        <span v-else>-</span>
                                    </td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <router-link :to="`/student/registration/${registration.id}`" class="btn btn-info btn-sm" v-tooltip="trans('student.view_detail')" ><i class="fas fa-arrow-circle-right"></i></router-link>
                                            <button class="btn btn-danger btn-sm" v-if="hasPermission('delete-registration')" :key="registration.id" v-confirm="{ok: confirmDelete(registration)}" v-tooltip="trans('student.delete_registration')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!registrations.total" module="student" title="registration_module_title" description="registration_module_description" icon="check-circle">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="registrations" @updateRecords="getRegistrations"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    import registrationForm from './form'

    export default {
        components : { registrationForm },
        data() {
            return {
                registrations: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'created_at',
                    order: 'desc',
                    course_id: [],
                    previous_institute_id: [],
                    status: null,
                    registration_type: null,
                    date_of_registration_start_date: '',
                    date_of_registration_end_date: '',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'created_at',
                        translation: i18n.general.created_at
                    },
                    {
                        value: 'date_of_registration',
                        translation: i18n.student.date_of_registration
                    }
                ],
                statuses: [
                    {
                        text: i18n.student.registration_status_pending,
                        value: 'pending'
                    },
                    {
                        text: i18n.student.registration_status_rejected,
                        value: 'rejected'
                    },
                    {
                        text: i18n.student.registration_status_allotted,
                        value: 'allotted'
                    }
                ],
                courses: [],
                registration_types: [],
                selected_courses: null,
                previous_institutes: [],
                selected_institutes: null,
                showCreatePanel: false,
                showFilterPanel: false,
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('list-registration') && !helper.hasPermission('new-registration')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            if (helper.hasPermission('list-registration'))
                this.getRegistrations();
            helper.showDemoNotification(['student']);
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getConfig(config){
                return helper.getConfig(config);
            },
            getRegistrations(page){
                let loader = this.$loading.show();

                if (typeof page !== 'number') {
                    page = 1;
                }
                this.filter.date_of_registration_start_date = helper.toDate(this.filter.date_of_registration_start_date);
                this.filter.date_of_registration_end_date = helper.toDate(this.filter.date_of_registration_end_date);
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/registration?page=' + page + url)
                    .then(response => {
                        this.registrations = response.registrations;
                        this.courses = response.filters.courses;
                        this.previous_institutes = response.filters.previous_institutes;
                        this.registration_types = response.filters.registration_types;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getStudentName(student){
                return helper.getStudentName(student);
            },
            formatCurrency(amount){
                return helper.formatCurrency(amount);
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/registration/print',{filter: this.filter})
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
                axios.post('/api/registration/pdf',{filter: this.filter})
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
            onPreviousInstituteSelect(selectedOption){
                this.filter.previous_institute_id.push(selectedOption.id);
            },
            onPreviousInstituteRemove(removedOption){
                this.filter.previous_institute_id.splice(this.filter.previous_institute_id.indexOf(removedOption.id), 1);
            },
            getRegistrationStatus(registration){
                return helper.getRegistrationStatus(registration);
            },
            confirmDelete(registration){
                return dialog => this.deleteRegistration(registration);
            },
            deleteRegistration(registration){
                let loader = this.$loading.show();
                axios.delete('/api/registration/'+registration.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getRegistrations();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
        },
        computed:{
            getSession(){
                return helper.getDefaultAcademicSession().name;
            },
            authToken(){
                return helper.getAuthToken();
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
                this.getRegistrations();
            },
            'filter.order': function(val){
                this.getRegistrations();
            },
            'filter.page_length': function(val){
                this.getRegistrations();
            }
        }
    }
</script>