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
                        <router-link to="/online-exam" class="btn btn-info btn-sm"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('exam.online_exam')}}</span></router-link>
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

		                    <div class="border-top">
		                    	<h4 class="card-title m-3 text-center"><small>{{trans('exam.online_exam_instructions')}}</small></h4>
		                    	<div class="p-4" style="font-size: 90%;" v-html="online_exam.instructions"></div>
		                    </div>

		                    <hr />

							<div v-if="!exam_started" class="mx-4">
								<button type="button" @click="startExam" class="btn btn-success btn-block">{{trans('exam.online_exam_start_button')}}</button>
							</div>
							<div v-else>
			                    <h4 class="card-title m-3">{{trans('exam.online_exam_questions')}}
				                    <span class="pull-right m-r-5" v-if="!is_final_submitted">
										<countdown :time="countdown" :interval="100" tag="p">
										    <template slot-scope="props">{{ props.hours }} {{trans('list.hour')}}, {{ props.minutes }} {{trans('list.minute')}}, {{ props.seconds }}.{{ Math.floor(props.milliseconds / 100) }} {{trans('list.second')}}</template>
										</countdown>
				                    </span>
			                    </h4>

								<form @submit.prevent="submit" @keydown="onlineExamForm.errors.clear($event.target.name)">
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
							                                <input class="form-check-input" :disabled="is_final_submitted ? true : false" type="radio" :value="option.title" :id="`${question.id}_option_${option.title}`" v-model="question.answer" :checked="question.answer == option.title" :name="getAnswerName(index)" @click="">
							                                <label class="form-check-label" :for="`${question.id}_option_${option.title}`"> ({{idx+1}}) {{option.title}}</label>

							                                <span style="margin-left: 10px;" v-if="online_exam.status == 'expired' && option.is_correct_answer"><i class="fas fa-check-circle text-success"></i></span>
							                            </div>
							                        </div>
					                                <div v-if="option.image" style="padding: 10px;"><center><img style="max-width: 150px;" :src="'/'+option.image" /></center></div>
					                            </div>
					                       </div>
					                       <div class="row" v-if="question.question_type == 'single_line'" style="padding-left: 20px;">
					                       		<div class="col-12">
													<input class="form-control" type="text" v-model="question.answer" :disabled="is_final_submitted ? true : false" :name="getAnswerName(index)" :placeholder="trans('exam.online_exam_answer')">
					                       		</div>
					                       </div>
					                       <div class="row" v-if="question.question_type == 'multiple_line'" style="padding-left: 20px;">
					                       		<div class="col-12">
													<autosize-textarea :disabled="is_final_submitted ? true : false" v-model="question.answer" rows="2" :name="getAnswerName(index)" :placeholder="trans('exam.online_exam_answer')"></autosize-textarea>
					                       		</div>
					                       </div>
					                       <button v-if="!is_final_submitted" type="button" @click="submit" class="btn btn-sm btn-info waves-effect waves-light pull-right">{{trans('general.save')}}</button>
					                       <div class="clearfix"></div>
					                    </div>
					                </div>
					                <div class="row" v-if="!is_final_submitted">
					                	<div class="col-12 p-5">
											<button type="button" class="btn btn-danger waves-effect waves-light " @click="$router.push('/online-exam')">{{trans('general.cancel')}}</button>
	                						<button type="button" @click="finalSubmit" class="btn btn-success waves-effect waves-light">{{trans('exam.online_exam_final_submission')}}</button>
					                       <div class="clearfix"></div>
					                	</div>
					                </div>
					            </form>
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
				online_exam: {
					batch: {
						course: {}
					},
					subject: {}
				},
				is_final_submitted: false,
				online_exam_record: {},
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

			if (this.hasRole('student') && this.online_exam.status == 'upcoming') {
				this.$router.push('/online-exam');
			}

			if (this.hasRole('parent') && this.online_exam.status != 'expired') {
				this.$router.push('/online-exam');
			}
		},
		methods: {
			hasRole(role) {
				return helper.hasRole(role);
			},
			getOnlineExam() {
				let loader = this.$loading.show();
				this.onlineExamForm.answers = [];
				axios.get('/api/online-exam/'+this.uuid+'/exam')
					.then(response => {
						this.online_exam = response.online_exam;
						this.questions = response.questions;
						this.countdown = response.countdown;
						this.online_exam_record = response.online_exam_record;
						this.is_final_submitted = response.is_final_submitted;
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
						this.exam_started = response.online_exam_record ? true : false;
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
			},
			submit() {
				let loader = this.$loading.show();
				this.onlineExamForm.post('/api/online-exam/'+this.uuid+'/exam')
					.then(response => {
						toastr.success(response.message);
						loader.hide();
					})
					.catch(error => {
						helper.showErrorMsg(error);
						loader.hide();
					})
			},
			finalSubmit() {
				let loader = this.$loading.show();
				this.onlineExamForm.post('/api/online-exam/'+this.uuid+'/exam?is_final=1')
					.then(response => {
						toastr.success(response.message);
						loader.hide();
						this.getOnlineExam();
					})
					.catch(error => {
						helper.showErrorMsg(error);
						loader.hide();
					})
			},
			startExam() {
				let loader = this.$loading.show();
				this.onlineExamForm.post('/api/online-exam/'+this.uuid+'/exam')
					.then(response => {
						this.getOnlineExam();
						loader.hide();
					})
					.catch(error => {
						helper.showErrorMsg(error);
						loader.hide();
					})
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