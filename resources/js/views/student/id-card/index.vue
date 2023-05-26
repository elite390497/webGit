<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('student.id_card')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <help-button @clicked="help_topic = ''"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                	<div class="card">
                		<div class="card-body p-4">
						    <form @submit.prevent="submit" @keydown="idCardForm.errors.clear($event.target.name)">
						        <div class="row">
						            <div class="col-12 col-sm-4">
						                <div class="form-group">
						                    <label for="">{{trans('academic.batch')}}</label>
						                    <v-select label="name" v-model="selected_batch" group-values="batches" group-label="course_group" :group-select="false" name="batch_id" id="batch_id" :options="batches" :placeholder="trans('academic.select_batch')" @select="onBatchSelect" @close="idCardForm.errors.clear('batch_id')" @remove="onBatchRemove">
						                        <div class="multiselect__option" slot="afterList" v-if="!batches.length">
						                            {{trans('general.no_option_found')}}
						                        </div>
						                    </v-select>
						                    <show-error :form-name="idCardForm" prop-name="batch_id"></show-error>
						                </div>
						            </div>
						            <div class="col-12 col-sm-4">
						                <div class="form-group">
						                    <label for="">{{trans('academic.id_card_template')}}</label>
						                    <v-select label="name" v-model="selected_id_card_template" name="id_card_template_id" id="id_card_template_id" :options="id_card_templates" :placeholder="trans('academic.select_id_card_template')" @select="onIdCardTemplateSelect" @close="idCardForm.errors.clear('id_card_template_id')" @remove="onIdCardTemplateRemove">
						                        <div class="multiselect__option" slot="afterList" v-if="!id_card_templates.length">
						                            {{trans('general.no_option_found')}}
						                        </div>
						                    </v-select>
						                    <show-error :form-name="idCardForm" prop-name="id_card_template_id"></show-error>
						                </div>
						            </div>
						        </div>
						        <div class="form-group" v-if="idCardForm.batch_id && idCardForm.id_card_template_id">
						        	<a :href="getURL" target="_blank" class="btn btn-info">{{trans('student.generate_id_card')}}</a>
						        </div>
						    </form>
                		</div>	
                	</div>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>	
</template>

<script>
	export default {
		components: {},
		data(){
			return {
				idCardForm: new Form({
					batch_id: '',
					id_card_template_id: ''
				},false),
				batches: [],
				selected_batch: null,
				id_card_templates: [],
				selected_id_card_template: null,
				help_topic: ''
			}
		},
		mounted(){
			if(!helper.hasPermission('generate-student-id-card')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
			}

			this.getPreRequisite();
            helper.showDemoNotification(['student']);
		},
		methods: {
			getPreRequisite(){
				let loader = this.$loading.show();
				axios.get('/api/student/id-card/pre-requisite')
					.then(response => {
						this.batches = response.batches;
						this.id_card_templates = response.id_card_templates;
						loader.hide();
					})
					.catch(error => {
						loader.hide();
						helper.showErrorMsg(error);
					})
			},
			onBatchSelect(selectedOption){
				let loader = this.$loading.show();
				this.idCardForm.batch_id = selectedOption.id;
				loader.hide();
			},
			onBatchRemove(removedOption){
				this.idCardForm.batch_id = '';
			},
			onIdCardTemplateSelect(selectedOption){
				let loader = this.$loading.show();
				this.idCardForm.id_card_template_id = selectedOption.id;
				loader.hide();
			},
			onIdCardTemplateRemove(removedOption){
				this.idCardForm.id_card_template_id = '';
			}
		},
        filters: {
          moment(date) {
            return helper.formatDate(date);
          },
          momentDateTime(date) {
            return helper.formatDateTime(date);
          }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            },
			getURL(){
				return '/student/id-card/print?batch_id='+this.idCardForm.batch_id+'&token='+this.authToken+'&id_card_template_id='+this.idCardForm.id_card_template_id;;
			}
        }
	}
</script>