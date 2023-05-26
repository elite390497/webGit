<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('configuration.sms')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/dashboard')"><i class="fas fa-home"></i> <span class="d-none d-sm-inline">{{trans('general.home')}}</span></button>
                        <help-button @clicked="help_topic = 'configuration.sms'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card">
                <div class="card-body p-4">
                    <show-tip module="configuration" tip="tip_sms"></show-tip>
                    <form @submit.prevent="submit" @keydown="configForm.errors.clear($event.target.name)">
                        <div class="row">
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('configuration.sms_gateway')}}</label>
                                    <select v-model="configForm.sms_gateway" class="custom-select col-12" name="sms_gateway" @change="configForm.errors.clear('sms_gateway')">
                                      <option value="">{{trans('general.select_one')}}</option>
                                      <option v-for="option in sms_gateways" v-bind:value="option.value">
                                        {{ option.text }}
                                      </option>
                                    </select>
                                    <show-error :form-name="configForm" prop-name="sms_gateway"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('configuration.max_sms_per_chunk')}}</label>
                                    <input class="form-control" type="text" v-model="configForm.max_sms_per_chunk" name="max_sms_per_chunk" :placeholder="trans('configuration.max_sms_per_chunk')">
                                    <show-error :form-name="configForm" prop-name="max_sms_per_chunk"></show-error>
                                </div>
                            </div>
                        </div>
                        <template v-if="configForm.sms_gateway == 'nexmo'">
                            <div class="row">
                                <div class="col-12 col-sm-3">
                                    <div class="form-group">
                                        <label for="">{{trans('configuration.nexmo_api_key')}}</label>
                                        <input class="form-control" type="text" v-model="configForm.nexmo_api_key" name="nexmo_api_key" :placeholder="trans('configuration.nexmo_api_key')">
                                        <show-error :form-name="configForm" prop-name="nexmo_api_key"></show-error>
                                    </div>
                                </div>
                                <div class="col-12 col-sm-3">
                                    <div class="form-group">
                                        <label for="">{{trans('configuration.nexmo_api_secret')}}</label>
                                        <input class="form-control" type="text" v-model="configForm.nexmo_api_secret" name="nexmo_api_secret" :placeholder="trans('configuration.nexmo_api_secret')">
                                        <show-error :form-name="configForm" prop-name="nexmo_api_secret"></show-error>
                                    </div>
                                </div>
                                <div class="col-12 col-sm-3">
                                    <div class="form-group">
                                        <label for="">{{trans('configuration.sender_mobile')}}</label>
                                        <input class="form-control" type="text" v-model="configForm.nexmo_sender_mobile" name="nexmo_sender_mobile" :placeholder="trans('configuration.sender_mobile')">
                                        <show-error :form-name="configForm" prop-name="nexmo_sender_mobile"></show-error>
                                    </div>
                                </div>
                                <div class="col-12 col-sm-3">
                                    <div class="form-group">
                                        <label for="">{{trans('configuration.receiver_mobile')}}</label>
                                        <input class="form-control" type="text" v-model="configForm.nexmo_receiver_mobile" name="nexmo_receiver_mobile" :placeholder="trans('configuration.receiver_mobile')">
                                        <show-error :form-name="configForm" prop-name="nexmo_receiver_mobile"></show-error>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <template v-else-if="configForm.sms_gateway == 'twilio'">
                            <div class="row">
                                <div class="col-12 col-sm-3">
                                    <div class="form-group">
                                        <label for="">{{trans('configuration.twilio_sid')}}</label>
                                        <input class="form-control" type="text" v-model="configForm.twilio_sid" name="twilio_sid" :placeholder="trans('configuration.twilio_sid')">
                                        <show-error :form-name="configForm" prop-name="twilio_sid"></show-error>
                                    </div>
                                </div>
                                <div class="col-12 col-sm-3">
                                    <div class="form-group">
                                        <label for="">{{trans('configuration.twilio_token')}}</label>
                                        <input class="form-control" type="text" v-model="configForm.twilio_token" name="twilio_token" :placeholder="trans('configuration.twilio_token')">
                                        <show-error :form-name="configForm" prop-name="twilio_token"></show-error>
                                    </div>
                                </div>
                                <div class="col-12 col-sm-3">
                                    <div class="form-group">
                                        <label for="">{{trans('configuration.sender_mobile')}}</label>
                                        <input class="form-control" type="text" v-model="configForm.twilio_sender_mobile" name="twilio_sender_mobile" :placeholder="trans('configuration.sender_mobile')">
                                        <show-error :form-name="configForm" prop-name="twilio_sender_mobile"></show-error>
                                    </div>
                                </div>
                                <div class="col-12 col-sm-3">
                                    <div class="form-group">
                                        <label for="">{{trans('configuration.receiver_mobile')}}</label>
                                        <input class="form-control" type="text" v-model="configForm.twilio_receiver_mobile" name="twilio_receiver_mobile" :placeholder="trans('configuration.receiver_mobile')">
                                        <show-error :form-name="configForm" prop-name="twilio_receiver_mobile"></show-error>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <template v-else-if="configForm.sms_gateway == 'custom'">
                            <div class="row">
                                <div class="col-12 col-sm-3">
                                    <div class="form-group">
                                        <label for="">{{trans('configuration.custom_sms_api_get_url')}}</label>
                                        <input class="form-control" type="text" v-model="configForm.custom_sms_api_get_url" name="custom_sms_api_get_url" :placeholder="trans('configuration.custom_sms_api_get_url')">
                                        <show-error :form-name="configForm" prop-name="custom_sms_api_get_url"></show-error>
                                    </div>
                                </div>
                                <div class="col-12 col-sm-3">
                                    <div class="form-group">
                                        <label for="">{{trans('configuration.custom_sms_api_number_prefix')}}</label>
                                        <input class="form-control" type="text" v-model="configForm.custom_sms_api_number_prefix" name="custom_sms_api_number_prefix" :placeholder="trans('configuration.custom_sms_api_number_prefix')">
                                        <show-error :form-name="configForm" prop-name="custom_sms_api_number_prefix"></show-error>
                                    </div>
                                </div>
                                <div class="col-12 col-sm-3">
                                    <div class="form-group">
                                        <label for="">{{trans('configuration.custom_sms_api_sender_id_param')}}</label>
                                        <input class="form-control" type="text" v-model="configForm.custom_sms_api_sender_id_param" name="custom_sms_api_sender_id_param" :placeholder="trans('configuration.custom_sms_api_sender_id_param')">
                                        <show-error :form-name="configForm" prop-name="custom_sms_api_sender_id_param"></show-error>
                                    </div>
                                </div>
                                <div class="col-12 col-sm-3">
                                    <div class="form-group">
                                        <label for="">{{trans('configuration.custom_sms_api_sender_id')}}</label>
                                        <input class="form-control" type="text" v-model="configForm.custom_sms_api_sender_id" name="custom_sms_api_sender_id" :placeholder="trans('configuration.custom_sms_api_sender_id')">
                                        <show-error :form-name="configForm" prop-name="custom_sms_api_sender_id"></show-error>
                                    </div>
                                </div>
                                <div class="col-12 col-sm-3">
                                    <div class="form-group">
                                        <label for="">{{trans('configuration.custom_sms_api_receiver_param')}}</label>
                                        <input class="form-control" type="text" v-model="configForm.custom_sms_api_receiver_param" name="custom_sms_api_receiver_param" :placeholder="trans('configuration.custom_sms_api_receiver_param')">
                                        <show-error :form-name="configForm" prop-name="custom_sms_api_receiver_param"></show-error>
                                    </div>
                                </div>
                                <div class="col-12 col-sm-3">
                                    <div class="form-group">
                                        <label for="">{{trans('configuration.custom_sms_api_message_param')}}</label>
                                        <input class="form-control" type="text" v-model="configForm.custom_sms_api_message_param" name="custom_sms_api_message_param" :placeholder="trans('configuration.custom_sms_api_message_param')">
                                        <show-error :form-name="configForm" prop-name="custom_sms_api_message_param"></show-error>
                                    </div>
                                </div>
                                <div class="col-12 col-sm-3">
                                    <div class="form-group">
                                        <label for="">{{trans('configuration.custom_sms_api_accepts_multiple_receiver')}}</label>
                                        <label class="custom-control custom-checkbox">
                                            <input type="checkbox" class="custom-control-input" value="1" v-model="configForm.custom_sms_api_accepts_multiple_receiver">
                                            <span class="custom-control-label"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <button type="submit" class="btn btn-info waves-effect waves-light pull-right m-t-10">{{trans('general.save')}}</button>
                    </form>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>


<script>
    export default {
        components : { },
        data() {
            return {
                configForm: new Form({
                    sms_gateway: '',
                    max_sms_per_chunk: '',
                    twilio_sid: '',
                    twilio_token: '',
                    twilio_sender_mobile: '',
                    twilio_receiver_mobile: '',
                    nexmo_api_key: '',
                    nexmo_api_secret: '',
                    nexmo_sender_mobile: '',
                    nexmo_receiver_mobile: '',
                    custom_sms_api_get_url: '',
                    custom_sms_api_number_prefix: '',
                    custom_sms_api_sender_id_param: '',
                    custom_sms_api_sender_id: '',
                    custom_sms_api_receiver_param: '',
                    custom_sms_api_message_param: '',
                    custom_sms_api_accepts_multiple_receiver: 0,
                    config_type: ''
                },false),
                help_topic: '',
                sms_gateways: [
                    {
                        text: "Nexmo",
                        value: "nexmo"
                    },
                    {
                        text: "Twilio",
                        value: "twilio"
                    },
                    {
                        text: "Custom",
                        value: "custom"
                    }
                ]
            }
        },
        mounted(){
            if(!helper.hasPermission('access-configuration')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getConfiguration();
        },
        methods: {
            getConfiguration(){
                let loader = this.$loading.show();
                axios.get('/api/configuration')
                    .then(response => {
                        this.configForm = helper.formAssign(this.configForm, response);
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            submit(){
                let loader = this.$loading.show();
                this.configForm.config_type = 'sms';
                this.configForm.post('/api/configuration')
                    .then(response => {
                        this.$store.dispatch('setConfig',{loaded: false});
                        toastr.success(response.message);
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
        }
    }
</script>
