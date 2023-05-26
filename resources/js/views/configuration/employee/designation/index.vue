<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('employee.designation')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="designations.total">{{trans('general.total_result_found',{count : designations.total, from: designations.from, to: designations.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="designations.total && !showCreatePanel" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('employee.add_new_designation')}}</span></button>
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
                        <help-button @clicked="help_topic = 'configuration.employee.designation'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <transition name="fade">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('employee.add_new_designation')}}</h4>
                        <designation-form @completed="getDesignations" @cancel="showCreatePanel = !showCreatePanel"></designation-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="designations.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('employee.designation_name')}}</th>
                                    <th>{{trans('employee.category')}}</th>
                                    <th>{{trans('employee.top_designation')}}</th>
                                    <th>{{trans('employee.designation_description')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="designation in designations.data">
                                    <td>
                                        {{designation.name}}
                                        <span v-if="isDefault(designation)" class="label label-info">{{trans('employee.default_designation')}}</span>
                                        <span v-if="isTeachingEmpmloyee(designation)" class="label label-info">{{trans('employee.teaching_employee')}}</span>
                                    </td>
                                    <td>{{designation.employee_category ? designation.employee_category.name : '-'}}</td>
                                    <td>{{designation.top_designation ? designation.top_designation.name : '-'}}</td>
                                    <td v-text="designation.description"></td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-info btn-sm" v-if="!isDefault(designation)" v-tooltip="trans('employee.edit_designation')" @click.prevent="editDesignation(designation)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" v-if="!isDefault(designation)" :key="designation.id" v-confirm="{ok: confirmDelete(designation)}" v-tooltip="trans('employee.delete_designation')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!designations.total" module="employee" title="designation_module_title" description="designation_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="designations" @updateRecords="getDesignations" @change.native="getDesignations"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>


<script>
    import designationForm from './form'

    export default {
        components : { designationForm },
        data() {
            return {
                designations: {
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
                        translation: i18n.employee.designation_name
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

            this.getDesignations();
        },
        methods: {
            getConfig(config){
                return helper.getConfig(config);
            },
            getDesignations(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/employee/designation?page=' + page + url)
                    .then(response => {
                        this.designations = response;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editDesignation(designation){
                this.$router.push('/configuration/employee/designation/'+designation.id+'/edit');
            },
            confirmDelete(designation){
                return dialog => this.deleteDesignation(designation);
            },
            deleteDesignation(designation){
                let loader = this.$loading.show();
                axios.delete('/api/employee/designation/'+designation.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getDesignations();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            isDefault(designation){
                return (designation.name == this.getConfig('system_admin_designation')) ? true : false;
            },
            getConfig(config){
                return helper.getConfig(config);
            },
            isTeachingEmpmloyee(designation){
                return (designation.is_teaching_employee) ? true : false;
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/employee/designation/print',{filter: this.filter})
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
                axios.post('/api/employee/designation/pdf',{filter: this.filter})
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
                this.getDesignations();
            },
            'filter.order': function(val){
                this.getDesignations();
            },
            'filter.page_length': function(val){
                this.getDesignations();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>
