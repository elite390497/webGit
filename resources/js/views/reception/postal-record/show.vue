<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container modal-lg">
                    <div class="modal-header" v-if="postal_record.id">
                        <slot name="header">
                            <span>#{{ postal_record.id }} {{postal_record.reference_number}}</span>
                            <span class="float-right pointer" @click="$emit('close')">x</span>
                        </slot>
                    </div>
                    <div class="modal-body" v-if="postal_record.id">
                        <slot name="body">
                            <h6 class="card-title">
                                <p><strong>{{trans('reception.postal_record_date')}}:</strong> {{postal_record.date | moment}}</p>

                                <strong>{{trans('reception.postal_record_sender')}}:</strong> {{postal_record.sender_title}} <br />
                                    {{postal_record.sender_address}}
                                <br />
                                <strong>{{trans('reception.postal_record_receiver')}}:</strong> {{postal_record.receiver_title}} <br />
                                    {{postal_record.receiver_address}} 
                                <p class="pull-right" v-if="postal_record.employee">
                                    <strong>{{trans('general.entry_by')}}:</strong> {{getEmployeeName(postal_record.employee)}} {{getEmployeeDesignation(postal_record.employee, postal_record.date)}}
                                </p>
                            </h6>
                            <div class="m-t-20" v-html="postal_record.description"></div>
                            <div v-if="attachments.length">
                                <ul class="m-t-10 upload-file-list">
                                    <li class="upload-file-list-item" v-for="attachment in attachments">
                                        <a :href="`/reception/postal/record/${postal_record.uuid}/attachment/${attachment.uuid}/download?token=${authToken}`" class="no-link-color"><i :class="['file-icon', 'fas', 'fa-lg', attachment.file_info.icon]"></i> <span class="upload-file-list-item-size">{{attachment.file_info.size}}</span> {{attachment.user_filename}}</a>
                                    </li>
                                </ul>
                            </div>
                            <hr />
                            <p>
                                <i class="far fa-clock"></i> <small>{{trans('general.created_at')}} {{postal_record.created_at | momentDateTime}}</small>
                                <span class="pull-right">
                                    <i class="far fa-clock"></i> <small>{{trans('general.updated_at')}} {{postal_record.updated_at | momentDateTime}}</small>
                                </span>
                            </p>
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
        props: ['uuid'],
        mounted(){
            if(this.uuid)
                this.get();
        },
        data(){
            return {
                postal_record: [],
                attachments: []
            }
        },
        methods: {
            get(){
                let loader = this.$loading.show();
                axios.get('/api/postal/record/'+this.uuid)
                    .then(response => {
                        this.postal_record = response.postal_record;
                        this.attachments = response.attachments;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getEmployeeName(employee){
                return helper.getEmployeeName(employee);
            },
            getEmployeeDesignation(employee, date){
                return helper.getEmployeeDesignation(employee, date);
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        },
        filters: {
          momentDateTime(date) {
            return helper.formatDateTime(date);
          },
          moment(date) {
            return helper.formatDate(date);
          }
        }
    }
</script>