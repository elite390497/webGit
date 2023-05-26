<template>
    <div>
        <form @submit.prevent="proceed" @keydown="scheduleForm.errors.clear($event.target.name)">
            <div class="row">
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('exam.exam')}} </label> <button type="button" class="btn btn-xs btn-info pull-right" v-if="hasPermission('create-exam')" @click="showExamModal = true">{{trans('general.add_new')}}</button>
                        <v-select label="name" v-model="selected_exam" name="exam_id" id="exam_id" :options="exams" :placeholder="trans('exam.select_exam')" @select="onExamSelect" @close="scheduleForm.errors.clear('exam_id')" @remove="scheduleForm.exam_id = ''" :disabled="id ? true : false">
                            <div class="multiselect__option" slot="afterList" v-if="!exams.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="scheduleForm" prop-name="exam_id"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('academic.batch')}} </label>
                        <v-select label="name" v-model="selected_batch" group-values="batches" group-label="course_group" :group-select="false" name="batch_id" id="batch_id" :options="batches" :placeholder="trans('academic.select_batch')" @select="onBatchSelect" @close="scheduleForm.errors.clear('batch_id')" @remove="scheduleForm.batch_id = ''" :disabled="id ? true : false">
                            <div class="multiselect__option" slot="afterList" v-if="!batches.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="scheduleForm" prop-name="batch_id"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('exam.grade')}} </label>
                        <v-select label="name" v-model="selected_exam_grade" name="exam_grade_id" id="exam_grade_id" :options="exam_grades" :placeholder="trans('exam.select_grade')" @select="onExamGradeSelect" @close="scheduleForm.errors.clear('exam_grade_id')" @remove="scheduleForm.exam_grade_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!exam_grades.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="scheduleForm" prop-name="exam_grade_id"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('exam.assessment')}} </label>
                        <v-select label="name" v-model="selected_exam_assessment" name="exam_assessment_id" id="exam_assessment_id" :options="exam_assessments" :placeholder="trans('exam.select_assessment')" @select="onExamAssessmentSelect" @close="scheduleForm.errors.clear('exam_assessment_id')" @remove="scheduleForm.exam_assessment_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!exam_assessments.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="scheduleForm" prop-name="exam_assessment_id"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('exam.overall_pass_percentage')}}</label>
                        <input class="form-control" type="text" v-model="scheduleForm.overall_pass_percentage" name="overall_pass_percentage" :placeholder="trans('exam.overall_pass_percentage')">
                        <show-error :form-name="scheduleForm" prop-name="overall_pass_percentage"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <switches class="m-l-20" v-model="scheduleForm.show_result" theme="bootstrap" color="success"></switches> {{trans('exam.show_result')}}
                    </div>
                </div>
            </div>
            <div class="row m-b-10" v-if="scheduleForm.records.length && exam_assessment">
                <div class="col-12 col-sm-3">

                </div>
                <div class="col-12 col-sm-3">

                </div>
                <div class="col-12 col-sm-3" v-for="detail in exam_assessment.details">
                    {{detail.name}} {{trans('exam.observation_detail_max_mark')}}
                </div>
            </div>

            <div class="row" v-for="(record,index) in scheduleForm.records">
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        {{record.subject_name}}
                        <div class="form-group">
                            <label class="custom-control custom-checkbox">
                                <input type="checkbox" class="custom-control-input" value="1" v-model="record.has_no_exam">
                                <span class="custom-control-label">{{trans('academic.subject_has_no_exam')}}</span>
                            </label>
                        </div>
                    </div>
                </div>
                <template v-if="! record.has_no_exam">
                    <div class="col-12 col-sm-3">
                        <div class="form-group">
                            <datepicker v-model="record.date" :bootstrapStyling="true" @selected="scheduleForm.errors.clear(getScheduleDateName(index))" :placeholder="trans('exam.schedule_date')"></datepicker>
                            <show-error :form-name="scheduleForm" :prop-name="getScheduleDateName(index)"></show-error>
                        </div>
                    </div>
                    <div class="col-12 col-sm-3" v-for="(detail,idx) in record.assessment_details">
                        <div class="row">
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label class="custom-control custom-checkbox">
                                        <input type="checkbox" class="custom-control-input" value="1" v-model="detail.is_applicable">
                                        <span class="custom-control-label">{{trans('assessment.is_applicable')}}</span>
                                    </label>
                                </div>
                            </div>
                            <div class="col-12 col-sm-9" v-if="detail.is_applicable">
                                <div class="form-group">
                                    <input class="form-control" type="text" v-model="detail.max_mark" :name="getDetailMaxMark(index, idx)" :placeholder="trans('exam.assessment_detail_max_mark')">
                                    <show-error :form-name="scheduleForm" :prop-name="getDetailMaxMark(index, idx)"></show-error>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
            <div class="card-footer text-right">
                <router-link to="/exam/schedule" class="btn btn-danger waves-effect waves-light ">{{trans('general.cancel')}}</router-link>
                <button type="submit" class="btn btn-info waves-effect waves-light">
                    <span v-if="id">{{trans('general.update')}}</span>
                    <span v-else>{{trans('general.save')}}</span>
                </button>
            </div>
        </form>

        <transition name="modal" v-if="showExamModal">
            <div class="modal-mask">
                <div class="modal-wrapper">
                    <div class="modal-container modal-lg">
                        <div class="modal-header">
                            <slot name="header">
                                {{trans('exam.add_new_exam')}}
                                <span class="float-right pointer" @click="showExamModal = false">x</span>
                            </slot>
                        </div>
                        <div class="modal-body">
                            <slot name="body">
                                <exam-form @completed="getPreRequisite" @cancel="showExamModal = false"></exam-form>
                                <div class="clearfix"></div>
                            </slot>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>


<script>
    import examForm from '../form'

    export default {
        components: {examForm},
        data() {
            return {
                scheduleForm: new Form({
                    batch_id: '',
                    exam_id: '',
                    exam_grade_id: '',
                    exam_assessment_id: '',
                    description: '',
                    overall_pass_percentage: '',
                    show_result: 0,
                    records: []
                }),
                all_batches: [],
                batches: [],
                selected_batch: null,
                exams: [],
                selected_exam: null,
                exam_grades: [],
                selected_exam_grade: null,
                exam_assessments: [],
                selected_exam_assessment: null,
                exam_assessments: [],
                batch_with_subjects: [],
                exam_assessment_with_details: [],
                exam_assessment: {},
                showExamModal: false
            };
        },
        props: ['id'],
        mounted() {
            if(!helper.hasPermission('create-exam-schedule') && !helper.hasPermission('edit-exam-schedule')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getPreRequisite();
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getScheduleDateName(index){
                return index+'_schedule_date';
            },
            getDetailMaxMark(index, idx){
                return index+'_'+idx+'_max_mark';
            },
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/exam/schedule/pre-requisite')
                    .then(response => {
                        this.all_batches = response.batches;
                        this.exams = response.exams;
                        this.exam_grades = response.exam_grades;
                        this.exam_assessments = response.exam_assessments;
                        this.batch_with_subjects = response.batch_with_subjects;
                        this.exam_assessment_with_details = response.exam_assessment_with_details;

                        if(this.id)
                            this.get();

                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            getSubjects(){
                let loader = this.$loading.show();

                let batch = this.batch_with_subjects.find(o => o.id == this.scheduleForm.batch_id);

                if (typeof batch == 'undefined') {
                    loader.hide();
                    return;
                }

                this.scheduleForm.records = [];

                batch.subjects.forEach(subject => {
                    this.scheduleForm.records.push({
                        subject_id: subject.id,
                        subject_name: subject.name+' ('+subject.code+')',
                        has_no_exam: subject.has_no_exam,
                        date: '',
                        assessment_details: []
                    })
                });
                this.selected_exam_assessment = null;
                this.scheduleForm.exam_assessment_id = '';
                
                loader.hide();
            },
            proceed(){
                if(this.id)
                    this.update();
                else
                    this.store();
            },
            store(){
                let loader = this.$loading.show();
                this.scheduleForm.post('/api/exam/schedule')
                    .then(response => {
                        toastr.success(response.message);
                        this.selected_batch = null;
                        this.selected_exam = null;
                        this.selected_exam_grade = null;
                        this.selected_exam_assessment = null;
                        this.scheduleForm.records = [];
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
                axios.get('/api/exam/schedule/'+this.id)
                    .then(response => {
                        this.selected_exam = response.selected_exam;
                        response = response.exam_schedule;

                        this.scheduleForm.overall_pass_percentage = response.options.overall_pass_percentage;
                        this.scheduleForm.show_result = response.options.show_result;

                        if (this.selected_exam && this.selected_exam.course_group_id)
                            this.batches = this.all_batches.filter(o => o.course_group === this.selected_exam.course_group_name);
                        else
                            this.batches = this.all_batches;

                        this.scheduleForm.batch_id = response.batch_id;
                        this.selected_batch = this.scheduleForm.batch_id ? {id: response.batch_id, name: response.batch.course.name+' '+response.batch.name} : null;

                        this.scheduleForm.exam_id = response.exam_id;

                        this.scheduleForm.exam_grade_id = response.exam_grade_id;
                        this.selected_exam_grade = this.scheduleForm.exam_grade_id ? {id: response.exam_grade_id, name: response.grade.name} : null;

                        this.scheduleForm.exam_assessment_id = response.exam_assessment_id;
                        this.selected_exam_assessment = this.scheduleForm.exam_assessment_id ? {id: response.exam_assessment_id, name: response.assessment.name} : null;
                        this.exam_assessment = this.scheduleForm.exam_assessment_id ? response.assessment : {};

                        let batch = this.batch_with_subjects.find(o => o.id == this.scheduleForm.batch_id);
                        this.scheduleForm.records = [];

                        let record = {};
                        batch.subjects.forEach(subject => {
                            record = response.records.find(o => o.subject_id == subject.id);

                            if (typeof record == 'undefined') {
                                record = {
                                    options: {has_no_exam: 0},
                                    date: ''
                                }
                            }

                            let assessment_details = [];
                            if (record.options.assessment_details && Array.isArray(record.options.assessment_details)) {
                                record.options.assessment_details.forEach(detail => {
                                    assessment_details.push({
                                        id: detail.id,
                                        is_applicable: detail.is_applicable,
                                        max_mark: detail.max_mark,
                                        pass_percentage: detail.pass_percentage
                                    })
                                })
                            } else {
                                response.assessment.details.forEach(detail => {
                                    assessment_details.push({
                                        id: detail.id,
                                        is_applicable: true,
                                        max_mark: detail.max_mark,
                                        pass_percentage: detail.pass_percentage
                                    })
                                })
                            }

                            this.scheduleForm.records.push({
                                subject_id: subject.id,
                                subject_name: subject.name+' ('+subject.code+')',
                                has_no_exam: record.date ? 0 : 1,
                                date: record.date,
                                assessment_details: assessment_details
                            });
                        });
                        
                        this.module_id = response.id;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        // this.$router.push('/exam/schedule');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.scheduleForm.patch('/api/exam/schedule/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/exam/schedule');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onBatchSelect(selectedOption){
                this.scheduleForm.batch_id = selectedOption.id;
            },
            onExamSelect(selectedOption){
                this.scheduleForm.batch_id = '';
                this.selected_batch = null;
                this.scheduleForm.records = [];
                if (selectedOption.course_group_id)
                    this.batches = this.all_batches.filter(o => o.course_group === selectedOption.course_group_name);
                else
                    this.batches = this.all_batches;
                this.scheduleForm.exam_id = selectedOption.id;
            },
            onExamGradeSelect(selectedOption){
                this.scheduleForm.exam_grade_id = selectedOption.id;
            },
            onExamAssessmentSelect(selectedOption){
                this.scheduleForm.exam_assessment_id = selectedOption.id;
                this.exam_assessment = this.exam_assessment_with_details.find(o => o.id == selectedOption.id);
                this.scheduleForm.records.forEach(record => {
                    record.assessment_details = [];
                    this.exam_assessment.details.forEach(detail => {
                        record.assessment_details.push({
                            id: detail.id,
                            is_applicable: true,
                            max_mark: detail.max_mark,
                            pass_percentage: detail.pass_percentage
                        });
                    });
                })
            },
            hideExamForm(){
                $('.add-exam-form').modal('hide');
            }
        },
        watch: {
            'scheduleForm.batch_id': function(val) {
                if (!this.id)
                    this.getSubjects();
            }
        }
    }
</script>

<style>
.loading-overlay.is-full-page{
    z-index: 1060;
}
</style>