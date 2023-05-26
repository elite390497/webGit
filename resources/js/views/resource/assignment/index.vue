<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('resource.assignment')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="assignments.total">{{trans('general.total_result_found',{count : assignments.total, from: assignments.from, to: assignments.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="assignments.total && !showCreatePanel && hasPermission('create-assignment')" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('resource.add_new_assignment')}}</span></button>
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
                        <help-button @clicked="help_topic = 'resource.assignment'"></help-button>
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
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('academic.batch')}}</label>
                                    <v-select label="name" track-by="id" group-values="batches" group-label="course_group" :group-select="false" v-model="selected_batches" name="batch_id" id="batch_id" :options="batches" :placeholder="trans('academic.select_batch')" @select="onBatchSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onBatchRemove" :selected="selected_batches">
                                        <div class="multiselect__option" slot="afterList" v-if="!batches.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('resource.assignment_title')}}</label>
                                    <input class="form-control" name="title" v-model="filter.title">
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <date-range-picker :start-date.sync="filter.date_of_assignment_start_date" :end-date.sync="filter.date_of_assignment_end_date" :label="trans('resource.date_of_assignment_between')"></date-range-picker>
                            </div>
                            <div class="col-12 col-sm-6">
                                <date-range-picker :start-date.sync="filter.due_date_start_date" :end-date.sync="filter.due_date_end_date" :label="trans('resource.due_date_between')"></date-range-picker>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getAssignments">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="fade" v-if="hasPermission('create-assignment')">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('resource.add_new_assignment')}}</h4>
                        <assignment-form @completed="getAssignments" @cancel="showCreatePanel = !showCreatePanel"></assignment-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="assignments.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('academic.subject')}}</th>
                                    <th>{{trans('academic.batch')}}</th>
                                    <th>{{trans('resource.assignment_title')}}</th>
                                    <th>{{trans('resource.date_of_assignment')}}</th>
                                    <th>{{trans('resource.due_date_of_assignment')}}</th>
                                    <th>{{trans('resource.assignment_posted_by')}}</th>
                                    <th>{{trans('general.created_at')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="assignment in assignments.data">
                                    <td v-text="assignment.subject.name+' ('+assignment.subject.code+')'"></td>
                                    <td v-text="assignment.subject.batch.course.name+' '+assignment.subject.batch.name"></td>
                                    <td v-text="assignment.title"></td>
                                    <td>{{assignment.date_of_assignment | moment}}</td>
                                    <td>{{assignment.due_date | moment}}</td>
                                    <td>{{getEmployeeName(assignment.employee)}} <br > {{getEmployeeDesignationOnDate(assignment.employee, assignment.date_of_assignment)}}</td>
                                    <td>{{assignment.created_at | momentDateTime}}</td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-success btn-sm" v-tooltip="trans('resource.view_assignment')" @click.prevent="showAction(assignment)"><i class="fas fa-arrow-circle-right"></i></button>
                                            <button class="btn btn-info btn-sm" v-if="hasPermission('edit-assignment')" v-tooltip="trans('resource.edit_assignment')" @click.prevent="editAssignment(assignment)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" v-if="hasPermission('delete-assignment')" :key="assignment.id" v-confirm="{ok: confirmDelete(assignment)}" v-tooltip="trans('resource.delete_assignment')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!assignments.total" module="resource" title="assignment_module_title" description="assignment_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel && hasPermission('create-assignment')" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="assignments" @updateRecords="getAssignments"></pagination-record>
                </div>
            </div>
        </div>
        <assignment-detail v-if="showModal" @close="showModal = false" :uuid="showUuid"></assignment-detail>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    import assignmentForm from './form'
    import assignmentDetail from './show'

    export default {
        components : { assignmentForm,assignmentDetail},
        data() {
            return {
                assignments: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'date_of_assignment',
                    order: 'desc',
                    title: '',
                    batch_id: [],
                    date_of_assignment_start_date: '',
                    date_of_assignment_end_date: '',
                    due_date_start_date: '',
                    due_date_end_date: '',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'date_of_assignment',
                        translation: i18n.resource.date_of_assignment
                    },
                    {
                        value: 'title',
                        translation: i18n.resource.assignment_title
                    }
                ],
                batches: [],
                selected_batches: null,
                showFilterPanel: false,
                showCreatePanel: false,
                help_topic: '',
                showUuid: '',
                showModal: false
            };
        },
        mounted(){
            if(!helper.hasPermission('list-assignment')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getAssignments();
            helper.showDemoNotification(['resource']);
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            showAction(assignment){
                this.showUuid = assignment.uuid;
                this.showModal = true;
            },
            getEmployeeName(employee){
                return helper.getEmployeeName(employee);
            },
            getEmployeeDesignationOnDate(employee, date){
                return helper.getEmployeeDesignationOnDate(employee, date);
            },
            getAssignments(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                this.filter.date_of_assignment_start_date = helper.toDate(this.filter.date_of_assignment_start_date);
                this.filter.date_of_assignment_end_date = helper.toDate(this.filter.date_of_assignment_end_date);
                this.filter.due_date_start_date = helper.toDate(this.filter.due_date_start_date);
                this.filter.due_date_end_date = helper.toDate(this.filter.due_date_end_date);
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/assignment?page=' + page + url)
                    .then(response => {
                        this.assignments = response.assignments;
                        this.batches = response.filters.batches;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editAssignment(assignment){
                this.$router.push('/resource/assignment/'+assignment.uuid+'/edit');
            },
            confirmDelete(assignment){
                return dialog => this.deleteAssignment(assignment);
            },
            deleteAssignment(assignment){
                let loader = this.$loading.show();
                axios.delete('/api/assignment/'+assignment.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        this.getAssignments();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getConfig(config) {
                return helper.getConfig(config)
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/assignment/print',{filter: this.filter})
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
                axios.post('/api/assignment/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onBatchSelect(selectedOption){
                this.filter.batch_id.push(selectedOption.id);
            },
            onBatchRemove(removedOption){
                this.filter.batch_id.splice(this.filter.batch_id.indexOf(removedOption.id), 1);
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
                this.getAssignments();
            },
            'filter.order': function(val){
                this.getAssignments();
            },
            'filter.page_length': function(val){
                this.getAssignments();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>