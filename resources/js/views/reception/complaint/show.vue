<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container modal-lg">
                    <div class="modal-header" v-if="complaint.id">
                        <slot name="header">
                            <span>#{{ complaint.id }}</span>
                            <span class="float-right pointer" @click="$emit('close')">x</span>
                        </slot>
                    </div>
                    <div class="modal-body" v-if="complaint.id">
                        <slot name="body">
                            <h6 class="card-title">
                                <p><strong>{{trans('reception.date_of_complaint')}}:</strong> {{complaint.date_of_complaint | moment}}</p>
                                <p v-if="complaint.date_of_resolution"><strong>{{trans('reception.date_of_resolution')}}:</strong> <span class="label label-success">{{complaint.date_of_resolution | moment}}</span></p>

                                <strong>{{trans('reception.complaint_type')}}:</strong> {{complaint.complaint_type.name}}
                                <br />
                                <strong>{{trans('reception.complainant_name')}}:</strong> {{complaint.complainant_name}} <br />
                                <strong>{{trans('reception.complainant_contact_number')}}:</strong> {{complaint.complainant_contact_number}} <br />
                                <strong>{{trans('reception.complainant_address')}}:</strong> {{complaint.complainant_address}}
                                <p class="pull-right" v-if="complaint.employee">
                                    <strong>{{trans('reception.complaint_assign_to')}}:</strong> {{getEmployeeName(complaint.employee)}} {{getEmployeeDesignation(complaint.employee, complaint.date_of_complaint)}}
                                </p>
                            </h6>
                            <div class="m-t-20" v-html="complaint.description"></div>
                            <div class="m-t-20" v-if="complaint.action" v-html="complaint.action"></div>
                            <div v-if="attachments.length">
                                <ul class="m-t-10 upload-file-list">
                                    <li class="upload-file-list-item" v-for="attachment in attachments">
                                        <a :href="`/reception/complaint/${complaint.uuid}/attachment/${attachment.uuid}/download?token=${authToken}`" class="no-link-color"><i :class="['file-icon', 'fas', 'fa-lg', attachment.file_info.icon]"></i> <span class="upload-file-list-item-size">{{attachment.file_info.size}}</span> {{attachment.user_filename}}</a>
                                    </li>
                                </ul>
                            </div>
                            <hr />
                            <p>
                                <i class="far fa-clock"></i> <small>{{trans('general.created_at')}} {{complaint.created_at | momentDateTime}}</small>
                                <span class="pull-right">
                                    <i class="far fa-clock"></i> <small>{{trans('general.updated_at')}} {{complaint.updated_at | momentDateTime}}</small>
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
                complaint: [],
                attachments: []
            }
        },
        methods: {
            get(){
                let loader = this.$loading.show();
                axios.get('/api/complaint/'+this.uuid)
                    .then(response => {
                        this.complaint = response.complaint;
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