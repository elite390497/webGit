<template>
    <form @submit.prevent="proceed" @keydown="batchForm.errors.clear($event.target.name)">
        <div class="row">
            <div class="col-12 col-sm-4">
                <div class="form-group">
                    <label for="">{{trans('academic.batch_name')}}</label>
                    <input class="form-control" type="text" v-model="batchForm.name" name="name" :placeholder="trans('academic.batch_name')">
                    <show-error :form-name="batchForm" prop-name="name"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-4">
                <div class="form-group">
                    <label for="">{{trans('academic.course')}}</label>
                    <v-select label="name" v-model="selected_course" group-values="courses" group-label="course_group" :group-select="false" name="course_id" id="course_id" :options="courses" :placeholder="trans('academic.select_course')" @select="onCourseSelect" @close="batchForm.errors.clear('course_id')" @remove="batchForm.course_id = ''">
                        <div class="multiselect__option" slot="afterList" v-if="!courses.length">
                            {{trans('general.no_option_found')}}
                        </div>
                    </v-select>
                    <show-error :form-name="batchForm" prop-name="course_id"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-4">
                <div class="form-group">
                    <label for="">{{trans('academic.max_strength')}}</label>
                    <input class="form-control" type="text" v-model="batchForm.max_strength" name="max_strength" :placeholder="trans('academic.max_strength')">
                    <show-error :form-name="batchForm" prop-name="max_strength"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-4">
                <div class="row">
                    <div class="col-12 col-sm-6">
                        <div class="form-group">
                            <label for="">{{trans('academic.roll_number_prefix')}}</label>
                            <input class="form-control" type="text" v-model="batchForm.roll_number_prefix" name="roll_number_prefix" :placeholder="trans('academic.roll_number_prefix')">
                            <show-error :form-name="batchForm" prop-name="roll_number_prefix"></show-error>
                        </div>
                    </div>
                    <div class="col-12 col-sm-6">
                        <div class="form-group">
                            <label for="">{{trans('academic.roll_number_digit')}}</label>
                            <input class="form-control" type="text" v-model="batchForm.roll_number_digit" name="roll_number_digit" :placeholder="trans('academic.roll_number_digit')">
                            <show-error :form-name="batchForm" prop-name="roll_number_digit"></show-error>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12 col-sm-4">
                <div class="form-group">
                    <label for="">{{trans('student.default_attendance_method')}}</label>
                    <select v-model="batchForm.default_attendance_method" class="custom-select col-12" name="default_attendance_method">
                      <option value="" selected>{{trans('general.select_one')}}</option>
                      <option v-for="option in attendance_methods" v-bind:value="option.value">
                        {{ option.text }}
                      </option>
                    </select>
                    <show-error :form-name="batchForm" prop-name="default_attendance_method"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-4">
                <div class="form-group">
                    <label for="">{{trans('academic.batch_description')}}</label>
                    <autosize-textarea v-model="batchForm.description" rows="1" name="description" :placeholder="trans('academic.batch_description')"></autosize-textarea>
                    <show-error :form-name="batchForm" prop-name="description"></show-error>
                </div>
            </div>
        </div>

        <template v-if="exam_observations.length">
            <h4 class="card-title">{{trans('exam.configuration')}}</h4>
            <div class="row">
                <div class="col-12 col-sm-4">
                    <div class="form-group">
                        <label for="">{{trans('exam.grade')}} ({{trans('exam.observation')}})</label>
                        <v-select label="name" v-model="selected_exam_grade" name="exam_grade_id" id="exam_grade_id" :options="exam_grades" :placeholder="trans('exam.select_grade')" @select="onExamGradeSelect" @close="batchForm.errors.clear('exam_grade_id')" @remove="batchForm.exam_grade_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!exam_grades.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="batchForm" prop-name="exam_grade_id"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-4">
                    <div class="form-group">
                        <label for="">{{trans('exam.observation')}}</label>
                        <v-select label="name" v-model="selected_exam_observation" name="exam_observation_id" id="exam_observation_id" :options="exam_observations" :placeholder="trans('exam.select_observation')" @select="onExamObservationSelect" @close="batchForm.errors.clear('exam_observation_id')" @remove="batchForm.exam_observation_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!exam_observations.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="batchForm" prop-name="exam_observation_id"></show-error>
                    </div>
                </div>
            </div>
        </template>

        <template v-if="id">
            <h4 class="card-title">{{trans('calendar.holiday_configuration')}}</h4>
            <p class="alert alert-info">{{trans('academic.batch_holiday_except_date_tip')}}</p>
            <div class="row">
                <div class="col-12 col-sm-4">
                    <div class="form-group">
                        <datepicker v-model="holiday" :bootstrapStyling="true" @selected="onSelected"></datepicker>
                        <show-error :form-name="batchForm" prop-name="dates"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-9">
                    <div class="form-group">
                        <span class="label label-info m-r-10 m-b-10 p-10" v-for="date in batchForm.holidays_except">
                            {{date | momentWithDay}} <i class="fas fa-times-circle cursor" v-tooltip="trans('general.remove')" @click="remove(date)"></i>
                        </span>
                    </div>
                </div>
            </div>
        </template>
        
        <div class="card-footer text-right">
            <router-link to="/academic/batch" class="btn btn-danger waves-effect waves-light " v-show="id">{{trans('general.cancel')}}</router-link>
            <button v-if="!id" type="button" class="btn btn-danger waves-effect waves-light " @click="$emit('cancel')">{{trans('general.cancel')}}</button>
            <button type="submit" class="btn btn-info waves-effect waves-light">
                <span v-if="id">{{trans('general.update')}}</span>
                <span v-else>{{trans('general.save')}}</span>
            </button>
        </div>
    </form>
</template>


<script>
    export default {
        components: {},
        data() {
            return {
                batchForm: new Form({
                    name: '',
                    course_id: '',
                    exam_grade_id: '',
                    exam_observation_id: '',
                    max_strength: '',
                    roll_number_prefix: '',
                    roll_number_digit: 0,
                    default_attendance_method: '',
                    description: '',
                    holidays_except: []
                }),
                holiday: '',
                attendance_methods: [],
                courses: [],
                selected_course: null,
                exam_grades: [],
                selected_exam_grade: null,
                exam_observations: [],
                selected_exam_observation: null
            };
        },
        props: ['id'],
        mounted() {
            if(!helper.hasPermission('create-batch') && !helper.hasPermission('edit-batch')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            if(this.id)
                this.get();

            this.getPreRequisite();
        },
        methods: {
            proceed(){
                if(this.id)
                    this.update();
                else
                    this.store();
            },
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/batch/pre-requisite')
                    .then(response => {
                        this.courses = response.courses;
                        this.exam_grades = response.exam_grades;
                        this.exam_observations = response.exam_observations;
                        this.attendance_methods = response.attendance_methods;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },  
            store(){
                let loader = this.$loading.show();
                this.batchForm.post('/api/batch')
                    .then(response => {
                        toastr.success(response.message);
                        this.selected_course = null;
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
                axios.get('/api/batch/'+this.id)
                    .then(response => {
                        this.batchForm.name = response.batch.name;
                        this.batchForm.course_id = response.batch.course_id;
                        this.batchForm.exam_grade_id = response.batch.exam_grade_id;
                        this.selected_exam_grade = response.batch.exam_grade_id ? {id: response.batch.exam_grade_id, name: response.batch.grade.name} : null;
                        this.batchForm.exam_observation_id = response.batch.exam_observation_id;
                        this.selected_exam_observation = response.batch.exam_observation_id ? {id: response.batch.exam_observation_id, name: response.batch.observation.name} : null;
                        this.batchForm.description = response.batch.description;
                        this.batchForm.max_strength = response.batch.options ? response.batch.options.max_strength : helper.getConfig('default_max_strength_per_batch');
                        this.batchForm.default_attendance_method = response.batch.options ? response.batch.options.default_attendance_method : '';
                        this.batchForm.roll_number_prefix = response.batch.options ? response.batch.options.roll_number_prefix : helper.getConfig('default_roll_number_prefix');
                        this.batchForm.roll_number_digit = response.batch.options && response.batch.options.hasOwnProperty('roll_number_digit') ? response.batch.options.roll_number_digit : 0,
                        this.selected_course = response.selected_course;
                        this.batchForm.holidays_except = response.batch.options.holidays_except || [];
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/academic/batch');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.batchForm.patch('/api/batch/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.batchForm.holidays_except = [];
                        this.$router.push('/academic/batch');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onCourseSelect(selectedOption){
                return this.batchForm.course_id = selectedOption.id;
            },
            onExamGradeSelect(selectedOption){
                return this.batchForm.exam_grade_id = selectedOption.id;
            },
            onExamObservationSelect(selectedOption){
                return this.batchForm.exam_observation_id = selectedOption.id;
            },
            onSelected(val){
                this.holiday = '';
                val = helper.toDate(val);
                
                if (this.batchForm.holidays_except.indexOf(val) < 0)
                    this.batchForm.holidays_except.push(val);

                this.batchForm.errors.clear('holidays_except');
                this.holiday = '';
            },
            remove(date){
                let idx = this.batchForm.holidays_except.indexOf(date);
                
                if (idx < 0)
                    return;

                this.batchForm.holidays_except.splice(idx, 1);
                this.holiday = '';
            }
        },
        filters: {
          momentWithDay(date) {
            return helper.formatDateWithDay(date);
          },
        }
    }
</script>
