<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('install.license_verification')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-danger btn-sm" @click.prevent="logout"><i class="fas fa-power-off"></i> <span class="d-none d-sm-inline">{{trans('auth.logout')}}</span></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card">
                <div class="card-body p-4">
                    <form @submit.prevent="submit" @keydown="licenseForm.errors.clear($event.target.name)">
                        <div class="row">
                            <div class="col-12 col-sm-6 col-md-4">
                                <div class="form-group">
                                    <label for="">{{trans('install.access_code')}}</label>
                                    <input class="form-control" type="text" v-model="licenseForm.access_code" name="access_code" :placeholder="trans('install.access_code')">
                                    <show-error :form-name="licenseForm" prop-name="access_code"></show-error>
                                </div>
                                <div class="form-group">
                                    <label for="">{{trans('install.envato_email')}}</label>
                                    <input class="form-control" type="text" v-model="licenseForm.envato_email" name="envato_email" :placeholder="trans('install.envato_email')">
                                    <show-error :form-name="licenseForm" prop-name="envato_email"></show-error>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <button type="submit" class="btn btn-info waves-effect waves-light m-t-10">{{trans('install.verify')}}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
	export default {
		data() {
			return {
				licenseForm: new Form({
					access_code: '',
					envato_email: ''
				})
			}
		},
		mounted(){
			if(helper.getConfig('l')) {
				this.$router.push('/');
			}
		},
		methods: {
			submit() {
                let loader = this.$loading.show();
				this.licenseForm.post('/api/license')
					.then(response => {
                        this.$store.dispatch('setConfig',{l: 1});
						toastr.success(response.message);
                        loader.hide();
						this.$router.push('/');
					})
					.catch(error => {
                        loader.hide();
						helper.showErrorMsg(error);
					});
			}
		}
	}
</script>