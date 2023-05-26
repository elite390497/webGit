<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container modal-lg">
                    <div class="modal-header" v-if="syllabus.id">
                        <slot name="header">
                            <span>{{syllabus.title}} {{syllabus.subject.name+' ('+syllabus.subject.code+')'}} {{syllabus.subject.batch.course.name+' '+syllabus.subject.batch.name}} </span>
                            <span class="float-right pointer" @click="$emit('close')">x</span>
                        </slot>
                    </div>
                    <div class="modal-body" v-if="syllabus.id">
                        <slot name="body">
                            <h6 class="card-title"> 
                                <p class="pull-right" v-if="syllabus.employee">
                                    <strong>{{trans('resource.syllabus_created_by')}}:</strong> {{getEmployeeName(syllabus.employee)}} {{getEmployeeDesignation(syllabus.employee, syllabus.start_date)}}
                                </p>
                            </h6>
                            <div class="m-t-20" v-for="syllabus_detail in syllabus.syllabus_details">
                                <h6 class="card-title">{{syllabus_detail.title}}</h6>
                                <p class="font-90pc" v-text="syllabus_detail.description"></p>
                                <hr v-if="!$last(syllabus_detail, syllabus.syllabus_details)" />
                            </div>
                            <h4 class="card-title" v-if="syllabus.syllabus_topics.length">{{trans('resource.syllabus_topic')}}</h4>
                            <div class="m-t-20" v-for="syllabus_topic in syllabus.syllabus_topics">
                                <h6 class="card-title">{{syllabus_topic.title}}
                                    <strong>{{trans('resource.syllabus_topic_start_date')}}: </strong> {{syllabus_topic.start_date | moment}}
                                    <br />
                                    <strong>{{trans('resource.syllabus_topic_end_date')}}: </strong> {{syllabus_topic.end_date | moment}}
                                </h6>
                                <p class="font-90pc" v-text="syllabus_topic.description"></p>
                                <hr v-if="!$last(syllabus_topic, syllabus.syllabus_topics)" />
                            </div>
                            <div v-if="attachments.length">
                                <ul class="m-t-10 upload-file-list">
                                    <li class="upload-file-list-item" v-for="attachment in attachments">
                                        <a :href="`/resource/syllabus/${syllabus.uuid}/attachment/${attachment.uuid}/download?token=${authToken}`" class="no-link-color"><i :class="['file-icon', 'fas', 'fa-lg', attachment.file_info.icon]"></i> <span class="upload-file-list-item-size">{{attachment.file_info.size}}</span> {{attachment.user_filename}}</a>
                                    </li>
                                </ul>
                            </div>
                            <hr />
                            <p>
                                <i class="far fa-clock"></i> <small>{{trans('general.created_at')}} {{syllabus.created_at | momentDateTime}}</small>
                                <span class="pull-right">
                                    <i class="far fa-clock"></i> <small>{{trans('general.updated_at')}} {{syllabus.updated_at | momentDateTime}}</small>
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
        props: ['uuid', 'url'],
        mounted(){
            if(this.uuid)
                this.get();
        },
        data(){
            return {
                syllabus: [],
                attachments: []
            }
        },
        methods: {
            get(){
                let loader = this.$loading.show();
                axios.get('/api/syllabus/'+this.uuid)
                    .then(response => {
                        this.syllabus = response.syllabus;
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