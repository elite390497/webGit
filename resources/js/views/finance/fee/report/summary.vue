<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('finance.fee_summary_report')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="list.total">{{trans('general.total_result_found',{count : list.total, from: list.from, to: list.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
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
                        <help-button @clicked="help_topic = 'finance.fee.report.summary'"></help-button>
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
                                    <label for="">{{trans('student.first_name')}}</label>
                                    <input class="form-control" type="text" v-model="filter.first_name" name="first_name" :placeholder="trans('student.first_name')">
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('student.last_name')}}</label>
                                    <input class="form-control" type="text" v-model="filter.last_name" name="last_name" :placeholder="trans('student.last_name')">
                                </div>
                            </div>
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
                                    <label for="">{{trans('finance.balance_fee_greater_than')}}</label>
                                    <input class="form-control" type="text" v-model="filter.min_balance" name="min_balance" :placeholder="trans('student.min_balance')">
                                </div>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getSummary">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="list.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th class="select-all" v-if="hasPermission('send-sms')">
                                        <label class="custom-control custom-checkbox">
                                            <input type="checkbox" class="custom-control-input" value="1" v-model="selectAll" @change="toggleSelectAll">
                                            <span class="custom-control-label"></span>
                                        </label>
                                    </th>
                                    <th>{{trans('student.admission_number_short')}}</th>
                                    <th>{{trans('student.name')}}</th>
                                    <th>{{trans('academic.batch')}}</th>
                                    <th>{{trans('student.first_guardian_name')}}</th>
                                    <th>{{trans('student.contact_number')}}</th>
                                    <th>{{trans('finance.total_fee')}}</th>
                                    <th>{{trans('finance.other')}}</th>
                                    <th>{{trans('finance.total_concession')}}</th>
                                    <th>{{trans('finance.paid_fee')}}</th>
                                    <th>{{trans('finance.balance_fee')}}</th>
                                    <th>{{trans('finance.late_fee_charged')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in list.data">
                                    <td class="select-all" v-if="hasPermission('send-sms')">
                                        <label class="custom-control custom-checkbox">
                                            <input type="checkbox" class="custom-control-input" :value="item.id" v-model="sendSMSForm.ids">
                                            <span class="custom-control-label"></span>
                                        </label>
                                    </td>
                                    <td v-text="item.admission_number"></td>
                                    <td v-text="item.name"></td>
                                    <td v-text="item.batch"></td>
                                    <td v-text="item.first_guardian_name"></td>
                                    <td v-text="item.contact_number"></td>
                                    <td v-text="item.total"></td>
                                    <td v-text="item.other"></td>
                                    <td v-text="item.concession"></td>
                                    <td v-text="item.paid"></td>
                                    <td v-text="item.balance"></td>
                                    <td v-text="item.late"></td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-info btn-sm" v-tooltip="trans('general.view_detail')" @click="$router.push('/student/'+item.uuid+'/fee/'+item.id)"><i class="fas fa-arrow-circle-right"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th colspan="6"></th>
                                    <th>{{footer.grand_total}}</th>
                                    <th>{{footer.grand_other}}</th>
                                    <th>{{footer.grand_concession}}</th>
                                    <th>{{footer.grand_paid}}</th>
                                    <th>{{footer.grand_balance}}</th>
                                    <th>{{footer.grand_late}}</th>
                                    <th></th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <module-info v-if="!list.total" module="finance" title="fee_summary_report_module_title" description="fee_summary_report_module_description" icon="list">
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="list" @updateRecords="getSummary"></pagination-record>
                </div>
                <div class="m-t-10 card-body border-top p-4" v-if="sendSMSForm.ids.length && hasPermission('send-sms')">
                    <h4 class="card-title">{{trans('communication.send_sms')}}</h4>
                    <p>{{trans('general.total_selected', {type: trans('student.student'), count: sendSMSForm.ids.length})}}</p>
                    <form @submit.prevent="submit" @keydown="sendSMSForm.errors.clear($event.target.name)">
                        <div class="row">
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label for="">{{trans('communication.sms')}} {{trans('communication.character_count', {count: characterCount})}} </label>
                                    <textarea class="form-control" v-model="sendSMSForm.sms" rows="2" name="sms" :placeholder="trans('communication.sms')"></textarea>
                                    <p class="help-block font-80pc">{{trans('communication.template_variable_tip')}}</p>
                                    <p class="help-block font-90pc">{{trans('communication.available_variables')}}: NAME, BATCH, FIRST_GUARDIAN_NAME, LATE_FEE, TOTAL_FEE, PAID_FEE, BALANCE_FEE</p>
                                    <show-error :form-name="sendSMSForm" prop-name="sms"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label for="">{{trans('communication.sample_sms')}}</label>
                                    <p>{{sampleMessage}}</p>
                                </div>
                            </div>
                        </div>
                        <button type="button" class="btn btn-info waves-effect waves-light" key="send-summary" v-confirm="{ok: confirmSendAction()}">{{trans('general.send')}}</button>
                    </form>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    export default {
        components : {  },
        data() {
            return {
                list: {
                    total: 0,
                    data: []
                },
                batches: [],
                selected_batches: null,
                footer: [],
                filter: {
                    sort_by : 'name',
                    order: 'asc',
                    first_name: '',
                    last_name: '',
                    min_balance: '',
                    batch_id: [],
                    page_length: helper.getConfig('page_length')
                },
                selectAll: false,
                sendSMSForm: new Form({
                    ids: [],
                    sms: ''
                }),
                orderByOptions: [
                    {
                        value: 'admission_number',
                        translation: i18n.student.admission_number
                    },
                    {
                        value: 'name',
                        translation: i18n.student.name
                    },
                    {
                        value: 'first_guardian_name',
                        translation: i18n.student.first_guardian_name
                    },
                    {
                        value: 'total',
                        translation: i18n.finance.total_fee
                    },
                    {
                        value: 'concession',
                        translation: i18n.finance.total_concession
                    },
                    {
                        value: 'paid',
                        translation: i18n.finance.paid_fee
                    },
                    {
                        value: 'balance',
                        translation: i18n.finance.balance_fee
                    },
                    {
                        value: 'late',
                        translation: i18n.finance.late_fee_charged
                    }
                ],
                showFilterPanel: false,
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('access-fee-report')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getSummary();
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getSummary(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                this.selectAll = false;
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/fee/report/summary?page=' + page + url)
                    .then(response => {
                        this.list = response.list;
                        this.footer = response.footer;
                        this.batches = response.filters.batches;
                        let ids = [];
                        this.list.data.forEach(item => {
                            ids.push(item.id);
                        })
                        this.selectAll = ids.every(elem => this.sendSMSForm.ids.indexOf(elem) > -1) ? 1 : 0;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            toggleSelectAll(){
                if(this.selectAll) {
                    this.list.data.forEach(item => {
                        if (this.sendSMSForm.ids.indexOf(item.id) < 0)
                            this.sendSMSForm.ids.push(item.id);
                    });
                } else {
                    this.list.data.forEach(item => {
                        let index = this.sendSMSForm.ids.indexOf(item.id);
                        if (index >= 0) {
                            this.sendSMSForm.ids.splice(index, 1);
                        }
                    });
                }
            },
            getConfig(config){
                return helper.getConfig(config);
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/fee/report/summary/print',{filter: this.filter})
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
                axios.post('/api/fee/report/summary/pdf',{filter: this.filter})
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
            },
            confirmSendAction(){
                return dialog => this.sendSMS();
            },
            sendSMS(){
                let loader = this.$loading.show();
                this.sendSMSForm.filter = this.filter;
                this.sendSMSForm.post('/api/fee/report/summary/sms')
                    .then(response => {
                        toastr.success(response.message);
                        this.sendSMSForm.ids = [];
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
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
                this.getSummary();
            },
            'filter.order': function(val){
                this.getSummary();
            },
            'filter.page_length': function(val){
                this.getSummary();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            },
            sampleMessage(){
                let item = this.list.data[0];

                let sms = this.sendSMSForm.sms;

                return sms.replace("#NAME#", item.name)
                    .replace("#BATCH#", item.batch)
                    .replace("#FIRST_GUARDIAN_NAME#", item.first_guardian_name)
                    .replace("#LATE_FEE#", item.late)
                    .replace("#TOTAL_FEE#", item.total)
                    .replace("#PAID_FEE#", item.paid)
                    .replace("#BALANCE_FEE#", item.balance);
            },
            characterCount(){
                return this.sendSMSForm.sms.length;
            }
        }
    }
</script>