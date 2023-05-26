<template>
	<div>
        <button v-if="!readMode" class="btn btn-sm btn-info pull-right" @click="addModal = true"><i class="fas fa-plus"></i> {{trans('student.add_new_qualification')}}</button>
        <div class="table-responsive" v-if="student_qualifications.total">
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th>{{trans('student.qualification_standard')}}</th>
                        <th>{{trans('student.institute_name')}}</th>
                        <th>{{trans('student.qualification_period')}}</th>
                        <th>{{trans('student.qualification_result')}}</th>
                        <th class="table-option">{{trans('general.action')}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="student_qualification in student_qualifications.data">
                        <td v-text="student_qualification.standard"></td>
                        <td v-text="student_qualification.institute_name"></td>
                        <td>{{student_qualification.start_period}} {{trans('general.to')}} {{student_qualification.end_period}}</td>
                        <td v-text="student_qualification.result"></td>
                        <td class="table-option">
                            <div class="btn-group">
                                <button class="btn btn-success btn-sm" v-tooltip="trans('student.view_qualification')" @click.prevent="showAction(student_qualification)" ><i class="fas fa-arrow-circle-right"></i></button>
                                <button v-if="!readMode" class="btn btn-info btn-sm" v-tooltip="trans('student.edit_qualification')" @click.prevent="editAction(student_qualification)" ><i class="fas fa-edit"></i></button>
                                <button v-if="!readMode" class="btn btn-danger btn-sm" :key="student_qualification.id" v-confirm="{ok: confirmDelete(student_qualification)}" v-tooltip="trans('student.delete_qualification')"><i class="fas fa-trash"></i></button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <template v-if="!readMode">
            <module-info v-if="!student_qualifications.total" module="student" title="qualification_module_title" description="qualification_module_description" icon="list">
                <div slot="btn">
                    <button class="btn btn-info btn-md" @click="addModal = true"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                </div>
            </module-info>
        </template>
        <template v-else>
            <div v-if="!student_qualifications.total" class="font-80pc">{{trans('general.no_result_found')}}</div>
        </template>

        <pagination-record :page-length.sync="filter.page_length" :records="student_qualifications" @updateRecords="getStudentQualifications" @change.native="getStudentQualifications"></pagination-record>

        <create-qualification v-if="addModal && !readMode" @close="addModal = false" @completed="getStudentQualifications" :student="student"></create-qualification>

        <edit-qualification v-if="editModal && !readMode" @close="editModal = false" @completed="getStudentQualifications" :student="student" :qid="editId"></edit-qualification>

        <show-qualification v-if="showModal" @close="showModal = false" :student="student" :qid="showId"></show-qualification>
    </div>
</template>

<script>
    import createQualification from './create'
    import editQualification from './edit'
    import showQualification from './show'

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
        components : { createQualification,editQualification,showQualification },
        data() {
            return {
                student_qualifications: {
                    total: 0,
                    data: []
                },
                showId: null,
                editId: null,
                filter: {
                    page_length: helper.getConfig('page_length')
                },
                addModal: false,
                editModal: false,
                showModal: false
            };
        },
        mounted(){
            if((this.readMode && !helper.hasPermission('list-student') && !helper.hasPermission('list-class-teacher-wise-student')) || (!this.readMode && !helper.hasPermission('edit-student'))){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getStudentQualifications();
        },
        methods: {
            getStudentName(){
                return helper.getStudentName(this.student);
            },
            editAction(student_qualification){
                this.editId = student_qualification.id;
                this.editModal = true;
            },
            showAction(student_qualification){
                this.showId = student_qualification.id;
                this.showModal = true;
            },
            getStudentQualifications(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/student/'+this.student.uuid+'/qualification?page=' + page + url)
                    .then(response => {
                        this.student_qualifications = response;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            confirmDelete(student_qualification){
                return dialog => this.deleteStudentQualification(student_qualification);
            },
            deleteStudentQualification(student_qualification){
                let loader = this.$loading.show();
                axios.delete('/api/student/'+this.student.uuid+'/qualification/'+student_qualification.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getStudentQualifications();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
        },
        filters: {
          momentDateTime(date) {
            return helper.formatDateTime(date);
          }
        },
        watch: { 
            student(student) {
                this.getStudentQualifications();
            }
        }
	}
</script>