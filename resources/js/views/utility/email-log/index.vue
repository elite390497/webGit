<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('utility.email_log')}}
                        <span class="card-subtitle d-none d-sm-inline" v-if="email_logs.total">{{trans('general.total_result_found',{count : email_logs.total, from: email_logs.from, to: email_logs.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <sort-by :order-by-options="orderByOptions" :sort-by="filter.sort_by" :order="filter.order" @updateSortBy="value => {filter.sort_by = value}"  @updateOrder="value => {filter.order = value}"></sort-by>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="email_logs.total">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>{{trans('utility.email_receiver')}}</th>
                                    <th>{{trans('utility.email_subject')}}</th>
                                    <th>{{trans('utility.sent_at')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="email_log in email_logs.data">
                                    <td v-text="email_log.to_address"></td>
                                    <td v-text="email_log.subject"></td>
                                    <td>{{email_log.created_at | moment }}</td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button type="button" class="btn btn-info btn-sm" @click="showDetailAction(email_log)" v-tooltip="trans('utility.view_email')"><i class="fas fa-arrow-circle-right"></i></button>
                                            <button class="btn btn-danger btn-sm" :key="email_log.id" v-confirm="{ok: confirmDelete(email_log)}" v-tooltip="trans('utility.delete_email_log')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!email_logs.total" module="utility" title="email_log_module_title" description="email_log_module_description" icon="list"></module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="email_logs" @updateRecords="getEmailLogs" @change.native="getEmailLogs"></pagination-record>
                </div>
            </div>

            <transition name="modal" v-if="showDetailModal">
                <div class="modal-mask">
                    <div class="modal-wrapper">
                        <div class="modal-container modal-lg">
                            <div class="modal-header">
                                <slot name="header">
                                    {{trans('utility.email_log')}}
                                    <span class="float-right pointer" @click="showDetailModal = false">x</span>
                                </slot>
                            </div>
                            <div class="modal-body">
                                <slot name="body">
                                    <h4>{{utility.email_subject}}
                                        <span class="pull-right">{{email_log.created_at | moment}}</span>
                                    </h4>
                                    <p>{{trans('utility.email_sender')+': '+email_log.from_address}}</p>
                                    <p>{{trans('utility.email_receiver')+': '+email_log.to_address}}</p>
                                    <div v-html="email_log.body"></div>
                                    <div class="clearfix"></div>
                                </slot>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>
<script>
    export default {
        components: {},
        data(){
            return {
                email_logs: {
                    total: 0,
                    data: []
                },
                filter: {
                    page_length: helper.getConfig('page_length'),
                    sort_by: 'created_at',
                    order: 'desc'
                },
                email_log: {},
                orderByOptions: [
                    {
                        value: 'created_at',
                        translation: i18n.general.created_at
                    }
                ],
                showDetailModal: false
            };
        },
        mounted(){
            if(!helper.featureAvailable('email_log')){
                helper.featureNotAvailableMsg();
                this.$router.push('/dashboard');
            }

            if(!helper.hasPermission('access-configuration')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getEmailLogs();
        },
        methods: {
            getEmailLogs(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/email-log?page=' + page + url)
                    .then(response => {
                        this.email_logs = response;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            showDetailAction(email_log){
                this.showDetailModal = true;
                let loader = this.$loading.show();
                axios.get('/api/email-log/'+email_log.id)
                    .then(response => {
                        this.email_log = response;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            confirmDelete(email_log){
                return dialog => this.deleteEmailLog(email_log);
            },
            deleteEmailLog(email_log){
                let loader = this.$loading.show();
                axios.delete('/api/email-log/'+email_log.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getEmailLogs();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
        },
        filters: {
          moment(date) {
            return helper.formatDateTime(date);
          }
        },
        watch: {
            filter: {
                handler(val){
                    this.getEmailLogs();
                },
                deep: true
            }
        }
    }
</script>
