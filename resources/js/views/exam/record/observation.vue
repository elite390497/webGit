<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('exam.record_observation')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/exam/record')"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('exam.record')}}</span></button>
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
			            </div>
			            <div class="card-footer text-right">
			                <button type="button" v-if="! disable_filter" @click="getStudents" class="btn btn-info waves-effect waves-light">{{trans('general.proceed')}}</button>
                            <button type="button" v-else @click="resetFilter" class="btn btn-danger m-r-10">{{trans('general.reset')}}</button>
			            </div>

                        <div class="row" v-if="recordForm.observation_marks.length">
                            <div class="col-12 col-sm-3">
                                <button class="btn btn-sm btn-info" type="button" v-if="show_comment" @click="show_comment = !show_comment">{{trans('exam.hide_comment')}}</button>
                                <button class="btn btn-sm btn-info" type="button" v-else @click="show_comment = !show_comment">{{trans('exam.show_comment')}}</button>
                            </div>
                            <div class="col-12 col-sm-3" v-for="detail in exam_observation.details">
                                <div class="form-group">
                                    <label>{{detail.name}}</label>
                                    <br />
                                    <span class="help-block font-80pc">{{trans('exam.observation_detail', {max_mark: detail.max_mark})}}</span>
                                </div>
                            </div>
                        </div>

                        <div class="row" v-for="(mark,index) in recordForm.observation_marks">
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    {{mark.name}} {{mark.roll_number}}
                                </div>
                            </div>
                            <div class="col-12 col-sm-3" v-for="(ob_mark, idx) in mark.ob_marks">
                                <div class="form-group">
                                    <input :disabled="disable_input" class="form-control" type="text" v-model="ob_mark.ob" :name="getMarkName(index, idx)" :placeholder="trans('exam.obtained_mark')">
                                    <show-error :form-name="recordForm" :prop-name="getMarkName(index, idx)"></show-error>
                                </div>
                            </div>
                            <div class="col-12" v-if="show_comment">
                                <div class="row">
                                    <div class="col-12 col-sm-3">
                                        
                                    </div>
                                    <div class="col-12 col-sm-9">
                                        <div class="form-group">
                                            <autosize-textarea :disabled="disable_input" v-model="mark.comment" rows="1" :name="getCommentName(index)" :placeholder="trans('exam.mark_comment')"></autosize-textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="card-footer text-right" v-if="recordForm.observation_marks.length && ! disable_input">
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
                    observation_marks: []
                },false),
                all_batches: [],
                batches: [],
                selected_batch: null,
                exams: [],
                selected_exam: null,
                student_records: [],
                exam_observation: {},
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
                axios.get('/api/exam/record/observation/pre-requisite')
                    .then(response => {
                        this.all_batches = response.batches;
                        this.exams = response.exams;

                        if(this.id)
                            this.get();

                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            resetFilter(){
                this.recordForm.observation_marks = [];
                this.student_records = [];
                this.exam_observation = {};
                this.disable_filter = false;
            },
            getStudents(){
                let loader = this.$loading.show();
                this.disable_filter = true;

                axios.post('/api/exam/record/observation/student', {
                	exam_id: this.recordForm.exam_id,
                	batch_id: this.recordForm.batch_id
                })
                .then(response => {
                    this.student_records = response.student_records;
                    this.exam_observation = response.exam_observation;
                    this.disable_input = response.exam_schedule.disable_input;
                    this.recordForm.observation_marks = [];
                    this.student_records.forEach(student_record => {
                        let comment = '';
                        if (response.exam_schedule && response.exam_schedule.observation_marks) {
                            let mark = response.exam_schedule.observation_marks.find(o => o.id == student_record.id);

                            if (typeof mark != 'undefined') {
                                if (mark.hasOwnProperty('comment')) {
                                    comment = mark.comment;
                                }
                            }
                        }

                        let ob_marks = [];
                        this.exam_observation.details.forEach(detail => {
                            let observation_ob = 0;
                            let observation_comment = '';
                            if (response.exam_schedule && response.exam_schedule.observation_marks) {
                                let mark = response.exam_schedule.observation_marks.find(o => o.id == student_record.id);
                                if (typeof mark != 'undefined' && mark.hasOwnProperty('observation_details')) {
                                    let observation_detail = mark.observation_details.find(o => o.id == detail.id);
                                    if (typeof observation_detail != 'undefined') {
                                        observation_ob = observation_detail.ob;
                                        observation_comment = observation_detail.comment;
                                    }
                                }
                            }

                            ob_marks.push({
                                id: detail.id,
                                ob: observation_ob,
                                comment: observation_comment
                            })
                        });

                        this.recordForm.observation_marks.push({
                            id: student_record.id,
                            name: helper.getStudentName(student_record.student),
                            roll_number: helper.getRollNumber(student_record),
                            ob_marks: ob_marks,
                            comment: comment
                        });
                    });

                    this.recordForm.observation_marks.sort(function(a, b) {
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
                this.recordForm.post('/api/exam/record/observation')
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
                axios.post('/api/exam/record/observation/delete', {
                        batch_id: this.recordForm.batch_id,
                        exam_id: this.recordForm.exam_id
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
            }
        },
        watch: {
        }
	}
</script>