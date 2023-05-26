<template>
	<div>
        <button v-if="!readMode" class="btn btn-sm btn-info pull-right" @click="addModal = true"><i class="fas fa-plus"></i> {{trans('student.add_new_document')}}</button>
        <div class="table-responsive" v-if="student_documents.total">
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th>{{trans('student.document_title')}}</th>
                        <th>{{trans('student.document_type')}}</th>
                        <th>{{trans('general.updated_at')}}</th>
                        <th class="table-option">{{trans('general.action')}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="student_document in student_documents.data">
                        <td v-text="student_document.title"></td>
                        <td v-text="student_document.student_document_type.name"></td>
                        <td>{{student_document.updated_at | momentDateTime}}</td>
                        <td class="table-option">
                            <div class="btn-group">
                                <button class="btn btn-success btn-sm" v-tooltip="trans('student.view_document')" @click.prevent="showAction(student_document)"><i class="fas fa-arrow-circle-right"></i></button>
                                <button v-if="!readMode" class="btn btn-info btn-sm" v-tooltip="trans('student.edit_document')" @click.prevent="editAction(student_document)"><i class="fas fa-edit"></i></button>
                                <button v-if="!readMode" class="btn btn-danger btn-sm" :key="student_document.id" v-confirm="{ok: confirmDelete(student_document)}" v-tooltip="trans('student.delete_document')"><i class="fas fa-trash"></i></button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <template v-if="!readMode">
            <module-info v-if="!student_documents.total" module="student" title="document_module_title" description="document_module_description" icon="list">
                <div slot="btn">
                        <button class="btn btn-info btn-md" @click="addModal = true"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                </div>
            </module-info>
        </template>
        <template v-else>
            <div v-if="!student_documents.total" class="font-80pc">{{trans('general.no_result_found')}}</div>
        </template>
        <pagination-record :page-length.sync="filter.page_length" :records="student_documents" @updateRecords="getStudentDocuments" @change.native="getStudentDocuments"></pagination-record>

        <create-document v-if="addModal && !readMode" @close="addModal = false" @completed="getStudentDocuments" :student="student"></create-document>

        <edit-document v-if="editModal && !readMode" @close="editModal = false" @completed="getStudentDocuments" :student="student" :did="editId"></edit-document>

        <show-document v-if="showModal" @close="showModal = false" :student="student" :did="showId"></show-document>
    </div>
</template>

<script>
    import createDocument from './create'
    import editDocument from './edit'
    import showDocument from './show'

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
        components : { createDocument,editDocument,showDocument },
        data() {
            return {
                student_documents: {
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

            this.getStudentDocuments();
        },
        methods: {
            editAction(student_document){
                this.editId = student_document.id;
                this.editModal = true;
            },
            showAction(student_document){
                this.showId = student_document.id;
                this.showModal = true;
            },
            getStudentDocuments(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/student/'+this.student.uuid+'/document?page=' + page + url)
                    .then(response => {
                        this.student_documents = response;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            confirmDelete(student_document){
                return dialog => this.deleteStudentDocument(student_document);
            },
            deleteStudentDocument(student_document){
                let loader = this.$loading.show();
                axios.delete('/api/student/'+this.student.uuid+'/document/'+student_document.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getStudentDocuments();
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
                this.getStudentDocuments();
            }
        }
	}
</script>