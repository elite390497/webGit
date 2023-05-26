<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('calendar.holiday')}} 
                        <span class="card-subtitle" v-if="holidays.total"><span class="d-none d-sm-inline">{{ trans('general.total_result_found',{count: holidays.total, from: holidays.from, to: holidays.to}) }}</span></span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="!showFilterPanel" @click="showFilterPanel = !showFilterPanel"><i class="fas fa-filter"></i> <span class="d-none d-sm-inline"> {{trans('general.filter')}}</span></button>
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
                        <help-button @clicked="help_topic = 'calendar.holiday'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-12 col-sm-4" v-if="hasPermission('create-holiday')">
                    <div class="card card-form border-right">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('calendar.add_new_holiday')}}</h4>
                            <create-holiday @completed="getHolidays" :disabled-dates="existing_holidays"></create-holiday>
                        </div>
                    </div>
                </div>
                <div :class="['col-12', hasPermission('create-holiday') ? 'col-sm-8' : '']">
                    <transition name="fade">
                        <div class="card card-form border-left" v-if="showFilterPanel">
                            <div class="card-body">
                                <h4 class="card-title">{{trans('general.filter')}}</h4>
                                <div class="row">
                                    <div class="col-12 col-sm-4">
                                        <div class="form-group">
                                            <label for="">{{trans('calendar.holiday_keyword')}}</label>
                                            <input class="form-control" name="keyword" v-model="filter.keyword">
                                        </div>
                                    </div>
                                    <div class="col-12 col-sm-8">
                                        <date-range-picker :start-date.sync="filter.date_start_date" :end-date.sync="filter.date_end_date" :label="trans('general.date_between')"></date-range-picker>
                                    </div>
                                </div>
                                <div class="card-footer text-right">
                                    <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                                    <button type="button" class="btn btn-info waves-effect waves-light" @click="getHolidays">{{trans('general.filter')}}</button>
                                </div>
                            </div>
                        </div>
                    </transition>
                    <div class="card">
                        <div class="card-body">
                            <div class="table-responsive" v-if="holidays.total">
                                <table class="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>{{trans('calendar.holiday_date')}}</th>
                                            <th>{{trans('calendar.holiday_description')}}</th>
                                            <th class="table-option" v-if="hasAnyPermission(['edit-holiday','delete-holiday'])">{{trans('general.action')}}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="holiday in holidays.data">
                                            <td>{{holiday.date | moment}}</td>
                                            <td>{{holiday.description}}</td>
                                            <td class="table-option" v-if="hasAnyPermission(['edit-holiday','delete-holiday'])">
                                                <div class="btn-group">
                                                    <button class="btn btn-info btn-sm" v-if="hasPermission('edit-holiday')" v-tooltip="trans('calendar.edit_holiday')" @click.prevent="editHoliday(holiday)"><i class="fas fa-edit"></i></button>
                                                    <button class="btn btn-danger btn-sm" v-if="hasPermission('delete-holiday')" :key="holiday.id" v-confirm="{ok: confirmDelete(holiday)}" v-tooltip="trans('calendar.delete_holiday')"><i class="fas fa-trash"></i></button>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <module-info v-if="!holidays.total" module="calendar" title="holiday_module_title" description="holiday_module_description" icon="list"></module-info>
                            <pagination-record :page-length.sync="filter.page_length" :records="holidays" @updateRecords="getHolidays"></pagination-record>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    import createHoliday from './create'

    export default {
        components : { createHoliday },
        data() {
            return {
                holidays: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'date',
                    order: 'asc',
                    keyword: '',
                    date_start_date: '',
                    date_end_date: '',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'date',
                        translation: i18n.calendar.holiday_date
                    },
                    {
                        value: 'description',
                        translation: i18n.calendar.holiday_description
                    }
                ],
                help_topic: '',
                existing_holidays: [],
                showFilterPanel: false
            };
        },
        mounted(){
            if(!helper.hasPermission('list-holiday')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getHolidays();
            helper.showDemoNotification(['calendar']);
        },
        methods: {
            getConfig(config){
                return helper.getConfig(config);
            },
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            hasAnyPermission(permission){
                return helper.hasAnyPermission(permission);
            },
            getHolidays(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                this.filter.date_start_date = helper.toDate(this.filter.date_start_date);
                this.filter.date_end_date = helper.toDate(this.filter.date_end_date);
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/holiday?page=' + page + url)
                    .then(response => {
                        this.holidays = response.holidays;
                        this.existing_holidays = response.existing_holidays;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editHoliday(holiday){
                this.$router.push('/calendar/holiday/'+holiday.id+'/edit');
            },
            confirmDelete(holiday){
                return dialog => this.deleteAcademicSession(holiday);
            },
            deleteAcademicSession(holiday){
                let loader = this.$loading.show();
                axios.delete('/api/holiday/'+holiday.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getHolidays();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/holiday/print',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        let print = window.open("/print");
                        print.document.write(response);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            pdf(){
                let loader = this.$loading.show();
                axios.post('/api/holiday/pdf',{filter: this.filter})
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
          }
        },
        watch: {
            'filter.sort_by': function(val) {
                this.getHolidays();
            },
            'filter.order': function(val) {
                this.getHolidays();
            },
            'filter.page_length': function(val) {
                this.getHolidays();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>
