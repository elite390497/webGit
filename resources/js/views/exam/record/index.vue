<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('exam.record')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/exam/record/observation')"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('exam.record_observation')}}</span></button>
                        <button class="btn btn-info btn-sm" @click="$router.push('/exam/schedule')"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('exam.schedule')}}</span></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card card-form">
                <div class="card-body p-t-20">
			        <form @submit.prevent="submit" @keydown="recordForm.errors.clear($event.target.name)">
			            <div class="row">
			                <div class="col-12 col-sm-3">
			                    <div class="form-group">
			                        <label for="">{{trans('exam.exam')}} </label>
			                        <v-select label="name" :disabled="disable_filter" v-model="selected_exam" name="exam_id" id="exam_id" :options="exams" :placeholder="trans('exam.select_exam')" @select="onExamSelect" @close="recordForm.errors.clear('exam_id')" @remove="recordForm.exam_id = ''">
			                            <div class="multiselect__option" slot="afterList" v-if="!exams.length">
			                                {{trans('general.no_option_found')}}
			                            </div>
			                        </v-select>
			                        <show-error :form-name="recordForm" prop-name="exam_id"></show-error>
			                    </div>
			                </div>
			                <div class="col-12 col-sm-3">
			                    <div class="form-group">
			                        <label for="">{{trans('academic.batch')}} </label>
			                        <v-select label="name" :disabled="disable_filter" v-model="selected_batch" group-values="batches" group-label="course_group" :group-select="false" name="batch_id" id="batch_id" :options="batches" :placeholder="trans('academic.select_batch')" @select="onBatchSelect" @close="recordForm.errors.clear('batch_id')" @remove="recordForm.batch_id = ''">
			                            <div class="multiselect__option" slot="afterList" v-if="!batches.length">
			                                {{trans('general.no_option_found')}}
			                            </div>
			                        </v-select>
			                        <show-error :form-name="recordForm" prop-name="batch_id"></show-error>
			                    </div>
			                </div>
			                <div class="col-12 col-sm-3">
			                    <div class="form-group">
			                        <label for="">{{trans('academic.subject')}} </label>
			                        <v-select label="name" :disabled="disable_filter" v-model="selected_subject" name="subject_id" id="subject_id" :options="subjects" :placeholder="trans('academic.select_subject')" @select="onSubjectSelect" @close="recordForm.errors.clear('subject_id')" @remove="recordForm.subject_id = ''">
			                            <div class="multiselect__option" slot="afterList" v-if="!subjects.length">
			                                {{trans('general.no_option_found')}}
			                            </div>
			                        </v-select>
			                        <show-error :form-name="recordForm" prop-name="subject_id"></show-error>
			                    </div>
			                </div>
			            </div>
			            <div class="card-footer text-right">
			                <button type="button" v-if="! disable_filter" @click="getStudents" class="btn btn-info waves-effect waves-light">{{trans('general.proceed')}}</button>
                            <button type="button" v-else @click="resetFilter" class="btn btn-danger m-r-10">{{trans('general.reset')}}</button>
			            </div>

                        <div class="row" v-if="recordForm.marks.length">
                            <div class="col-12 col-sm-3">
                                </div>
                            <div class="col-12 col-sm-2" v-for="detail in exam_assessment.details" v-if="detail.is_applicable">
                                <div class="form-group">
                                    <label>{{detail.name}}</label>
                                    <br />
                                    <span class="help-block font-80pc">{{trans('exam.assessment_detail', {max_mark: getRecordMaxMark(detail), pass_percentage: getRecordPassPercentage(detail)})}}</span>
                                </div>
                            </div>
                        </div>

                        <div class="row" v-for="(mark,index) in recordForm.marks">
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    {{mark.name}} {{mark.roll_number}}
                                </div>
                            </div>
                            <template>
                                <div class="col-12 col-sm-2" v-for="(ob_mark, idx) in mark.ob_marks">
                                    <div class="form-group">
                                        <input class="form-control" type="text" v-model="ob_mark.ob" :name="getMarkName(index, idx)" :placeholder="trans('exam.obtained_mark')">
                                        <show-error :form-name="recordForm" :prop-name="getMarkName(index, idx)"></show-error>
                                    </div>
                                </div>

                            </template>
                        </div>

                        <div class="card-footer text-right" v-if="recordForm.marks.length && ! disable_input">
                            <button type="button" class="btn btn-danger" key="delete-record" v-confirm="{ok: confirmDelete()}">{{trans('general.delete')}}</button>
                            <button type="submit" class="btn btn-info waves-effect waves-light">{{trans('general.save')}}</button>
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
                recordForm: new Form({
                    batch_id: '',
                    exam_id: '',
                    subject_id: '',
                    marks: []
                },false),
                all_batches: [],
                batches: [],
                selected_batch: null,
                exams: [],
                selected_exam: null,
                subjects: [],
                selected_subject: null,
                batch_with_subjects: [],
                student_records: [],
                exam_assessment: {},
                exam_record: {},
                disable_filter: false,
                disable_input: true,
                show_comment: false
            }
        },
        mounted(){
            if(!helper.hasPermission('store-exam-mark')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getPreRequisite();
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getMarkName(index, idx){
                return index+'_'+idx+'_mark';
            },
            getCommentName(index){
                return index+'_comment';
            },
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/exam/record/pre-requisite')
                    .then(response => {
                        this.all_batches = response.batches;
                        this.exams = response.exams;
                        this.batch_with_subjects = response.batch_with_subjects;

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

                this.subjects = [];
                this.selected_subject = null;
                let batch = this.batch_with_subjects.find(o => o.id == this.recordForm.batch_id);

                if (typeof batch == 'undefined') {
               		loader.hide();
                	return;
                }

                batch.subjects.forEach(subject => {
                	this.subjects.push({
                		id: subject.id,
                		name: subject.name+' ('+subject.code+')'
                	});
                });

               	loader.hide();
            },
            resetFilter(){
                this.recordForm.marks = [];
                this.student_records = [];
                this.exam_assessment = {};
                this.disable_filter = false;
            },
            getRecordMaxMark(detail){
                if (this.exam_record) {
                    let assessment_details = this.exam_record.options.hasOwnProperty('assessment_details') ? this.exam_record.options.assessment_details : [];
                    let assessment_detail = assessment_details.find(o => o.id == detail.id);

                    if (typeof assessment_detail != 'undefined') {
                        return assessment_detail.max_mark;
                    } else {
                        return detail.max_mark;
                    }
                } else {
                    return detail.max_mark;
                }
            },
            getRecordPassPercentage(detail){
                if (this.exam_record) {
                    let assessment_details = this.exam_record.options.hasOwnProperty('assessment_details') ? this.exam_record.options.assessment_details : [];
                    let assessment_detail = assessment_details.find(o => o.id == detail.id);

                    if (typeof assessment_detail != 'undefined') {
                        return assessment_detail.pass_percentage;
                    } else {
                        return detail.pass_percentage;
                    }
                } else {
                    return detail.pass_percentage;
                }
            },
            getStudents(){
                let loader = this.$loading.show();
                this.disable_filter = true;

                axios.post('/api/exam/record/student', {
                	exam_id: this.recordForm.exam_id,
                	batch_id: this.recordForm.batch_id,
                	subject_id: this.recordForm.subject_id
                })
                .then(response => {
                    this.student_records = response.student_records;
                    this.exam_assessment = response.exam_assessment;
                    this.disable_input = response.exam_record.disable_input;
                    this.exam_record = response.exam_record;
                    this.recordForm.marks = [];
                    this.student_records.forEach(student_record => {
                        let is_absent = 0;
                        let comment = '';
                        if (response.exam_record && response.exam_record.marks) {
                            let mark = response.exam_record.marks.find(o => o.id == student_record.id);

                            if (typeof mark != 'undefined') {
                                if (mark.hasOwnProperty('is_absent')) {
                                    is_absent = mark.is_absent ? 1 : 0;
                                }
                                if (mark.hasOwnProperty('comment')) {
                                    comment = mark.comment;
                                }
                            }
                        }

                        if (this.exam_record.options.hasOwnProperty('assessment_details')) {
                            this.exam_assessment.details.forEach(detail => {
                                let assessment_detail = this.exam_record.options.assessment_details.find(o => o.id == detail.id);
                                if (typeof assessment_detail != 'undefined') {
                                    detail.max_mark = assessment_detail.max_mark;
                                    detail.pass_percentage = assessment_detail.pass_percentage;
                                    detail.is_applicable = assessment_detail.is_applicable;
                                } else {
                                    detail.is_applicable = true;
                                }
                            })
                        }

                        let ob_marks = [];
                        this.exam_assessment.details.forEach(detail => {
                            let assessment_ob = 0;
                            let assessment_comment = '';
                            let assessment_is_absent = 0;
                            if (response.exam_record && response.exam_record.marks) {
                                let mark = response.exam_record.marks.find(o => o.id == student_record.id);
                                if (typeof mark != 'undefined' && mark.hasOwnProperty('assessment_details')) {
                                    let assessment_detail = mark.assessment_details.find(o => o.id == detail.id);
                                    if (typeof assessment_detail != 'undefined') {
                                        assessment_ob = assessment_detail.ob;
                                        assessment_is_absent = assessment_detail.is_absent ? 1 : 0;
                                        assessment_comment = assessment_detail.comment;
                                    }
                                }
                            }

                            detail.is_applicable = detail.hasOwnProperty('is_applicable') ? detail.is_applicable : true;

                            if (detail.is_applicable) {
                                ob_marks.push({
                                    id: detail.id,
                                    ob: assessment_ob,
                                    is_absent: assessment_is_absent,
                                    comment: assessment_comment
                                })
                            }
                        });

                        this.recordForm.marks.push({
                            id: student_record.id,
                            name: helper.getStudentName(student_record.student),
                            roll_number: helper.getRollNumber(student_record),
                            is_absent: is_absent,
                            ob_marks: ob_marks,
                            comment: comment
                        });
                    });

                    this.recordForm.marks.sort(function(a, b) {
                      var nameA = a.name.toUpperCase();
                      var nameB = b.name.toUpperCase();
                      if (nameA < nameB) {
                        return -1;
                      }
                      if (nameA > nameB) {
                        return 1;
                      }
                      return 0;
                    });

                    loader.hide();
                })
                .catch(error => {
                    this.disable_filter = false;
                	loader.hide();
                	helper.showErrorMsg(error);
                });

            },
            submit(){
                let loader = this.$loading.show();
                this.recordForm.post('/api/exam/record')
                    .then(response => {
                        loader.hide();
                        toastr.success(response.message);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            confirmDelete(){
                return dialog => this.deleteRecord();
            },
            deleteRecord(){
                let loader = this.$loading.show();
                axios.post('/api/exam/record/delete', {
                        batch_id: this.recordForm.batch_id,
                        exam_id: this.recordForm.exam_id,
                        subject_id: this.recordForm.subject_id
                    })
                    .then(response => {
                        toastr.success(response.message);
                        this.getStudents();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onBatchSelect(selectedOption){
                this.recordForm.batch_id = selectedOption.id;
            },
            onExamSelect(selectedOption){
                this.recordForm.batch_id = '';
                this.selected_batch = null;
                if (selectedOption.course_group_id)
                    this.batches = this.all_batches.filter(o => o.course_group === selectedOption.course_group_name);
                else
                    this.batches = this.all_batches;
                
                this.recordForm.exam_id = selectedOption.id;
            },
            onSubjectSelect(selectedOption){
                this.recordForm.subject_id = selectedOption.id;
            }
        },
        watch: {
            'recordForm.batch_id': function(val) {
                if (!this.id)
                    this.getSubjects();
            }
        }
	}
</script>