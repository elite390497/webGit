<template>
	<div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('general.update')}}</h3>
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
                        	<h4 class="card-title">{{trans('general.update')}}</h4>
                            <div v-if="product.current_version == product.latest_version && product.name" class="alert alert-danger">No update available! Please check later.</div>
                            <div v-else>
                                <template v-if="!is_processing">
                                    <div v-html="update_tips"></div>
                                    <div class="table-responsive" v-if="product.name">
                                        <table class="table table-sm">
                                            <tbody>
                                                <tr>
                                                    <th>Version Available for Upgrade</th>
                                                    <td>{{product.next_release_version}}</td>
                                                </tr>
                                                <tr>
                                                    <th>Date of Release</th>
                                                    <td>{{product.next_release_date | moment}}</td>
                                                </tr>
                                                <tr>
                                                    <th>Update Size</th>
                                                    <td>{{getFileSize(product.next_release_size)}}</td>
                                                </tr>
                                                <tr>
                                                    <th colspan="2" v-html="product.next_release_change_log"></th>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <button type="button" class="btn btn-info" key="download" v-confirm="{ok: confirmDownload(0)}" v-if="!is_downloaded">Download</button>
                                        <button type="button" class="btn btn-info" key="direct-update" v-confirm="{ok: confirmUpdate()}" v-if="is_downloaded">Update</button>
                                        <button type="button" class="btn btn-success" key="download-update" v-confirm="{ok: confirmDownload(1)}" v-if="!is_downloaded">Download & Update</button>
                                    </div>
                                </template>
                                <template v-else>
                                    <p class="text-center">Don't perform any action till we are performing update!</p>
                                    <p class="text-center" v-if="is_downloading">Update Size ({{getFileSize(product.next_release_size)}}) - Downloading.....</p>
                                    <p class="text-center" v-if="is_updating">Updating.....</p>
                                    <button type="button" class="btn btn-info" key="update" v-confirm="{ok: confirmUpdate()}" v-if="is_downloaded">Update</button>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="card">
                        <div class="card-body">
                        	<h4 class="card-title">{{trans('general.product_information')}}</h4>
                        	<product :product="product" update="1"></product>
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
                update_tips: '',
				product: {},
                is_processing: 0,
                is_downloading: 0,
                is_updating: 0,
                is_downloaded: 0,
                updateForm: new Form({
                    build: '',
                    version: ''
                })
			}
		},
		mounted(){
			if(!helper.hasRole('admin')) {
				this.$router.push('/');
			}

            this.getPreRequisite();
		},
		methods: {
            confirmUpdate(){
                return dialog => this.update();
            },
            confirmDownload(action){
                return dialog => this.download(action);
            },
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/update')
                    .then(response => {
                        this.update_tips = response.update_tips;
                        this.product = response.product;

                        if (response.is_downloaded) {
                            this.is_downloaded = 1;
                            this.updateForm.build = this.product.next_release_build;
                            this.updateForm.version = this.product.next_release_version;
                        }
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
			download(action){
                let loader = this.$loading.show();
                this.is_processing = 1;
                this.is_downloading = 1;
                axios.post('/api/download')
                    .then(response => {
                        toastr.success(response.message);
                        this.is_downloading = 0;
                        this.is_downloaded = 1;
                        this.updateForm.build = response.release.build;
                        this.updateForm.version = response.release.version;

                        if(action)
                            this.update();

                        loader.hide();
                    })
                    .catch(error => {
                        helper.showErrorMsg(error);
                        this.is_processing = 0;
                        this.is_downloading = 0;
                        loader.hide();
                    })
			},
            update(){
                let loader = this.$loading.show();
                this.is_updating = 1;
                this.updateForm.post('/api/update')
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        location.reload();
                    })
                    .catch(error => {
                        loader.hide();
                        this.is_processing = 0;
                        this.is_updating = 0;
                        helper.showErrorMsg(error);
                    })
            },
            getFileSize(size){
                return helper.bytesToSize(size);
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