<template>
    <div>
        <form @submit.prevent="proceed" @keydown="onlineExamQuestionForm.errors.clear($event.target.name)">
            <div class="row">
                <div class="col-12">
                    <div class="form-group">
                        <label for="">{{trans('exam.online_exam_question')}}</label>
                        <autosize-textarea v-model="onlineExamQuestionForm.question" rows="1" name="question" :placeholder="trans('exam.online_exam_question')"></autosize-textarea>
                        <show-error :form-name="onlineExamQuestionForm" prop-name="question"></show-error>
                    </div>
                </div>
                <div class="col-12">
					<upload-image id="image" :button-text="trans('general.choose_image')" upload-path="/online-exam/question/image" remove-path="/online-exam/question/image" :image-source="onlineExamQuestionForm.image" @uploaded="onlineExamQuestionForm.image = $event" @removed="onlineExamQuestionForm.image = ''"></upload-image>
                </div>
                <!-- <div class="col-12 col-sm-4">
                    <div class="form-group">
                        <label for="">{{trans('exam.online_exam_question_type')}}</label>
                        <select v-model="onlineExamQuestionForm.question_type" class="custom-select col-12" name="question_type"@change="onlineExamQuestionForm.errors.clear('question_type')" :disabled="onlineExam.exam_type == 'mcq' ? true : false">
                          <option value="" selected>{{trans('general.select_one')}}</option>
                          <option v-for="option in online_exam_question_types" v-bind:value="option.value">
                            {{ option.text }}
                          </option>
                        </select>
                        <show-error :form-name="onlineExamQuestionForm" prop-name="question_type"></show-error>
                    </div>
                </div> -->
                <div class="col-12 col-sm-4">
                    <div class="form-group">
                        <label for="">{{trans('exam.online_exam_mark')}}</label>
                        <input class="form-control" type="number" v-model="onlineExamQuestionForm.mark" name="mark" :placeholder="trans('exam.online_exam_mark')">
                        <show-error :form-name="onlineExamQuestionForm" prop-name="mark"></show-error>
                    </div>
                </div>
                <div class="col-12" v-if="onlineExamQuestionForm.question_type == 'mcq'" >
		            <div class="row" :key="index" v-for="(option,index) in onlineExamQuestionForm.options">
		                <div class="col-12 col-sm-1">
		                    <button type="button" class="btn btn-danger btn-sm" :key="index" v-confirm="{ok: confirmDelete(index)}" v-tooltip="trans('general.delete')"><i class="fas fa-trash"></i></button>
		                </div>
		                <div class="col-12 col-sm-5">
		                    <div class="form-group">
		                        <autosize-textarea v-model="option.title" rows="1" name="getOptionTitle(index)" :placeholder="trans('exam.online_exam_option_number', {attribute: index+1})"></autosize-textarea>
		                        <show-error :form-name="onlineExamQuestionForm" :prop-name="getOptionTitle(index)"></show-error>
		                    </div>
		                </div>
		                <div class="col-12 col-sm-1">
		                    <div class="form-group">
		                        <label class="custom-control custom-checkbox" v-tooltip="trans('exam.online_exam_is_correct_answer')">
	                                <input type="checkbox" class="custom-control-input" v-model="option.is_correct_answer" value="1">
	                                <span class="custom-control-label" style="font-size: 80%">&nbsp;</span>
	                            </label>
		                    </div>
		                </div>
		                <div class="col-12 col-sm-5">
		                    <upload-image :id="getOptionId(index)" :button-text="trans('general.choose_image')" upload-path="/online-exam/question/image" remove-path="/online-exam/question/image" :image-source="option.image" @uploaded="option.image = $event" @removed="option.image = ''"></upload-image>
		                </div>
		            </div>
		            <div class="row">
		            	<div class="col-12">
		            		<button type="button" class="btn btn-info btn-sm mx-4 m-b-20" @click="addNewOption">{{trans('exam.add_new_option')}}</button>
		            	</div>
		            </div>
                </div>
            </div>

            <button v-if="!id" type="button" class="btn btn-danger waves-effect waves-light " @click="$emit('cancel')">{{trans('general.cancel')}}</button>
            <button type="submit" class="btn btn-info waves-effect waves-light">
                <span v-if="id">{{trans('general.update')}}</span>
                <span v-else>{{trans('general.save')}}</span>
            </button>
        </form>
    </div>
</template>

<script>
	export default {
		props: ['id','onlineExam','question'],
		data() {
			return {
				onlineExamQuestionForm: new Form({
					question: '',
					image: '',
					mark: '',
					question_type: 'mcq',
					options: []
				}),
				online_exam_question_types: []
			}
		},
		mounted() {
			this.getPreRequisite();

			if (this.onlineExam.exam_type == 'mcq') {
				this.onlineExamQuestionForm.question_type = 'mcq'
			}

			if (this.id) {
				this.onlineExamQuestionForm.question = this.question.question;
				this.onlineExamQuestionForm.image = this.question.image;
				this.onlineExamQuestionForm.mark = this.question.mark;
				this.onlineExamQuestionForm.question_type = this.question.question_type;
				this.question.answers.forEach(answer => {
					this.onlineExamQuestionForm.options.push({
						title: answer.title,
						is_correct_answer: answer.is_correct_answer,
						image: answer.image
					});
				});
			}
		},
		methods: {
			getOptionTitle(index) {
				return 'option_title_'+index;
			},
			getOptionId(index) {
				return 'option_id_'+index;
			},
			getPreRequisite(){
				axios.get('/api/online-exam/pre-requisite')
					.then(response => {
						this.online_exam_question_types = response.online_exam_question_types;
					})
			},
            addNewOption(){
                this.onlineExamQuestionForm.options.push({
                    image: '',
                    title: '',
                    is_correct_option: ''
                });
            },
            confirmDelete(index){
                return dialog => this.deleteOption(index);
            },
            deleteOption(index){
                this.onlineExamQuestionForm.options.splice(index, 1);
            },
            proceed() {
            	if (!this.id)
            		this.submit()
            	else
            		this.update()
            },
            submit() {
            	let loader = this.$loading.show();
            	this.onlineExamQuestionForm.post('/api/online-exam/'+this.onlineExam.uuid+'/question')
            		.then(response => {
            			toastr.success(response.message);
            			this.$emit('completed');
            			loader.hide();
            		})
            		.catch(error => {
            			loader.hide();
            			helper.showErrorMsg(error);
            		})
            },
            update() {
            	let loader = this.$loading.show();
            	this.onlineExamQuestionForm.patch('/api/online-exam/'+this.onlineExam.uuid+'/question/'+this.id)
            		.then(response => {
            			toastr.success(response.message);
            			this.$emit('completed');
            			loader.hide();
            		})
            		.catch(error => {
            			loader.hide();
            			helper.showErrorMsg(error);
            		})
            }
		}
	}
</script>	