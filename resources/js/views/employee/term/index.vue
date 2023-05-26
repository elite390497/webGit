<template>
	<div>
        <button class="btn btn-sm btn-info pull-right" @click="addModal = true" v-if="canAddTerm && !readMode"><i class="fas fa-plus"></i> {{trans('employee.add_new_term')}}</button>
        <div class="table-responsive" v-if="employee.employee_terms">
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th>{{trans('employee.date_of_joining')}}</th>
                        <th>{{trans('employee.date_of_leaving')}}</th>
                        <th class="table-option">{{trans('general.action')}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="employee_term in employee.employee_terms">
                        <td>{{employee_term.date_of_joining | moment}}</td>
                        <td>
                            <span v-if="employee_term.date_of_leaving">{{employee_term.date_of_leaving | moment}}</span>
                            <span v-else>-</span>
                        </td>
                        <td class="table-option">
                            <div class="btn-group">
                                <!-- <template v-if="$first(employee_term, employee.employee_terms)"> -->
                                    <template v-if="!readMode">
                                        <button class="btn btn-danger btn-sm" :key="employee_term.id" v-confirm="{ok: confirmDelete(employee_term)}" v-tooltip="trans('employee.delete_term')"><i class="fas fa-trash"></i></button>
                                        <button class="btn btn-info btn-sm" v-tooltip="trans('employee.edit_term')" @click.prevent="editAction(employee_term)"><i class="fas fa-edit"></i></button>
                                    </template>
                                <!-- </template> -->
                                <button class="btn btn-success btn-sm" v-tooltip="trans('employee.view_term')" @click.prevent="showAction(employee_term)"><i class="fas fa-arrow-circle-right"></i></button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else class="font-80pc">
            {{trans('general.no_result_found')}}
        </div>

        <create-term v-if="addModal && canAddTerm && !readMode" @close="addModal = false" @completed="$emit('completed')" :employee="employee"></create-term>

        <edit-term v-if="editModal && !readMode" @close="editModal = false" @completed="$emit('completed')" :employee="employee" :tid="editId"></edit-term>

        <show-term v-if="showModal" @close="showModal = false" :employee="employee" :tid="showId"></show-term>
    </div>
</template>

<script>
    import createTerm from './create'
    import editTerm from './edit'
    import showTerm from './show'

    export default {
        components: {createTerm,editTerm,showTerm},
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
        mounted(){
        },
        methods: {
            editAction(employee_term){
                this.editId = employee_term.id;
                this.editModal = true;
            },
            showAction(employee_term){
                this.showId = employee_term.id;
                this.showModal = true;
            },
            confirmDelete(employee_term){
                return dialog => this.deleteEmployeeTerm(employee_term);
            },
            deleteEmployeeTerm(employee_term){
                let loader = this.$loading.show();
                axios.delete('/api/employee/'+this.employee.uuid+'/term/'+employee_term.id)
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
            canAddTerm(){
                return this.employee.employee_terms.every(employee_term => {
                    return employee_term.date_of_leaving != null;
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