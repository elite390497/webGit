<template>
	<div>
        <form @submit.prevent="submit" @keydown="bookPostForm.errors.clear($event.target.name)">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('library.date_of_addition')}}</label>
                        <datepicker v-model="bookPostForm.date_of_addition" :bootstrapStyling="true" @selected="bookPostForm.errors.clear('date_of_addition')" :placeholder="trans('library.date_of_addition')"></datepicker>
                        <show-error :form-name="bookPostForm" prop-name="date_of_addition"></show-error>
                    </div>
                </div>
	            <div class="col-12 col-sm-6">
	                <div class="form-group">
	                    <label for="">{{trans('library.book_quantity')}}</label>
	                    <input class="form-control" type="text" v-model="bookPostForm.quantity" name="quantity" :placeholder="trans('library.book_quantity')">
	                    <show-error :form-name="bookPostForm" prop-name="quantity"></show-error>
	                </div>
	            </div>
            </div>

            <div class="row" v-if="bookPostForm.details.length">
            	<div class="col-12 col-sm-4">
	                <label for="">{{trans('library.book_number')}}</label>
            	</div>
            	<div class="col-12 col-sm-4">
	                <label for="">{{trans('library.book_location')}}</label>
            	</div>
            	<div class="col-12 col-sm-4">
	                <label for="">{{trans('library.book_condition')}}</label>
            	</div>
            </div>

            <div class="row" v-for="(detail, index) in bookPostForm.details" v-if="bookPostForm.details.length">
            	<div class="col-12 col-sm-4">
	                <div class="form-group">
	                    <input class="form-control" type="number" v-model="detail.number" :name="getNumberName(index)" :placeholder="trans('library.book_number')">
	                    <show-error :form-name="bookPostForm" :prop-name="getNumberName(index)"></show-error>
	                </div>
            	</div>
            	<div class="col-12 col-sm-4">
	                <div class="form-group">
	                    <input class="form-control" type="text" v-model="detail.location" :name="getLocationName(index)" :placeholder="trans('library.book_location')">
	                    <show-error :form-name="bookPostForm" :prop-name="getLocationName(index)"></show-error>
	                </div>
            	</div>
            	<div class="col-12 col-sm-4">
	                <div class="form-group">
						<select v-model="detail.book_condition_id" class="custom-select col-12" :name="getConditionName(index)">
							<option value=null selected>{{trans('general.select_one')}}</option>
                  			<option v-for="condition in book_conditions" v-bind:value="condition.id">
                            	{{ condition.name }}
                          	</option>
                        </select>
	                    <show-error :form-name="bookPostForm" :prop-name="getConditionName(index)"></show-error>
	                </div>
            	</div>
            </div>

            <div class="row">
                <div class="col-12">
                	<div class="form-group">
	                    <label for="">{{trans('library.book_post_remarks')}}</label>
	                    <autosize-textarea v-model="bookPostForm.remarks" rows="1" name="remarks" :placeholder="trans('library.book_post_remarks')"></autosize-textarea>
	                    <show-error :form-name="bookPostForm" prop-name="remarks"></show-error>
	                </div>
                </div>
            </div>

            <div class="card-footer text-right">
                <button type="submit" class="btn btn-info waves-effect waves-light">{{trans('general.save')}}</button>
            </div>
        </form>
    </div>
</template>

<script>
	export default {
		components: {},
		props: {
			book: Object,
			lastBookNumber: Number
		},
		data(){
			return {
				bookPostForm: new Form({
					date_of_addition: '',
					quantity: '',
					addition_method: '',
					details: [],
					remarks: ''
				}),
				book_conditions: []
			}
		},
		mounted() {
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
						loader.hide();
						helper.showErrorMsg(error);
					})
			},
			getNumberName(index){
				return index+'_number';
			},
			getLocationName(index){
				return index+'_location';
			},
			getConditionName(index){
				return index+'_condition';
			},
			submit(){
				let loader = this.$loading.show();
				this.bookPostForm.post('/api/book/'+this.book.uuid+'/post')
					.then(response => {
						toastr.success(response.message);
						this.bookPostForm.details = [];
						this.$emit('completed');
						loader.hide();
					})
					.catch(error => {
						loader.hide();
						helper.showErrorMsg(error);
					})
			}
		},
		watch: {
			'bookPostForm.quantity': function(value){
				value = parseInt(value)

				if (value > 20) {
					this.bookPostForm.quantity = 1;
					return toastr.error(i18n.library.book_post_max_limit_crossed);
				}

				this.bookPostForm.details = [];
				let max_number = this.lastBookNumber + value;
				for(let number = this.lastBookNumber; number < max_number; number++) {
					this.bookPostForm.details.push({
						number: number,
						location: '',
						book_condition_id: ''
					})
				}
			}
		}
	}
</script>