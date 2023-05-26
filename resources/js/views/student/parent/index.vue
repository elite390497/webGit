<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('student.parent')}}
                        <span class="card-subtitle d-none d-sm-inline" v-if="student_parents.total">{{trans('general.total_result_found',{count : student_parents.total, from: student_parents.from, to: student_parents.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="student_parents.total && !showCreatePanel && hasPermission('edit-student')" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('student.add_new_parent')}}</span></button>
                        <button class="btn btn-info btn-sm" v-if="!showFilterPanel" @click="showFilterPanel = !showFilterPanel"><i class="fas fa-filter"></i> <span class="d-none d-sm-inline">{{trans('general.filter')}}</span></button>
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
                        <help-button @clicked="help_topic = 'student-parent'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <transition name="fade">
                <div class="card card-form" v-if="showFilterPanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('general.filter')}}</h4>
                        <div class="row">
                            <div class="col-12 col-sm-4">
                                <div class="form-group">
                                    <label for="">{{trans('student.first_guardian_name')}}</label>
                                    <input class="form-control" name="first_guardian_name" v-model="filter.first_guardian_name">
                                </div>
                            </div>
                            <div class="col-12 col-sm-4">
                                <div class="form-group">
                                    <label for="">{{trans('student.second_guardian_name')}}</label>
                                    <input class="form-control" name="second_guardian_name" v-model="filter.second_guardian_name">
                                </div>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getParents">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="fade" v-if="hasPermission('edit-student')">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('student.add_new_parent')}}</h4>
                        <parent-form @completed="getParents" @cancel="showCreatePanel = !showCreatePanel"></parent-form>
                    </div>
                </div>
            </transition>
            <div class="card" v-if="hasPermission('edit-student')">
                <div class="card-body">
                    <div class="table-responsive" v-if="student_parents.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('student.father_name')}}</th>
                                    <th>{{trans('student.mother_name')}}</th>
                                    <th>{{trans('student.first_guardian_contact_number')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="student_parent in student_parents.data">
                                    <td v-text="student_parent.father_name"></td>
                                    <td v-text="student_parent.mother_name"></td>
                                    <td v-text="student_parent.first_guardian_contact_number_1"></td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-danger btn-sm" v-if="hasPermission('edit-student')" :key="student_parent.id" v-confirm="{ok: confirmDelete(student_parent)}" v-tooltip="trans('student.delete_parent')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!student_parents.total" module="student" title="student_parent_module_title" description="student_parent_module_description" icon="check-circle">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="student_parents" @updateRecords="getParents"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    import parentForm from './summary-form'

    export default {
        components : { parentForm },
        data() {
            return {
                student_parents: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'created_at',
                    order: 'desc',
                    first_guardian_name: '',
                    second_guardian_name: '',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'created_at',
                        translation: i18n.general.created_at
                    },
                    {
                        value: 'first_guardian_name',
                        translation: i18n.student.first_guardian_name
                    },
                    {
                        value: 'second_guardian_name',
                        translation: i18n.student.second_guardian_name
                    }
                ],
                showCreatePanel: false,
                showFilterPanel: false,
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('edit-student')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getParents();
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getConfig(config){
                return helper.getConfig(config);
            },
            getParents(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/student/parent?page=' + page + url)
                    .then(response => {
                        this.student_parents = response.student_parents;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/student/parent/print',{filter: this.filter})
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
                axios.post('/api/student/parent/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            confirmDelete(student_parent){
                return dialog => this.deleteRegistration(student_parent);
            },
            deleteRegistration(student_parent){
                let loader = this.$loading.show();
                axios.delete('/api/student/parent/'+student_parent.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getParents();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
        },
        computed:{
            authToken(){
                return helper.getAuthToken();
            }
        },
        filters: {
          moment(date) {
            return helper.formatDate(date);
          },
          momentDateTime(date) {
            return helper.formatDateTime(date);
          }
        },
        watch: {
            'filter.sort_by': function(val){
                this.getParents();
            },
            'filter.order': function(val){
                this.getParents();
            },
            'filter.page_length': function(val){
                this.getParents();
            }
        }
    }
</script>