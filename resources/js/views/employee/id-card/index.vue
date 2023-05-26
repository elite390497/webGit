<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('employee.id_card')}}</h3>
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
						                    <label for="">{{trans('employee.department')}}</label>
						                    <v-select label="name" v-model="selected_department" name="department_id" id="department_id" :options="departments" :placeholder="trans('employee.select_department')" @select="onDepartmentSelect" @close="idCardForm.errors.clear('department_id')" @remove="onDepartmentRemove">
						                        <div class="multiselect__option" slot="afterList" v-if="!departments.length">
						                            {{trans('general.no_option_found')}}
						                        </div>
						                    </v-select>
						                    <show-error :form-name="idCardForm" prop-name="department_id"></show-error>
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
						        <div class="form-group" v-if="idCardForm.department_id && idCardForm.id_card_template_id">
						        	<a :href="getURL" target="_blank" class="btn btn-info">{{trans('employee.generate_id_card')}}</a>
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
					department_id: '',
					id_card_template_id: ''
				},false),
				departments: [],
				selected_department: null,
				id_card_templates: [],
				selected_id_card_template: null,
				help_topic: ''
			}
		},
		mounted(){
			if(!helper.hasPermission('generate-employee-id-card')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
			}

			this.getPreRequisite();
            helper.showDemoNotification(['employee']);
		},
		methods: {
			getPreRequisite(){
				let loader = this.$loading.show();
				axios.get('/api/employee/id-card/pre-requisite')
					.then(response => {
						this.departments = response.departments;
						this.id_card_templates = response.id_card_templates;
						loader.hide();
					})
					.catch(error => {
						loader.hide();
						helper.showErrorMsg(error);
					})
			},
			onDepartmentSelect(selectedOption){
				let loader = this.$loading.show();
				this.idCardForm.department_id = selectedOption.id;
				loader.hide();
			},
			onDepartmentRemove(removedOption){
				this.idCardForm.department_id = '';
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
				return '/employee/id-card/print?department_id='+this.idCardForm.department_id+'&token='+this.authToken+'&id_card_template_id='+this.idCardForm.id_card_template_id;;
			}
        }
	}
</script>