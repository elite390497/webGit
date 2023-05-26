<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('exam.online_exam')}}
                        <span class="card-subtitle d-none d-sm-inline" v-if="online_exam">{{online_exam.name}} ({{trans('exam.online_exam_type_'+online_exam.exam_type)}})</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <router-link :to="`/online-exam/${uuid}/records`" class="btn btn-info btn-sm"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('exam.online_exam')}}</span></router-link>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
        	<div class="row">
        		<div class="col-12">
		            <div class="card">
		                <div class="card-boy" v-if="online_exam">
		                    <h4 class="card-title m-3 text-center">
			                    {{ online_exam.batch.course.name+' '+online_exam.batch.name }}
			                    {{ online_exam.subject.name+' ('+online_exam.subject.code+')' }}
			                </h4>
		                    <h4 class="card-title m-3 text-center">
		                    	<small>{{online_exam.date | moment }} {{online_exam.start_time | momentTime }} {{trans('general.to')}} {{online_exam.end_time | momentTime}} </small> <br />
		                    </h4>

		                    <div class="row px-4 pb-4 text-center">
		                    	<div class="col-6">
		                    		<strong>{{trans('student.student')}}:</strong> {{getStudentName(online_exam_record.student_record.student)}}
		                    	</div>
		                    	<div class="col-6">
			                    	<strong>{{trans('student.roll_number')}}:</strong> {{getRollNumber(online_exam_record.student_record)}}
		                    	</div>
		                    	<div class="col-6">
			                    	<strong>{{trans('academic.batch')}}:</strong> {{online_exam_record.student_record.batch.course.name+' '+online_exam_record.student_record.batch.name}}
		                    	</div>
		                    	<div class="col-6">
			                    	<strong>{{trans('exam.online_exam_start_time')}}:</strong> {{online_exam_record.start | momentDateTime}}
		                    	</div>
		                    	<div class="col-6">
			                    	<strong>{{trans('exam.online_exam_end_time')}}:</strong> {{online_exam_record.end | momentDateTime}}
		                    	</div>
		                    	<div class="col-6">
			                    	<strong>{{trans('exam.obtained_mark')}}:</strong> {{online_exam_record.obtained_mark}}
			                    </div>
		                    </div>

		                    <div class="border-top">
		                    	<h4 class="card-title m-3 text-center"><small>{{trans('exam.online_exam_instructions')}}</small></h4>
		                    	<div class="p-4" style="font-size: 90%;" v-html="online_exam.instructions"></div>
		                    </div>

		                    <hr />

		                    <h4 class="card-title m-3">{{trans('exam.online_exam_questions')}}</h4>

							<div class="p-4">
			                    <div v-for="(question,index) in onlineExamForm.answers" class="border-bottom my-2" style="font-size: 90%; padding: 10px; background-color: rgb(241, 243, 244); border-radius: 5px; color: #000;">
			                       <p>
			                            ({{index+1}}) {{question.question}} 
			                            <span class="pull-right">({{question.mark}})</span>
			                        </p>
			                       <div v-if="question.image" style="padding: 10px;"><center><img style="max-width: 250px;" :src="'/'+question.image" /></center></div>

			                       <div class="row" v-if="question.question_type == 'mcq'" style="padding-left: 20px;">
			                            <div class="col-6" v-for="(option, idx) in question.answers">
			                            	<div class="radio radio-info">
				                            	<div class="form-check form-check-inline">
					                                <input class="form-check-input" :disabled="true" type="radio" :value="option.title" :id="`${question.id}_option_${option.title}`" v-model="question.answer" :checked="question.answer == option.title" :name="getAnswerName(index)" @click="">
					                                <label class="form-check-label" :for="`${question.id}_option_${option.title}`"> ({{idx+1}}) {{option.title}}</label>

					                                <span style="margin-left: 10px;" v-if="online_exam.status == 'expired' && option.is_correct_answer"><i class="fas fa-check-circle text-success"></i></span>
					                            </div>
					                        </div>
			                                <div v-if="option.image" style="padding: 10px;"><center><img style="max-width: 150px;" :src="'/'+option.image" /></center></div>
			                            </div>
			                       </div>
			                       <div class="row" v-if="question.question_type == 'single_line'" style="padding-left: 20px;">
			                       		<div class="col-12">
											<input class="form-control" type="text" v-model="question.answer" :disabled="true" :name="getAnswerName(index)" :placeholder="trans('exam.online_exam_answer')">
			                       		</div>
			                       </div>
			                       <div class="row" v-if="question.question_type == 'multiple_line'" style="padding-left: 20px;">
			                       		<div class="col-12">
											<autosize-textarea :disabled="true" v-model="question.answer" rows="2" :name="getAnswerName(index)" :placeholder="trans('exam.online_exam_answer')"></autosize-textarea>
			                       		</div>
			                       </div>
			                       <div class="clearfix"></div>
			                    </div>
			                </div>
		                </div>
		            </div>
		        </div>
		    </div>
        </div>
    </div>	
</template>

<script>
	export default {
		data() {
			return {
				uuid:this.$route.params.uuid,
				id:this.$route.params.id,
				online_exam: {
					batch: {
						course: {}
					},
					subject: {}
				},
				online_exam_record: {
					student_record: {
						student: {
							parent: {}
						},
						batch: {
							course: {}
						}
					}
				},
				onlineExamForm: new Form({
					answers: [],
				},false),
				exam_started: false,
				questions: [],
				countdown: 0
			}
		},
		mounted() {
			this.getOnlineExam();

			if (this.hasAnyRole(['student','parent'])) {
				this.$router.push('/online-exam');
			}
		},
		methods: {
			hasAnyRole(role) {
				return helper.hasAnyRole(role);
			},
			getStudentName(student) {
				return helper.getStudentName(student);
			},
			getRollNumber(student_record) {
				return helper.getRollNumber(student_record);
			},
			getOnlineExam() {
				let loader = this.$loading.show();
				this.onlineExamForm.answers = [];
				axios.get('/api/online-exam/'+this.uuid+'/exam/'+this.id)
					.then(response => {
						this.online_exam = response.online_exam;
						this.questions = response.questions;
						this.online_exam_record = response.online_exam_record;
						this.questions.forEach(question => {

							let answer = '';
							if (this.online_exam_record) {
								let question_answer = this.online_exam_record.answers.find(o => o.question_id == question.id);

								if (typeof question_answer !== undefined) {
									answer = question_answer.answer;
								}
							}

							this.onlineExamForm.answers.push({
								...question,
								answer: answer
							})
						})
						loader.hide();
					})
					.catch(error => {
						helper.showErrorMsg(Error);
						loader.hide();
						this.$router.push('/online-exam');
					})
			},
			getAnswerName(index) {
				return 'answer_'+index
			}
		},
        filters: {
          moment(date) {
            return helper.formatDate(date);
          },
          momentTime(time) {
            return helper.formatTime(time);
          },
          momentDateTime(date) {
            return helper.formatDateTime(date);
          }
        },
	}
</script>