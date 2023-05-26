<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('academic.id_card_template')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <router-link to="/configuration/academic/id-card/template" class="btn btn-info btn-sm"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('academic.id_card_template')}}</span></router-link>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <div class="card border-right">
                        <div class="card-body">
                            <h4 class="card-title m-3"><span class="d-none d-sm-inline">{{id_card_template.name}}</span></h4>
                            <div class="table-responsive">
                                <table class="table table-sm custom-show-table">
                                    <tbody>
                                        <tr>
                                            <td>{{trans('academic.id_card_template_type')}}</td>
                                            <td>{{id_card_template.type == 'student' ? trans('student.student') : trans('employee.employee')}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('academic.id_card_template_width')}}</td>
                                            <td>{{id_card_template.width}}mm</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('academic.id_card_template_height')}}</td>
                                            <td>{{id_card_template.height}}mm</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('academic.id_card_template_per_page_limit')}}</td>
                                            <td>{{id_card_template.options.per_page_limit}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="row">
                        <div class="col-12 col-sm-6">
                            <h2 class="text-center">{{trans('academic.id_card_template_background_image')}}</h2>
                            <upload-image id="background_image" :upload-path="`/academic/id-card/template/background/${id_card_template.id}`" :remove-path="`/academic/id-card/template/background/remove/${id_card_template.id}`" :image-source="background_image" @uploaded="updateImage" @removed="updateImage"></upload-image>
                        </div>
                        <div class="col-12 col-sm-6">
                            <h2 class="text-center">{{trans('academic.id_card_template_signature_image')}}</h2>
                            <upload-image id="signature_image" :upload-path="`/academic/id-card/template/signature/${id_card_template.id}`" :remove-path="`/academic/id-card/template/signature/remove/${id_card_template.id}`" :image-source="signature_image" @uploaded="updateImage" @removed="updateImage"></upload-image>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
	export default {
        components : { },
        data() {
            return {
                id:this.$route.params.id,
                id_card_template: {},
                background_image: '',
                signature_image: '',
            }
        },
        mounted(){
            this.getIdCardTemplate();
        },
        methods: {
        	getIdCardTemplate(){
                let loader = this.$loading.show();
        		axios.get('/api/academic/id-card/template/'+this.id)
        			.then(response => {
        				this.id_card_template = response;
                        this.background_image = response.options.background_image;
                        this.signature_image = response.options.signature_image;
                        loader.hide();
        			})
        			.catch(error => {
                        loader.hide();
        				helper.showErrorMsg(error);
        				this.$router.push('/dashboard');
        			})
        	},
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            updateImage(){

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