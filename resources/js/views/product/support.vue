<template>
	<div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('general.support')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-danger btn-sm" @click="$router.push('/dashboard')"><i class="fas fa-home"></i> <span class="d-none d-sm-inline">{{trans('general.home')}}</span></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid p-4">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <div class="card">
                        <div class="card-body">
                        	<h4 class="card-title">{{trans('general.support')}}</h4>
                        	<div class="alert alert-danger" v-if="product.name && !checkSupportValidity">Your support is expired. Please renew your support.</div>
                        	<div v-else>
                                <div v-html="support_tips"></div>
    	                        <form @submit.prevent="submit" @keydown="supportForm.errors.clear($event.target.name)">
                                    <div class="form-group">
                                        <input class="form-control" type="text" v-model="supportForm.subject" name="subject" placeholder="Subject">
                                        <show-error :form-name="supportForm" prop-name="subject"></show-error>
                                    </div>
                                    <div class="form-group">
                                        <autosize-textarea rows="5" class="form-control" v-model="supportForm.body" placeholder="Body" name="body"></autosize-textarea>
                                        <show-error :form-name="supportForm" prop-name="body"></show-error>
                                    </div>
                                  	<div class="form-group">
                                  		<button type="submit" class="btn btn-info waves-effect waves-light m-t-10">Submit</button>
                                  	</div>
                                </form>
                        	</div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="card">
                        <div class="card-body">
                        	<h4 class="card-title">{{trans('general.product_information')}}</h4>
                        	<product :product="product"></product>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
	import product from './product'

	export default {
		components: {product},
		data() {
			return {
                support_tips: '',
				product: {},
				supportForm: new Form({
					help_topic: '',
					body: '',
					purchase_code: '',
					product_name: '',
					date_of_support_expiry: '',
                    subject: ''
				})
			}
		},
		mounted(){
            if(!helper.hasRole('admin') || !helper.getConfig('pb')) {
				this.$router.push('/');
			}

            this.getPreRequisite();
		},
		methods: {
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/support')
                    .then(response => {
                        this.support_tips = response.support_tips;
                        this.product = response.product;
                        this.supportForm.purchase_code = this.product.purchase_code;
                        this.supportForm.product_name = this.product.name;
                        this.supportForm.date_of_support_expiry = this.product.date_of_support_expiry;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
			submit(){
                let loader = this.$loading.show();
				this.supportForm.post('/api/support')
					.then(response => {
						toastr.success(response.message);
                        loader.hide();
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
          }
        },
        computed: {
            checkSupportValidity(){
                if (helper.today() <= this.product.date_of_support_expiry)
                    return true;
                else
                    return false;
            }
        }
	}
</script>