<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('academic.session')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="academic_sessions.total">{{ trans('general.total_result_found',{count: academic_sessions.total, from: academic_sessions.from, to: academic_sessions.to}) }}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="academic_sessions.total && !showCreatePanel && hasPermission('create-academic-session')" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('academic.add_new_session')}}</span></button>
                        <button class="btn btn-info btn-sm" v-if="hasPermission('import-previous-session-data')" @click="showImportModal = true" v-tooltip="trans('general.import')"><i class="fas fa-file-import"></i> <span class="d-none d-sm-inline">{{trans('general.import')}}</span></button>

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
                        <help-button @clicked="help_topic = 'academic.session'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <transition name="fade" v-if="hasPermission('create-academic-session')">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('academic.add_new_session')}}</h4>
                        <show-tip module="academic" tip="date_of_academic_session_not_editable"></show-tip>
                        <academic-session-form @completed="getAcademicSessions" @cancel="showCreatePanel = !showCreatePanel"></academic-session-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="academic_sessions.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('academic.session_name')}}</th>
                                    <th>{{trans('academic.session_start_date')}}</th>
                                    <th>{{trans('academic.session_end_date')}}</th>
                                    <th>{{trans('academic.session_default')}}</th>
                                    <th>{{trans('academic.session_description')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="academic_session in academic_sessions.data">
                                    <td v-text="academic_session.name"></td>
                                    <td>{{academic_session.start_date | moment}}</td>
                                    <td>{{academic_session.end_date | moment}}</td>
                                    <td v-html="getStatus(academic_session)"></td>
                                    <td v-text="academic_session.description"></td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-info btn-sm" v-if="hasPermission('edit-academic-session')" v-tooltip="trans('academic.edit_session')" @click.prevent="editAcademicSession(academic_session)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" v-if="hasPermission('delete-academic-session')" :key="academic_session.id" v-confirm="{ok: confirmDelete(academic_session)}" v-tooltip="trans('academic.delete_session')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!academic_sessions.total" module="academic" title="session_module_title" description="session_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel && hasPermission('create-academic-session')" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="academic_sessions" @updateRecords="getAcademicSessions"></pagination-record>
                </div>
            </div>
        </div>

        <transition name="modal" v-if="showImportModal">
            <div class="modal-mask">
                <div class="modal-wrapper">
                    <div class="modal-container modal-lg">
                        <div class="modal-header">
                            <slot name="header">
                                {{trans('academic.import_data')}}
                                <span class="float-right pointer" @click="showImportModal = false">x</span>
                            </slot>
                        </div>
                        <div class="modal-body">
                            <slot name="body">
                                <div class="form-group">
                                    <select v-model="importForm.academic_session_id" class="custom-select col-12" name="academic_session_id">
                                      <option value="">{{trans('academic.select_session')}}</option>
                                      <option v-if="academic_session.id != getDefaultAcademicSession.id" v-for="academic_session in getAcademicSessionList" v-bind:value="academic_session.id">
                                        {{ academic_session.name }}
                                      </option>
                                    </select>
                                </div>
                                <div class="row">
                                    <div class="col-12 col-sm-6">
                                        <div class="form-group">
                                            <label class="custom-control custom-checkbox">
                                                <input type="checkbox" class="custom-control-input" value="1" v-model="importForm.course_group">
                                                <span class="custom-control-label">{{trans('academic.course_group')}}</span>
                                            </label>
                                        </div>
                                        <div class="form-group">
                                            <label class="custom-control custom-checkbox">
                                                <input type="checkbox" class="custom-control-input" value="1" v-model="importForm.course">
                                                <span class="custom-control-label">{{trans('academic.course')}}</span>
                                            </label>
                                        </div>
                                        <div class="form-group">
                                            <label class="custom-control custom-checkbox">
                                                <input type="checkbox" class="custom-control-input" value="1" v-model="importForm.batch">
                                                <span class="custom-control-label">{{trans('academic.batch')}}</span>
                                            </label>
                                        </div>
                                        <div class="form-group">
                                            <label class="custom-control custom-checkbox">
                                                <input type="checkbox" class="custom-control-input" value="1" v-model="importForm.subject">
                                                <span class="custom-control-label">{{trans('academic.subject')}}</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div class="col-12 col-sm-6">
                                        <div class="form-group">
                                            <label class="custom-control custom-checkbox">
                                                <input type="checkbox" class="custom-control-input" value="1" v-model="importForm.fee_group">
                                                <span class="custom-control-label">{{trans('finance.fee_group')}}</span>
                                            </label>
                                        </div>
                                        <div class="form-group">
                                            <label class="custom-control custom-checkbox">
                                                <input type="checkbox" class="custom-control-input" value="1" v-model="importForm.fee_head">
                                                <span class="custom-control-label">{{trans('finance.fee_head')}}</span>
                                            </label>
                                        </div>
                                        <div class="form-group">
                                            <label class="custom-control custom-checkbox">
                                                <input type="checkbox" class="custom-control-input" value="1" v-model="importForm.transport_circle">
                                                <span class="custom-control-label">{{trans('transport.transport_circle')}}</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <button type="button" class="btn btn-info pull-right" @click="importData">{{trans('general.import')}}</button>
                                <button type="button" class="btn btn-danger pull-right m-r-10" @click="showImportModal = false">{{trans('general.cancel')}}</button>
                            </slot>
                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    import academicSessionForm from './form'

    export default {
        components : { academicSessionForm},
        data() {
            return {
                academic_sessions: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'start_date',
                    order: 'desc',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'name',
                        translation: i18n.academic.session_name
                    },
                    {
                        value: 'start_date',
                        translation: i18n.academic.session_start_date
                    },
                    {
                        value: 'end_date',
                        translation: i18n.academic.session_end_date
                    }
                ],
                showCreatePanel: false,
                showImportModal: false,
                importForm: new Form({
                    academic_session_id: '',
                    course_group: 0,
                    course: 0,
                    batch: 0,
                    subject: 0,
                    fee_group: 0,
                    fee_head: 0,
                    transport_circle: 0
                }),
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('list-academic-session')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getAcademicSessions();
            helper.showDemoNotification(['academic']);
        },
        methods: {
            getConfig(config){
                return helper.getConfig(config);
            },
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getAcademicSessions(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/academic/session?page=' + page + url)
                    .then(response => {
                        this.academic_sessions = response;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editAcademicSession(academic_session){
                this.$router.push('/academic/session/'+academic_session.id+'/edit');
            },
            confirmDelete(academic_session){
                return dialog => this.deleteAcademicSession(academic_session);
            },
            deleteAcademicSession(academic_session){
                let loader = this.$loading.show();
                axios.delete('/api/academic/session/'+academic_session.id)
                    .then(response => {
                        this.$store.dispatch('setAcademicSession',response.academic_sessions);
                        toastr.success(response.message);
                        this.getAcademicSessions();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getStatus(academic_session){
                return academic_session.is_default ? '<i class="fas fa-check"></i>' : '<i class="fas fa-times"></i>';
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/academic/session/print',{filter: this.filter})
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
                axios.post('/api/academic/session/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            importData(){
                this.importForm.post('/api/academic/session/import')
                    .then(response => {
                        toastr.success(response.message);
                        this.showImportModal = false;
                    })
                    .catch(error => {
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
            'filter.sort_by': function(val) {
                this.getAcademicSessions();
            },
            'filter.order': function(val) {
                this.getAcademicSessions();
            },
            'filter.page_length': function(val) {
                this.getAcademicSessions();
            },
            'importForm.subject': function(val) {
                this.importForm.batch = this.importForm.subject || this.importForm.batch
            },
            'importForm.batch': function(val) {
                this.importForm.course = this.importForm.batch || this.importForm.course
            },
            'importForm.course': function(val) {
                this.importForm.course_group = this.importForm.course || this.importForm.course_group
            },
            'importForm.fee_head': function(val) {
                this.importForm.fee_group = this.importForm.fee_head || this.importForm.fee_group
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            },
            getAcademicSessionList(){
                return helper.getAcademicSessions();
            },
            getDefaultAcademicSession(){
                return helper.getDefaultAcademicSession();
            }
        }
    }
</script>
