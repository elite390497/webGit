<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('reception.complaint')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="complaints.total">{{trans('general.total_result_found',{count : complaints.total, from: complaints.from, to: complaints.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="complaints.total && !showCreatePanel && hasPermission('create-complaint')" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('reception.add_new_complaint')}}</span></button>
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
                        <help-button @clicked="help_topic = 'reception.complaint'"></help-button>
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
                                    <label for="">{{trans('reception.complaint_type')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_complaint_types" name="complaint_type_id" id="complaint_type_id" :options="complaint_types" :placeholder="trans('reception.select_complaint_type')" @select="onComplaintTypeSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onComplaintTypeRemove" :selected="selected_complaint_types">
                                        <div class="multiselect__option" slot="afterList" v-if="!complaint_types.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <date-range-picker :start-date.sync="filter.date_of_complaint_start_date" :end-date.sync="filter.date_of_complaint_end_date" :label="trans('general.date_between')"></date-range-picker>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getComplaints">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="fade" v-if="hasPermission('create-complaint')">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('reception.add_new_complaint')}}</h4>
                        <complaint-form @completed="getComplaints" @cancel="showCreatePanel = !showCreatePanel"></complaint-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="complaints.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>{{trans('reception.complaint_type')}}</th>
                                    <th>{{trans('reception.date_of_complaint')}}</th>
                                    <th>{{trans('reception.complainant')}}</th>
                                    <th>{{trans('reception.date_of_resolution')}}</th>
                                    <th>{{trans('reception.complaint_assign_to')}}</th>
                                    <th>{{trans('general.entry_by')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="complaint in complaints.data">
                                    <td v-text="complaint.id"></td>
                                    <td v-text="complaint.complaint_type.name"></td>
                                    <td>{{complaint.date_of_complaint | moment}}</td>
                                    <td>
                                        {{complaint.complainant_name}} <br />
                                        {{complaint.complainant_contact_number}} <br />
                                        {{complaint.complainant_address}} <br />
                                    </td>
                                    <td>
                                        <span v-if="complaint.date_of_resolution" class="label label-success">{{complaint.date_of_resolution | moment}}</span>
                                        <span v-else class="label label-danger">{{trans('reception.complaint_pending')}}</span>
                                    </td>
                                    <td>{{getEmployeeName(complaint.employee)}} <br > {{getEmployeeDesignationOnDate(complaint.employee, complaint.date_of_complaint)}}</td>
                                    <td>{{getEmployeeName(complaint.user.employee)}} <br > {{getEmployeeDesignationOnDate(complaint.user.employee, complaint.date_of_complaint)}}</td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-success btn-sm" v-tooltip="trans('general.view')" @click.prevent="showAction(complaint)"><i class="fas fa-arrow-circle-right"></i></button>
                                            <button class="btn btn-info btn-sm" v-if="hasPermission('edit-complaint')" v-tooltip="trans('reception.edit_complaint')" @click.prevent="editComplaint(complaint)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" v-if="hasPermission('delete-complaint')" :key="complaint.id" v-confirm="{ok: confirmDelete(complaint)}" v-tooltip="trans('reception.delete_complaint')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!complaints.total" module="reception" title="complaint_module_title" description="complaint_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel && hasPermission('create-complaint')" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="complaints" @updateRecords="getComplaints"></pagination-record>
                </div>
            </div>
        </div>
        <complaint-detail v-if="showModal" @close="showModal = false" :uuid="showUuid"></complaint-detail>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    import complaintForm from './form'
    import complaintDetail from './show'

    export default {
        components : { complaintForm, complaintDetail},
        data() {
            return {
                complaints: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'created_at',
                    order: 'desc',
                    type: '',
                    complaint_type_id: [],
                    date_of_complaint_start_date: '',
                    date_of_complaint_end_date: '',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'date',
                        translation: i18n.reception.date_of_complaint
                    },
                    {
                        value: 'created_at',
                        translation: i18n.general.created_at
                    }
                ],
                showFilterPanel: false,
                showCreatePanel: false,
                complaint_types: [],
                selected_complaint_types: null,
                help_topic: '',
                showUuid: '',
                showModal: false
            };
        },
        mounted(){
            if(!helper.hasPermission('list-complaint')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getComplaints();
            helper.showDemoNotification(['reception']);
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            showAction(complaint){
                this.showUuid = complaint.uuid;
                this.showModal = true;
            },
            getEmployeeName(employee){
                return helper.getEmployeeName(employee);
            },
            getComplaints(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                this.filter.date_of_complaint_start_date = helper.toDate(this.filter.date_of_complaint_start_date);
                this.filter.date_of_complaint_end_date = helper.toDate(this.filter.date_of_complaint_end_date);
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/complaint?page=' + page + url)
                    .then(response => {
                        this.complaints = response.complaints;
                        this.complaint_types = response.filters.complaint_types;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editComplaint(complaint){
                this.$router.push('/reception/complaint/'+complaint.uuid+'/edit');
            },
            confirmDelete(complaint){
                return diapass => this.deleteComplaint(complaint);
            },
            deleteComplaint(complaint){
                let loader = this.$loading.show();
                axios.delete('/api/complaint/'+complaint.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        this.getComplaints();
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
                axios.post('/api/complaint/print',{filter: this.filter})
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
                axios.post('/api/complaint/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onComplaintTypeSelect(selectedOption){
                this.filter.complaint_type_id.push(selectedOption.id);
            },
            onComplaintTypeRemove(removedOption){
                this.filter.complaint_type_id.splice(this.filter.complaint_type_id.indexOf(removedOption.id), 1);
            },
            getEmployeeDesignationOnDate(employee, date){
                return helper.getEmployeeDesignationOnDate(employee, date);
            }
        },
        filters: {
          moment(date) {
            return helper.formatDate(date);
          },
          momentDateTime(date) {
            return helper.formatDateTime(date);
          },
          momentTime(time) {
            return helper.formatTime(time);
          }
        },
        watch: {
            'filter.sort_by': function(val){
                this.getComplaints();
            },
            'filter.order': function(val){
                this.getComplaints();
            },
            'filter.page_length': function(val){
                this.getComplaints();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>