<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('library.book_publisher')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="book_publishers.total">{{trans('general.total_result_found',{count : book_publishers.total, from: book_publishers.from, to: book_publishers.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="book_publishers.total && !showCreatePanel" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('library.add_new_book_publisher')}}</span></button>
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
                        <help-button @clicked="help_topic = 'configuration.library.book-publisher'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <transition name="fade">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('library.add_new_book_publisher')}}</h4>
                        <book-publisher-form @completed="getBookPublishers" @cancel="showCreatePanel = !showCreatePanel"></book-publisher-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="book_publishers.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('library.book_publisher_name')}}</th>
                                    <th>{{trans('library.book_publisher_description')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="book_publisher in book_publishers.data">
                                    <td v-text="book_publisher.name"></td>
                                    <td v-text="book_publisher.description"></td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-info btn-sm" v-tooltip="trans('library.edit_book_publisher')" @click.prevent="editBookPublisher(book_publisher)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" :key="book_publisher.id" v-confirm="{ok: confirmDelete(book_publisher)}" v-tooltip="trans('library.delete_book_publisher')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!book_publishers.total" module="library" title="book_publisher_module_title" description="book_publisher_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="book_publishers" @updateRecords="getBookPublishers" @change.native="getBookPublishers"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>


<script>
    import bookPublisherForm from './form'

    export default {
        components : { bookPublisherForm },
        data() {
            return {
                book_publishers: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by: 'name',
                    order: 'asc',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'name',
                        translation: i18n.library.book_publisher_name
                    }
                ],
                showCreatePanel: false,
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('access-configuration')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getBookPublishers();
        },
        methods: {
            getConfig(config){
                return helper.getConfig(config);
            },
            getBookPublishers(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/library/book/publisher?page=' + page + url)
                    .then(response => {
                        this.book_publishers = response;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editBookPublisher(book_publisher){
                this.$router.push('/configuration/library/book/publisher/'+book_publisher.id+'/edit');
            },
            confirmDelete(book_publisher){
                return dialog => this.deleteBookPublisher(book_publisher);
            },
            deleteBookPublisher(book_publisher){
                let loader = this.$loading.show();
                axios.delete('/api/library/book/publisher/'+book_publisher.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getBookPublishers();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/library/book/publisher/print',{filter: this.filter})
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
                axios.post('/api/library/book/publisher/pdf',{filter: this.filter})
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
          momentDateTime(date) {
            return helper.formatDateTime(date);
          }
        },
        watch: {
            'filter.sort_by': function(val){
                this.getBookPublishers();
            },
            'filter.order': function(val){
                this.getBookPublishers();
            },
            'filter.page_length': function(val){
                this.getBookPublishers();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>
