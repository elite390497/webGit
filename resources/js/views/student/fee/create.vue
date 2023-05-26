<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('student.set_fee')}} <small v-if="student_record.student">{{getStudentName(student_record.student)}}  ({{student_record.academic_session.name}})</small></h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <router-link to="/student/list" class="btn btn-info btn-sm"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('student.student')}}</span></router-link>
                        <div class="btn-group">
                            <button type="button" class="btn btn-info btn-sm dropdown-toggle no-caret " role="menu" id="moreOption" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-tooltip="trans('general.more_option')">
                                <i class="fas fa-ellipsis-h"></i> <span class="d-none d-sm-inline"></span>
                            </button>
                            <div :class="['dropdown-menu',getConfig('direction') == 'ltr' ? 'dropdown-menu-right' : '']" aria-labelledby="moreOption">
                                <button class="dropdown-item custom-dropdown" @click="$router.push('/student/'+student_record.student.uuid)"><i class="fas fa-arrow-circle-right"></i> {{trans('student.view_detail')}}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-body py-4">
                            <student-summary :student-record="student_record" class="border-bottom"></student-summary>
                        </div>
                        <div class="card-body px-4">
                            <form @submit.prevent="submit" @keydown="studentFeeRecordForm.errors.clear($event.target.name)">
                                <div class="row">
                                    <div class="col-12 col-sm-4">
                                        <div class="form-group">
                                            <label for="">{{trans('transport.transport_circle')}}</label>
                                            <select v-model="studentFeeRecordForm.transport_circle_id" class="custom-select col-12" @change="" name="transport_circle_id">
                                                <option :value="null">{{trans('transport.no_transport')}}</option>
                                                <option v-for="transport_circle in transport_circles" v-bind:value="transport_circle.id">
                                                    {{ transport_circle.name }}
                                                </option>
                                            </select>
                                            <show-error :form-name="studentFeeRecordForm" prop-name="transport_circle_id"></show-error>
                                        </div>
                                    </div>
                                    <div class="col-12 col-sm-4">
                                        <div class="form-group">
                                            <label for="">{{trans('finance.fee_concession')}}</label>
                                            <select v-model="studentFeeRecordForm.fee_concession_id" class="custom-select col-12" @change="" name="fee_concession_id">
                                                <option :value="null">{{trans('finance.no_fee_concession')}}</option>
                                                <option v-for="fee_concession in fee_concessions" v-bind:value="fee_concession.id">
                                                    {{ fee_concession.name }}
                                                </option>
                                            </select>
                                            <show-error :form-name="studentFeeRecordForm" prop-name="fee_concession_id"></show-error>
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" class="btn btn-info waves-effect waves-light">{{trans('general.save')}}</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import studentSummary from './../summary'

    export default {
        components : {studentSummary},
        data() {
            return {
                uuid:this.$route.params.uuid,
                record_id:this.$route.params.record_id,
                transport_circles: [],
                fee_concessions: [],
                student_record: {},
                studentFeeRecordForm: new Form({
                    transport_circle_id: null,
                    fee_concession_id: null
                },false)
            };
        },
        mounted(){
            if(!helper.hasPermission('set-fee')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getRecord();
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getConfig(config){
                return helper.getConfig(config);
            },
            getStudentName(student){
                return helper.getStudentName(student);
            },
            getRecord(){
                axios.get('/api/student/'+this.uuid+'/record/'+this.record_id)
                    .then(response => {
                        this.student_record = response.student_record;
                        this.fee_concessions = response.fee_concessions;
                        this.transport_circles = response.transport_circles;

                        if (this.student_record.fee_allocation_id) {
                            toastr.error(i18n.student.fee_already_allocated);
                            this.$router('/student/'+this.uuid+'/fee/'+this.record_id);
                        }
                    }) 
                    .catch(error => {
                        helper.showErrorMsg(error);
                        this.$router.push('/student/'+this.uuid);
                    })
            },
            submit(){
                this.studentFeeRecordForm.post('/api/student/'+this.uuid+'/fee/'+this.record_id)
                    .then(response => {
                        toastr.success(response.message);
                        this.$router.push('/student/'+this.uuid+'/fee/'+this.record_id);
                    })
                    .catch(error => {
                        helper.showErrorMsg(error);
                    })
            }
        }
    }
</script>