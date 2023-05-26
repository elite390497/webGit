<template>
    <div>
        <form @submit.prevent="proceed" @keydown="observationForm.errors.clear($event.target.name)">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('exam.observation_name')}}</label>
                        <input class="form-control" type="text" v-model="observationForm.name" name="name" :placeholder="trans('exam.observation_name')">
                        <show-error :form-name="observationForm" prop-name="name"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('exam.observation_description')}}</label>
                        <input class="form-control" type="text" v-model="observationForm.description" name="description" :placeholder="trans('exam.observation_description')">
                        <show-error :form-name="observationForm" prop-name="description"></show-error>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <h6 class="card-title">{{trans('exam.observation_sub_parameter')}}</h6>
                    <template v-for="(detail,index) in observationForm.details">
                        <div class="row">
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('exam.observation_detail_name')}} 
                                    <button type="button" class="btn btn-xs btn-danger m-l-20" :key="`${index}_delete_detail`" v-confirm="{ok: confirmDeleteDetail(index)}" v-tooltip="trans('general.delete')"><i class="fas fa-times"></i></button></label>
                                    <input class="form-control" type="text" v-model="detail.name" :name="getDetailName(index)" :placeholder="trans('exam.observation_detail_name')">
                                    <show-error :form-name="observationForm" :prop-name="getDetailName(index)"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-2">
                                <div class="form-group">
                                    <label for="">{{trans('exam.observation_detail_max_mark')}}</label>
                                    <input class="form-control" type="number" v-model="detail.max_mark" :name="getDetailMaxMarkName(index)" :placeholder="trans('exam.observation_detail_max_mark')">
                                    <show-error :form-name="observationForm" :prop-name="getDetailMaxMarkName(index)"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-4">
                                <div class="form-group">
                                    <label for="">{{trans('exam.observation_detail_description')}}</label>
                                    <autosize-textarea v-model="detail.description" rows="2" :name="getDetailDescriptionName(index)" :placeholder="trans('resource.observation_detail_description')"></autosize-textarea>
                                    <show-error :form-name="observationForm" :prop-name="getDetailDescriptionName(index)"></show-error>
                                </div>
                            </div>
                        </div>
                    </template>
                    <div class="form-group">
                        <button type="button" @click="addRow" class="btn btn-info btn-sm waves-effect waves-light">{{trans('exam.add_new_observation_detail')}}</button>
                    </div>
                </div>
            </div>
            <div class="card-footer text-right">
                <router-link to="/configuration/exam/observation" class="btn btn-danger waves-effect waves-light ">{{trans('general.cancel')}}</router-link>
                <button type="submit" class="btn btn-info waves-effect waves-light">
                    <span v-if="id">{{trans('general.update')}}</span>
                    <span v-else>{{trans('general.save')}}</span>
                </button>
            </div>
        </form>
    </div>
</template>


<script>
    export default {
        components: {},
        data() {
            return {
                observationForm: new Form({
                    name: '',
                    description: '',
                    details: []
                })
            };
        },
        props: ['id'],
        mounted() {
            if(!helper.hasPermission('access-configuration')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            if(this.id)
                this.get();
            else {
                this.addRow();
            }
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            addRow(){
                let new_index = this.observationForm.details.push({
                    name: '',
                    max_mark: '',
                    description: ''
                })
            },
            confirmDeleteDetail(index){
                return dialog => this.deleteDetail(index);
            },
            deleteDetail(index){
                this.observationForm.details.splice(index, 1);
            },
            getDetailName(index){
                return index+'_detail_name';
            },
            getDetailMaxMarkName(index){
                return index+'_detail_max_mark';
            },
            getDetailDescriptionName(index){
                return index+'_detail_description';
            },
            proceed(){
                if(this.id)
                    this.update();
                else
                    this.store();
            },
            store(){
                let loader = this.$loading.show();
                this.observationForm.post('/api/exam/observation')
                    .then(response => {
                        toastr.success(response.message);
                        this.observationForm.details = [];
                        this.addRow();
                        this.$emit('completed');
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            get(){
                let loader = this.$loading.show();
                axios.get('/api/exam/observation/'+this.id)
                    .then(response => {
                        this.observationForm.name = response.name;
                        this.observationForm.description = response.description;

                        response.details.forEach(detail => {
                            this.observationForm.details.push({
                                name: detail.name,
                                max_mark: detail.max_mark,
                                description: detail.description
                            });
                        });
                        
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/configuration/exam/observation');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.observationForm.patch('/api/exam/observation/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/configuration/exam/observation');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
        }
    }
</script>