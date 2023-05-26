<template>
    <div>
        <form @submit.prevent="submit" @keydown="registrationForm.errors.clear($event.target.name)">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('student.student_type')}}</label>
                        <div class="radio radio-info p-l-0">
                            <div class="form-check form-check-inline ">
                                <input class="form-check-input" type="radio" value="new" id="student_type_new" v-model="registrationForm.student_type" :checked="registrationForm.student_type == 'new'" name="student_type" @click="registrationForm.errors.clear('student_type')">
                                <label class="form-check-label" for="student_type_new"> {{trans('student.new_student')}}</label>
                            </div>
                            <div class="form-check form-check-inline ">
                                <input class="form-check-input" type="radio" value="existing" id="student_type_existing" v-model="registrationForm.student_type" :checked="registrationForm.student_type == 'existing'" name="student_type" @click="registrationForm.errors.clear('student_type')">
                                <label class="form-check-label" for="student_type_existing"> {{trans('student.existing_student')}}</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-6" v-if="registrationForm.student_type != 'new'">
                    <div class="col-12 col-sm-8" v-if="registrationForm.student_id">
                        <div class="form-group">
                            <div v-if="registrationForm.student_id">{{trans('student.name')+': '+getStudentName(selected_student)}} {{trans('student.first_guardian_name')+': '+selected_student.parent.first_guardian_name}}</div>
                        </div>
                    </div>
                    <div class="col-12 col-sm-4">
                        <div class="form-group">
                            <button type="button" class="m-t-20 btn btn-sm btn-danger" @click="removeStudentId" v-if="registrationForm.student_id">
                                <i class="fas fa-times-circle"></i> {{trans('student.remove_student')}}
                            </button>
                            <button type="button" class="m-t-20 btn btn-sm btn-info" v-else @click="searchStudentModal = true"><i class="fas fa-search"></i> {{trans('student.search_student')}}</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('student.date_of_registration')}}</label>
                        <datepicker v-model="registrationForm.date_of_registration" :bootstrapStyling="true" @selected="registrationForm.errors.clear('date_of_registration')" :placeholder="trans('student.date_of_registration')"></datepicker>
                        <show-error :form-name="registrationForm" prop-name="date_of_registration"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('academic.course')}}</label>
                        <v-select label="name" v-model="selected_course" group-values="courses" group-label="course_group" :group-select="false" name="course_id" id="course_id" :options="courses" :placeholder="trans('academic.select_course')" @select="onCourseSelect" @close="registrationForm.errors.clear('course_id')" @remove="registrationForm.course_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!courses.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <span class="help-block" v-if="registrationForm.course_id && enable_registration_fee && registration_fee >= 0">{{trans('student.registration_fee')}} {{formatCurrency(registration_fee)}}</span>
                        <show-error :form-name="registrationForm" prop-name="course_id"></show-error>
                    </div>
                </div>
                <template v-if="registrationForm.student_type == 'new'">
                    <div class="col-12 col-sm-6">
                        <div class="form-group">
                            <label for="">{{trans('student.name')}}</label>
                            <div class="row">
                                <div class="col-12 col-sm-4">
                                    <input class="form-control" type="text" v-model="registrationForm.first_name" name="first_name" :placeholder="trans('student.first_name')">
                                    <show-error :form-name="registrationForm" prop-name="first_name"></show-error>
                                </div>
                                <div class="col-12 col-sm-4">
                                    <input class="form-control" type="text" v-model="registrationForm.middle_name" name="middle_name" :placeholder="trans('student.middle_name')">
                                    <show-error :form-name="registrationForm" prop-name="middle_name"></show-error>
                                </div>
                                <div class="col-12 col-sm-4">
                                    <input class="form-control" type="text" v-model="registrationForm.last_name" name="last_name" :placeholder="trans('student.last_name')">
                                    <show-error :form-name="registrationForm" prop-name="last_name"></show-error>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-sm-6">
                        <div class="form-group">
                            <label for="">{{trans('student.gender')}}</label>
                            <div class="radio radio-info p-l-0">
                                <div class="form-check form-check-inline " v-for="gender in genders">
                                  <input class="form-check-input" type="radio" :value="gender.id" :id="gender.id" v-model="registrationForm.gender" :checked="registrationForm.gender == gender.id" name="gender" @click="registrationForm.errors.clear('gender')">
                                  <label class="form-check-label" :for="gender.id">{{trans('list.'+gender.id)}}</label>
                                </div>
                            </div>
                            <show-error :form-name="registrationForm" prop-name="gender"></show-error>
                        </div>
                    </div>
                    <div class="col-12 col-sm-3">
                        <div class="form-group">
                            <label for="">{{trans('student.date_of_birth')}}</label>
                            <datepicker v-model="registrationForm.date_of_birth" :bootstrapStyling="true" @selected="registrationForm.errors.clear('date_of_birth')" :placeholder="trans('student.date_of_birth')"></datepicker>
                            <show-error :form-name="registrationForm" prop-name="date_of_birth"></show-error>
                        </div>
                    </div>
                    <div class="col-12 col-sm-3">
                        <div class="form-group">
                            <label for="">{{trans('student.contact_number')}}</label>
                            <input class="form-control" type="text" v-model="registrationForm.contact_number" name="contact_number" :placeholder="trans('student.contact_number')">
                            <show-error :form-name="registrationForm" prop-name="contact_number"></show-error>
                        </div>
                    </div>
                </template>
            </div>
            <hr />
            <div class="row m-t-20" v-if="registrationForm.student_type == 'new'">
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('student.parent_type')}}</label>
                        <div class="radio radio-info p-l-0">
                            <div class="form-check form-check-inline ">
                                <input class="form-check-input" type="radio" value="new" id="parent_type_new" v-model="registrationForm.parent_type" :checked="registrationForm.parent_type == 'new'" name="parent_type" @click="registrationForm.errors.clear('parent_type')">
                                <label class="form-check-label" for="parent_type_new"> {{trans('student.new_parent')}}</label>
                            </div>
                            <div class="form-check form-check-inline ">
                                <input class="form-check-input" type="radio" value="existing" id="parent_type_existing" v-model="registrationForm.parent_type" :checked="registrationForm.parent_type == 'existing'" name="parent_type" @click="registrationForm.errors.clear('parent_type')">
                                <label class="form-check-label" for="parent_type_existing"> {{trans('student.existing_parent')}}</label>
                            </div>
                        </div>
                    </div>
                </div>
                <template v-if="registrationForm.parent_type == 'new'">
                    <div class="col-12 col-sm-6">
                        <div class="row">
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label for="">{{trans('student.first_guardian_name')}}</label>
                                    <input class="form-control" type="text" v-model="registrationForm.first_guardian_name" name="first_guardian_name" :placeholder="trans('student.first_guardian_name')">
                                    <show-error :form-name="registrationForm" prop-name="first_guardian_name"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label for="">{{trans('general.relation')}}</label>
                                    <select v-model="registrationForm.first_guardian_relation" class="custom-select col-12" name="first_guardian_relation" @change="registrationForm.errors.clear('first_guardian_relation')">
                                      <option value="">{{trans('general.select_one')}}</option>
                                      <option v-for="relation in guardian_relations" v-bind:value="relation.id">
                                        {{ relation.name }}
                                      </option>
                                    </select>
                                    <show-error :form-name="registrationForm" prop-name="first_guardian_relation"></show-error>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label for="">{{trans('student.second_guardian_name')}}</label>
                                    <input class="form-control" type="text" v-model="registrationForm.second_guardian_name" name="second_guardian_name" :placeholder="trans('student.second_guardian_name')">
                                    <show-error :form-name="registrationForm" prop-name="second_guardian_name"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label for="">{{trans('student.second_guardian_relation')}}</label>
                                    <select v-model="registrationForm.second_guardian_relation" class="custom-select col-12" name="second_guardian_relation" @change="registrationForm.errors.clear('second_guardian_relation')">
                                      <option value="">{{trans('general.select_one')}}</option>
                                      <option v-for="relation in guardian_relations" v-bind:value="relation.id">
                                        {{ relation.name }}
                                      </option>
                                    </select>
                                    <show-error :form-name="registrationForm" prop-name="second_guardian_relation"></show-error>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label for="">{{trans('student.first_guardian_contact_number')}}</label>
                                    <input class="form-control" type="text" v-model="registrationForm.first_guardian_contact_number_1" name="first_guardian_contact_number_1" :placeholder="trans('student.first_guardian_contact_number')">
                                    <show-error :form-name="registrationForm" prop-name="first_guardian_contact_number_1"></show-error>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div class="col-12 col-sm-3" v-if="registrationForm.student_parent_id">
                        <div class="form-group">
                            <div v-if="registrationForm.student_parent_id">
                                {{trans('student.first_guardian_name')+': '+selected_parent.first_guardian_name}}
                                <span v-if="selected_parent.first_guardian_relation">({{trans('list.'+selected_parent.first_guardian_relation)}})</span>
                            </div>
                            <div v-if="registrationForm.student_parent_id">
                                {{trans('student.second_guardian_name')+': '+selected_parent.second_guardian_name}}
                                <span v-if="selected_parent.second_guardian_relation">({{trans('list.'+selected_parent.second_guardian_relation)}})</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-sm-1">
                        <div class="form-group">
                            <button type="button" class="m-t-20 btn btn-sm btn-danger" @click="removeParentId" v-if="registrationForm.student_parent_id">
                                <i class="fas fa-times-circle"></i> {{trans('student.remove_parent')}}
                            </button>
                            <button type="button" class="m-t-20 btn btn-sm btn-info" v-else @click="searchParentModal = true"><i class="fas fa-search"></i> {{trans('student.search_parent')}}</button>
                        </div>
                    </div>
                </template>
            </div>
            <div class="row">
                <div class="col-12 col-sm-4">
                    <div class="form-group">
                        <label for="">{{trans('student.previous_institute')}}</label>
                        <v-select label="name" v-model="selected_previous_institute" name="previous_institute_id" id="previous_institute_id" :options="previous_institutes" :placeholder="trans('academic.select_institute')" @select="onPreviousInstituteSelect" @close="registrationForm.errors.clear('previous_institute_id')" @remove="registrationForm.previous_institute_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!previous_institutes.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="registrationForm" prop-name="registration_remarks"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-8">
                    <div class="form-group">
                        <label for="">{{trans('student.registration_remarks')}}</label>
                        <autosize-textarea v-model="registrationForm.registration_remarks" rows="1" name="registration_remarks" :placeholder="trans('student.registration_remarks')"></autosize-textarea>
                        <show-error :form-name="registrationForm" prop-name="registration_remarks"></show-error>
                    </div>
                </div>
            </div>
            <custom-field :fields="custom_fields" :customValues="custom_values" :clear="clearCustomField" :formErrors="customFieldFormErrors" @updateCustomValues="updateCustomValues"></custom-field>

            <div class="card-footer text-right">
                <button type="button" class="btn btn-danger waves-effect waves-light " @click="$emit('cancel')">{{trans('general.cancel')}}</button>
                <button type="submit" class="btn btn-info waves-effect waves-light">{{trans('general.save')}}</button>
            </div>
        </form>

        <search-parent v-if="searchParentModal" @completed="updateParentId" @close="searchParentModal = false"></search-parent>
        <search-student v-if="searchStudentModal" @completed="updateStudentId" @close="searchStudentModal = false"></search-student>
    </div>
</template>


<script>
    import searchParent from './search-parent'
    import searchStudent from './search-student'

    export default {
        components: {searchParent,searchStudent},
        data() {
            return {
                registrationForm: new Form({
                    first_name: '',
                    middle_name: '',
                    last_name: '',
                    parent_type: 'new',
                    student_type: 'new',
                    student_id: '',
                    student_parent_id: '',
                    first_guardian_name: '',
                    first_guardian_relation: '',
                    second_guardian_name: '',
                    second_guardian_relation: '',
                    first_guardian_contact_number_1: '',
                    date_of_birth: '',
                    gender: '',
                    course_id: '',
                	contact_number: '',
                    date_of_registration: '',
                    registration_remarks: '',
                    previous_institute_id: '',
                    custom_values: [],
                }),
                guardian_relations: [],
                courses: [],
                course_details: [],
                previous_institutes: [],
                selected_previous_institute: null,
                selected_course: null,
                genders: [],
                searchParentModal: false,
                searchStudentModal: false,
                registration_fee: 0,
                enable_registration_fee: 0,
                selected_parent: {},
                selected_student: {},
                custom_fields: [],
                custom_values: [],
                clearCustomField: false,
                customFieldFormErrors: {}
            };
        },
        mounted() {
            this.getPreRequisite();
        },
        methods: {
            getStudentName(student){
                return helper.getStudentName(student);
            },
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/registration/pre-requisite')
                    .then(response => {
                        this.courses = response.courses;
                        this.genders = response.genders;
                        this.course_details = response.course_details;
                        this.previous_institutes = response.previous_institutes;
                        this.custom_fields = response.custom_fields;
                        this.guardian_relations = response.guardian_relations;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            updateCustomValues(value) {
                this.registrationForm.custom_values = value;
            },
            submit(){
                let loader = this.$loading.show();
                this.registrationForm.post('/api/registration')
                    .then(response => {
                        toastr.success(response.message);
                        this.$emit('completed')
                        this.selected_course = null;
                        this.selected_parent = {};
                        this.selected_previous_institute = null;
                        this.registrationForm.parent_type = 'new';
                        this.registrationForm.student_type = 'new';
                        this.clearCustomField = true;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        this.customFieldFormErrors = error;
                        helper.showErrorMsg(error);
                    });
            },
            onCourseSelect(selectedOption){
                this.registrationForm.course_id = selectedOption.id;
                let course = this.course_details.find(o => o.course_id == selectedOption.id);
                this.enable_registration_fee = (course != 'undefined') ? course.enable_registration_fee : 0;
                this.registration_fee = (this.enable_registration_fee) ? course.registration_fee : 0
            },
            onPreviousInstituteSelect(selectedOption){
                this.registrationForm.previous_institute_id = selectedOption.id;
            },
            formatCurrency(amount){
                return helper.formatCurrency(amount);
            },
            updateParentId(val){
                this.selected_parent = val;
                this.registrationForm.student_parent_id = val.id;
                this.searchParentModal = false;
            },
            removeParentId(){
                this.selected_parent = {};
                this.registrationForm.student_parent_id = '';
            },
            updateStudentId(val){
                this.selected_student = val;
                this.registrationForm.student_id = val.id;
                this.searchStudentModal = false;
            },
            removeStudentId(){
                this.selected_student = {};
                this.registrationForm.student_id = '';
            }
        }
    }
</script>
