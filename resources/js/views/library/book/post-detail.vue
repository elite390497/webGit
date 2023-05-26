<template>
    <div class="table-responsive">
        <table class="table table-sm">
        	<thead>
            	<tr>
            		<th>{{trans('library.book_number')}}</th>
            		<th>{{trans('library.book_location')}}</th>
            		<th>{{trans('library.book_condition')}}</th>
                    <th>{{trans('library.book_availability')}}</th>
            		<th>{{trans('library.book_post_detail_remarks')}}</th>
                    <th class="table-option">{{trans('general.action')}}</th>
            	</tr>
        	</thead>
            <tbody>
            	<template v-for="book_post in book.book_posts">
	            	<tr v-for="book_post_detail in book_post.book_post_details">
	            		<td>{{book_post_detail.number}}</td>
	            		<td>{{book_post_detail.location}}</td>
	            		<td>
                            <span v-if="book_post_detail.book_condition_id">{{book_post_detail.book_condition.name}}</span>
                            <span v-else>-</span>
                        </td>
                        <td>
                            <span v-if="book_post_detail.is_not_available"><i class="fas fa-times"></i></span>
                            <span v-else><i class="fas fa-check"></i></span>
                        </td>
	            		<td>{{book_post_detail.remarks}}</td>
                        <td class="table-option">
                            <div class="btn-group">
                                <button class="btn btn-info btn-sm" v-if="hasPermission('edit-book')" v-tooltip="trans('library.edit_book')" @click.prevent="editBook(book_post_detail)"><i class="fas fa-edit"></i></button>
                                <button class="btn btn-danger btn-sm" v-if="hasPermission('delete-book')" :key="book_post_detail.id" v-confirm="{ok: confirmDelete(book_post_detail)}" v-tooltip="trans('library.delete_book')"><i class="fas fa-trash"></i></button>
                            </div>
                        </td>
	            	</tr>
	            </template>
            </tbody>
        </table>
        <book-post-detail-edit :book="book" :book-post-id="editBookPostId" :id="editId" v-if="showEditModal" @close="showEditModal = false" @completed="$emit('completed')"></book-post-detail-edit>
    </div>
</template>

<script>
    import bookPostDetailEdit from './post-detail-edit'

	export default {
        components: {bookPostDetailEdit},
		props: ['book'],
		data(){
			return {
                showEditModal: false,
                editId: '',
                editBookPostId: ''
			}
		},
		mounted(){

		},
		methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            editBook(book_post_detail){
                this.showEditModal = true;
                this.editId = book_post_detail.id;
                this.editBookPostId = book_post_detail.book_post_id;
            },
            confirmDelete(book_post_detail){
                return dialog => this.deleteBookPostDetail(book_post_detail);
            },
            deleteBookPostDetail(book_post_detail){
                let loader = this.$loading.show();
                axios.delete('/api/book/'+this.book.uuid+'/post/detail/'+book_post_detail.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.$emit('completed');
                        loader.hide();
                    }).catch(error => {
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
        }
	}
</script>