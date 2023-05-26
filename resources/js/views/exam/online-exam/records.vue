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
                        <router-link :to="`/online-exam/${online_exam.uuid}/questions`" class="btn btn-info btn-sm"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('exam.online_exam_questions')}}</span></router-link>
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
                            <h4 class="card-title m-3">{{trans('exam.online_exam_records')}}</h4>

                            <div class="table-responsive p-2" v-if="students.length">
                                <table class="table table-bordered table-sm">
                                    <thead>
                                        <tr>
                                            <th>{{trans('exam.online_exam_rank')}}</th>
                                            <th>{{trans('student.student')}}</th>
                                            <th>{{trans('student.roll_number')}}</th>
                                            <th>{{trans('exam.online_exam_start_time')}}</th>
                                            <th>{{trans('exam.online_exam_end_time')}}</th>
                                            <th>{{trans('exam.obtained_mark')}}</th>
                                        </tr>
                                    </thead>
                                    <thead>
                                        <tr v-for="(student,index) in students">
                                            <td>{{index+1}}</td>
                                            <td>
                                                <span v-if="student.record_id"><router-link :to="`/online-exam/${uuid}/records/${student.record_id}/report`">{{student.name}}</router-link></span>
                                                <span v-else>{{student.name}}</span>
                                            </td>
                                            <td>{{student.roll_number}}</td>
                                            <td>{{student.start | momentDateTime}}</td>
                                            <td>{{student.end | momentDateTime}}</td>
                                            <td>{{student.mark}}</td>
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import onlineExamDetail from './detail'

    export default {
        components : { onlineExamDetail },
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
                students: []
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
                axios.get('/api/online-exam/'+this.uuid+'?student=1')
                    .then(response => {
                        this.online_exam = response.online_exam;
                        this.students = response.students;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/dashboard');
                    })
            },
            getStudentName(student){
                return helper.getStudentName(student);
            },
            getRollNumber(student_record){
                return helper.getRollNumber(student_record);
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