<template>
    <div>
        <div class="table-responsive" v-if="students.length">
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th>{{trans('student.admission_number_short')}}</th>
                        <th>{{trans('student.name')}}</th>
                        <th>{{trans('academic.batch')}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="student in students">
                        <td v-html="getAdmissionNumber(student)"></td>
                        <td v-text="getStudentName(student)"></td>
                        <td v-text="getBatch(student)"></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <template v-if="!readMode">
            <module-info v-if="!students.length" module="student" title="account_module_title" description="account_module_description" icon="list">
            </module-info>
        </template>
        <template v-else>
            <div v-if="!students.length" class="font-80pc">{{trans('general.no_result_found')}}</div>
        </template>
        <div>&nbsp;</div>
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
        components : {},
        data() {
            return {
                students: []
            };
        },
        mounted(){
            if(!helper.hasPermission('list-student') && !helper.hasPermission('list-class-teacher-wise-student')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getStudentSiblings();
        },
        methods: {
            getStudentSiblings(){
                let loader = this.$loading.show();
                axios.get('/api/student/'+this.student.uuid+'/sibling')
                    .then(response => {
                        this.students = response.students;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getStudentRecord(student){
                let length = student.student_records.length;
                return (length) ? student.student_records[length - 1] : null;
            },
            getAdmissionNumber(student){
                let student_record = this.getStudentRecord(student);

                if (! student_record)
                    return '<span class="label label-danger">'+i18n.student.student_status_not_admitted+'</span>';

                return helper.getAdmissionNumber(student_record.admission);
            },
            getStudentName(student){
                return helper.getStudentName(student);
            },
            getBatch(student){
                let student_record = this.getStudentRecord(student);

                if (! student_record)
                    return '-';

                return student_record.batch.course.name+' '+student_record.batch.name;
            }
        },
        filters: {
          momentDateTime(date) {
            return helper.formatDateTime(date);
          }
        },
        watch: { 
            student(student) {
                this.getStudentSiblings();
            }
        }
    }
</script>

<style>
    .dg-backdrop{
      z-index: 10000;
    }
    .dg-container{
      z-index: 10000;
    }
</style>