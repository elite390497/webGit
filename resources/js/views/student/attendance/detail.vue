<template>
    <div v-if="student.id">
        <div class="mb-3">
            <span v-for="student_record in student_records" :key="student_record.id" class="label label-info lb-md mr-5 pointer" @click="fetch(student_record)">
                {{student_record.batch.course.name+' '+student_record.batch.name}}
            </span>
        </div>
        <div class="table-responsive">
            <table class="table table-sm table-bordered">
                <thead>
                    <tr>
                        <th v-for="head in header" :key="head.key">{{head.label}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="row in rows" :key="row.key">
                        <td v-for="column in row" :key="column.key" class="text-center">
                            <span v-if="column.icon"><i :class="['fas', column.icon, column.class ? 'text-'+column.class : '']"></i></span>
                            <span v-else>{{column.label}}</span>
                        </td>
                    </tr>   
                </tbody>
            </table>
            <p class="font-weight-bold">{{trans('student.total_attendance')}}: {{total_attendance}}</p>
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
            }
        },
        components: {},
        data() {
            return {
                header: [],
                rows: [],
                student_records: [],
                total_attendance: 0,
                current_student_record: {}
            }
        },
        mounted(){
            this.student_records = this.student.student_records.filter(student_record => {
                return student_record.academic_session_id === helper.getDefaultAcademicSession().id
            })

            if (! this.student_records.length) {
                toastr.error(i18n.general.no_result_found);
                return
            }

            this.current_student_record = this.student_records[0]

            this.fetch(this.current_student_record)
        },
        methods: {
            fetch(student_record) {
                if (this.current_student_record.id === student_record.id && this.rows.length) {
                    return;
                }

                let loader = this.$loading.show();
                axios.get('/api/student/'+this.student.uuid+'/record/'+student_record.id+'/attendance')
                    .then(response => {
                        this.header = response.header;
                        this.rows = response.rows;
                        this.total_attendance = response.total_attendance;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
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