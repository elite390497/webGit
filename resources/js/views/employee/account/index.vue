<template>
    <div class="p-b-20">
        <button v-if="!readMode" class="btn btn-sm btn-info pull-right m-b-10" @click="addModal = true"><i class="fas fa-plus"></i> {{trans('employee.add_new_account')}}</button>
        <div class="table-responsive" v-if="employee_accounts.total">
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th>{{trans('employee.account_name')}}</th>
                        <th>{{trans('employee.account_number')}}</th>
                        <th>{{trans('employee.bank_name')}}</th>
                        <th>{{trans('employee.is_account_primary')}}</th>
                        <th class="table-option">{{trans('general.action')}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="employee_account in employee_accounts.data">
                        <td v-text="employee_account.name"></td>
                        <td v-text="employee_account.account_number"></td>
                        <td v-text="employee_account.bank_name"></td>
                        <td>
                            <i class="fas fa-check" v-if="employee_account.options.is_primary"></i>
                            <i class="fas fa-times" v-else></i>
                        </td>
                        <td class="table-option">
                            <div class="btn-group">
                                <button class="btn btn-success btn-sm" v-tooltip="trans('employee.view_account')" @click.prevent="showAction(employee_account)"><i class="fas fa-arrow-circle-right"></i></button>
                                <button v-if="!readMode" class="btn btn-info btn-sm" v-tooltip="trans('employee.edit_account')" @click.prevent="editAction(employee_account)"><i class="fas fa-edit"></i></button>
                                <button v-if="!readMode" class="btn btn-danger btn-sm" :key="employee_account.id" v-confirm="{ok: confirmDelete(employee_account)}" v-tooltip="trans('employee.delete_account')"><i class="fas fa-trash"></i></button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <template v-if="!readMode">
            <module-info v-if="!employee_accounts.total" module="employee" title="account_module_title" description="account_module_description" icon="list">
                <div slot="btn">
                    <button class="btn btn-info btn-md" @click="addModal = true"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                </div>
            </module-info>
        </template>
        <template v-else>
            <div v-if="!employee_accounts.total" class="font-80pc">{{trans('general.no_result_found')}}</div>
        </template>

        <pagination-record :page-length.sync="filter.page_length" :records="employee_accounts" @updateRecords="getEmployeeAccounts" @change.native="getEmployeeAccounts"></pagination-record>

        <create-account v-if="addModal && !readMode" @close="addModal = false" @completed="getEmployeeAccounts" :employee="employee"></create-account>

        <edit-account v-if="editModal && !readMode" @close="editModal = false" @completed="getEmployeeAccounts" :employee="employee" :aid="editId"></edit-account>

        <show-account v-if="showModal" @close="showModal = false" :employee="employee" :aid="showId"></show-account>
    </div>
</template>

<script>
    import createAccount from './create'
    import editAccount from './edit'
    import showAccount from './show'

    export default {
        props: {
            employee: {
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
                employee_accounts: {
                    total: 0,
                    data: []
                },
                showId: null,
                editId: null,
                employee_account: {},
                filter: {
                    page_length: helper.getConfig('page_length')
                },
                addModal: false,
                editModal: false,
                showModal: false
            };
        },
        mounted(){
            if(!helper.hasPermission('list-employee')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getEmployeeAccounts();
        },
        methods: {
            getEmployeeName(){
                return helper.getEmployeeName(this.employee);
            },
            showAction(employee_account){
                this.showId = employee_account.id;
                this.showModal = true;
            },
            editAction(employee_account){
                this.editId = employee_account.id;
                this.editModal = true;
            },
            getEmployeeAccounts(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/employee/'+this.employee.uuid+'/account?page=' + page + url)
                    .then(response => {
                        this.employee_accounts = response;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            confirmDelete(employee_account){
                return dialog => this.deleteEmployeeAccount(employee_account);
            },
            deleteEmployeeAccount(employee_account){
                let loader = this.$loading.show();
                axios.delete('/api/employee/'+this.employee.uuid+'/account/'+employee_account.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getEmployeeAccounts();
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
            employee(employee) {
                this.getEmployeeAccounts();
            }
        }
    }
</script>