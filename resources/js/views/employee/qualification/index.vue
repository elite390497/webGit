<template>
    <div>
        <button v-if="!readMode" class="btn btn-sm btn-info pull-right" @click="addModal = true"><i class="fas fa-plus"></i> {{trans('employee.add_new_qualification')}}</button>
        <div class="table-responsive" v-if="employee_qualifications.total">
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th>{{trans('employee.qualification_standard')}}</th>
                        <th>{{trans('employee.institute_name')}}</th>
                        <th>{{trans('employee.qualification_period')}}</th>
                        <th>{{trans('employee.qualification_result')}}</th>
                        <th class="table-option">{{trans('general.action')}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="employee_qualification in employee_qualifications.data">
                        <td v-text="employee_qualification.standard"></td>
                        <td v-text="employee_qualification.institute_name"></td>
                        <td>{{employee_qualification.start_period}} {{trans('general.to')}} {{employee_qualification.end_period}}</td>
                        <td v-text="employee_qualification.result"></td>
                        <td class="table-option">
                            <div class="btn-group">
                                <button class="btn btn-success btn-sm" v-tooltip="trans('employee.view_qualification')" @click.prevent="showAction(employee_qualification)" ><i class="fas fa-arrow-circle-right"></i></button>
                                <button v-if="!readMode" class="btn btn-info btn-sm" v-tooltip="trans('employee.edit_qualification')" @click.prevent="editAction(employee_qualification)" ><i class="fas fa-edit"></i></button>
                                <button v-if="!readMode" class="btn btn-danger btn-sm" :key="employee_qualification.id" v-confirm="{ok: confirmDelete(employee_qualification)}" v-tooltip="trans('employee.delete_qualification')"><i class="fas fa-trash"></i></button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <template v-if="!readMode">
            <module-info v-if="!employee_qualifications.total" module="employee" title="qualification_module_title" description="qualification_module_description" icon="list">
                <div slot="btn">
                    <button class="btn btn-info btn-md" @click="addModal = true"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                </div>
            </module-info>
        </template>
        <template v-else>
            <div v-if="!employee_qualifications.total" class="font-80pc">{{trans('general.no_result_found')}}</div>
            <div>&nbsp;</div>
        </template>

        <pagination-record :page-length.sync="filter.page_length" :records="employee_qualifications" @updateRecords="getEmployeeQualifications" @change.native="getEmployeeQualifications"></pagination-record>

        <create-qualification v-if="addModal && !readMode" @close="addModal = false" @completed="getEmployeeQualifications" :employee="employee"></create-qualification>

        <edit-qualification v-if="editModal && !readMode" @close="editModal = false" @completed="getEmployeeQualifications" :employee="employee" :qid="editId"></edit-qualification>

        <show-qualification v-if="showModal" @close="showModal = false" :employee="employee" :qid="showId"></show-qualification>
    </div>
</template>

<script>
    import createQualification from './create'
    import editQualification from './edit'
    import showQualification from './show'

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
        components : { createQualification,editQualification,showQualification },
        data() {
            return {
                employee_qualifications: {
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
            if(!helper.hasPermission('list-employee')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getEmployeeQualifications();
        },
        methods: {
            getEmployeeName(){
                return helper.getEmployeeName(this.employee);
            },
            editAction(employee_qualification){
                this.editId = employee_qualification.id;
                this.editModal = true;
            },
            showAction(employee_qualification){
                this.showId = employee_qualification.id;
                this.showModal = true;
            },
            getEmployeeQualifications(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/employee/'+this.employee.uuid+'/qualification?page=' + page + url)
                    .then(response => {
                        this.employee_qualifications = response;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            confirmDelete(employee_qualification){
                return dialog => this.deleteEmployeeQualification(employee_qualification);
            },
            deleteEmployeeQualification(employee_qualification){
                let loader = this.$loading.show();
                axios.delete('/api/employee/'+this.employee.uuid+'/qualification/'+employee_qualification.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getEmployeeQualifications();
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
                this.getEmployeeQualifications();
            }
        }
    }
</script>