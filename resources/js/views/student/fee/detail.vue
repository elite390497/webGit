<template>
    <div v-if="student.id">
        <div class="table-responsive">
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th>{{trans('student.admission_number_short')}}</th>
                        <th>{{trans('academic.batch')}}</th>
                        <th>{{trans('student.date_of_admission')}}</th>
                        <th class="table-option">{{trans('general.action')}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="student_record in student.student_records" v-if="!student_record.date_of_exit">
                        <td>{{getAdmissionNumber(student_record.admission)}}</td>
                        <td>
                            {{student_record.batch.course.name+' '+student_record.batch.name}}
                        </td>
                        <td>
                            <span>{{student_record.admission.date_of_admission | moment}}</span>
                        </td>
                        <td class="table-option">
                            <button class="btn btn-info btn-sm" v-tooltip="trans('student.view_student_fee')" @click="$router.push('/student/'+student.uuid+'/fee/'+student_record.id)">
                                <i class="fas fa-arrow-circle-right"></i> {{trans('finance.fee')}}
                            </button>
                        </td>
                    </tr>   
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            student: {
                type: Object,
                default() {
                    return {}
                }
            },
            readMode: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
            }
        },
        mounted(){
            if(!helper.hasPermission('list-student-fee')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }
        },
        methods: {
            getAdmissionNumber(admission){
                return helper.getAdmissionNumber(admission);
            },
            hasPermission(permission) {
                return helper.hasPermission(permission);
            }
        },
        computed: {
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
        }
    }
</script>