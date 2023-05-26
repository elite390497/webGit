<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('employee.department')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="departments.total">{{trans('general.total_result_found',{count : departments.total, from: departments.from, to: departments.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="departments.total && !showCreatePanel" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('employee.add_new_department')}}</span></button>
                        <sort-by :order-by-options="orderByOptions" :sort-by="filter.sort_by" :order="filter.order" @updateSortBy="value => {filter.sort_by = value}"  @updateOrder="value => {filter.order = value}"></sort-by>
                        <div class="btn-group">
                            <button type="button" class="btn btn-info btn-sm dropdown-toggle no-caret " role="menu" id="moreOption" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-tooltip="trans('general.more_option')">
                                <i class="fas fa-ellipsis-h"></i> <span class="d-none d-sm-inline"></span>
                            </button>
                            <div :class="['dropdown-menu',getConfig('direction') == 'ltr' ? 'dropdown-menu-right' : '']" aria-labelledby="moreOption">
                                <button class="dropdown-item custom-dropdown" @click="print"><i class="fas fa-print"></i> {{trans('general.print')}}</button>
                                <button class="dropdown-item custom-dropdown" @click="pdf"><i class="fas fa-file-pdf"></i> {{trans('general.generate_pdf')}}</button>
                            </div>
                        </div>
                        <help-button @clicked="help_topic = 'configuration.employee.department'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <transition name="fade">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('employee.add_new_department')}}</h4>
                        <department-form @completed="getDepartments" @cancel="showCreatePanel = !showCreatePanel"></department-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="departments.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('employee.department_name')}}</th>
                                    <th>{{trans('employee.department_description')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="department in departments.data">
                                    <td v-text="department.name"></td>
                                    <td v-text="department.description"></td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-info btn-sm" v-tooltip="trans('employee.edit_department')" @click.prevent="editDepartment(department)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" :key="department.id" v-confirm="{ok: confirmDelete(department)}" v-tooltip="trans('employee.delete_department')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!departments.total" module="employee" title="department_module_title" description="department_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="departments" @updateRecords="getDepartments" @change.native="getDepartments"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>


<script>
    import departmentForm from './form'

    export default {
        components : { departmentForm },
        data() {
            return {
                departments: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by: 'name',
                    order: 'asc',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'name',
                        translation: i18n.employee.department_name
                    }
                ],
                showCreatePanel: false,
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('access-configuration')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getDepartments();
        },
        methods: {
            getConfig(config){
                return helper.getConfig(config);
            },
            getDepartments(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/employee/department?page=' + page + url)
                    .then(response => {
                        this.departments = response;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editDepartment(department){
                this.$router.push('/configuration/employee/department/'+department.id+'/edit');
            },
            confirmDelete(department){
                return dialog => this.deleteDepartment(department);
            },
            deleteDepartment(department){
                let loader = this.$loading.show();
                axios.delete('/api/employee/department/'+department.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getDepartments();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/employee/department/print',{filter: this.filter})
                    .then(response => {
                        let print = window.open("/print");
                        loader.hide();
                        print.document.write(response);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            pdf(){
                let loader = this.$loading.show();
                axios.post('/api/employee/department/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
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
            'filter.sort_by': function(val){
                this.getDepartments();
            },
            'filter.order': function(val){
                this.getDepartments();
            },
            'filter.page_length': function(val){
                this.getDepartments();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>
