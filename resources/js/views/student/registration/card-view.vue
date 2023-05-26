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
                        <button class="btn btn-info btn-sm" @click="$router.push('/student/registration')" v-tooltip="trans('general.list_view')"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('general.list_view')}}</span></button>
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
                <div class="card-body p-4">
                    <div class="row">
                        <div class="col-md-3 col-12" v-for="registration in registrations.data" :key="registration.id">
                            <div class="card card-box with-shadow student-card">
                                <div class="card-body">
                                    <div class="ribbon ribbon-top-left" v-if="isToday(registration.student.date_of_birth)"><span class="ribbon-red"><i class="fas fa-birthday-cake"></i> {{trans('calendar.birthday')}}</span></div>
                                    <div class="student-info" @click="navigateToStudent(registration)">
                                        <span class="student-thumb pull-left">
                                            <template v-if="!registration.student.student_photo">
                                                <img v-if="registration.student.gender == 'female'" src="/images/avatar_female_kid.png" class="img-circle">
                                                <img v-else src="/images/avatar_male_kid.png" class="img-circle">
                                            </template>
                                            <template v-else>
                                                <img :src="`/${registration.student.student_photo}`" style="height: inherit; width: auto;">
                                            </template>
                                        </span>
                                        <p>
                                            <span class="other small text-muted">#{{registration.id}} 
                                                <template v-if="registration.student.age">({{ registration.student.age.years+' '+trans('list.year')+' '+registration.student.age.months+' '+trans('list.month')}})</template>
                                            </span>
                                            <span class="student-name">{{ registration.student.name }}</span>
                                            <span class="other small text-muted">{{ registration.course.name }}
                                                <span v-for="status in getRegistrationStatus(registration)" style="display: inline-block;" :class="['label','label-'+status.color,'m-r-5']">{{status.label}}</span>
                                            </span>
                                            <span class="other small text-muted">{{ registration.student.parent.first_guardian_name }} <i class="fas fa-mobile"></i> {{ registration.student.contact_number }}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                    page_length: 12
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
            },
            navigateToStudent(registration){
                this.$router.push('/student/registration/'+registration.id)
            },
            isToday(date) {
                return moment(date).format('MM-DD') == moment(helper.today()).format('MM-DD') ? true : false
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


<style scoped lang="scss">
    .card.student-card {
        opacity: 0.9;
        transition: all 0.3s ease-in-out;
        cursor: pointer;

        .student-info {
            .student-thumb {
                float: left;
                width: 100px;
                height: 100px;
                border-radius: 50%;
                background: #e1e2e3;
                margin-right: 20px;
                text-align: center;
                overflow: hidden;
                i {
                    padding-top: 25px;
                    font-size: 50px;
                }
                img {
                    width: 100%;
                }
            }
            p{
                padding-top: 10px;
                margin-bottom: 0;
                min-height: 100px;

                span {
                    display: block;

                    &.student-name{
                        font-size: 120%;
                        font-weight: 500;
                    }
                    &.batch{
                        font-size: 100%;
                    }
                    &.other{
                        font-size: 90%;
                    }
                }
            }
        }
    }
</style>