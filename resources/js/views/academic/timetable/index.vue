<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('academic.timetable')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="timetables.total">{{trans('general.total_result_found',{count : timetables.total, from: timetables.from, to: timetables.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="timetables.total && hasPermission('create-timetable')" @click="$router.push('/academic/timetable/create')" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('academic.add_new_timetable')}}</span></button>
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
                        <help-button @clicked="help_topic = 'academic.timetable'"></help-button>
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
                                    <v-select label="name" track-by="id" group-values="batches" group-label="course_group" :group-select="false" v-model="selected_batches" name="batch_id" id="batch_id" :options="batches" :placeholder="trans('academic.select_batch')" @select="onBatchSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onBatchRemove" :selected="selected_batches">
                                        <div class="multiselect__option" slot="afterList" v-if="!batches.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <datepicker v-model="filter.date_effective" :bootstrapStyling="true" :placeholder="trans('academic.date_effective')" :clear-button="true"></datepicker>
                                </div>
                            </div>
                        </div>
                        <h4 class="card-title">{{trans('general.print_setting')}}</h4>
                        <div class="row">
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <switches class="m-t-10" v-model="filter.show_session_name" theme="bootstrap" color="success"></switches> {{trans('academic.timetable_show_session_name')}}
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <switches class="m-t-10" v-model="filter.show_session_timing" theme="bootstrap" color="success"></switches> {{trans('academic.timetable_show_session_timing')}}
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <switches class="m-t-10" v-model="filter.show_session_subject_name" theme="bootstrap" color="success"></switches> {{trans('academic.timetable_show_session_subject_name')}}
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <switches class="m-t-10" v-model="filter.show_session_teacher_name" theme="bootstrap" color="success"></switches> {{trans('academic.timetable_show_session_teacher_name')}}
                                </div>
                            </div>
                        </div>

                        <div class="card-footer">
                            <div class="row">
                                <div class="col-12 col-sm-6">
                                    <button type="button" class="btn btn-info" @click="printSelectedBatchTimetable">{{trans('academic.print_selected_batch_timetable')}}</button>
                                </div>
                                <div class="col-12 col-sm-6 text-right">
                                    <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                                    <button type="button" class="btn btn-info waves-effect waves-light" @click="getTimetables">{{trans('general.filter')}}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="timetables.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('academic.batch')}}</th>
                                    <th>{{trans('academic.date_effective')}}</th>
                                    <td>{{trans('academic.timetable_status')}}</td>
                                    <th>{{trans('academic.timetable_description')}}</th>
                                    <th>{{trans('general.created_at')}}</th>
                                    <th>{{trans('general.updated_at')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="timetable in timetables.data">
                                    <td v-text="timetable.batch.course.name+' '+timetable.batch.name"></td>
                                    <td>{{timetable.date_effective | moment}}</td>
                                    <td>
                                        <template v-for="status in getStatus(timetable)">
                                            <span :class="['label','label-'+status['color']]">{{status['total']+'/'+status['allocated']+' '+status['status']}}</span>
                                        </template>
                                    </td>
                                    <td v-text="timetable.description"></td>
                                    <td>{{timetable.created_at | momentDateTime}}</td>
                                    <td>{{timetable.updated_at | momentDateTime}}</td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-info btn-sm" v-if="hasPermission('edit-timetable')" v-tooltip="trans('academic.timetable_allocation')" @click="$router.push('/academic/timetable/'+timetable.uuid+'/allocation')">
                                                <i class="fas fa-user-plus"></i> {{trans('academic.allocation')}}
                                            </button>
                                            <button type="button" class="btn btn-sm btn-info dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <span class="sr-only">Toggle Dropdown</span>
                                            </button>
                                            <div class="dropdown-menu">
                                                <button class="dropdown-item custom-dropdown-menu" v-tooltip="trans('general.print')" @click.prevent="printBatchTimetable(timetable)">
                                                    <i class="fas fa-print"></i> {{trans('general.print')}}
                                                </button>
                                                <button class="dropdown-item custom-dropdown-menu" v-tooltip="trans('general.generate_pdf')" @click.prevent="pdfBatchTimetable(timetable)">
                                                    <i class="fas fa-file-pdf"></i> {{trans('general.generate_pdf')}}
                                                </button>
                                                <button class="dropdown-item custom-dropdown-menu" v-if="hasPermission('edit-timetable')" v-tooltip="trans('academic.edit_timetable')" @click.prevent="editTimetable(timetable)">
                                                    <i class="fas fa-edit"></i> {{trans('general.edit')}}
                                                </button>
                                                <button class="dropdown-item custom-dropdown-menu" v-if="hasPermission('delete-timetable')" :key="timetable.id" v-confirm="{ok: confirmDelete(timetable)}" v-tooltip="trans('academic.delete_timetable')">
                                                    <i class="fas fa-trash"></i> {{trans('general.delete')}}
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!timetables.total" module="academic" title="timetable_module_title" description="timetable_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="hasPermission('create-timetable')" @click="$router.push('/academic/timetable/create')"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="timetables" @updateRecords="getTimetables"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    export default {
        components: {},
        data(){
            return {
                timetables: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'date_effective',
                    order: 'desc',
                    batch_id: [],
                    date_effective: '',
                    show_session_name: true,
                    show_session_timing: true,
                    show_session_subject_name: true,
                    show_session_teacher_name: true,
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'date_effective',
                        translation: i18n.academic.date_effective
                    }
                ],
                batches: [],
                selected_batches: null,
                showFilterPanel: false,
                help_topic: ''
            }
        },
        mounted(){
            if(!helper.hasPermission('list-timetable')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getTimetables();
            helper.showDemoNotification(['academic_timetable']);
        },
        methods: {
            getConfig(config){
                return helper.getConfig(config);
            },
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getTimetables(page){
                let loader = this.$loading.show();
                this.filter.date_effective = helper.toDate(this.filter.date_effective);
                // this.filter.date_effective = helper.today();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/timetable?page=' + page + url)
                    .then(response => {
                        this.timetables = response.timetables;
                        this.batches = response.filters.batches;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editTimetable(timetable){
                this.$router.push('/academic/timetable/'+timetable.uuid+'/edit');
            },
            confirmDelete(timetable){
                return dialog => this.deleteTimetable(timetable);
            },
            deleteTimetable(timetable){
                let loader = this.$loading.show();
                axios.delete('/api/timetable/'+timetable.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        this.getTimetables();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/timetable/print',{filter: this.filter})
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
                axios.post('/api/timetable/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getStartTime(timetable){
                return moment(timetable.timetable_sessions[0].start, 'HH:mm:ss').format('h:mm a');
            },
            getEndTime(timetable){
                let session_count = timetable.timetable_sessions.length;
                return moment(timetable.timetable_sessions[session_count - 1].end, 'HH:mm:ss').format('h:mm a');
            },
            getStatus(timetable){
                var total = 0;
                var allocated = 0;
                timetable.timetable_allocations.forEach(allocation => {
                    allocation.timetable_allocation_details.forEach(detail => {
                        if (!detail.class_timing_session.is_a_break) {
                            total++;
                            if (detail.subject_id)
                                allocated++;
                        }
                    })
                })
                if (!total)
                    return [{status: i18n.academic.timetable_status_unallocated, color: 'danger', total: total, allocated: allocated}];
                else if (allocated < total)
                    return [{status: i18n.academic.timetable_status_partially_allocatted, color: 'warning', total: total, allocated: allocated}];
                else
                    return [{status: i18n.academic.timetable_status_allocated, color: 'success', total: total, allocated: allocated}];
            },
            onBatchSelect(selectedOption){
                this.filter.batch_id.push(selectedOption.id);
            },
            onBatchRemove(removedOption){
                this.filter.batch_id.splice(this.filter.batch_id.indexOf(removedOption.id), 1);
            },
            printBatchTimetable(timetable){
                let loader = this.$loading.show();
                axios.post('/api/timetable/print/batch',{filter: this.filter,uuid: timetable.uuid})
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
            pdfBatchTimetable(timetable){
                let loader = this.$loading.show();
                axios.post('/api/timetable/pdf/batch',{filter: this.filter,uuid: timetable.uuid})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            printSelectedBatchTimetable(){
                let loader = this.$loading.show();
                axios.post('/api/timetable/print/selected',{filter: this.filter})
                    .then(response => {
                        let print = window.open("/print");
                        loader.hide();
                        print.document.write(response);
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
                this.getTimetables();
            },
            'filter.order': function(val) {
                this.getTimetables();
            },
            'filter.page_length': function(val) {
                this.getTimetables();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>