<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('student.student_list')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="student_records.total">{{trans('general.total_result_found',{count : student_records.total, from: student_records.from, to: student_records.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <template v-if="hasNotAnyRole(['student','parent'])">
                            <button class="btn btn-info btn-sm" @click="$router.push('/student/list')" v-tooltip="trans('general.list_view')"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('general.list_view')}}</span></button>
                            <button class="btn btn-info btn-sm" v-if="student_records.total && hasPermission('list-registration')" @click="$router.push('/student/registration')" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('student.add_new_student')}}</span></button>
                            <button class="btn btn-info btn-sm" v-if="!showFilterPanel" @click="showFilterPanel = !showFilterPanel"><i class="fas fa-filter"></i> <span class="d-none d-sm-inline">{{trans('general.filter')}}</span></button>
                            <sort-by :order-by-options="orderByOptions" :sort-by="filter.sort_by" :order="filter.order" @updateSortBy="value => {filter.sort_by = value}"  @updateOrder="value => {filter.order = value}"></sort-by>
                            <div class="btn-group">
                                <button type="button" class="btn btn-info btn-sm dropdown-toggle no-caret " role="menu" id="moreOption" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-tooltip="trans('general.more_option')">
                                    <i class="fas fa-ellipsis-h"></i> <span class="d-none d-sm-inline"></span>
                                </button>
                                <div :class="['dropdown-menu',getConfig('direction') == 'ltr' ? 'dropdown-menu-right' : '']" aria-labelledby="moreOption">
                                    <button class="dropdown-item custom-dropdown" @click="print"><i class="fas fa-print"></i> {{trans('general.print')}}</button>
                                    <button class="dropdown-item custom-dropdown" @click="pdf"><i class="fas fa-file-pdf"></i> {{trans('general.generate_pdf')}}</button>
                                    <a class="dropdown-item custom-dropdown" :href="exportExcel()"><i class="fas fa-file-excel"></i> {{trans('general.generate_excel')}}</a>
                                    <button class="dropdown-item custom-dropdown" @click="$router.go(-1)"><i class="fas fa-undo"></i> {{trans('general.back')}}</button>
                                </div>
                            </div>
                            <help-button @clicked="help_topic = 'admission'"></help-button>
                        </template>
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
                                    <label for="">{{trans('student.first_name')}}</label>
                                    <input class="form-control" name="first_name" v-model="filter.first_name">
                                </div>
                            </div>
                            <div class="col-12 col-sm-2">
                                <div class="form-group">
                                    <label for="">{{trans('student.last_name')}}</label>
                                    <input class="form-control" name="last_name" v-model="filter.last_name">
                                </div>
                            </div>
                            <div class="col-12 col-sm-2">
                                <div class="form-group">
                                    <label for="">{{trans('student.first_guardian_name')}}</label>
                                    <input class="form-control" name="first_guardian_name" v-model="filter.first_guardian_name">
                                </div>
                            </div>
                            <div class="col-12 col-sm-2">
                                <div class="form-group">
                                    <label for="">{{trans('student.second_guardian_name')}}</label>
                                    <input class="form-control" name="second_guardian_name" v-model="filter.second_guardian_name">
                                </div>
                            </div>
                            <div class="col-12 col-sm-4">
                                <div class="form-group">
                                    <label for="">{{trans('academic.batch')}}</label>
                                    <v-select label="name" track-by="id" group-values="batches" group-label="course_group" :group-select="false" v-model="selected_batches" name="batch_id" id="batch_id" :options="batches" :placeholder="trans('academic.select_batch')" @select="onBatchSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onBatchRemove" :selected="selected_batches">
                                        <div class="multiselect__option" slot="afterList" v-if="!batches.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <date-range-picker :start-date.sync="filter.date_of_birth_start_date" :end-date.sync="filter.date_of_birth_end_date" :label="trans('student.date_of_birth_between')"></date-range-picker>
                            </div>
                            <div class="col-12 col-sm-6">
                                <date-range-picker :start-date.sync="filter.date_of_admission_start_date" :end-date.sync="filter.date_of_admission_end_date" :label="trans('student.date_of_admission_between')"></date-range-picker>
                            </div>
                            <div class="col-12 col-sm-2">
                                <div class="form-group">
                                    <label for="">{{trans('student.student_group')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_student_groups" name="student_group_id" id="student_group_id" :options="student_groups" :placeholder="trans('student.select_student_group')" @select="onStudentGroupSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onStudentGroupRemove" :selected="selected_student_groups">
                                        <div class="multiselect__option" slot="afterList" v-if="!student_groups.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-2">
                                <div class="form-group">
                                    <label for="">{{trans('student.gender')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_genders" name="gender" id="gender" :options="genders" @select="onGenderSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onGenderRemove" :selected="selected_genders">
                                        <div class="multiselect__option" slot="afterList" v-if="!genders.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-2">
                                <div class="form-group">
                                    <label for="">{{trans('misc.blood_group')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_blood_groups" name="blood_group_id" id="blood_group_id" :options="blood_groups" :placeholder="trans('misc.select_blood_group')" @select="onBloodGroupSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onBloodGroupRemove" :selected="selected_blood_groups">
                                        <div class="multiselect__option" slot="afterList" v-if="!blood_groups.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-2">
                                <div class="form-group">
                                    <label for="">{{trans('misc.religion')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_religions" name="religion_id" id="religion_id" :options="religions" :placeholder="trans('misc.select_religion')" @select="onReligionSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onReligionRemove" :selected="selected_religions">
                                        <div class="multiselect__option" slot="afterList" v-if="!religions.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-2">
                                <div class="form-group">
                                    <label for="">{{trans('misc.caste')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_castes" name="caste_id" id="caste_id" :options="castes" :placeholder="trans('misc.select_caste')" @select="onCasteSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onCasteRemove" :selected="selected_castes">
                                        <div class="multiselect__option" slot="afterList" v-if="!castes.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-2">
                                <div class="form-group">
                                    <label for="">{{trans('misc.category')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_categories" name="category_id" id="category_id" :options="categories" :placeholder="trans('misc.select_category')" @select="onCategorySelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onCategoryRemove" :selected="selected_categories">
                                        <div class="multiselect__option" slot="afterList" v-if="!categories.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getStudents">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body p-4">
                    <div class="row">
                        <div class="col-md-3 col-12" v-for="student_record in student_records.data" :key="student_record.id">
                            <div class="card card-box with-shadow student-card">
                                <div class="card-body">
                                    <div class="ribbon ribbon-top-left" v-if="isToday(student_record.student.date_of_birth)"><span class="ribbon-red"><i class="fas fa-birthday-cake"></i> {{trans('calendar.birthday')}}</span></div>
                                    <div class="student-info" @click="navigateToStudent(student_record)">
                                        <span class="student-thumb pull-left">
                                            <template v-if="!student_record.student.student_photo">
                                                <img v-if="student_record.student.gender == 'female'" src="/images/avatar_female_kid.png" class="img-circle">
                                                <img v-else src="/images/avatar_male_kid.png" class="img-circle">
                                            </template>
                                            <template v-else>
                                                <img :src="`/${student_record.student.student_photo}`" style="height: inherit; width: auto;">
                                            </template>
                                        </span>
                                        <p>
                                            <span class="other small text-muted">{{student_record.admission.admission_number}} 
                                                <template v-if="student_record.student.age">({{ student_record.student.age.years+' '+trans('list.year')+' '+student_record.student.age.months+' '+trans('list.month')}})</template>
                                            </span>
                                            <span class="student-name">{{ student_record.student.name }}</span>
                                            <span class="other small text-muted">{{ student_record.batch.course.name+' '+student_record.batch.name }} ({{ student_record.full_roll_number }})</span>
                                            <span class="other small text-muted">{{ student_record.student.parent.first_guardian_name }} <i class="fas fa-mobile"></i> {{ student_record.student.contact_number }}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <module-info v-if="!student_records.total" module="student" title="admission_module_title" description="admission_module_description" icon="list">
                    </module-info>
                    <pagination-record :show-page-length="false" :page-length.sync="filter.page_length" :records="student_records" @updateRecords="getStudents"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    export default {
        components : {},
        data() {
            return {
                student_records: {
                    total: 0,
                    data: []
                },
                selectAll: false,
                studentGroupForm: new Form({
                    ids: [],
                    student_group_id: '',
                    action: 'attach'
                }),
                student_groups: [],
                selected_group: null,
                filter: {
                    sort_by : 'first_name',
                    order: 'asc',
                    batch_id: [],
                    blood_group_id: [],
                    religion_id: [],
                    caste_id: [],
                    gender: [],
                    category_id: [],
                    student_group_id: [],
                    first_name: '',
                    last_name: '',
                    first_guardian_name: '',
                    second_guardian_name: '',
                    date_of_admission_start_date: '',
                    date_of_birth_end_date: '',
                    date_of_admission_end_date: '',
                    date_of_birth_start_date: '',
                    columns: [
                        'first_guardian_name',
                        'date_of_admission',
                        'admission_number',
                        'contact_number'
                    ],
                    page_length: 12
                },
                orderByOptions: [
                    {
                        value: 'first_name',
                        translation: i18n.student.first_name
                    },
                    {
                        value: 'last_name',
                        translation: i18n.student.last_name
                    },
                    {
                        value: 'first_guardian_name',
                        translation: i18n.student.first_guardian_name
                    },
                    {
                        value: 'second_guardian_name',
                        translation: i18n.student.second_guardian_name
                    },
                    {
                        value: 'date_of_birth',
                        translation: i18n.student.date_of_birth
                    }
                ],
                columns: [
                    {
                        text: i18n.student.admission_number,
                        value: 'admission_number'
                    },
                    {
                        text: i18n.student.roll_number,
                        value: 'roll_number'
                    },
                    {
                        text: i18n.student.middle_name,
                        value: 'middle_name'
                    },
                    {
                        text: i18n.student.first_guardian_name,
                        value: 'first_guardian_name'
                    },
                    {
                        text: i18n.student.second_guardian_name,
                        value: 'second_guardian_name'
                    },
                    {
                        text: i18n.student.date_of_birth,
                        value: 'date_of_birth'
                    },
                    {
                        text: i18n.student.date_of_admission,
                        value: 'date_of_admission'
                    },
                    {
                        text: i18n.student.date_of_promotion,
                        value: 'date_of_promotion'
                    },
                    {
                        text: i18n.student.contact_number,
                        value: 'contact_number'
                    },
                    {
                        text: i18n.student.gender,
                        value: 'gender'
                    },
                    {
                        text: i18n.student.nationality,
                        value: 'nationality'
                    },
                    {
                        text: i18n.misc.blood_group,
                        value: 'blood_group'
                    },
                    {
                        text: i18n.misc.religion,
                        value: 'religion'
                    },
                    {
                        text: i18n.misc.caste,
                        value: 'caste'
                    },
                    {
                        text: i18n.misc.category,
                        value: 'category'
                    },
                    {
                        text: i18n.student.unique_identification_number,
                        value: 'unique_identification_number'
                    },
                    {
                        text: i18n.student.first_guardian_contact_number_1,
                        value: 'first_guardian_contact_number_1'
                    },
                    {
                        text: i18n.student.second_guardian_contact_number_1,
                        value: 'second_guardian_contact_number_1'
                    },
                    {
                        text: i18n.student.emergency_contact_name,
                        value: 'emergency_contact_name'
                    },
                    {
                        text: i18n.student.emergency_contact_number,
                        value: 'emergency_contact_number'
                    },
                    {
                        text: i18n.student.present_address,
                        value: 'present_address'
                    },
                    {
                        text: i18n.student.permanent_address,
                        value: 'permanent_address'
                    }
                ],
                batches: [],
                selected_batches: null,
                blood_groups: [],
                selected_blood_groups: null,
                castes: [],
                genders: [],
                selected_genders: null,
                selected_castes: null,
                religions: [],
                selected_religions: null,
                categories: [],
                selected_categories: null,
                showFilterPanel: false,
                showColumnPanel: false,
                selected_student_groups: null,
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('list-student') && !helper.hasPermission('list-class-teacher-wise-student')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getStudents();
            helper.showDemoNotification(['student_admission']);
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            hasNotAnyRole(roles){
                return helper.hasNotAnyRole(roles);
            },
            getConfig(config){
                return helper.getConfig(config);
            },
            getStudents(page){
                let loader = this.$loading.show();

                if (typeof page !== 'number') {
                    page = 1;
                }
                this.selectAll = false;
                this.filter.date_of_admission_start_date = helper.toDate(this.filter.date_of_admission_start_date);
                this.filter.date_of_admission_end_date = helper.toDate(this.filter.date_of_admission_end_date);
                this.filter.date_of_birth_start_date = helper.toDate(this.filter.date_of_birth_start_date);
                this.filter.date_of_birth_end_date = helper.toDate(this.filter.date_of_birth_end_date);
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/student?page=' + page + url)
                    .then(response => {
                        this.student_records = response.student_records;
                        this.batches = response.filters.batches;
                        this.blood_groups = response.filters.blood_groups;
                        this.religions = response.filters.religions;
                        this.castes = response.filters.castes;
                        this.genders = response.filters.genders;
                        this.categories = response.filters.categories;
                        this.student_groups = response.filters.student_groups;
                        let ids = [];
                        this.student_records.data.forEach(student_record => {
                            ids.push(student_record.student.id);
                        })
                        this.selectAll = ids.every(elem => this.studentGroupForm.ids.indexOf(elem) > -1) ? 1 : 0;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            toggleSelectAll(){
                if(this.selectAll) {
                    this.student_records.data.forEach(student_record => {
                        if (this.studentGroupForm.ids.indexOf(student_record.student.id) < 0)
                            this.studentGroupForm.ids.push(student_record.student.id);
                    });
                } else {
                    this.student_records.data.forEach(student_record => {
                        let index = this.studentGroupForm.ids.indexOf(student_record.student.id);
                        if (index >= 0) {
                            this.studentGroupForm.ids.splice(index, 1);
                        }
                    });
                }
            },
            getStudentName(student){
                return helper.getStudentName(student);
            },
            print(){
                let loader = this.$loading.show();
                if (this.filter.columns.length > 6) {
                    toastr.error(i18n.student.print_max_column);
                    loader.hide();
                    return;
                }

                axios.post('/api/student/print',{filter: this.filter})
                    .then(response => {
                        let print = window.open("/print");
                        print.document.write(response);
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            pdf(){
                let loader = this.$loading.show();
                if (this.filter.columns.length > 6) {
                    toastr.error(i18n.student.print_max_column);
                    loader.hide();
                    return;
                }
                
                axios.post('/api/student/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            exportExcel(){

                let url = helper.getFilterURL(this.filter);
                return '/api/student?action=excel' + url + '&token=' + this.authToken;
            },
            onBatchSelect(selectedOption){
                this.filter.batch_id.push(selectedOption.id);
            },
            onBatchRemove(removedOption){
                this.filter.batch_id.splice(this.filter.batch_id.indexOf(removedOption.id), 1);
            },
            onBloodGroupSelect(selectedOption){
                this.filter.blood_group_id.push(selectedOption.id);
            },
            onBloodGroupRemove(removedOption){
                this.filter.blood_group_id.splice(this.filter.blood_group_id.indexOf(removedOption.id), 1);
            },
            onReligionSelect(selectedOption){
                this.filter.religion_id.push(selectedOption.id);
            },
            onReligionRemove(removedOption){
                this.filter.religion_id.splice(this.filter.religion_id.indexOf(removedOption.id), 1);
            },
            onCasteSelect(selectedOption){
                this.filter.caste_id.push(selectedOption.id);
            },
            onCasteRemove(removedOption){
                this.filter.caste_id.splice(this.filter.caste_id.indexOf(removedOption.id), 1);
            },
            onGenderSelect(selectedOption){
                this.filter.gender.push(selectedOption.id);
            },
            onGenderRemove(removedOption){
                this.filter.gender.splice(this.filter.gender.indexOf(removedOption.id), 1);
            },
            onCategorySelect(selectedOption){
                this.filter.category_id.push(selectedOption.id);
            },
            onCategoryRemove(removedOption){
                this.filter.category_id.splice(this.filter.category_id.indexOf(removedOption.id), 1);
            },
            isColumnVisible(column){
                return (this.filter.columns.indexOf(column) > -1) ? true : false;
            },
            getRollNumber(student_record){
                return helper.getRollNumber(student_record);
            },
            getCourse(student_record){
                return student_record.batch.course.name;
            },
            getBatch(student_record){
                return student_record.batch.name;
            },
            onStudentGroupSelect(selectedOption){
                this.filter.student_group_id.push(selectedOption.id);
            },
            onStudentGroupRemove(removedOption){
                this.filter.student_group_id.splice(this.filter.student_group_id.indexOf(removedOption.id), 1);
            },
            onGroupSelect(selectedOption){
                this.studentGroupForm.student_group_id = selectedOption.id;
            },
            confirmGroupAction(){
                return dialog => this.groupAction();
            },
            groupAction(){
                let loader = this.$loading.show();
                this.studentGroupForm.post('/api/student/action/group')
                    .then(response => {
                        toastr.success(response.message);
                        this.getStudents();
                        this.studentGroupForm.action = 'attach';
                        this.selected_group = null;
                        this.studentGroupForm.ids = [];
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            navigateToStudent(student_record){
                this.$router.push('/student/'+student_record.student.uuid)
            },
            isToday(date) {
                return helper.isToday(date)
            }
        },
        computed:{
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
                this.getStudents();
            },
            'filter.order': function(val){
                this.getStudents();
            },
            'filter.page_length': function(val){
                this.getStudents();
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