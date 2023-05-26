<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('student.import')}} ({{getSession}})</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
        	<div class="card">
        		<div class="card-body">
                    <div class="p-4"><show-tip module="student" tip="import_tip"></show-tip></div>

					<div class="p-4 d-flex justify-content-center" v-if="!items.length">
						<button type="button" class="btn btn-lg btn-info" @click="launchFilePicker" :disabled="isUploadDisabled"><i class='fas fa-upload'></i> {{trans('general.upload')}}</button>

						<input type="file" style="display:none" ref="file" v-uploader/>
					</div>

					<template v-if="items.length">
	                    <div class="table-responsive">
	                        <table class="table table-sm">
	                            <thead>
	                                <tr>
	                                    <th v-for="(column,index) in columns">{{trans('general.column_number', {number: index + 1})}}</th>
	                                </tr>
	                            </thead>
	                            <tbody>
	                                <tr v-for="item in items">
	                                	<td v-for="data in item" v-text="data"></td>
	                                </tr>
	                            </tbody>
	                        </table>
	                    </div>

                        <div class="p-4">
                            <h4 class="card-title">{{trans('student.column_selector')}}</h4>
    	                    <div class="row">
    	                    	<div class="col-12 col-sm-3" v-for="(column,index) in columns">
    			                    <div class="form-group">
    			                    	<label for="">{{trans('general.column_number', {number: index + 1})}}</label>
    		                            <select v-model="column.name" class="custom-select col-12" name="columns">
    		                              <option value=null>{{trans('general.select_one')}}</option>
    		                              <option v-for="option in options" v-bind:value="option.value">
    		                                {{ option.text }}
    		                              </option>
    		                            </select>
    			                    </div>
    	                    	</div>
    	                    </div>
                            <button type="button" class="btn btn-info" @click="submit">{{trans('general.submit')}}</button>
                        </div>

	                </template>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				isUploadDisabled: false,
	            progress: 0,
	            file: '',
	            items: [],
	            isUploaded: false,
	            columns: [],
	            uuid: '',
	            options: []
			}
		},
		mounted(){
		},
        directives: {
            uploader: {
              bind(el, binding, vnode) {
                el.addEventListener('change', e => {
                  vnode.context.file = e.target.files[0];
                });
              }
            },
        },
        watch: {
            file(file){
                let fileExtension = file.name.substr((file.name.lastIndexOf('.') + 1));

                if(fileExtension != 'csv'){
                    toastr.error(i18n.general.file_not_allowed);
                    this.isUploadDisabled = false;
                } else if(file.size > helper.getConfig('post_max_size')){
                    toastr.error(i18n.general.file_too_large);
                    this.isUploadDisabled = false;
                } else {
                    let formData = new FormData();
                    formData.append('file', file);
                    axios.post('/api/student/import/start',formData)
                    .then(response => {
                        this.isUploaded = true;
                        this.items = response.items;
                        this.uuid = response.uuid;
                        this.options = response.options;
						this.options.forEach((option,index) => {
							this.columns.push({
								name: option.value
							})
						})
                    }).catch(error => {
                        if(error.response.status == 413)
                            toastr.error(i18n.general.file_too_large);
                        else
                            helper.showErrorMsg(error);
                        this.progress = 0;
                        this.isUploadDisabled = false;
                    });
                    this.$refs.file.value = '';
                }
            }
        },
		methods: {
            launchFilePicker() {
                this.isUploadDisabled = true;
                this.$refs.file.click();
            },
            submit(){
                let loader = this.$loading.show();
            	axios.post('/api/student/import/finish',{
	            		uuid: this.uuid,
	            		columns: this.columns
	            	})
            		.then(response => {
                        loader.hide();
            			toastr.success(response.message);
                        this.$router.push('/student/list')
            		})
            		.catch(error => {
                        loader.hide();  
            			helper.showErrorMsg(error);
            		})
            }
		},
		computed: {
            getSession(){
                return helper.getDefaultAcademicSession().name;
            }
		}
	}
</script>