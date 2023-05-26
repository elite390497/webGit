<template>
	<div>
        <form @submit.prevent="proceed" @keydown="enquiryForm.errors.clear($event.target.name)">
            <div class="row">
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('reception.date_of_enquiry')}}</label>
                        <datepicker v-model="enquiryForm.date_of_enquiry" :bootstrapStyling="true" @selected="enquiryForm.errors.clear('date_of_enquiry')" :placeholder="trans('reception.date_of_enquiry')"></datepicker>
                        <show-error :form-name="enquiryForm" prop-name="date_of_enquiry"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('reception.enquiry_type')}}</label>
                        <v-select label="name" v-model="selected_enquiry_type" name="enquiry_type_id" id="enquiry_type_id" :options="enquiry_types" :placeholder="trans('reception.select_enquiry_type')" @select="onEnquiryTypeSelect" @close="enquiryForm.errors.clear('enquiry_type_id')" @remove="enquiryForm.enquiry_type_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!enquiry_types.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="enquiryForm" prop-name="enquiry_type_id"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('reception.enquiry_source')}}</label>
                        <v-select label="name" v-model="selected_enquiry_source" name="enquiry_source_id" id="enquiry_source_id" :options="enquiry_sources" :placeholder="trans('reception.select_enquiry_source')" @select="onEnquirySourceSelect" @close="enquiryForm.errors.clear('enquiry_source_id')" @remove="enquiryForm.enquiry_source_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!enquiry_sources.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="enquiryForm" prop-name="enquiry_source_id"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('student.email')}}</label>
                        <input class="form-control" type="text" v-model="enquiryForm.email" name="email" :placeholder="trans('student.email')">
                        <show-error :form-name="enquiryForm" prop-name="email"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('student.contact_number')}}</label>
                        <input class="form-control" type="text" v-model="enquiryForm.contact_number" name="contact_number" :placeholder="trans('student.contact_number')">
                        <show-error :form-name="enquiryForm" prop-name="contact_number"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('student.alternate_contact_number')}}</label>
                        <input class="form-control" type="text" v-model="enquiryForm.alternate_contact_number" name="alternate_contact_number" :placeholder="trans('student.alternate_contact_number')">
                        <show-error :form-name="enquiryForm" prop-name="alternate_contact_number"></show-error>
                    </div>
                </div>
            </div>
            <h4 class="card-title">{{trans('student.guardian')}}</h4>
            <div class="row">
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('student.first_guardian_name')}}</label>
                        <input class="form-control" type="text" v-model="enquiryForm.first_guardian_name" name="first_guardian_name" :placeholder="trans('student.first_guardian_name')">
                        <show-error :form-name="enquiryForm" prop-name="first_guardian_name"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('general.relation')}}</label>
                        <select v-model="enquiryForm.first_guardian_relation" class="custom-select col-12" name="first_guardian_relation" @change="enquiryForm.errors.clear('first_guardian_relation')">
                          <option value="">{{trans('general.select_one')}}</option>
                          <option v-for="relation in guardian_relations" v-bind:value="relation.id">
                            {{ relation.name }}
                          </option>
                        </select>
                        <show-error :form-name="enquiryForm" prop-name="first_guardian_relation"></show-error>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('student.second_guardian_name')}}</label>
                        <input class="form-control" type="text" v-model="enquiryForm.second_guardian_name" name="second_guardian_name" :placeholder="trans('student.second_guardian_name')">
                        <show-error :form-name="enquiryForm" prop-name="second_guardian_name"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('general.relation')}}</label>
                        <select v-model="enquiryForm.second_guardian_relation" class="custom-select col-12" name="second_guardian_relation" @change="enquiryForm.errors.clear('second_guardian_relation')">
                          <option value="">{{trans('general.select_one')}}</option>
                          <option v-for="relation in guardian_relations" v-bind:value="relation.id">
                            {{ relation.name }}
                          </option>
                        </select>
                        <show-error :form-name="enquiryForm" prop-name="second_guardian_relation"></show-error>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('student.third_guardian_name')}}</label>
                        <input class="form-control" type="text" v-model="enquiryForm.third_guardian_name" name="third_guardian_name" :placeholder="trans('student.third_guardian_name')">
                        <show-error :form-name="enquiryForm" prop-name="third_guardian_name"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('general.relation')}}</label>
                        <select v-model="enquiryForm.third_guardian_relation" class="custom-select col-12" name="third_guardian_relation" @change="enquiryForm.errors.clear('third_guardian_relation')">
                          <option value="">{{trans('general.select_one')}}</option>
                          <option v-for="relation in guardian_relations" v-bind:value="relation.id">
                            {{ relation.name }}
                          </option>
                        </select>
                        <show-error :form-name="enquiryForm" prop-name="third_guardian_relation"></show-error>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12 col-sm-9">
                    <div class="form-group">
                        <label for="">{{trans('reception.enquiry_remarks')}}</label>
                        <autosize-textarea v-model="enquiryForm.remarks" rows="1" name="remarks" :placeholder="trans('reception.enquiry_remarks')"></autosize-textarea>
                        <show-error :form-name="enquiryForm" prop-name="remarks"></show-error>
                    </div>
                </div>
            </div>
            <div class="p-t-20 border-top">
                <div class="row" v-for="(student, index) in enquiryForm.students">
                    <div class="col-12 col-sm-2">
                        <div class="form-group">
                            <label for="">
                                {{trans('student.name')}}
                                <button type="button" class="btn btn-xs btn-danger" :key="`${index}_delete_student`" v-confirm="{ok: confirmDelete(index)}" v-tooltip="trans('student.delete_student')"><i class="fas fa-times"></i></button>
                            </label>
                            <input class="form-control" type="text" v-model="student.student_name" :name="getStudentName(index)" :placeholder="trans('student.name')">
                            <show-error :form-name="enquiryForm" :prop-name="getStudentName(index)"></show-error>
                        </div>
                    </div>
                    <div class="col-12 col-sm-2">
                        <div class="form-group">
                            <label for="">{{trans('student.gender')}}</label>
                            <div class="radio radio-info p-l-0">
                                <div class="form-check form-check-inline " v-for="gender in genders">
                                    <input class="form-check-input" type="radio" :value="gender.id" :id="getGenderId(index,gender.id)" v-model="student.gender" :checked="student.gender == gender.id" :name="getGenderName(index)" @click="enquiryForm.errors.clear(getGenderName(index))">
                                    <label class="form-check-label" :for="getGenderId(index,gender.id)"> {{trans('list.'+gender.id)}}</label>
                                </div>
                            </div>
                            <show-error :form-name="enquiryForm" :prop-name="getGenderName(index)"></show-error>
                        </div>
                    </div>
                    <div class="col-12 col-sm-2">
                        <div class="form-group">
                            <label for="">{{trans('student.date_of_birth')}}</label>
                            <datepicker v-model="student.date_of_birth" :bootstrapStyling="true" @selected="enquiryForm.errors.clear(getDateOfBirthName(index))" :placeholder="trans('student.date_of_birth')"></datepicker>
                            <show-error :form-name="enquiryForm" :prop-name="getDateOfBirthName(index)"></show-error>
                        </div>
                    </div>
                    <div class="col-12 col-sm-2">
                        <div class="form-group">
                            <label for="">{{trans('academic.course')+' '+getDefaultAcademicSession.name}}</label>
                            <v-select label="name" v-model="student.selected_course" group-values="courses" group-label="course_group" :group-select="false" :name="getCourseName(index)" :id="getCourseName(index)" :options="courses" :placeholder="trans('academic.select_course')" @select="onCourseSelect" @close="enquiryForm.errors.clear(getCourseName(index))" @remove="onCourseRemove">
                                <div class="multiselect__option" slot="afterList" v-if="!courses.length">
                                    {{trans('general.no_option_found')}}
                                </div>
                            </v-select>
                            <show-error :form-name="enquiryForm" :prop-name="getCourseName(index)"></show-error>
                        </div>
                    </div>
                    <div class="col-12 col-sm-2">
                        <div class="form-group">
                            <label for="">{{trans('reception.current_institute')}}</label>
                            <v-select label="name" v-model="student.selected_institute" :name="getCurrentInstituteName(index)" :id="getCurrentInstituteName(index)" :options="institutes" :placeholder="trans('academic.select_institute')" @select="onInstituteSelect" @close="enquiryForm.errors.clear(getCurrentInstituteName(index))" @remove="onInstituteRemove">
                                <div class="multiselect__option" slot="afterList" v-if="!institutes.length">
                                    {{trans('general.no_option_found')}}
                                </div>
                            </v-select>
                            <show-error :form-name="enquiryForm" :prop-name="getCurrentInstituteName(index)"></show-error>
                        </div>
                    </div>
                    <div class="col-12 col-sm-2">
                        <div class="form-group">
                            <label for="">
                                {{trans('student.remarks')}}
                            </label>
                            <input class="form-control" type="text" v-model="student.remarks" :name="getRemarkName(index)" :placeholder="trans('student.remarks')">
                            <show-error :form-name="enquiryForm" :prop-name="getRemarkName(index)"></show-error>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <div class="form-group">
                            <button type="button" @click="addRow" class="btn btn-info btn-sm waves-effect waves-light">{{trans('student.add_new_student')}}</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-footer text-right">
                <button v-show="uuid" type="button" class="btn btn-danger " @click="$router.push('/reception/enquiry')">{{trans('general.cancel')}}</button>
                <button v-if="!uuid" type="button" class="btn btn-danger " @click="$emit('cancel')">{{trans('general.cancel')}}</button>
                <button type="submit" class="btn btn-info waves-effect waves-light">{{trans('general.save')}}</button>
            </div>
        </form>
    </div>
</template>

<script>

    export default {
        components: {},
        props: ['uuid'],
        data(){
            return {
                enquiryForm: new Form({
                    first_guardian_name: '',
                    first_guardian_relation: '',
                    second_guardian_name: '',
                    second_guardian_relation: '',
                    third_guardian_name: '',
                    third_guardian_relation: '',
                    date_of_enquiry: '',
                    enquiry_type_id: '',
                    enquiry_source_id: '',
                    contact_number: '',
                    alternate_contact_number: '',
                    email: '',
                    remarks: '',
                    students: []
                }),
                guardian_relations: [],
                enquiry_types: [],
                enquiry_sources: [],
                courses: [],
                institutes: [],
                genders: [],
                selected_enquiry_type: null,
                selected_enquiry_source: null
            }
        },
        mounted(){
            if(!this.uuid)
                this.addRow();

            if(this.uuid)
                this.get();

            this.getPreRequisite();
        },
        methods: {
            proceed(){
                if(this.uuid)
                    this.update();
                else
                    this.store();
            }, 
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/enquiry/pre-requisite')
                    .then(response => {
                        this.enquiry_types = response.enquiry_types;
                        this.enquiry_sources = response.enquiry_sources;
                        this.courses = response.courses;
                        this.institutes = response.institutes;
                        this.genders = response.genders;
                        this.guardian_relations = response.guardian_relations;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            addRow(){
                let new_index = this.enquiryForm.students.push({
                    uuid: this.$uuid.v4(),
                    student_name: '',
                    date_of_birth: '',
                    gender: '',
                    course_id: '',
                    institute_id: '',
                    remarks: '',
                    selected_course: null,
                    selected_institute: null
                })
            },
            getStudentName(index){
                return index+'_student_name';
            },
            getRemarkName(index){
                return index+'_remarks';
            },
            getDateOfBirthName(index){
                return index+'_date_of_birth';
            },
            getCourseName(index){
                return index+'_course_id';
            },
            getCurrentInstituteName(index){
                return index+'_institute_id';
            },
            getGenderName(index){
                return index+'_gender';
            },
            getGenderId(index,id){
                return index+'_'+id+'_gender';
            },
            get(){
                let loader = this.$loading.show();
                axios.get('/api/enquiry/'+this.uuid)
                    .then(response => {
                        this.enquiryForm.date_of_enquiry = response.enquiry.date_of_enquiry;
                        this.enquiryForm.first_guardian_name = response.enquiry.first_guardian_name;
                        this.enquiryForm.second_guardian_name = response.enquiry.second_guardian_name;
                        this.enquiryForm.third_guardian_name = response.enquiry.third_guardian_name;
                        this.enquiryForm.first_guardian_relation = response.enquiry.first_guardian_relation;
                        this.enquiryForm.second_guardian_relation = response.enquiry.second_guardian_relation;
                        this.enquiryForm.third_guardian_relation = response.enquiry.third_guardian_relation;
                        this.enquiryForm.contact_number = response.enquiry.contact_number;
                        this.enquiryForm.alternate_contact_number = response.enquiry.alternate_contact_number;
                        this.enquiryForm.email = response.enquiry.email;
                        this.enquiryForm.remarks = response.enquiry.remarks;
                        this.enquiryForm.enquiry_type_id = response.enquiry.enquiry_type_id;
                        this.selected_enquiry_type = response.enquiry.enquiry_type_id ? {id: response.enquiry.enquiry_type_id, name: response.enquiry.enquiry_type.name} : null;
                        this.enquiryForm.enquiry_source_id = response.enquiry.enquiry_source_id;
                        this.selected_enquiry_source = response.enquiry.enquiry_source_id ? {id: response.enquiry.enquiry_source_id, name: response.enquiry.enquiry_source.name} : null;
                        response.enquiry.enquiry_details.forEach(student => {
                            this.enquiryForm.students.push({
                                uuid: student.uuid,
                                student_name: student.student_name,
                                gender: student.gender,
                                date_of_birth: student.date_of_birth,
                                course_id: student.course_id,
                                selected_course: (student.course_id) ? {id: student.course_id, name: student.course.name} : null,
                                institute_id: student.institute_id,
                                selected_institute: (student.institute_id) ? {id: student.institute_id, name: student.institute.name} : null,
                                remarks: student.remarks
                            });
                        });
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            store(){
                let loader = this.$loading.show();
                this.enquiryForm.post('/api/enquiry')
                    .then(response => {
                        toastr.success(response.message);
                        this.enquiryForm.selected_enquiry_type = null;
                        this.enquiryForm.selected_enquiry_source = null;
                        this.enquiryForm.students = [];
                        this.addRow();
                        this.$emit('completed');
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            update(){
                let loader = this.$loading.show();
                this.enquiryForm.patch('/api/enquiry/'+this.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/reception/enquiry');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            onEnquiryTypeSelect(selectedOption){
                this.enquiryForm.enquiry_type_id = selectedOption.id;
            },
            onEnquirySourceSelect(selectedOption){
                this.enquiryForm.enquiry_source_id = selectedOption.id;
            },
            confirmDelete(index){
                return dialog => this.deleteStudent(index);
            },
            deleteStudent(index){
                this.enquiryForm.students.splice(index, 1);
            },
            onCourseSelect(selectedOption, id){
                let index = id.split("_")[0];
                let student = this.enquiryForm.students[index];
                student.course_id = selectedOption.id;
            },
            onCourseRemove(removedOption, id){
                let index = id.split("_")[0];
                let student = this.enquiryForm.students[index];
                student.course_id = '';
            },
            onInstituteSelect(selectedOption, id){
                let index = id.split("_")[0];
                let student = this.enquiryForm.students[index];
                student.institute_id = selectedOption.id;
            },
            onInstituteRemove(removedOption, id){
                let index = id.split("_")[0];
                let student = this.enquiryForm.students[index];
                student.institute_id = '';
            }
        },
        computed:{
            getDefaultAcademicSession(){
                return helper.getDefaultAcademicSession();
            }
        }
    }
</script>