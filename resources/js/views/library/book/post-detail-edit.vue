<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container modal-lg">
                    <div class="modal-header">
                        <slot name="header">
                            {{trans('library.edit_book')}}
                            <span class="float-right pointer" @click="$emit('close')">x</span>
                        </slot>
                    </div>
                    <div class="modal-body">
                        <slot name="body">
						    <form @submit.prevent="submit" @keydown="postDetailForm.errors.clear($event.target.name)">
						    	<div class="row">
						        	<div class="col-12 col-sm-4">
						                <div class="form-group">
									        <label for="">{{trans('library.book_number')}}</label>
						                    <input class="form-control" type="number" v-model="postDetailForm.number" name="number" :placeholder="trans('library.book_number')">
						                    <show-error :form-name="postDetailForm" prop-name="number"></show-error>
						                </div>
						        	</div>
						        	<div class="col-12 col-sm-4">
						                <div class="form-group">
									        <label for="">{{trans('library.book_location')}}</label>
						                    <input class="form-control" type="text" v-model="postDetailForm.location" name="location" :placeholder="trans('library.book_location')">
						                    <show-error :form-name="postDetailForm" prop-name="location"></show-error>
						                </div>
						        	</div>
						        	<div class="col-12 col-sm-4">
						                <div class="form-group">
									        <label for="">{{trans('library.book_condition')}}</label>
											<select v-model="postDetailForm.book_condition_id" class="custom-select col-12" name="book_condition_id" @change="postDetailForm.errors.clear('book_condition_id')">
												<option value=null selected>{{trans('general.select_one')}}</option>
						              			<option v-for="condition in book_conditions" v-bind:value="condition.id">
						                        	{{ condition.name }}
						                      	</option>
						                    </select>
						                    <show-error :form-name="postDetailForm" prop-name="book_condition_id"></show-error>
						                </div>
						        	</div>
						        	<div class="col-4">
						        		<div class="form-group">
					                        <label class="custom-control custom-checkbox">
					                            <input type="checkbox" class="custom-control-input" v-model="postDetailForm.is_not_available" value="1" name="is_not_available">
					                            <span class="custom-control-label">{{trans('library.book_not_available')}}</span>
					                        </label>
						        		</div>
						        	</div>
									<div class="col-8">
										<div class="form-group">
									        <label for="">{{trans('library.book_post_detail_remarks')}}</label>
									        <autosize-textarea v-model="postDetailForm.remarks" rows="1" name="remarks" :placeholder="trans('library.book_post_remarks')"></autosize-textarea>
									        <show-error :form-name="postDetailForm" prop-name="remarks"></show-error>
									    </div>
									</div>
						    	</div>

						    	<div class="text-right">

							        <button type="button" class="btn btn-danger waves-effect waves-light m-r-10" @click="$emit('close')">{{trans('general.cancel')}}</button>
							        <button type="submit" class="btn btn-info waves-effect waves-light">{{trans('general.save')}}</button>
						    		
						    	</div>
						    </form>	
						    <div class="clearfix"></div>
						</slot>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
	export default {
		props: ['book','id','bookPostId'],
		data(){
			return  {
				postDetailForm: new Form({
					number: '',
					book_condition_id: '',
					location: '',
					remarks: '',
					is_not_available: 0
				}),
				book_conditions: []
			}
		},
		mounted(){
			this.fillDetail();
			this.getPreRequisite();
		},
		methods: {
			getPreRequisite(){
				let loader = this.$loading.show();
				axios.get('/api/book/post/pre-requisite')
					.then(response => {
						this.book_conditions = response.book_conditions;
						loader.hide();
					})
					.catch(error => {
						helper.showErrorMsg(error);
						loader.hide();
					})
			},
			fillDetail(){
				let book_post = this.book.book_posts.find(o => o.id == this.bookPostId);

				if (! book_post)
					this.$emit('close');

				let book_post_detail = book_post.book_post_details.find(o => o.id == this.id);

				if (! book_post_detail)
					this.$emit('close');

				this.postDetailForm.number = book_post_detail.number;
				this.postDetailForm.book_condition_id = book_post_detail.book_condition_id || '';
				this.postDetailForm.location = book_post_detail.location;
				this.postDetailForm.remarks = book_post_detail.remarks;
				this.postDetailForm.is_not_available = book_post_detail.is_not_available;
			},
			submit(){
				let loader = this.$loading.show();
				this.postDetailForm.patch('/api/book/'+this.book.uuid+'/post/detail/'+this.id)
					.then(response => {
						toastr.success(response.message);
						this.$emit('completed');
						this.$emit('close');
						loader.hide();
					})
					.catch(error => {
						loader.hide();
						helper.showErrorMsg(error);
					})
			}
		}
	}
</script>

<style>
.loading-overlay.is-full-page{
    z-index: 1060;
}
</style>