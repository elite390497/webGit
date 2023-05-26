<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('institute.document')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="institute_documents.total">{{trans('general.total_result_found',{count : institute_documents.total, from: institute_documents.from, to: institute_documents.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="institute_documents.total && !showCreatePanel && hasPermission('create-institute-document')" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('institute.add_new_document')}}</span></button>
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
                        <help-button @clicked="help_topic = 'institute.document'"></help-button>
                        
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
                                    <label for="">{{trans('institute.document_keyword')}}</label>
                                    <input class="form-control" name="keyword" v-model="filter.keyword">
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('general.tags')}}</label>
                                    <v-select label="name" track-by="slug" v-model="selected_tags" name="tag_id" id="tag_id" :options="tag_options" :placeholder="trans('general.select_tag')" @select="onTagSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onTagRemove" :selected="selected_tags">
                                        <div class="multiselect__option" slot="afterList" v-if="!tag_options.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-1">
                                <div class="form-group">
                                    <div>{{trans('institute.document_status_expired')}}</div>
                                    <switches class="m-t-20" v-model="filter.expired" theme="bootstrap" color="success"></switches>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3" v-if="!filter.expired">
                                <div class="form-group">
                                    <label for="">{{trans('institute.document_expiring_in_days')}}</label>
                                    <input class="form-control" type="text" v-model="filter.expiring_in" name="expiring_in" :placeholder="trans('institute.document_expiring_in_days')">
                                </div>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getInstituteDocuments">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="fade" v-if="hasPermission('create-institute-document')">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('institute.add_new_document')}}</h4>
                        <institute-document-form @completed="getInstituteDocuments" @cancel="showCreatePanel = !showCreatePanel"></institute-document-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="institute_documents.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('institute.document_title')}}</th>
                                    <th>{{trans('institute.document_date_of_expiry')}}</th>
                                    <th>{{trans('general.tags')}}</th>
                                    <th>{{trans('institute.document_description')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="institute_document in institute_documents.data">
                                    <td>{{institute_document.title}}</td>
                                    <td>
                                    	<span v-if="institute_document.date_of_expiry">
                                            {{institute_document.date_of_expiry | moment}}
                                            <span :class="['label','label-'+getStatus(institute_document)['color']]">{{trans('institute.'+getStatus(institute_document)['status'], {day: getStatus(institute_document)['day']})}}</span>
                                        </span>
                                        <span v-else>-</span>
                                    </td>
                                    <td>
                                        <span class="label label-success" style="margin-right: 3px;" v-for="tag in institute_document.tags">{{tag.name}}</span>
                                    </td>
                                    <td>{{institute_document.description}}</td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-success btn-sm" v-tooltip="trans('institute.view_document')" @click.prevent="showDetailAction(institute_document)"><i class="fas fa-arrow-circle-right"></i></button>
                                            <button class="btn btn-info btn-sm" v-tooltip="trans('institute.edit_document')" @click.prevent="editInstituteDocument(institute_document)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" :key="institute_document.id" v-confirm="{ok: confirmDelete(institute_document)}" v-tooltip="trans('institute.delete_document')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!institute_documents.total" module="institute" title="document_module_title" description="document_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel && hasPermission('create-institute-document')" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="institute_documents" @updateRecords="getInstituteDocuments"></pagination-record>
                </div>
            </div>
        </div>

        <transition name="modal" v-if="showDetailModal">
            <div class="modal-mask">
                <div class="modal-wrapper">
                    <div class="modal-container modal-lg">
                        <div class="modal-header">
                            <slot name="header">
                                {{institute_document.title}}
                                <span class="float-right pointer" @click="showDetailModal = false">x</span>
                            </slot>
                        </div>
                        <div class="modal-body">
                            <slot name="body">
                                <div v-if="institute_document.date_of_expiry">
                                    {{trans('institute.document_date_of_expiry')}}: {{institute_document.date_of_expiry | moment}}
                                    <span :class="['label','label-'+getStatus(institute_document)['color']]">{{trans('institute.'+getStatus(institute_document)['status'], {day: getStatus(institute_document)['day']})}}</span>
                                </div>
                                <div class="m-t-20" v-html="institute_document.description"></div>
                                <div v-if="documents.length">
                                    <ul class="m-t-10 upload-file-list">
                                        <li class="upload-file-list-item" v-for="document in documents">
                                            <a :href="`/institute/document/${institute_document.id}/attachment/${document.uuid}/download?token=${authToken}`" class="no-link-color"><i :class="['file-icon', 'fas', 'fa-lg', document.file_info.icon]"></i> <span class="upload-file-list-item-size">{{document.file_info.size}}</span> {{document.user_filename}} </a>
                                        </li>
                                    </ul>
                                </div>
                                <hr />
                                <p>
                                    <i class="far fa-clock"></i> <small>{{trans('general.created_at')}} {{institute_document.created_at | momentDateTime}}</small>
                                    <span class="pull-right">
                                        <i class="far fa-clock"></i> <small>{{trans('general.updated_at')}} {{institute_document.updated_at | momentDateTime}}</small>
                                    </span>
                                </p>
                                <div class="clearfix"></div>
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
    import instituteDocumentForm from './form'

    export default {
        components : { instituteDocumentForm},
        data() {
            return {
                institute_documents: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'date_of_expiry',
                    order: 'desc',
                    tag_id: [],
                    expired: false,
                    expiring_in: 0,
                    keyword: '',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'date_of_expiry',
                        translation: i18n.institute.document_date_of_expiry
                    },
                    {
                        value: 'title',
                        translation: i18n.institute.document_title
                    },
                    {
                        value: 'created_at',
                        translation: i18n.general.created_at
                    }
                ],
                showCreatePanel: false,
                showFilterPanel: false,
                viewId: '',
                tag_options: [],
                selected_tags: null,
                institute_document: {},
                documents: [],
                showDetailModal: false,
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('list-institute-document') || !helper.hasPermission('create-institute-document')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            if (helper.hasPermission('list-institute-document'))
                this.getInstituteDocuments();
            helper.showDemoNotification(['institute']);
        },
        methods: {
            getConfig(config){
                return helper.getConfig(config);
            },
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getInstituteDocuments(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/institute/document?page=' + page + url)
                    .then(response => {
                        this.institute_documents = response.institute_documents;
                        this.tag_options = response.filters.tags;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getInstituteDocument(){
                let loader = this.$loading.show();
                axios.get('/api/institute/document/'+this.viewId)
                    .then(response => {
                        this.institute_document = response.institute_document;
                        this.documents = response.documents;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });

            },
            editInstituteDocument(institute_document){
                this.$router.push('/institute/document/'+institute_document.id+'/edit');
            },
            confirmDelete(institute_document){
                return dialog => this.deleteInstituteDocument(institute_document);
            },
            deleteInstituteDocument(institute_document){
                let loader = this.$loading.show();
                axios.delete('/api/institute/document/'+institute_document.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getInstituteDocuments();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/institute/document/print',{filter: this.filter})
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
                axios.post('/api/institute/document/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getStatus(institute_document){
                return helper.getInstituteDocumentStatus(institute_document);
            },
            showDetailAction(institute_document){
                this.viewId = institute_document.id;
                this.showDetailModal = true;
            },
            onTagSelect(selectedOption){
                this.filter.tag_id.push(selectedOption.slug);
            },
            onTagRemove(removedOption){
                this.filter.tag_id.splice(this.filter.tag_id.indexOf(removedOption.slug), 1);
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
                this.getInstituteDocuments();
            },
            'filter.order': function(val){
                this.getInstituteDocuments();
            },
            'filter.page_length': function(val){
                this.getInstituteDocuments();
            },
            viewId(val){
                if (val)
                    this.getInstituteDocument();
                else {
                    this.institute_document = {};
                    this.documents = [];
                }
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>