<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container modal-lg">
                    <div class="modal-header">
                        <slot name="header">
                            {{trans('student.edit_record')}}
                            <span class="float-right pointer" @click="$emit('close')">x</span>
                        </slot>
                    </div>
                    <div class="modal-body" style="min-height: 300px;">
                        <slot name="body">
                            <form @submit.prevent="submit" @keydown="recordForm.errors.clear($event.target.name)">
                                <div class="row">
                                    <div class="col-12 col-sm-6">
                                        <div class="form-group">
                                            <label for="">{{trans('student.date_of_admission_promotion')}}</label>
                                            <datepicker v-model="recordForm.date_of_entry" :bootstrapStyling="true" @selected="recordForm.errors.clear('date_of_entry')" :placeholder="trans('student.date_of_admission_promotion')"></datepicker>
                                            <show-error :form-name="recordForm" prop-name="date_of_entry"></show-error>
                                        </div>
                                    </div>
                                    <div class="col-12 col-sm-6">
                                        <div class="form-group">
                                            <label for="">{{trans('academic.batch')}}</label>
                                            <v-select label="name" v-model="selected_batch" group-values="batches" group-label="course_group" :group-select="false" name="batch_id" id="batch_id" :options="batches" :placeholder="trans('academic.select_batch')" @select="onBatchSelect" @close="recordForm.errors.clear('batch_id')" @remove="onBatchRemove">
                                                <div class="multiselect__option" slot="afterList" v-if="!batches.length">
                                                    {{trans('general.no_option_found')}}
                                                </div>
                                            </v-select>
                                            <show-error :form-name="recordForm" prop-name="batch_id"></show-error>
                                        </div>
                                    </div>
                                    <div class="col-12 col-sm-6">
                                        <div class="form-group">
                                            <label for="">{{trans('student.admission_number')}}</label>
                                            <div class="row">
                                                <div class="col-12 col-sm-4">
                                                    <input class="form-control" type="text" v-model="recordForm.prefix" name="prefix" :placeholder="trans('student.admission_number_prefix')">
                                                </div>
                                                <div class="col-12 col-sm-8">
                                                    <input class="form-control" type="text" v-model="recordForm.number" name="number" :placeholder="trans('student.admission_number')">
                                                </div>
                                            </div>
                                            <show-error :form-name="recordForm" prop-name="number"></show-error>
                                        </div>
                                    </div>
                                </div>

                                <div class="card-footer text-right">
                                    <button type="submit" class="btn btn-info waves-effect waves-light">{{trans('general.save')}}</button>
                                </div>
                            </form>
                        </slot>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        components: {},
        props: ['student','record'],
        data(){
            return {
                recordForm: new Form({
                    batch_id: '',
                    date_of_entry: '',
                    number: '',
                    prefix: ''
                },false),
                batches: [],
                selected_batch: null,
            }
        },
        mounted(){
            if(!helper.hasPermission('edit-student')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }
            this.getPreRequisite();
        },
        methods: {
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/student/record/pre-requisite')
                    .then(response => {
                        this.batches = response.batches;
                        this.selected_batch = {id: this.record.batch_id, name: this.record.batch.course.name+' '+this.record.batch.name};
                        this.recordForm.batch_id = this.record.batch_id;
                        this.recordForm.date_of_entry = this.record.date_of_entry;
                        this.recordForm.number = this.record.admission.number;
                        this.recordForm.prefix = this.record.admission.prefix;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            complete(){
                this.$emit('completed');
                this.$emit('close');
            },
            onBatchSelect(selectedOption){
                this.recordForm.batch_id = selectedOption.id;
                loader.hide();
            },
            onBatchRemove(removedOption){
                this.recordForm.batch_id = '';
            },
            submit(){
                let loader = this.$loading.show();
                this.recordForm.patch('/api/student/'+this.student.uuid+'/record/'+this.record.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.$emit('completed');
                        this.$emit('close');
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
        }
    }
</script>

<style>
    .loading-overlay{
        z-index: 1060;
    }
</style>