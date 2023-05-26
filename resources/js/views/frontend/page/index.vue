<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('frontend.page')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="pages.total">{{trans('general.total_result_found',{count : pages.total, from: pages.from, to: pages.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="pages.total && !showCreatePanel" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('frontend.add_new_page')}}</span></button>
                        <button class="btn btn-info btn-sm" v-if="!showFilterPanel" @click="showFilterPanel = !showFilterPanel"><i class="fas fa-filter"></i> <span class="d-none d-sm-inline">{{trans('general.filter')}}</span></button>
                        <sort-by :order-by-options="orderByOptions" :sort-by="filter.sort_by" :order="filter.order" @updateSortBy="value => {filter.sort_by = value}"  @updateOrder="value => {filter.order = value}"></sort-by>
                        <!-- <div class="btn-group">
                            <button type="button" class="btn btn-info btn-sm dropdown-toggle no-caret " role="menu" id="moreOption" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-tooltip="trans('general.more_option')">
                                <i class="fas fa-ellipsis-h"></i> <span class="d-none d-sm-inline"></span>
                            </button>
                            <div :class="['dropdown-menu',getConfig('direction') == 'ltr' ? 'dropdown-menu-right' : '']" aria-labelledby="moreOption">
                                <button class="dropdown-item custom-dropdown" @click="print"><i class="fas fa-print"></i> {{trans('general.print')}}</button>
                                <button class="dropdown-item custom-dropdown" @click="pdf"><i class="fas fa-file-pdf"></i> {{trans('general.generate_pdf')}}</button>
                            </div>
                        </div> -->
                        <help-button @clicked="help_topic = 'frontend.page'"></help-button>
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
                                    <label for="">{{trans('frontend.page_title')}}</label>
                                    <input class="form-control" name="title" v-model="filter.title">
                                </div>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getPages">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="fade">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('frontend.add_new_page')}}</h4>
                        <page-form @completed="getPages" @cancel="showCreatePanel = !showCreatePanel"></page-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="pages.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('frontend.page_title')}}</th>
                                    <th>{{trans('frontend.page_draft')}}</th>
                                    <th style="width:50%;">{{trans('frontend.page_body')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="page in pages.data">
                                    <td v-text="page.title"></td>
                                    <td>
                                        <span v-if="page.is_draft"><i class="fas fa-check"></i></span>
                                        <span v-else><i class="fas fa-times"></i></span>
                                    </td>
                                    <td v-html="page.excerpt"></td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-success btn-sm" v-tooltip="trans('frontend.view_page')" @click.prevent="showAction(page)"><i class="fas fa-arrow-circle-right"></i></button>
                                            <button class="btn btn-info btn-sm" v-tooltip="trans('frontend.edit_page')" @click.prevent="editPage(page)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" :key="page.id" v-confirm="{ok: confirmDelete(page)}" v-tooltip="trans('frontend.delete_page')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!pages.total" module="frontend" title="page_module_title" description="page_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="pages" @updateRecords="getPages"></pagination-record>
                </div>
            </div>
        </div>
        <page-detail v-if="showModal" @close="showModal = false" :uuid="showUuid"></page-detail>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    import pageForm from './form'
    import pageDetail from './show'

    export default {
        components : { pageForm,pageDetail},
        data() {
            return {
                pages: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'title',
                    order: 'asc',
                    title: '',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'title',
                        translation: i18n.frontend.page_title
                    }
                ],
                showFilterPanel: false,
                showCreatePanel: false,
                help_topic: '',
                showUuid: '',
                showModal: false
            };
        },
        mounted(){
            if(!helper.frontendConfigurationAccessible()){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getPages();
            helper.showDemoNotification(['frontend']);
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            showAction(page){
                this.showUuid = page.uuid;
                this.showModal = true;
            },
            getPages(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/frontend/page?page=' + page + url)
                    .then(response => {
                        this.pages = response.pages;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editPage(page){
                this.$router.push('/frontend/page/'+page.uuid+'/edit');
            },
            confirmDelete(page){
                return dialog => this.deletePage(page);
            },
            deletePage(page){
                let loader = this.$loading.show();
                axios.delete('/api/frontend/page/'+page.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        this.getPages();
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
                axios.post('/api/frontend/page/print',{filter: this.filter})
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
                axios.post('/api/frontend/page/pdf',{filter: this.filter})
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
            'filter.sort_by': function(val){
                this.getPages();
            },
            'filter.order': function(val){
                this.getPages();
            },
            'filter.page_length': function(val){
                this.getPages();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>