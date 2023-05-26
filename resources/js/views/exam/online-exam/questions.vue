<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('exam.online_exam')}}
                        <span class="card-subtitle d-none d-sm-inline" v-if="online_exam">{{online_exam.name}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <router-link to="/online-exam" class="btn btn-info btn-sm"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('exam.online_exam')}}</span></router-link>
                        <router-link :to="`/online-exam/${online_exam.uuid}/records`" class="btn btn-info btn-sm"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('exam.online_exam_record')}}</span></router-link>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-12 col-sm-4">
                    <online-exam-detail :onlineExam="online_exam" @updateExam="getOnlineExam"></online-exam-detail>
                </div>
                <div class="col-12 col-sm-8 p-0">
                    <div class="card">
                        <div class="card-boy">
                            <h4 class="card-title m-3">{{trans('exam.online_exam_instructions')}}
                                <div class="action-buttons pull-right mr-2">
                                    <button class="btn btn-info btn-sm" v-if="online_exam.is_editable" @click="addQuestion"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('exam.add_new_question')}}</span></button>
                                </div>
                            </h4>

                            <div class="border-top" style="font-size: 90%; padding-top: 10px;" v-html="online_exam.instructions"></div>

                            <hr />

                            <h4 class="card-title m-3">{{trans('exam.online_exam_questions')}}</h4>

                            <div v-for="(question,index) in online_exam.questions" class="border-bottom my-2" style="font-size: 90%; margin-right: 20px; padding: 10px; background-color: rgb(241, 243, 244); border-radius: 5px; color: #000;">
                               <p>
                                    ({{index+1}}) {{question.question}} 
                                    <span class="pull-right">({{question.mark}})</span>
                                </p>
                               <div v-if="question.image" style="padding: 10px;"><center><img style="max-width: 250px;" :src="'/'+question.image" /></center></div>

                               <div class="row" v-if="question.question_type == 'mcq'" style="padding-left: 20px;">
                                    <div class="col-6" v-for="(option, idx) in question.answers">
                                        <p>
                                            ({{idx+1}}) {{option.title}}
                                            <i v-if="option.is_correct_answer" class="fas fa-check-circle text-success"></i>
                                            <div v-if="option.image" style="padding: 10px;"><center><img style="max-width: 150px;" :src="'/'+option.image" /></center></div>
                                        </p>
                                    </div>
                               </div>

                               <div class="pull-right" v-if="online_exam.is_editable">
                                   <button type="button" @click="editQuestion(question)" class="btn btn-sm btn-info m-r-5"><i class="fas fa-edit"></i></button>
                                   <button type="button" :key="question.id" v-confirm="{ok: confirmDelete(question)}" class="btn btn-sm btn-danger"><i class="fas fa-times"></i></button>
                               </div>
                               <div class="clearfix"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <transition name="modal" v-if="hasPermission('edit-online-exam') && showQuestionModal">
            <div class="modal-mask">
                <div class="modal-wrapper">
                    <div class="modal-container modal-lg">
                        <div class="modal-header">
                            <slot name="header">
                                {{trans('exam.add_new_question')}}
                                <span class="float-right pointer" @click="showQuestionModal = false">x</span>
                            </slot>
                        </div>
                        <div class="modal-body">
                            <slot name="body">
                                <question-form :id="question.id" :question="question" :onlineExam="online_exam" @completed="getOnlineExam" @cancel="showQuestionModal = !showQuestionModal"></question-form>
                            </slot>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import onlineExamDetail from './detail'
    import questionForm from './question-form'

    export default {
        components : { onlineExamDetail,questionForm },
        data() {
            return {
                uuid:this.$route.params.uuid,
                online_exam: {
                    batch: {
                        course: {}
                    },
                    subject: {},
                    records: [],
                    questions: []
                },
                question: {},
                showQuestionModal: false
            }
        },
        mounted(){
            if(!helper.hasPermission('edit-online-exam')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getOnlineExam();
        },
        methods: {
            hasPermission(permission) {
                return helper.hasPermission(permission);
            },
            getOnlineExam(){
                this.showQuestionModal = false;
                let loader = this.$loading.show();
                axios.get('/api/online-exam/'+this.uuid)
                    .then(response => {
                        this.online_exam = response.online_exam;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/dashboard');
                    })
            },
            addQuestion(){
                this.question = {}
                this.showQuestionModal = true;
            },
            editQuestion(question) {
                this.question = question;
                this.showQuestionModal = true;
            },
            confirmDelete(question){
                return dialog => this.deleteQuestion(question);
            },
            deleteQuestion(question){
                let loader = this.$loading.show();
                axios.delete('/api/online-exam/'+this.uuid+'/question/'+question.id)
                    .then(response => {
                        this.getOnlineExam();
                        toastr.success(response.message);
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
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