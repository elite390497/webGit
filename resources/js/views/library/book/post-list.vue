<template>
    <div class="table-responsive" v-if="book.id">
        <table class="table table-sm">
        	<thead>
            	<tr>
            		<th>{{trans('library.date_of_addition')}}</th>
            		<th>{{trans('library.book_quantity')}}</th>
            		<th>{{trans('library.book_post_remarks')}}</th>
                    <th class="table-option">{{trans('general.action')}}</th>
            	</tr>
        	</thead>
            <tbody>
            	<tr v-for="book_post in book.book_posts">
            		<td>{{book_post.date_of_addition | moment}}</td>
            		<td>{{book_post.quantity}}</td>
            		<td>{{book_post.remarks}}</td>
                    <td class="table-option">
                        <div class="btn-group">
                            <button class="btn btn-danger btn-sm" v-if="hasPermission('delete-book')" :key="book_post.id" v-confirm="{ok: confirmDelete(book_post)}" v-tooltip="trans('library.delete_book_post')"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
            	</tr>
            </tbody>
        </table>
    </div>
</template>

<script>
	export default {
		props: ['book'],
		data(){
			return {

			}
		},
		mounted(){

		},
		methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            confirmDelete(book_post){
                return dialog => this.deleteBookPost(book_post);
            },
            deleteBookPost(book_post){
                let loader = this.$loading.show();
                axios.delete('/api/book/'+this.book.uuid+'/post/'+book_post.id)
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