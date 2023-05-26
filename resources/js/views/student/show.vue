<template>
    <div>
        <div class="page-titles" v-if="student.id">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('student.student_detail')}}
                        <span class="card-subtitle">{{getStudentName(student)}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <router-link to="/student/card-view" class="btn btn-info btn-sm"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('student.student')}}</span></router-link>
                        <router-link v-if="hasPermission('edit-student')" :to="`/student/${student.uuid}/edit`" class="btn btn-info btn-sm"><i class="fas fa-pencil-alt"></i> <span class="d-none d-sm-inline">{{trans('student.edit_student')}}</span></router-link>
                        <div class="btn-group" v-if="student.student_records.length">
                            <button type="button" class="btn btn-info btn-sm dropdown-toggle no-caret " role="menu" id="moreOption" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-tooltip="trans('general.more_option')">
                                <i class="fas fa-ellipsis-h"></i> <span class="d-none d-sm-inline"></span>
                            </button>
                            <div :class="['dropdown-menu',getConfig('direction') == 'ltr' ? 'dropdown-menu-right' : '']" aria-labelledby="moreOption">
                                <button v-for="student_record in student.student_records" class="dropdown-item custom-dropdown" @click="$router.push('/student/'+student.uuid+'/fee/'+student_record.id)"><i class="fas fa-file"></i> {{student_record.batch.course.name}} {{trans('finance.fee_allocation')}}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-12 col-sm-8 p-0">
                    <div class="card">
                        <div class="card-body">
                            <div id="accordion" class="accordion" v-if="student.id">
                                <div class="card" style="overflow: visible;">
                                    <div class="card-header collapsed" id="basic" @click="tab = 'basic'" data-toggle="collapse" data-target="#collapseBasic" aria-expanded="false" aria-controls="collapseBasic">
                                       <h5><i class="fas fa-lg fa-graduation-cap fa-fix-w-32"></i> {{trans('student.basic_information')}}</h5>
                                    </div>

                                    <div id="collapseBasic" class="collapse" aria-labelledby="basic" data-parent="#accordion">
                                        <div class="card-body">
                                            <basic-detail :student="student" v-if="tab == 'basic'"></basic-detail>
                                        </div>
                                    </div>
                                </div>
                                <div class="card" style="overflow: visible;">
                                    <div class="card-header collapsed" id="parent" @click="tab = 'parent'" data-toggle="collapse" data-target="#collapseParent" aria-expanded="false" aria-controls="collapseParent">
                                        <h5><i class="fas fa-lg fa-users fa-fix-w-32"></i> {{trans('student.parent_information')}}</h5>
                                    </div>

                                    <div id="collapseParent" class="collapse" aria-labelledby="parent" data-parent="#accordion">
                                        <div class="card-body">
                                            <parent-detail :student="student" v-if="tab == 'parent'"></parent-detail>
                                        </div>
                                    </div>
                                </div>
                                <div class="card" style="overflow: visible;">
                                    <div class="card-header collapsed" id="contact" @click="tab = 'contact'" data-toggle="collapse" data-target="#collapseContact" aria-expanded="false" aria-controls="collapseContact">
                                        <h5><i class="fas fa-lg fa-address-book fa-fix-w-32"></i> {{trans('student.contact_information')}}</h5>
                                    </div>

                                    <div id="collapseContact" class="collapse" aria-labelledby="contact" data-parent="#accordion">
                                        <div class="card-body">
                                            <contact-detail :student="student" v-if="tab == 'contact'"></contact-detail>
                                        </div>
                                    </div>
                                </div>
                                <div class="card" style="overflow: visible;">
                                    <div class="card-header collapsed" id="document" @click="tab = 'document'" data-toggle="collapse" data-target="#collapseDocument" aria-expanded="false" aria-controls="collapseDocument">
                                        <h5><i class="fas fa-lg fa-folder fa-fix-w-32"></i> {{trans('student.document_information')}}</h5>
                                    </div>

                                    <div id="collapseDocument" class="collapse" aria-labelledby="document" data-parent="#accordion">
                                        <div class="card-body">
                                            <document-detail :read-mode="true" :student="student" v-if="tab == 'document'"></document-detail>
                                        </div>
                                    </div>
                                </div>
                                <div class="card" style="overflow: visible;">
                                    <div class="card-header collapsed" id="qualification" @click="tab = 'qualification'" data-toggle="collapse" data-target="#collapseQualification" aria-expanded="false" aria-controls="collapseQualification">
                                        <h5><i class="fas fa-lg fa-book fa-fix-w-32"></i> {{trans('student.qualification_information')}}</h5>
                                    </div>

                                    <div id="collapseQualification" class="collapse" aria-labelledby="qualification" data-parent="#accordion">
                                        <div class="card-body">
                                            <qualification-detail :read-mode="true" :student="student" v-if="tab == 'qualification'"></qualification-detail>
                                        </div>
                                    </div>
                                </div>
                                <div class="card" style="overflow: visible;">
                                    <div class="card-header collapsed" id="sibling" @click="tab = 'sibling'" data-toggle="collapse" data-target="#collapseSibling" aria-expanded="false" aria-controls="collapseSibling">
                                        <h5><i class="fas fa-lg fa-people-carry fa-fix-w-32"></i> {{trans('student.sibling_information')}}</h5>
                                    </div>

                                    <div id="collapseSibling" class="collapse" aria-labelledby="sibling" data-parent="#accordion">
                                        <div class="card-body">
                                            <sibling-detail :read-mode="true" :student="student" v-if="tab == 'sibling'"></sibling-detail>
                                        </div>
                                    </div>
                                </div>
                                <div class="card" style="overflow: visible;">
                                    <div class="card-header collapsed" id="account" @click="tab = 'account'" data-toggle="collapse" data-target="#collapseAccount" aria-expanded="false" aria-controls="collapseAccount">
                                        <h5><i class="fas fa-lg fa-university fa-fix-w-32"></i> {{trans('student.account_information')}}</h5>
                                    </div>

                                    <div id="collapseAccount" class="collapse" aria-labelledby="account" data-parent="#accordion">
                                        <div class="card-body">
                                            <account-detail :read-mode="true" :student="student" v-if="tab == 'account'"></account-detail>
                                        </div>
                                    </div>
                                </div>
                                <div class="card" v-if="student.student_records.length" style="overflow: visible;">
                                    <div class="card-header collapsed" id="login" @click="tab = 'login'" data-toggle="collapse" data-target="#collapseUserLogin" aria-expanded="false" aria-controls="collapseUserLogin">
                                        <h5><i class="fas fa-lg fa-sign-in-alt fa-fix-w-32"></i> {{trans('auth.user_login')}}</h5>
                                    </div>

                                    <div id="collapseUserLogin" class="collapse" aria-labelledby="login" data-parent="#accordion">
                                        <div class="card-body">
                                            <login-detail :student="student" v-if="tab == 'login'"></login-detail>
                                        </div>
                                    </div>
                                </div>
                                <div class="card" v-if="student.student_records.length && hasPermission('list-student-fee')" style="overflow: visible;">
                                    <div class="card-header collapsed" id="fee" @click="tab = 'fee'" data-toggle="collapse" data-target="#collapseFee" aria-expanded="false" aria-controls="collapseFee">
                                        <h5><i class="fas fa-lg fa-coins fa-fix-w-32"></i> {{trans('student.fee_history')}}</h5>
                                    </div>

                                    <div id="collapseFee" class="collapse" aria-labelledby="fee" data-parent="#accordion">
                                        <div class="card-body">
                                            <fee-detail :read-mode="true" :student="student" v-if="tab == 'fee'"></fee-detail>
                                        </div>
                                    </div>
                                </div>
                                <div class="card" v-if="student.student_records.length" style="overflow: visible;">
                                    <div class="card-header collapsed" id="attendance" @click="tab = 'attendance'" data-toggle="collapse" data-target="#collapseAttendance" aria-expanded="false" aria-controls="collapseAttendance">
                                        <h5><i class="fas fa-lg fa-tasks fa-fix-w-32"></i> {{trans('student.attendance_history')}}</h5>
                                    </div>

                                    <div id="collapseAttendance" class="collapse" aria-labelledby="attendance" data-parent="#accordion">
                                        <div style="padding: 1.5rem 1.5rem 0 2.5rem;">
                                            <attendance-detail :student="student" v-if="tab == 'attendance'"></attendance-detail>
                                        </div>
                                    </div>
                                </div>
                                <div class="card" v-if="student.student_records.length" style="overflow: visible;">
                                    <div class="card-header collapsed" id="exam" @click="tab = 'exam'" data-toggle="collapse" data-target="#collapseExam" aria-expanded="false" aria-controls="collapseExam">
                                        <h5><i class="fas fa-lg fa-file-alt fa-fix-w-32"></i> {{trans('exam.exam_report')}}</h5>
                                    </div>

                                    <div id="collapseExam" class="collapse" aria-labelledby="exam" data-parent="#accordion">
                                        <div style="padding: 1.5rem 1.5rem 0 2.5rem;">
                                            <exam-report :student="student" v-if="tab == 'exam'"></exam-report>
                                        </div>
                                    </div>
                                </div>
                                <div class="card" v-if="student.student_records.length" style="overflow: visible;">
                                    <div class="card-header collapsed" id="promotion" @click="tab = 'promotion'" data-toggle="collapse" data-target="#collapsePromotion" aria-expanded="false" aria-controls="collapsePromotion">
                                        <h5><i class="fas fa-lg fa-chart-line fa-fix-w-32"></i> {{trans('student.promotion_history')}}</h5>
                                    </div>

                                    <div id="collapsePromotion" class="collapse" aria-labelledby="promotion" data-parent="#accordion">
                                        <div class="card-body">
                                            <promotion-detail :read-mode="true" :student="student" v-if="tab == 'promotion'"></promotion-detail>
                                        </div>
                                    </div>
                                </div>
                                <div class="card" v-if="student.student_records.length" style="overflow: visible;">
                                    <div class="card-header collapsed" id="termination" @click="tab = 'termination'" data-toggle="collapse" data-target="#collapseTermination" aria-expanded="false" aria-controls="collapseTermination">
                                        <h5><i class="fas fa-lg fa-sign-out-alt fa-fix-w-32"></i> {{trans('student.termination_history')}}</h5>
                                    </div>

                                    <div id="collapseTermination" class="collapse" aria-labelledby="termination" data-parent="#accordion">
                                        <div class="card-body">
                                            <termination-detail :read-mode="true" :student="student" v-if="tab == 'termination'"></termination-detail>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-4 hidden-sm-down p-0 border-left">
                    <div class="card">
                        <div class="card-body p-r-20">
                            <div class="m-3 text-center">
                                <span>
                                    <template v-if="!student.student_photo">
                                        <img v-if="student.gender == 'female'" src="/images/avatar_female_kid.png" class="img-circle">
                                        <img v-else src="/images/avatar_male_kid.png" class="img-circle">
                                    </template>
                                    <template v-else>
                                        <img :src="`/${student.student_photo}`" class="img-circle">
                                    </template>
                                </span>
                            </div>
                            <div class="table-responsive" v-if="student.id">
                                <table class="table table-sm custom-show-table">
                                    <tbody>
                                        <tr>
                                            <td>{{trans('student.name')}}</td>
                                            <td>{{getStudentName(student)}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('student.father_name')}}</td>
                                            <td>{{student.parent ? student.parent.father_name : ''}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('student.mother_name')}}</td>
                                            <td>{{student.parent ? student.parent.mother_name : ''}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('student.contact_number')}}</td>
                                            <td>{{student.contact_number}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('student.gender')}}</td>
                                            <td>{{trans('list.'+student.gender)}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('student.date_of_birth')}}</td>
                                            <td>{{student.date_of_birth | moment}}</td>
                                        </tr>
                                    </tbody>
                                </table>


                                <table class="table table-sm custom-show-table" v-for="student_record in currentStudentRecords">
                                    <tbody>
                                        <tr>
                                            <td>{{trans('academic.batch')}}</td>
                                            <td><span v-html="getStatus(student_record)"></span> {{student_record.batch.course.name+' '+student_record.batch.name+' '+student_record.academic_session.name}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('student.date_of_admission')}}</td>
                                            <td>{{student_record.admission.date_of_admission | moment}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('student.admission_number')}}</td>
                                            <td>{{student_record.admission.admission_number}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('student.date_of_promotion')}}</td>
                                            <td>{{student_record.date_of_entry | moment}}</td>
                                        </tr>
                                        <tr v-if="student_record.date_of_exit">
                                            <td class="text-danger font-weight-bold">{{trans('student.date_of_termination')}}</td>
                                            <td class="text-danger font-weight-bold">{{student_record.date_of_exit | moment}}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <table class="table table-sm custom-show-table">
                                    <tbody>
                                        <tr>
                                            <td>{{trans('general.created_at')}}</td>
                                            <td>{{student.created_at | momentDateTime}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('general.updated_at')}}</td>
                                            <td>{{student.updated_at | momentDateTime}}</td>
                                        </tr>
                                    </tbody>
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
    import basicDetail from './basic/detail'
    import parentDetail from './parent/detail'
    import contactDetail from './contact/detail'
    import documentDetail from './document/index'
    import accountDetail from './account/index'
    import qualificationDetail from './qualification/index'
    import terminationDetail from './termination/detail'
    import promotionDetail from './promotion/detail'
    import feeDetail from './fee/detail'
    import attendanceDetail from './attendance/detail'
    import siblingDetail from './sibling/index'
    import loginDetail from './login/detail'
    import examReport from './exam-report'

    export default {
        components : { basicDetail,parentDetail,contactDetail,documentDetail,accountDetail,qualificationDetail,terminationDetail,siblingDetail,promotionDetail,loginDetail,attendanceDetail,examReport,feeDetail },
        data() {
            return {
                uuid:this.$route.params.uuid,
                student: {},
                photo: '',
                tab: ''
            }
        },
        mounted(){
            if(!helper.hasPermission('list-student') && !helper.hasPermission('list-class-teacher-wise-student')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getStudent();
            helper.showDemoNotification(['student']);
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getConfig(config){
                return helper.getConfig(config);
            },
            getStudent(){
                let loader = this.$loading.show();
                axios.get('/api/student/'+this.uuid)
                    .then(response => {
                        this.student = response;
                        this.photo = this.student.student_photo;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/dashboard');
                    })
            },
            getStudentName(){
                return helper.getStudentName(this.student);
            },
            updatePhoto(val){
            },
            getStatus(student_record){
                if (! student_record)
                    return '<span class="badge badge-info lb-sm">'+i18n.student.student_status_not_admitted+'</span>';
                else if (student_record.date_of_exit)
                    return '<span class="badge badge-danger lb-sm">'+i18n.student.student_status_not_terminated+'</span>';
                else
                    return '<span class="badge badge-success lb-sm">'+i18n.student.student_status_not_studying+'</span>';
            },
        },
        computed: {
            getDefaultAcademicSession(){
                return helper.getDefaultAcademicSession();
            },
            currentStudentRecords() {
                return this.student.student_records.filter(student_record => {
                    return student_record.academic_session_id === helper.getDefaultAcademicSession().id
                })
            }
        },
        filters: {
          moment(date) {
            return helper.formatDate(date);
          },
          momentDateTime(date) {
            return helper.formatDateTime(date);
          }
        },
        watch: {
            '$route.params.uuid': function (uuid) {
                this.uuid = uuid;
                this.getStudent()
            }
        }
    }
</script>

<style>
    .img-circle {
        max-height: 150px;
        max-width: 150px;
    }
</style>