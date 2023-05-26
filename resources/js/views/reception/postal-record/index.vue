<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('reception.postal_record')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="postal_records.total">{{trans('general.total_result_found',{count : postal_records.total, from: postal_records.from, to: postal_records.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="postal_records.total && !showCreatePanel && hasPermission('create-postal-record')" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('reception.add_new_postal_record')}}</span></button>
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
                        <help-button @clicked="help_topic = 'reception.postal-record'"></help-button>
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
                                    <label for="">{{trans('reception.postal_record_type')}}</label>
                                    <select v-model="filter.type" class="custom-select col-12">
                                      <option value=null selected>{{trans('general.select_one')}}</option>
                                      <option v-for="option in types" v-bind:value="option.value">
                                        {{ option.text }}
                                      </option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <date-range-picker :start-date.sync="filter.date_start_date" :end-date.sync="filter.date_end_date" :label="trans('general.date_between')"></date-range-picker>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getPostalRecords">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="fade" v-if="hasPermission('create-postal-record')">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('reception.add_new_postal_record')}}</h4>
                        <postal-record-form @completed="getPostalRecords" @cancel="showCreatePanel = !showCreatePanel"></postal-record-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="postal_records.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>{{trans('reception.postal_record_type')}}</th>
                                    <th>{{trans('reception.postal_record_reference_number')}}</th>
                                    <th>{{trans('reception.postal_record_confidential')}}</th>
                                    <th>{{trans('reception.postal_record_sender')}}</th>
                                    <th>{{trans('reception.postal_record_receiver')}}</th>
                                    <th>{{trans('reception.postal_record_date')}}</th>
                                    <th>{{trans('general.entry_by')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="postal_record in postal_records.data">
                                    <td v-text="postal_record.id"></td>
                                    <td v-text="postal_record.type"></td>
                                    <td>{{postal_record.reference_number}}</td>
                                    <td v-html="isConfidential(postal_record)"></td>
                                    <td>
                                        {{postal_record.sender_title}} <br />
                                        {{postal_record.sender_address}}
                                    </td>
                                    <td>
                                        {{postal_record.receiver_title}} <br />
                                        {{postal_record.receiver_address}}
                                    </td>
                                    <td>{{postal_record.date | moment}}</td>
                                    <td>{{getEmployeeName(postal_record.user.employee)}} <br > {{getEmployeeDesignationOnDate(postal_record.user.employee, postal_record.date)}}</td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-success btn-sm" v-tooltip="trans('general.view')" @click.prevent="showAction(postal_record)"><i class="fas fa-arrow-circle-right"></i></button>
                                            <button class="btn btn-info btn-sm" v-if="hasPermission('edit-postal-record')" v-tooltip="trans('reception.edit_postal_record')" @click.prevent="editPostalRecord(postal_record)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" v-if="hasPermission('delete-postal-record')" :key="postal_record.id" v-confirm="{ok: confirmDelete(postal_record)}" v-tooltip="trans('reception.delete_postal_record')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!postal_records.total" module="reception" title="postal_record_module_title" description="postal_record_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel && hasPermission('create-postal-record')" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="postal_records" @updateRecords="getPostalRecords"></pagination-record>
                </div>
            </div>
        </div>
        <postal-record-detail v-if="showModal" @close="showModal = false" :uuid="showUuid"></postal-record-detail>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    import postalRecordForm from './form'
    import postalRecordDetail from './show'

    export default {
        components : { postalRecordForm, postalRecordDetail},
        data() {
            return {
                postal_records: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'created_at',
                    order: 'desc',
                    type: null,
                    date_start_date: '',
                    date_end_date: '',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'created_at',
                        translation: i18n.general.created_at
                    }
                ],
                types: [
                    {
                        text: i18n.reception.postal_record_dispatch,
                        value: 'dispatch'
                    },
                    {
                        text: i18n.reception.postal_record_receive,
                        value: 'receive'
                    }
                ],
                showFilterPanel: false,
                showCreatePanel: false,
                postaling_purposes: [],
                selected_postaling_purposes: null,
                help_topic: '',
                showUuid: '',
                showModal: false
            };
        },
        mounted(){
            if(!helper.hasPermission('list-postal-record')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getPostalRecords();
            helper.showDemoNotification(['reception']);
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            showAction(postal_record){
                this.showUuid = postal_record.uuid;
                this.showModal = true;
            },
            getPostalRecords(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                this.filter.date_start_date = helper.toDate(this.filter.date_start_date);
                this.filter.date_end_date = helper.toDate(this.filter.date_end_date);
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/postal/record?page=' + page + url)
                    .then(response => {
                        this.postal_records = response.postal_records;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editPostalRecord(postal_record){
                this.$router.push('/reception/postal/record/'+postal_record.uuid+'/edit');
            },
            confirmDelete(postal_record){
                return diarecord => this.deletePostalRecord(postal_record);
            },
            isConfidential(postal_record){
                return postal_record.is_confidential ? '<i class="fas fa-check"></i>' : '<i class="fas fa-times"></i>';
            },
            deletePostalRecord(postal_record){
                let loader = this.$loading.show();
                axios.delete('/api/postal/record/'+postal_record.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        this.getPostalRecords();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getConfig(config) {
                return helper.getConfig(config)
            },
            getEmployeeName(employee){
                return helper.getEmployeeName(employee);
            },
            getEmployeeDesignationOnDate(employee, date){
                return helper.getEmployeeDesignationOnDate(employee, date);
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/postal/record/print',{filter: this.filter})
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
                axios.post('/api/postal/record/pdf',{filter: this.filter})
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
                this.getPostalRecords();
            },
            'filter.order': function(val){
                this.getPostalRecords();
            },
            'filter.page_length': function(val){
                this.getPostalRecords();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>