<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('reception.admission_enquiry')}}
                        <span class="card-subtitle d-none d-sm-inline" v-if="enquiries.total">{{trans('general.total_result_found',{count : enquiries.total, from: enquiries.from, to: enquiries.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="enquiries.total && !showCreatePanel && hasPermission('create-enquiry')" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('reception.add_new_enquiry')}}</span></button>
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
                        <help-button @clicked="help_topic = 'reception.enquiry'"></help-button>
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
                                    <label for="">{{trans('reception.enquiry_type')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_enquiry_types" name="enquiry_type_id" id="enquiry_type_id" :options="enquiry_types" :placeholder="trans('reception.select_enquiry_type')" @select="onEnquiryTypeSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onEnquiryTypeRemove" :selected="selected_enquiry_types">
                                        <div class="multiselect__option" slot="afterList" v-if="!enquiry_types.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('reception.enquiry_source')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_enquiry_sources" name="enquiry_source_id" id="enquiry_source_id" :options="enquiry_sources" :placeholder="trans('reception.select_enquiry_source')" @select="onEnquirySourceSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onEnquirySourceRemove" :selected="selected_enquiry_sources">
                                        <div class="multiselect__option" slot="afterList" v-if="!enquiry_sources.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('academic.institute')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_institutes" name="institute_id" id="institute_id" :options="institutes" :placeholder="trans('academic.select_institute')" @select="onInstituteSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onInstituteRemove" :selected="selected_institutes">
                                        <div class="multiselect__option" slot="afterList" v-if="!institutes.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('reception.enquiry_status')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_enquiry_statuses" name="enquiry_status" id="enquiry_status" :options="enquiry_statuses" :placeholder="trans('reception.select_enquiry_status')" @select="onEnquiryStatusSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onEnquiryStatusRemove" :selected="selected_enquiry_statuses">
                                        <div class="multiselect__option" slot="afterList" v-if="!enquiry_statuses.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <date-range-picker :start-date.sync="filter.date_of_enquiry_start_date" :end-date.sync="filter.date_of_enquiry_end_date" :label="trans('general.date_between')"></date-range-picker>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getEnquiries">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="fade" v-if="hasPermission('create-enquiry')">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('reception.add_new_enquiry')}}</h4>
                        <enquiry-form @completed="getEnquiries" @cancel="showCreatePanel = !showCreatePanel"></enquiry-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="enquiries.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>{{trans('reception.enquirer')}}</th>
                                    <th>{{trans('reception.enquiry_type')}}</th>
                                    <th>{{trans('reception.enquiry_source')}}</th>
                                    <th>{{trans('reception.date_of_enquiry')}}</th>
                                    <th>{{trans('student.contact_number')}}</th>
                                    <th>{{trans('reception.no_of_students')}}</th>
                                    <th>{{trans('reception.enquiry_status')}}</th>
                                    <th>{{trans('reception.enquiry_remarks')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="enquiry in enquiries.data">
                                    <td v-text="enquiry.id"></td>
                                    <td>
                                        <span v-if="enquiry.first_guardian_name && enquiry.first_guardian_relation">{{trans('list.'+enquiry.first_guardian_relation)+': '+enquiry.first_guardian_name}} <br /></span>
                                        <span v-if="enquiry.second_guardian_name && enquiry.second_guardian_relation">{{trans('list.'+enquiry.second_guardian_relation)+': '+enquiry.second_guardian_name}} <br /></span>
                                        <span v-if="enquiry.third_guardian_name && enquiry.third_guardian_relation">{{trans('list.'+enquiry.third_guardian_relation)+': '+enquiry.third_guardian_name}} <br /></span>
                                    </td>
                                    <td v-text="enquiry.enquiry_type.name"></td>
                                    <td v-text="enquiry.enquiry_source.name"></td>
                                    <td>{{enquiry.date_of_enquiry | moment}}</td>
                                    <td>
                                        <span v-if="enquiry.contact_number">{{trans('student.contact_number')+': '+enquiry.contact_number}} <br /></span>
                                        <span v-if="enquiry.alternate_contact_number">{{trans('student.alternate_contact_number')+': '+enquiry.alternate_contact_number}} <br /></span>
                                        <span v-if="enquiry.email">{{trans('student.email')+': '+enquiry.email}} <br /></span>
                                    </td>
                                    <td v-text="enquiry.enquiry_details_count"></td>
                                    <td>
                                        <span v-for="status in getEnquiryStatus(enquiry)" :class="['label','label-'+status.color,'m-r-5']">{{status.label}}</span>
                                    </td>
                                    <td v-text="enquiry.remarks"></td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-success btn-sm" v-tooltip="trans('reception.enquiry_detail')" @click="$router.push('/reception/enquiry/'+enquiry.uuid)"><i class="fas fa-arrow-circle-right"></i></button>
                                            <button class="btn btn-info btn-sm" v-if="hasPermission('edit-enquiry')" v-tooltip="trans('reception.edit_enquiry')" @click.prevent="editEnquiry(enquiry)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" v-if="hasPermission('delete-enquiry')" :key="enquiry.id" v-confirm="{ok: confirmDelete(enquiry)}" v-tooltip="trans('reception.delete_enquiry')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!enquiries.total" module="reception" title="enquiry_module_title" description="enquiry_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel && hasPermission('create-enquiry')" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="enquiries" @updateRecords="getEnquiries"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    import enquiryForm from './form'

    export default {
        components : { enquiryForm },
        data() {
            return {
                enquiries: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'date_of_enquiry',
                    order: 'desc',
                    enquiry_type_id: [],
                    enquiry_source_id: [],
                    enquiry_status: [],
                    institute_id: [],
                    date_of_enquiry_start_date: '',
                    date_of_enquiry_end_date: '',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'date_of_enquiry',
                        translation: i18n.reception.date_of_enquiry
                    },
                    {
                        value: 'created_at',
                        translation: i18n.general.created_at
                    }
                ],
                showFilterPanel: false,
                showCreatePanel: false,
                enquiry_types: [],
                selected_enquiry_types: null,
                enquiry_sources: [],
                selected_enquiry_sources: null,
                enquiry_statuses: [],
                selected_enquiry_statuses: null,
                institutes: [],
                selected_institutes: null,
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('list-enquiry')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getEnquiries();
            helper.showDemoNotification(['reception']);
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getEmployeeName(employee){
                return helper.getEmployeeName(employee);
            },
            getEnquiries(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                this.filter.date_of_enquiry_start_date = helper.toDate(this.filter.date_of_enquiry_start_date);
                this.filter.date_of_enquiry_end_date = helper.toDate(this.filter.date_of_enquiry_end_date);
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/enquiry?page=' + page + url)
                    .then(response => {
                        this.enquiries = response.enquiries;
                        this.enquiry_types = response.filters.enquiry_types;
                        this.enquiry_sources = response.filters.enquiry_sources;
                        this.enquiry_statuses = response.filters.enquiry_statuses;
                        this.institutes = response.filters.institutes;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editEnquiry(enquiry){
                this.$router.push('/reception/enquiry/'+enquiry.uuid+'/edit');
            },
            confirmDelete(enquiry){
                return dialog => this.deleteEnquiry(enquiry);
            },
            deleteEnquiry(enquiry){
                let loader = this.$loading.show();
                axios.delete('/api/enquiry/'+enquiry.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        this.getEnquiries();
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
                axios.post('/api/enquiry/print',{filter: this.filter})
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
                axios.post('/api/enquiry/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onEnquiryTypeSelect(selectedOption){
                this.filter.enquiry_type_id.push(selectedOption.id);
            },
            onEnquiryTypeRemove(removedOption){
                this.filter.enquiry_type_id.splice(this.filter.enquiry_type_id.indexOf(removedOption.id), 1);
            },
            onEnquirySourceSelect(selectedOption){
                this.filter.enquiry_source_id.push(selectedOption.id);
            },
            onEnquirySourceRemove(removedOption){
                this.filter.enquiry_source_id.splice(this.filter.enquiry_source_id.indexOf(removedOption.id), 1);
            },
            onEnquiryStatusSelect(selectedOption){
                this.filter.enquiry_status.push(selectedOption.id);
            },
            onEnquiryStatusRemove(removedOption){
                this.filter.enquiry_status.splice(this.filter.enquiry_status.indexOf(removedOption.id), 1);
            },
            onInstituteSelect(selectedOption){
                this.filter.institute_id.push(selectedOption.id);
            },
            onInstituteRemove(removedOption){
                this.filter.institute_id.splice(this.filter.institute_id.indexOf(removedOption.id), 1);
            },
            getEnquiryStatus(enquiry){
                return helper.getEnquiryStatus(enquiry);
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
                this.getEnquiries();
            },
            'filter.order': function(val){
                this.getEnquiries();
            },
            'filter.page_length': function(val){
                this.getEnquiries();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>