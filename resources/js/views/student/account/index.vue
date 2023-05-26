<template>
	<div>
        <button v-if="!readMode" class="btn btn-sm btn-info pull-right" @click="addModal = true"><i class="fas fa-plus"></i> {{trans('student.add_new_account')}}</button>
        <div class="table-responsive" v-if="student_accounts.total">
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th>{{trans('student.account_name')}}</th>
                        <th>{{trans('student.account_number')}}</th>
                        <th>{{trans('student.bank_name')}}</th>
                        <th>{{trans('student.is_account_primary')}}</th>
                        <th class="table-option">{{trans('general.action')}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="student_account in student_accounts.data">
                        <td v-text="student_account.name"></td>
                        <td v-text="student_account.account_number"></td>
                        <td v-text="student_account.bank_name"></td>
                        <td>
                            <i class="fas fa-check" v-if="student_account.options.is_primary"></i>
                            <i class="fas fa-times" v-else></i>
                        </td>
                        <td class="table-option">
                            <div class="btn-group">
                                <button class="btn btn-success btn-sm" v-tooltip="trans('student.view_account')" @click.prevent="showAction(student_account)"><i class="fas fa-arrow-circle-right"></i></button>
                                <button v-if="!readMode" class="btn btn-info btn-sm" v-tooltip="trans('student.edit_account')" @click.prevent="editAction(student_account)"><i class="fas fa-edit"></i></button>
                                <button v-if="!readMode" class="btn btn-danger btn-sm" :key="student_account.id" v-confirm="{ok: confirmDelete(student_account)}" v-tooltip="trans('student.delete_account')"><i class="fas fa-trash"></i></button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <template v-if="!readMode">
            <module-info v-if="!student_accounts.total" module="student" title="account_module_title" description="account_module_description" icon="list">
                <div slot="btn">
                    <button class="btn btn-info btn-md" @click="addModal = true"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                </div>
            </module-info>
        </template>
        <template v-else>
            <div v-if="!student_accounts.total" class="font-80pc">{{trans('general.no_result_found')}}</div>
        </template>

        <pagination-record :page-length.sync="filter.page_length" :records="student_accounts" @updateRecords="getStudentAccounts" @change.native="getStudentAccounts"></pagination-record>

        <create-account v-if="addModal && !readMode" @close="addModal = false" @completed="getStudentAccounts" :student="student"></create-account>

        <edit-account v-if="editModal && !readMode" @close="editModal = false" @completed="getStudentAccounts" :student="student" :aid="editId"></edit-account>

        <show-account v-if="showModal" @close="showModal = false" :student="student" :aid="showId"></show-account>
    </div>
</template>

<script>
    import createAccount from './create'
    import editAccount from './edit'
    import showAccount from './show'

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
        components : { createAccount,editAccount,showAccount },
        data() {
            return {
                student_accounts: {
                    total: 0,
                    data: []
                },
                showId: null,
                editId: null,
                student_account: {},
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

            this.getStudentAccounts();
        },
        methods: {
            getStudentName(){
                return helper.getStudentName(this.student);
            },
            showAction(student_account){
                this.showId = student_account.id;
                this.showModal = true;
            },
            editAction(student_account){
                this.editId = student_account.id;
                this.editModal = true;
            },
            getStudentAccounts(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/student/'+this.student.uuid+'/account?page=' + page + url)
                    .then(response => {
                        this.student_accounts = response;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            confirmDelete(student_account){
                return dialog => this.deleteStudentAccount(student_account);
            },
            deleteStudentAccount(student_account){
                let loader = this.$loading.show();
                axios.delete('/api/student/'+this.student.uuid+'/account/'+student_account.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getStudentAccounts();
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
                this.getStudentAccounts();
            }
        }
	}
</script>