<template>
	<div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('general.about')}}</h3>
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
                        	<h4 class="card-title">{{trans('general.about')}}</h4>
                        	<div v-html="content"></div>
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
				content: '',
				product: {}
			}
		},
		mounted(){
			if(!helper.hasRole('admin') || !helper.getConfig('pb')) {
				this.$router.push('/');
			}

            this.getContent();
		},
        methods: {
            getContent(){
                let loader = this.$loading.show();
                axios.get('/api/about')
                    .then(response => {
                        this.content = response.about;
                        this.product = response.product;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            }
        },
        filters: {
          moment(date) {
            return helper.formatDate(date);
          }
        }
	}
</script>