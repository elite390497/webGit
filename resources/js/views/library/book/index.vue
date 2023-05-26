<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('library.book')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="books.total">{{trans('general.total_result_found',{count : books.total, from: books.from, to: books.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="books.total && !showCreatePanel && hasPermission('create-book')" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('library.add_new_book')}}</span></button>
                        <button class="btn btn-info btn-sm" v-if="!showFilterPanel" @click="showFilterPanel = !showFilterPanel"><i class="fas fa-filter"></i> <span class="d-none d-sm-inline">{{trans('general.filter')}}</span></button>
                        <sort-by :order-by-options="orderByOptions" :sort-by="filter.sort_by" :order="filter.order" @updateSortBy="value => {filter.sort_by = value}"  @updateOrder="value => {filter.order = value}"></sort-by>
                        <div class="btn-group">
                            <button type="button" class="btn btn-info btn-sm dropdown-toggle no-caret " role="menu" id="moreOption" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-tooltip="trans('general.more_option')">
                                <i class="fas fa-ellipsis-h"></i> <span class="d-none d-sm-inline"></span>
                            </button>
                            <div :class="['dropdown-menu',getConfig('direction') == 'ltr' ? 'dropdown-menu-right' : '']" aria-labelledby="moreOption">
                                <button class="dropdown-item custom-dropdown" v-if="hasPermission('edit-book')" @click="$router.push('/library/barcode')"><i class="fas fa-barcode"></i> {{trans('library.generate_barcode')}}</button>
                                <button class="dropdown-item custom-dropdown" @click="print"><i class="fas fa-print"></i> {{trans('general.print')}}</button>
                                <button class="dropdown-item custom-dropdown" @click="pdf"><i class="fas fa-file-pdf"></i> {{trans('general.generate_pdf')}}</button>
                            </div>
                        </div>
                        <help-button @clicked="help_topic = 'library.book'"></help-button>
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
                                    <label for="">{{trans('library.book_title')}}</label>
                                    <input class="form-control" name="title" v-model="filter.title" :placeholder="trans('library.book_title')">
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('library.book_author')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_book_authors" name="book_author_id" id="book_author_id" :options="book_authors" :placeholder="trans('library.select_book_author')" @select="onBookAuthorSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onBookAuthorRemove" :selected="selected_book_authors">
                                        <div class="multiselect__option" slot="afterList" v-if="!book_authors.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('library.book_language')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_book_languages" name="book_language_id" id="book_language_id" :options="book_languages" :placeholder="trans('library.select_book_language')" @select="onBookLanguageSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onBookLanguageRemove" :selected="selected_book_languages">
                                        <div class="multiselect__option" slot="afterList" v-if="!book_languages.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('library.book_topic')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_book_topics" name="book_topic_id" id="book_topic_id" :options="book_topics" :placeholder="trans('library.select_book_topic')" @select="onBookTopicSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onBookTopicRemove" :selected="selected_book_topics">
                                        <div class="multiselect__option" slot="afterList" v-if="!book_topics.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('library.book_publisher')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_book_publishers" name="book_publisher_id" id="book_publisher_id" :options="book_publishers" :placeholder="trans('library.select_book_publisher')" @select="onBookPublisherSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onBookPublisherRemove" :selected="selected_book_publishers">
                                        <div class="multiselect__option" slot="afterList" v-if="!book_publishers.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getBooks">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="fade" v-if="hasPermission('create-book')">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('library.add_new_book')}}</h4>
                        <book-form @completed="getBooks" @cancel="showCreatePanel = !showCreatePanel"></book-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="books.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('library.book_title')}}</th>
                                    <th>{{trans('library.book_author')}}</th>
                                    <th>{{trans('library.book_language')}}</th>
                                    <th>{{trans('library.book_topic')}}</th>
                                    <th>{{trans('library.book_publisher')}}</th>
                                    <th>{{trans('library.book_isbn_number')}}</th>
                                    <th>{{trans('library.book_price')}}</th>
                                    <th>{{trans('library.book_page')}}</th>
                                    <th>{{trans('library.book_quantity')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="book in books.data">
                                    <td v-text="book.title"></td>
                                    <td v-text="book.book_author.name"></td>
                                    <td v-text="book.book_language.name"></td>
                                    <td v-text="book.book_topic.name"></td>
                                    <td v-text="book.book_publisher.name"></td>
                                    <td v-text="book.isbn_number"></td>
                                    <td v-text="formatCurrency(book.price)"></td>
                                    <td v-text="book.page"></td>
                                    <td v-text="book.book_post_details_count"></td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-success btn-sm" v-tooltip="trans('library.view_book')" @click.prevent="$router.push('/library/book/'+book.uuid)"><i class="fas fa-arrow-circle-right"></i></button>
                                            <button class="btn btn-info btn-sm" v-if="hasPermission('edit-book')" v-tooltip="trans('library.edit_book')" @click.prevent="editBook(book)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" v-if="hasPermission('delete-book')" :key="book.id" v-confirm="{ok: confirmDelete(book)}" v-tooltip="trans('library.delete_book')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!books.total" module="library" title="book_module_title" description="book_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel && hasPermission('create-book')" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="books" @updateRecords="getBooks"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    import bookForm from './form'

    export default {
        components : { bookForm },
        data() {
            return {
                books: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'title',
                    order: 'asc',
                    book_author_id: [],
                    book_language_id: [],
                    book_publisher_id: [],
                    book_topic_id: [],
                    help_topic: '',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'title',
                        translation: i18n.library.book_title
                    },
                    {
                        value: 'page',
                        translation: i18n.library.book_page
                    },
                    {
                        value: 'price',
                        translation: i18n.library.book_price
                    }
                ],
                showCreatePanel: false,
                showFilterPanel: false,
                book_authors: [],
                book_languages: [],
                book_publishers: [],
                book_topics: [],
                selected_book_authors: null,
                selected_book_languages: null,
                selected_book_topics: null,
                selected_book_publishers: null,
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('list-book')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getBooks();
            helper.showDemoNotification(['library']);
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getBooks(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/book?page=' + page + url)
                    .then(response => {
                        this.books = response.books;
                        this.book_authors = response.filters.book_authors;
                        this.book_languages = response.filters.book_languages;
                        this.book_publishers = response.filters.book_publishers;
                        this.book_topics = response.filters.book_topics;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editBook(book){
                this.$router.push('/library/book/'+book.uuid+'/edit');
            },
            confirmDelete(book){
                return dialog => this.deleteBook(book);
            },
            deleteBook(book){
                let loader = this.$loading.show();
                axios.delete('/api/book/'+book.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        this.getBooks();
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
                axios.post('/api/book/print',{filter: this.filter})
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
                axios.post('/api/book/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onBookAuthorSelect(selectedOption){
                this.filter.book_author_id.push(selectedOption.id);
            },
            onBookAuthorRemove(removedOption){
                this.filter.book_author_id.splice(this.filter.book_author_id.indexOf(removedOption.id), 1);
            },
            onBookLanguageSelect(selectedOption){
                this.filter.book_language_id.push(selectedOption.id);
            },
            onBookLanguageRemove(removedOption){
                this.filter.book_language_id.splice(this.filter.book_language_id.indexOf(removedOption.id), 1);
            },
            onBookTopicSelect(selectedOption){
                this.filter.book_topic_id.push(selectedOption.id);
            },
            onBookTopicRemove(removedOption){
                this.filter.book_topic_id.splice(this.filter.book_topic_id.indexOf(removedOption.id), 1);
            },
            onBookPublisherSelect(selectedOption){
                this.filter.book_publisher_id.push(selectedOption.id);
            },
            onBookPublisherRemove(removedOption){
                this.filter.book_publisher_id.splice(this.filter.book_publisher_id.indexOf(removedOption.id), 1);
            },
            formatCurrency(amount){
                return helper.formatCurrency(amount);
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
                this.getBooks();
            },
            'filter.order': function(val){
                this.getBooks();
            },
            'filter.page_length': function(val){
                this.getBooks();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>