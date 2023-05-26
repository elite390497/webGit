<template>
	<div>
        <form @submit.prevent="submit" @keydown="followUpForm.errors.clear($event.target.name)">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('reception.date_of_follow_up')}}</label>
                        <datepicker v-model="followUpForm.date_of_follow_up" :bootstrapStyling="true" @selected="followUpForm.errors.clear('date_of_follow_up')" :placeholder="trans('reception.date_of_follow_up')"></datepicker>
                        <show-error :form-name="followUpForm" prop-name="date_of_follow_up"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('reception.date_of_next_follow_up')}}</label>
                        <datepicker v-model="followUpForm.date_of_next_follow_up" :bootstrapStyling="true" @selected="followUpForm.errors.clear('date_of_next_follow_up')" :placeholder="trans('reception.date_of_next_follow_up')"></datepicker>
                        <show-error :form-name="followUpForm" prop-name="date_of_next_follow_up"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('reception.enquiry_status')}}</label>
                        <select v-model="followUpForm.status" class="custom-select col-12" name="status" @change="followUpForm.errors.clear('status')">
                          <option v-for="status in statuses" v-bind:value="status.value">
                            {{ status.text }}
                          </option>
                        </select>
                        <show-error :form-name="followUpForm" prop-name="status"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">
                            {{trans('reception.follow_up_remarks')}}
                        </label>
                        <input class="form-control" type="text" v-model="followUpForm.remarks" name="remarks" :placeholder="trans('reception.follow_up_remarks')">
                        <show-error :form-name="followUpForm" prop-name="remarks"></show-error>
                    </div>
                </div>
            </div>
            <div class="card-footer text-right">
                <button type="submit" class="btn btn-info waves-effect waves-light">{{trans('general.save')}}</button>
            </div>
        </form>
        <div class="clearfix"></div>
    </div>
</template>

<script>
    export default {
        components: {},
        props: ['enquiry'],
        data() {
            return {
                followUpForm: new Form({
                    date_of_follow_up: '',
                    date_of_next_follow_up: '',
                    status: '',
                    remarks: '',
                }),
                statuses: [
                    {
                        text: i18n.reception.enquiry_status_open,
                        value: 'open'
                    },
                    {
                        text: i18n.reception.enquiry_status_partially_closed,
                        value: 'partially_closed'
                    },
                    {
                        text: i18n.reception.enquiry_status_closed,
                        value: 'closed'
                    },
                    {
                        text: i18n.reception.enquiry_status_missed,
                        value: 'missed'
                    }
                ]
            }
        },
        mounted(){
            this.followUpForm.status = this.enquiry.status;
        },
        methods: {
            submit(){
                let loader = this.$loading.show();
                this.followUpForm.post('/api/enquiry/'+this.enquiry.uuid+'/follow/up')
                    .then(response => {
                        toastr.success(response.message);
                        this.$emit('completed');
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            }
        },
        watch: {
            enquiry(enquiry){
                this.followUpForm.status = enquiry.status;
            }
        }
    }
</script>