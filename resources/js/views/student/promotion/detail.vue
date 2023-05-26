<template>
    <div v-if="student.id">
        <div class="table-responsive">
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th>{{trans('student.admission_number_short')}}</th>
                        <th>{{trans('academic.batch')}}</th>
                        <th>{{trans('student.date_of_admission')}}</th>
                        <th>{{trans('student.date_of_promotion')}}</th>
                        <th>{{trans('student.promotion_remarks')}}</th>
                        <th class="table-option" v-if="!readMode">{{trans('general.action')}}</th>
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
                        <td>{{student_record.date_of_entry | moment}}</td>
                        <td>
                            <span>{{student_record.entry_remarks}}</span>
                        </td>
                        <td class="table-option" v-if="!readMode">
                            <button class="btn btn-warning btn-sm" v-if="$first(student_record, student.student_records)" v-tooltip="trans('general.edit')" @click.prevent="editRecord(student_record)">
                                <i class="fas fa-edit"></i> {{trans('general.edit')}}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <edit-record v-if="editModal && !readMode" @close="editModal = false" @completed="complete" :student="student" :record="record"></edit-record>
    </div>
</template>

<script>
    import editRecord from '../edit-record'

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
        components: {editRecord},
        data() {
            return {
                record: null,
                editModal: false
            }
        },
        mounted(){

        },
        methods: {
            getAdmissionNumber(admission){
                return helper.getAdmissionNumber(admission);
            },
            editRecord(record) {
                this.record = record;
                this.editModal = true;
            },
            complete(){
                this.$emit('completed');
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