<template>
    <div v-if="book.id">
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('library.book_detail')}}
                        <span class="card-subtitle">{{'#'+book.id}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <router-link to="/library/book" class="btn btn-info btn-sm"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('library.book')}}</span></router-link>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-12 col-sm-8 p-0">
                    <div class="card">
                        <div class="card-body">
                            <div id="accordion">
                                <div class="card" v-if="hasPermission('edit-book')">
                                    <div class="card-header collapsed" id="post" @click="tab = 'post'"  data-toggle="collapse" data-target="#collapsePost" aria-expanded="false" aria-controls="collapsePost">
                                       <h5><i class="fas fa-lg fa-book fa-fix-w-32"></i> {{trans('library.add_more_book')}}</h5>
                                    </div>
                                    
                                    <div id="collapsePost" class="collapse" aria-labelledby="post" data-parent="#accordion">
                                        <div class="card-body">
                                            <book-post-form :book="book" :last-book-number="last_book_number" @completed="get" v-if="tab == 'post'"></book-post-form>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="card" v-if="hasPermission('edit-book')">
                                    <div class="card-header collapsed" id="post-list" @click="tab = 'post-list'"  data-toggle="collapse" data-target="#collapseListPost" aria-expanded="false" aria-controls="collapseListPost">
                                       <h5><i class="fas fa-lg fa-book-open fa-fix-w-32"></i> {{trans('library.list_book_addition')}}</h5>
                                    </div>
                                    
                                    <div id="collapseListPost" class="collapse" aria-labelledby="post" data-parent="#accordion">
                                        <div class="card-body">
                                            <book-post-list :book="book" v-if="tab == 'post-list'" @completed="get"></book-post-list>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="card">
                                    <div class="card-header collapsed" id="post-detail" @click="tab = 'post-detail'"  data-toggle="collapse" data-target="#collapseListPostDetail" aria-expanded="false" aria-controls="collapseListPostDetail">
                                       <h5><i class="fas fa-lg fa-swatchbook fa-fix-w-32"></i> {{trans('library.list_book')}}</h5>
                                    </div>
                                    
                                    <div id="collapseListPostDetail" class="collapse" aria-labelledby="post" data-parent="#accordion">
                                        <div class="card-body">
                                            <book-post-detail :book="book" v-if="tab == 'post-detail'" @completed="get"></book-post-detail>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-4 p-l-0 border-left">
                    <div class="card">
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-sm custom-show-table">
                                    <tbody>
                                        <tr>
                                            <td>{{trans('library.book_title')}}</td>
                                            <td style="width: 60%">{{book.title}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('library.book_isbn_number')}}</td>
                                            <td>{{book.isbn_number}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('library.book_author')}}</td>
                                            <td>{{book.book_author_id ? book.book_author.name : ''}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('library.book_language')}}</td>
                                            <td>{{book.book_language_id ? book.book_language.name : ''}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('library.book_topic')}}</td>
                                            <td>{{book.book_topic_id ? book.book_topic.name : ''}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('library.book_publisher')}}</td>
                                            <td>{{book.book_publisher_id ? book.book_publisher.name : ''}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('library.book_edition')}}</td>
                                            <td>{{book.edition}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('library.book_type')}}</td>
                                            <td>{{trans('library.book_type_'+book.type)}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('library.book_page')}}</td>
                                            <td>{{book.page}}</td>
                                        </tr>
                                        <tr class="highlight">
                                            <td>{{trans('library.book_quantity')}}</td>
                                            <td>{{getQuantity}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('library.book_price')}}</td>
                                            <td>{{formatCurrency(book.price)}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('library.book_summary')}}</td>
                                            <td>{{book.summary}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('library.book_description')}}</td>
                                            <td>{{book.description}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import bookPostForm from './post-form'
    import bookPostList from './post-list'
    import bookPostDetail from './post-detail'

	export default {
        components: {bookPostForm, bookPostList, bookPostDetail},
        data(){
        	return {
                uuid:this.$route.params.uuid,
        		book: {},
                last_book_number: 0,
                tab: ''
        	}
        },
        mounted() {
        	this.get();
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
        	get(){
                let loader = this.$loading.show();
                axios.get('/api/book/'+this.uuid)
                    .then(response => {
                    	this.book = response.book;
                        this.last_book_number = response.last_book_number;
                    	loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                    	helper.showErrorMsg(error);
                    })
        	},
        	formatCurrency(amount){
        		return helper.formatCurrency(amount);
        	}
        },
        computed: {
            getQuantity(){
                let quantity = 0;
                this.book.book_posts.forEach(book_post => {
                    quantity += book_post.book_post_details.length;
                })
                return quantity;
            }
        }
	}
</script>