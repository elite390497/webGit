<template>
    <form @submit.prevent="proceed" @keydown="bookForm.errors.clear($event.target.name)">
        <div class="row">
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('library.book_title')}}</label>
                    <input class="form-control" type="text" v-model="bookForm.title" name="title" :placeholder="trans('library.book_title')">
                    <show-error :form-name="bookForm" prop-name="title"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('library.book_author')}}</label>
                    <v-select label="name" v-model="selected_book_author" name="book_author_id" id="book_author_id" :options="book_authors" :placeholder="trans('library.select_book_author')" @select="onBookAuthorSelect" @close="bookForm.errors.clear('book_author_id')" @remove="bookForm.book_author_id = ''">
                        <div class="multiselect__option" slot="afterList" v-if="!book_authors.length">
                            {{trans('general.no_option_found')}}
                        </div>
                    </v-select>
                    <show-error :form-name="bookForm" prop-name="book_author_id"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('library.book_language')}}</label>
                    <v-select label="name" v-model="selected_book_language" name="book_language_id" id="book_language_id" :options="book_languages" :placeholder="trans('library.select_book_language')" @select="onBookLanguageSelect" @close="bookForm.errors.clear('book_language_id')" @remove="bookForm.book_language_id = ''">
                        <div class="multiselect__option" slot="afterList" v-if="!book_languages.length">
                            {{trans('general.no_option_found')}}
                        </div>
                    </v-select>
                    <show-error :form-name="bookForm" prop-name="book_language_id"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('library.book_topic')}}</label>
                    <v-select label="name" v-model="selected_book_topic" name="book_topic_id" id="book_topic_id" :options="book_topics" :placeholder="trans('library.select_book_topic')" @select="onBookTopicSelect" @close="bookForm.errors.clear('book_topic_id')" @remove="bookForm.book_topic_id = ''">
                        <div class="multiselect__option" slot="afterList" v-if="!book_topics.length">
                            {{trans('general.no_option_found')}}
                        </div>
                    </v-select>
                    <show-error :form-name="bookForm" prop-name="book_topic_id"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('library.book_publisher')}}</label>
                    <v-select label="name" v-model="selected_book_publisher" name="book_publisher_id" id="book_publisher_id" :options="book_publishers" :placeholder="trans('library.select_book_publisher')" @select="onBookPublisherSelect" @close="bookForm.errors.clear('book_publisher_id')" @remove="bookForm.book_publisher_id = ''">
                        <div class="multiselect__option" slot="afterList" v-if="!book_publishers.length">
                            {{trans('general.no_option_found')}}
                        </div>
                    </v-select>
                    <show-error :form-name="bookForm" prop-name="book_publisher_id"></show-error>
                </div>
            </div>
            <div class="col-12 col-md-3">
                <div class="form-group">
                    <label for="">{{trans('library.book_type')}}</label>
                    <div class="radio radio-success">
                        <input type="radio" value="reference" id="type_reference" v-model="bookForm.type" :checked="bookForm.type == 'reference'" name="type" @click="bookForm.errors.clear('type')">
                        <label for="type_reference">{{trans('library.book_type_reference')}}</label>
                    </div>
                    <div class="radio radio-success">
                        <input type="radio" value="text" id="type_text" v-model="bookForm.type" :checked="bookForm.type == 'text'" name="type" @click="bookForm.errors.clear('type')">
                        <label for="type_text">{{trans('library.book_type_text')}}</label>
                    </div>
                    <show-error :form-name="bookForm" prop-name="type"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('library.book_isbn_number')}}</label>
                    <input class="form-control" type="text" v-model="bookForm.isbn_number" name="isbn_number" :placeholder="trans('library.book_isbn_number')">
                    <show-error :form-name="bookForm" prop-name="isbn_number"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('library.book_edition')}}</label>
                    <input class="form-control" type="text" v-model="bookForm.edition" name="edition" :placeholder="trans('library.book_edition')">
                    <show-error :form-name="bookForm" prop-name="edition"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('library.book_page')}}</label>
                    <input class="form-control" type="text" v-model="bookForm.page" name="page" :placeholder="trans('library.book_page')">
                    <show-error :form-name="bookForm" prop-name="page"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('library.book_price')}}</label>
                    <currency-input :position="default_currency.position" :symbol="default_currency.symbol" name="price" :placeholder="trans('library.book_price')" v-model="bookForm.price" @input.native="bookForm.errors.clear('price')"></currency-input>
                    <show-error :form-name="bookForm" prop-name="price"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('library.book_summary')}}</label>
                    <autosize-textarea v-model="bookForm.summary" rows="2" name="summary" :placeholder="trans('library.book_summary')"></autosize-textarea>
                    <show-error :form-name="bookForm" prop-name="summary"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('library.book_description')}}</label>
                    <autosize-textarea v-model="bookForm.description" rows="2" name="description" :placeholder="trans('library.book_description')"></autosize-textarea>
                    <show-error :form-name="bookForm" prop-name="description"></show-error>
                </div>
            </div>
        </div>
        <div class="card-footer text-right">
            <router-link to="/library/book" class="btn btn-danger waves-effect waves-light " v-show="uuid">{{trans('general.cancel')}}</router-link>
            <button v-if="!uuid" type="button" class="btn btn-danger waves-effect waves-light " @click="$emit('cancel')">{{trans('general.cancel')}}</button>
            <button type="submit" class="btn btn-info waves-effect waves-light">
                <span v-if="uuid">{{trans('general.update')}}</span>
                <span v-else>{{trans('general.save')}}</span>
            </button>
        </div>
    </form>
</template>


<script>
    export default {
        components: {},
        data() {
            return {
                bookForm: new Form({
                    title: '',
                    isbn_number: '',
                    book_author_id: '',
                    book_language_id: '',
                    book_topic_id: '',
                    book_publisher_id: '',
                    edition: '',
                    page: '',
                    price: '',
                    type: '',
                    summary: '',
                    description: ''
                }),
                book_authors: [],
                selected_book_author: null,
                book_languages: [],
                selected_book_language: null,
                book_topics: [],
                selected_book_topic: null,
                book_publishers: [],
                selected_book_publisher: null,
                default_currency: helper.getConfig('default_currency')
            };
        },
        props: ['uuid'],
        mounted() {
            if(!helper.hasPermission('create-book') && !helper.hasPermission('edit-book')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            if(this.uuid)
                this.get();

            this.getPreRequisite();
        },
        methods: {
            proceed(){
                if(this.uuid)
                    this.update();
                else
                    this.store();
            },
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/book/pre-requisite')
                    .then(response => {
                        this.book_authors = response.book_authors;
                        this.book_languages = response.book_languages;
                        this.book_topics = response.book_topics;
                        this.book_publishers = response.book_publishers;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            store(){
                let loader = this.$loading.show();
                this.bookForm.post('/api/book')
                    .then(response => {
                        toastr.success(response.message);
                        this.selected_book_author = null;
                        this.selected_book_language = null;
                        this.selected_book_topic = null;
                        this.selected_book_publisher = null;
                        this.$emit('completed');
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            get(){
                let loader = this.$loading.show();
                axios.get('/api/book/'+this.uuid)
                    .then(response => {
                        this.bookForm.title = response.book.title;
                        this.bookForm.isbn_number = response.book.isbn_number;
                        this.bookForm.edition = response.book.edition;
                        this.bookForm.price = response.book.price;
                        this.bookForm.page = response.book.page;
                        this.bookForm.type = response.book.type;
                        this.bookForm.summary = response.book.summary;
                        this.bookForm.description = response.book.description;
                        this.bookForm.book_author_id = response.book.book_author_id;
                        this.bookForm.book_language_id = response.book.book_language_id;
                        this.bookForm.book_topic_id = response.book.book_topic_id;
                        this.bookForm.book_publisher_id = response.book.book_publisher_id;
                        this.selected_book_author = response.selected_book_author;
                        this.selected_book_language = response.selected_book_language;
                        this.selected_book_topic = response.selected_book_topic;
                        this.selected_book_publisher = response.selected_book_publisher;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/library/book');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.bookForm.patch('/api/book/'+this.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/library/book');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onBookAuthorSelect(selectedOption){
                this.bookForm.book_author_id = selectedOption.id;
            },
            onBookLanguageSelect(selectedOption){
                this.bookForm.book_language_id = selectedOption.id;
            },
            onBookTopicSelect(selectedOption){
                this.bookForm.book_topic_id = selectedOption.id;
            },
            onBookPublisherSelect(selectedOption){
                this.bookForm.book_publisher_id = selectedOption.id;
            }
        }
    }
</script>
