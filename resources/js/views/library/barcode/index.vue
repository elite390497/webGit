<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('library.generate_barcode')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
		                <button class="btn btn-info btn-sm" @click="$router.push('/library/issue/list')"><i class="fas fa-book"></i> <span class="d-none d-sm-inline">{{trans('library.issue_list')}}</span></button>
		                <button class="btn btn-info btn-sm" @click="$router.push('/library/book')"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('library.book')}}</span></button>
                        <help-button @clicked="help_topic = 'book-issue'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
        	<form @submit.prevent="submit" @keydown="barcodeForm.errors.clear($event.target.name)">
	            <div class="card card-form">
	                <div class="card-body p-t-20">
				        <div class="row">
				            <div class="col-12 col-sm-6">
			                    <div class="form-group">
			                        <div class="radio radio-success">
			                            <input type="radio" value="range" id="range" v-model="barcodeForm.type" :checked="barcodeForm.type" name="type" @click="barcodeForm.errors.clear('type')">
			                            <label for="range">{{trans('library.barcode_range')}}</label>
			                        </div>
			                        <div class="radio radio-success">
			                            <input type="radio" value="csv" id="csv" v-model="barcodeForm.type" :checked="!barcodeForm.type" name="type" @click="barcodeForm.errors.clear('type')">
			                            <label for="csv">{{trans('library.barcode_csv')}}</label>
			                        </div>
			                        <show-error :form-name="barcodeForm" prop-name="type"></show-error>
			                    </div>
			                    <div class="row" v-if="barcodeForm.type == 'range'">
				            		<div class="col-12 col-sm-6">
					                    <div class="form-group">
			                                <label for="">{{trans('library.range_start')}}</label>
			                                <input class="form-control" type="number" v-model="barcodeForm.start" name="start" :placeholder="trans('library.barcode_range_start')">
			                                <show-error :form-name="barcodeForm" prop-name="start"></show-error>
					                    </div>
					                </div>
				            		<div class="col-12 col-sm-6">
					                    <div class="form-group">
			                                <label for="">{{trans('library.range_end')}}</label>
			                                <input class="form-control" type="number" v-model="barcodeForm.end" name="end" :placeholder="trans('library.barcode_range_end')">
			                                <show-error :form-name="barcodeForm" prop-name="end"></show-error>
					                    </div>
					                </div>
					            </div>
				                <div class="form-group" v-if="barcodeForm.type == 'csv'">
				                    <label for="">{{trans('library.barcode_csv')}}</label>
				                    <autosize-textarea v-model="barcodeForm.csv" rows="3" name="csv" :placeholder="trans('library.barcode_csv')"></autosize-textarea>
				                    <show-error :form-name="barcodeForm" prop-name="csv"></show-error>
				                </div>
			                    <div class="row">
				            		<div class="col-12 col-sm-6">
					                    <div class="form-group">
			                                <label for="">{{trans('library.barcode_width')}}</label>
			                                <div class="input-group">
			                                    <input class="form-control" type="number" step=".02" v-model="barcodeForm.width" name="width" :placeholder="trans('library.barcode_width')">
			                                    <div class="input-group-append"><span class="input-group-text">mm</span></div>
			                                </div>
			                                <show-error :form-name="barcodeForm" prop-name="width"></show-error>
					                    </div>
					                </div>
				            		<div class="col-12 col-sm-6">
					                    <div class="form-group">
			                                <label for="">{{trans('library.barcode_height')}}</label>
			                                <div class="input-group">
			                                    <input class="form-control" type="number" step=".02" v-model="barcodeForm.height" name="height" :placeholder="trans('library.barcode_height')">
			                                    <div class="input-group-append"><span class="input-group-text">mm</span></div>
			                                </div>
			                                <show-error :form-name="barcodeForm" prop-name="height"></show-error>
					                    </div>
					                </div>
					                <div class="col-12 col-sm-6">
			                            <div class="form-group">
			                                <label for="">{{trans('library.barcode_per_page_limit')}}</label>
			                                <input class="form-control" type="number" v-model="barcodeForm.per_page_limit" name="per_page_limit" :placeholder="trans('library.barcode_per_page_limit')">
			                                <show-error :form-name="barcodeForm" prop-name="per_page_limit"></show-error>
			                            </div>
					                </div>
					            </div>
				            </div>
				        </div>
					</div>
			        <div class="card-footer text-right">
			            <button type="submit" class="btn btn-info waves-effect waves-light">
			                <span>{{trans('library.generate_barcode')}}</span>
			            </button>
			        </div>
				</div>
			</form>
        </div>
    </div>
</template>

<script>
	export default {
		components: {},
		data(){
			return {
				barcodeForm: new Form({
					type: '',
					start: '',
					end: '',
					csv: '',
					height: '',
					width: '',
					per_page_limit: ''
				}, false)
			}
		},
		mounted(){
		},
		methods: {
            submit(){
                let loader = this.$loading.show();
                this.barcodeForm.post('/api/library/barcode')
                    .then(response => {
                        let print = window.open("/print");
                        loader.hide();
                        print.document.write(response);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
		},
        watch: {
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