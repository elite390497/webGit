<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('reception.call_log')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="call_logs.total">{{trans('general.total_result_found',{count : call_logs.total, from: call_logs.from, to: call_logs.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="call_logs.total && !showCreatePanel && hasPermission('create-call-log')" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('reception.add_new_call_log')}}</span></button>
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
                        <help-button @clicked="help_topic = 'reception.call-log'"></help-button>
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
                                    <label for="">{{trans('reception.call_type')}}</label>
                                    <select v-model="filter.type" class="custom-select col-12">
                                      <option value=null selected>{{trans('general.select_one')}}</option>
                                      <option v-for="option in types" v-bind:value="option.value">
                                        {{ option.text }}
                                      </option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('reception.calling_purpose')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_calling_purposes" name="calling_purpose_id" id="calling_purpose_id" :options="calling_purposes" :placeholder="trans('reception.select_calling_purpose')" @select="onCallingPurposeSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onCallingPurposeRemove" :selected="selected_calling_purposes">
                                        <div class="multiselect__option" slot="afterList" v-if="!calling_purposes.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <date-range-picker :start-date.sync="filter.date_start_date" :end-date.sync="filter.date_end_date" :label="trans('general.date_between')"></date-range-picker>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getCallLogs">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="fade" v-if="hasPermission('create-call-log')">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('reception.add_new_call_log')}}</h4>
                        <call-log-form @completed="getCallLogs" @cancel="showCreatePanel = !showCreatePanel"></call-log-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="call_logs.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>{{trans('reception.calling_purpose')}}</th>
                                    <th>{{trans('reception.call_detail')}}</th>
                                    <th>{{trans('reception.call_log_name')}}</th>
                                    <th>{{trans('reception.date')}}</th>
                                    <th>{{trans('reception.start_time')}}</th>
                                    <th>{{trans('reception.end_time')}}</th>
                                    <th>{{trans('reception.call_duration')}}</th>
                                    <th>{{trans('reception.call_log_description')}}</th>
                                    <th>{{trans('general.entry_by')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="call_log in call_logs.data">
                                    <td v-text="call_log.id"></td>
                                    <td v-text="call_log.calling_purpose.name"></td>
                                    <td>
                                        {{call_log.outgoing_number}} {{trans('general.to')}} {{call_log.incoming_number}}
                                    </td>
                                    <td>{{call_log.name}}</td>
                                    <td>{{call_log.date | moment}}</td>
                                    <td>{{call_log.start_time | momentTime}}</td>
                                    <td>{{call_log.end_time | momentTime}}</td>
                                    <td>{{call_log.call_duration}}</td>
                                    <td>{{call_log.description}}</td>
                                    <td>{{getEmployeeName(call_log.user.employee)}} <br > {{getEmployeeDesignationOnDate(call_log.user.employee, call_log.date)}}</td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-info btn-sm" v-if="hasPermission('edit-call-log')" v-tooltip="trans('reception.edit_call_log')" @click.prevent="editCallLog(call_log)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" v-if="hasPermission('delete-call-log')" :key="call_log.id" v-confirm="{ok: confirmDelete(call_log)}" v-tooltip="trans('reception.delete_call_log')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!call_logs.total" module="reception" title="call_log_module_title" description="call_log_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel && hasPermission('create-call-log')" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="call_logs" @updateRecords="getCallLogs"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    import callLogForm from './form'

    export default {
        components : { callLogForm},
        data() {
            return {
                call_logs: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'created_at',
                    order: 'desc',
                    type: null,
                    calling_purpose_id: [],
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
                        text: i18n.reception.call_type_incoming,
                        value: 'incoming'
                    },
                    {
                        text: i18n.reception.call_type_outgoing,
                        value: 'outgoing'
                    }
                ],
                showFilterPanel: false,
                showCreatePanel: false,
                calling_purposes: [],
                selected_calling_purposes: null,
                help_topic: '',
                showUuid: '',
                showModal: false
            };
        },
        mounted(){
            if(!helper.hasPermission('list-call-log')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getCallLogs();
            helper.showDemoNotification(['reception']);
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            showAction(call_log){
                this.showUuid = call_log.uuid;
                this.showModal = true;
            },
            getCallLogs(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                this.filter.date_start_date = helper.toDate(this.filter.date_start_date);
                this.filter.date_end_date = helper.toDate(this.filter.date_end_date);
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/call/log?page=' + page + url)
                    .then(response => {
                        this.call_logs = response.call_logs;
                        this.calling_purposes = response.filters.calling_purposes;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editCallLog(call_log){
                this.$router.push('/reception/call/log/'+call_log.uuid+'/edit');
            },
            confirmDelete(call_log){
                return dialog => this.deleteCallLog(call_log);
            },
            deleteCallLog(call_log){
                let loader = this.$loading.show();
                axios.delete('/api/call/log/'+call_log.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        this.getCallLogs();
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
                axios.post('/api/call/log/print',{filter: this.filter})
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
                axios.post('/api/call/log/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onCallingPurposeSelect(selectedOption){
                this.filter.calling_purpose_id.push(selectedOption.id);
            },
            onCallingPurposeRemove(removedOption){
                this.filter.calling_purpose_id.splice(this.filter.calling_purpose_id.indexOf(removedOption.id), 1);
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
                this.getCallLogs();
            },
            'filter.order': function(val){
                this.getCallLogs();
            },
            'filter.page_length': function(val){
                this.getCallLogs();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>