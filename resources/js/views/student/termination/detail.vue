<template>
    <div v-if="student.id">
        <template v-if="!readMode">
            <form @submit.prevent="submit" @keydown="terminationForm.errors.clear($event.target.name)">
                <div class="row">
                    <div class="col-12 col-sm-4">
                        <div class="form-group">
                            <label for="">{{trans('academic.batch')}}</label>
                            <select v-model="terminationForm.student_record_id" class="custom-select col-12" name="student_record_id">
                              <option value="" selected>{{trans('general.select_one')}}</option>
                              <option v-for="student_record in student.student_records" v-if="!student_record.date_of_exit" v-bind:value="student_record.id">
                                {{ student_record.batch.course.name+' '+student_record.batch.name }}
                              </option>
                            </select>
                            <show-error :form-name="terminationForm" prop-name="termination_reason"></show-error>
                        </div>
                    </div>
                    <div class="col-12 col-sm-4">
                        <div class="form-group">
                            <label for="">{{trans('student.date_of_termination')}}</label>
                            <datepicker v-model="terminationForm.date_of_termination" :bootstrapStyling="true" @selected="terminationForm.errors.clear('date_of_termination')" :placeholder="trans('student.date_of_termination')"></datepicker>
                            <show-error :form-name="terminationForm" prop-name="date_of_termination"></show-error>
                        </div>
                    </div>
                    <div class="col-12 col-sm-4">
                        <div class="form-group">
                            <label for="">{{trans('student.termination_reason')}}</label>
                            <select v-model="terminationForm.termination_reason" class="custom-select col-12" name="termination_reason">
                              <option value="" selected>{{trans('general.select_one')}}</option>
                              <option v-for="option in termination_reasons" v-bind:value="option.value">
                                {{ option.text }}
                              </option>
                            </select>
                            <show-error :form-name="terminationForm" prop-name="termination_reason"></show-error>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 col-sm-12">
                        <div class="form-group">
                            <label for="">{{trans('student.termination_remarks')}}</label>
                            <autosize-textarea v-model="terminationForm.termination_remarks" rows="3" name="termination_remarks" :placeholder="trans('student.termination_remarks')"></autosize-textarea>
                            <show-error :form-name="terminationForm" prop-name="termination_remarks"></show-error>
                        </div>
                    </div>
                    <div class="col-12">
                        <label>&nbsp;</label>
                        <div class="form-group">
                            <file-upload-input :button-text="trans('general.upload_document')" :token="terminationForm.upload_token" module="student_record" :clear-file="clearAttachment" :module-id="module_id"></file-upload-input>
                        </div>
                    </div>
                </div>
                <div class="card-footer text-right">
                    <button type="submit" class="btn btn-info waves-effect waves-light">{{trans('general.save')}}</button>
                </div>
            </form>
        </template>

        <div class="table-responsive" v-if="hasTerminationRecord">
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th>{{trans('student.admission_number_short')}}</th>
                        <th>{{trans('academic.batch')}}</th>
                        <th>{{trans('student.date_of_admission')}}</th>
                        <th>{{trans('student.date_of_promotion')}}</th>
                        <th>{{trans('student.date_of_termination')}}</th>
                        <th>{{trans('student.termination_reason')}}</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="student_record in student.student_records" v-if="student_record.date_of_exit">
                        <td>{{getAdmissionNumber(student_record.admission)}}</td>
                        <td>{{student_record.batch.course.name+' '+student_record.batch.name}}</td>
                        <td>{{student_record.date_of_entry | moment}}</td>
                        <td>
                            <span>{{student_record.admission.date_of_admission | moment}}</span>
                        </td>
                        <td>
                            <span v-if="student_record.date_of_exit">{{student_record.date_of_exit | moment}}</span>
                            <span v-else>-</span>
                        </td>
                        <td>
                            <span v-if="student_record.date_of_exit">{{trans('student.termination_reason_'+student_record.termination_reason)}}</span>
                            <span v-else>-</span>
                        </td>
                        <td>
                            <button class="btn btn-info btn-sm" @click="showTerminationDetail(student_record)"><i class="fas fa-arrow-circle-right"></i></button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else class="font-80pc">
            {{trans('general.no_result_found')}}
        </div>
        <div>&nbsp;</div>
        <transition name="modal" v-if="showModal">
            <div class="modal-mask">
                <div class="modal-wrapper">
                    <div class="modal-container modal-lg">
                        <div class="modal-header">
                            <slot name="header">
                                {{getStudentName(student)}}
                                <span class="float-right pointer" @click="showModal = false">x</span>
                            </slot>
                        </div>
                        <div class="modal-body">
                            <slot name="body">
                                <p>{{trans('academic.batch')}}: {{student_record.batch.course.name+' '+student_record.batch.name}}</p>
                                <p>{{trans('student.admission_number_short')}}: {{getAdmissionNumber(student_record.admission)}}</p>
                                <p>{{trans('student.date_of_admission')}}: {{student_record.admission.date_of_admission | moment}}</p>
                                <p>{{trans('student.date_of_promotion')}}: {{student_record.date_of_entry | moment}}</p>
                                <p>{{trans('student.date_of_termination')}}:
                                    <span v-if="student_record.date_of_exit">{{student_record.date_of_exit | moment}}</span>
                                    <span v-else>-</span>
                                </p>
                                <p>{{trans('student.termination_reason')}}:
                                    <span v-if="student_record.date_of_exit">{{trans('student.termination_reason_'+student_record.termination_reason)}}</span>
                                    <span v-else>-</span>
                                </p>
                                <p>{{trans('student.termination_remarks')}}:
                                    <span v-if="student_record.date_of_exit">{{student_record.exit_remarks}}</span>
                                    <span v-else>-</span>
                                </p>
                                <div v-if="attachments.length">
                                    <ul class="m-t-10 upload-file-list">
                                        <li class="upload-file-list-item" v-for="attachment in attachments">
                                            <a :href="`/student/${student.uuid}/terminate/${student_record.id}/attachment/${attachment.uuid}/download?token=${authToken}`" class="no-link-color"><i :class="['file-icon', 'fas', 'fa-lg', attachment.file_info.icon]"></i> <span class="upload-file-list-item-size">{{attachment.file_info.size}}</span> {{attachment.user_filename}} </a>
                                        </li>
                                    </ul>
                                </div>
                                <p>
                                    <i class="far fa-clock"></i> <small>{{trans('general.created_at')}} {{student_record.created_at | momentDateTime}}</small>
                                    <span class="pull-right">
                                        <i class="far fa-clock"></i> <small>{{trans('general.updated_at')}} {{student_record.updated_at | momentDateTime}}</small>
                                    </span>
                                </p>
                                <div class="clearfix"></div>
                            </slot>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        props: {
            student: {
                type: Object,
                default() {
                    return {}
                }
            },
            readMode: {
                type: Boolean,
                default: false
            }
        },
        components: {},
        data() {
            return {
                terminationForm: new Form({
                    student_record_id: '',
                    date_of_termination: '',
                    termination_remarks: '',
                    termination_reason: '',
                    upload_token: ''
                }),
                termination_reasons: [],
                clearAttachment: false,
                module_id: '',
                student_record: {},
                showModal: false,
                attachments: []
            }
        },
        mounted(){
            this.terminationForm.upload_token = this.$uuid.v4();

            this.getPreRequisite();
        },
        methods: {
            getStudentName(student){
                return helper.getStudentName(student);
            },
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/student/pre-requisite?form_type=termination')
                    .then(response => {
                        this.termination_reasons = response.termination_reasons;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            submit(){
                let loader = this.$loading.show();
                this.terminationForm.post('/api/student/'+this.student.uuid+'/terminate/'+this.terminationForm.student_record_id)
                    .then(response => {
                        toastr.success(response.message);
                        this.clearAttachment = !this.clearAttachment;
                        this.terminationForm.upload_token = this.$uuid.v4();
                        this.$emit('completed');
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            getAdmissionNumber(admission){
                return helper.getAdmissionNumber(admission);
            },
            showTerminationDetail(student_record){
                this.student_record = student_record;
                let loader = this.$loading.show();
                axios.get('/api/student/'+this.student.uuid+'/terminate/'+this.student_record.id+'/attachment')
                    .then(response => {
                        this.attachments = response.attachments;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
                this.showModal = true;
            }
        },
        computed: {
            hasTerminationRecord(){
                return this.student.student_records.some(function(element) {
                    return element.date_of_exit;
                })
            },
            authToken(){
                return helper.getAuthToken();
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
        watch: {
        }
    }
</script>