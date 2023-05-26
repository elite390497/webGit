<template>
	<div>
        <button class="btn btn-sm btn-info pull-right m-b-10" @click="addModal = true" v-if="canAddDesignation && !readMode"><i class="fas fa-plus"></i> {{trans('employee.add_new_designation')}}</button>
        <div class="table-responsive" v-if="employee.employee_designations">
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th>{{trans('employee.designation')}}</th>
                        <th>{{trans('employee.category')}}</th>
                        <th>{{trans('employee.department')}}</th>
                        <th>{{trans('employee.date_effective')}}</th>
                        <th>{{trans('employee.date_end')}}</th>
                        <th class="table-option">{{trans('general.action')}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="employee_designation in employee.employee_designations">
                        <td>
                            {{employee_designation.designation.name}}
                        </td>
                        <td v-text="employee_designation.designation.employee_category.name"></td>
                        <td v-text="employee_designation.department_id ? employee_designation.department.name : '-'"></td>
                        <td>{{employee_designation.date_effective | moment}}</td>
                        <td>
                            <span v-if="employee_designation.date_end">{{employee_designation.date_end | moment}}</span>
                            <span v-else>-</span>
                        </td>
                        <td class="table-option">
                            <div class="btn-group">
                                <template v-if="$first(employee_designation, employee.employee_designations) && !readMode">
                                    <button class="btn btn-danger btn-sm" :key="employee_designation.id" v-confirm="{ok: confirmDelete(employee_designation)}" v-tooltip="trans('employee.delete_designation')"><i class="fas fa-trash"></i></button>
                                    <button class="btn btn-info btn-sm" v-tooltip="trans('employee.edit_designation')" @click.prevent="editAction(employee_designation)"><i class="fas fa-edit"></i></button>
                                </template>
                                <button class="btn btn-success btn-sm" v-tooltip="trans('employee.view_designation')" @click.prevent="showAction(employee_designation)"><i class="fas fa-arrow-circle-right"></i></button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else class="font-80pc">
            {{trans('general.no_result_found')}}
        </div>

        <create-designation v-if="addModal && canAddDesignation && !readMode" @close="addModal = false" @completed="$emit('completed')" :employee="employee"></create-designation>

        <edit-designation v-if="editModal && !readMode" @close="editModal = false" @completed="$emit('completed')" :employee="employee" :did="editId"></edit-designation>

        <show-designation v-if="showModal" @close="showModal = false" :employee="employee" :did="showId"></show-designation>
    </div>
</template>

<script>
    import createDesignation from './create'
    import editDesignation from './edit'
    import showDesignation from './show'

	export default {
        components: {createDesignation,editDesignation,showDesignation},
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
        data(){
            return {
                addModal: false,
                showId: null,
                editId: null,
                addModal: false,
                editModal: false,
                showModal: false
            }
        },
        methods: {
            editAction(employee_designation){
                this.editId = employee_designation.id;
                this.editModal = true;
            },
            showAction(employee_designation){
                this.showId = employee_designation.id;
                this.showModal = true;
            },
            confirmDelete(employee_designation){
                return dialog => this.deleteEmployeeDesignation(employee_designation);
            },
            deleteEmployeeDesignation(employee_designation){
                let loader = this.$loading.show();
                axios.delete('/api/employee/'+this.employee.uuid+'/designation/'+employee_designation.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.$emit('completed');
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
        },
        computed: {
            canAddDesignation(){
                return this.employee.employee_terms.some(employee_term => {
                    return employee_term.date_of_leaving == null;
                })
            }
        },
        filters: {
          momentDateTime(date) {
            return helper.formatDateTime(date);
          },
          moment(date) {
            return helper.formatDate(date);
          }
        }
	}
</script>