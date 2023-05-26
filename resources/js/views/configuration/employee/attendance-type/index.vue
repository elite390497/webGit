<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('employee.attendance_type')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="attendance_types.total">{{trans('general.total_result_found',{count : attendance_types.total, from: attendance_types.from, to: attendance_types.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="attendance_types.total && !showCreatePanel" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('employee.add_new_attendance_type')}}</span></button>
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
                        <help-button @clicked="help_topic = 'configuration.employee.attendance-type'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <transition name="fade">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('employee.add_new_attendance_type')}}</h4>
                        <attendance-type-form @completed="getAttendanceTypes" @cancel="showCreatePanel = !showCreatePanel"></attendance-type-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="attendance_types.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('employee.attendance_type')}}</th>
                                    <th>{{trans('employee.attendance_type_name')}}</th>
                                    <th>{{trans('employee.attendance_type_alias')}}</th>
                                    <th>{{trans('employee.attendance_type_status')}}</th>
                                    <th>{{trans('employee.attendance_type_description')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="attendance_type in attendance_types.data">
                                    <td v-text="getType(attendance_type)"></td>
                                    <td>
                                        {{attendance_type.name}} {{getUnit(attendance_type)}}
                                    </td>
                                    <td v-text="attendance_type.alias"></td>
                                    <td v-html="getStatus(attendance_type)"></td>
                                    <td v-text="attendance_type.description"></td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-info btn-sm" v-tooltip="trans('employee.edit_attendance_type')" @click.prevent="editAttendanceType(attendance_type)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" :key="attendance_type.id" v-confirm="{ok: confirmDelete(attendance_type)}" v-tooltip="trans('employee.delete_attendance_type')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!attendance_types.total" module="employee" title="attendance_type_module_title" description="attendance_type_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="attendance_types" @updateRecords="getAttendanceTypes" @change.native="getAttendanceTypes"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>


<script>
    import attendanceTypeForm from './form'

    export default {
        components : { attendanceTypeForm },
        data() {
            return {
                attendance_types: {
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
                        translation: i18n.employee.attendance_type_name
                    },
                    {
                        value: 'alias',
                        translation: i18n.employee.attendance_type_alias
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

            this.getAttendanceTypes();
        },
        methods: {
            getConfig(config){
                return helper.getConfig(config);
            },
            getAttendanceTypes(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/employee/attendance/type?page=' + page + url)
                    .then(response => {
                        this.attendance_types = response;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editAttendanceType(attendance_type){
                this.$router.push('/configuration/employee/attendance/type/'+attendance_type.id+'/edit');
            },
            confirmDelete(attendance_type){
                return dialog => this.deleteAttendanceType(attendance_type);
            },
            deleteAttendanceType(attendance_type){
                let loader = this.$loading.show();
                axios.delete('/api/employee/attendance/type/'+attendance_type.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getAttendanceTypes();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/employee/attendance/type/print',{filter: this.filter})
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
                axios.post('/api/employee/attendance/type/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getStatus(attendance_type){
                if (attendance_type.is_active) 
                    return '<span class="label label-success">'+i18n.employee.attendance_type_status_active+'</span>';
                else
                    return '<span class="label label-danger">'+i18n.employee.attendance_type_status_inactive+'</span>';
            },
            getType(attendance_type){
                if (! attendance_type.type)
                    return '-';

                return i18n.employee['attendance_type_'+attendance_type.type];
            },
            getUnit(attendance_type){
                if (attendance_type.type != 'production_based_earning' && attendance_type.type != 'production_based_deduction')
                    return;

                return '('+attendance_type.unit+')';
            }
        },
        filters: {
          momentDateTime(date) {
            return helper.formatDateTime(date);
          }
        },
        watch: {
            'filter.sort_by': function(val){
                this.getAttendanceTypes();
            },
            'filter.order': function(val){
                this.getAttendanceTypes();
            },
            'filter.page_length': function(val){
                this.getAttendanceTypes();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>
