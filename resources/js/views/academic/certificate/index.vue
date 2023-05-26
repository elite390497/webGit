<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('academic.certificate')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="certificates.total">{{trans('general.total_result_found',{count : certificates.total, from: certificates.from, to: certificates.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="hasPermission('create-certificate')" @click="$router.push('/academic/certificate/create')" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('academic.add_new_certificate')}}</span></button>
                        <button class="btn btn-info btn-sm" v-if="!showFilterPanel" @click="showFilterPanel = !showFilterPanel"><i class="fas fa-filter"></i> <span class="d-none d-sm-inline">{{trans('general.filter')}}</span></button>
                        <sort-by :order-by-options="orderByOptions" :sort-by="filter.sort_by" :order="filter.order" @updateSortBy="value => {filter.sort_by = value}"  @updateOrder="value => {filter.order = value}"></sort-by>
                        <div class="btn-group">
                            <button type="button" class="btn btn-info btn-sm dropdown-toggle no-caret " role="menu" id="moreOption" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-tooltip="trans('general.more_option')">
                                <i class="fas fa-ellipsis-h"></i> <span class="d-none d-sm-inline"></span>
                            </button>
                            <div :class="['dropdown-menu',getConfig('direction') == 'ltr' ? 'dropdown-menu-right' : '']" aria-labelledby="moreOption">
                                <button class="dropdown-item custom-dropdown" @click="print"><i class="fas fa-print"></i> {{trans('general.print')}}</button>
                                <button class="dropdown-item custom-dropdown" @click="pdf"><i class="fas fa-file-pdf"></i> {{trans('general.generate_pdf')}}</button>
                            </div>
                        </div>
                        <help-button @clicked="help_topic = 'academic.certificate'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <transition name="fade">
                <div class="card card-form" v-if="showFilterPanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('general.filter')}}</h4>
                        <div class="row">
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('academic.certificate_template')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_certificate_templates" name="certificate_template_id" id="certificate_template_id" :options="certificate_templates" :placeholder="trans('academic.select_certificate_template')" @select="onCertificateTemplateSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onCertificateTemplateRemove" :selected="selected_certificate_templates">
                                        <div class="multiselect__option" slot="afterList" v-if="!certificate_templates.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('academic.certificate_template_type')}}</label>
                                    <select v-model="filter.type" class="custom-select col-12">
                                      <option value=null selected>{{trans('general.select_one')}}</option>
                                      <option v-for="option in types" v-bind:value="option.value">
                                        {{ option.text }}
                                      </option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <date-range-picker :start-date.sync="filter.date_of_certificate_start_date" :end-date.sync="filter.date_of_certificate_end_date" :label="trans('academic.date_of_certificate_between')"></date-range-picker>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getCertificates">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="certificates.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('academic.certificate_template')}}</th>
                                    <th v-if="filter.type != 'employee'">{{trans('student.student')}}</th>
                                    <th v-if="filter.type != 'student'">{{trans('employee.employee')}}</th>
                                    <th>{{trans('academic.date_of_certificate')}}</th>
                                    <th>{{trans('general.created_at')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="certificate in certificates.data">
                                    <td v-text="certificate.certificate_template.name"></td>
                                    <td v-if="filter.type != 'employee'">
                                        <span v-if="certificate.certificate_template.type == 'student'">
                                            {{getStudentName(certificate.student_record.student)}} <br /> {{getStudentBatch(certificate.student_record)}}
                                        </span>
                                        <span v-else>
                                            -
                                        </span>
                                    </td>
                                    <td v-if="filter.type != 'student'">
                                        <span v-if="certificate.certificate_template.type == 'employee'">
                                            {{getEmployeeName(certificate.employee)}} <br /> {{getEmployeeDesignationOnDate(certificate.employee, certificate.date_of_certificate)}}
                                        </span>
                                        <span v-else>
                                            -
                                        </span>
                                    </td>
                                    <td>{{certificate.date_of_certificate | moment}}</td>
                                    <td>{{certificate.created_at | momentDateTime}}</td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <a target="_blank" :href="`/academic/certificate/${certificate.uuid}/print?token=${authToken}`" v-tooltip="trans('general.print')" class="btn btn-success btn-sm">
                                                <i class="fas fa-print"></i>
                                            </a>
                                            <button class="btn btn-info btn-sm" v-if="hasPermission('edit-certificate')" v-tooltip="trans('academic.edit_certificate')" @click.prevent="editCertificate(certificate)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" v-if="hasPermission('delete-certificate')" :key="certificate.id" v-confirm="{ok: confirmDelete(certificate)}" v-tooltip="trans('academic.delete_certificate')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!certificates.total" module="academic" title="certificate_module_title" description="certificate_module_description" icon="list"></module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="certificates" @updateRecords="getCertificates"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    export default {
        components : {},
        data() {
            return {
                certificates: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'date_of_certificate',
                    order: 'desc',
                    type: null,
                    certificate_template_id: [],
                    date_of_certificate_start_date: '',
                    date_of_certificate_end_date: '',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'date_of_certificate',
                        translation: i18n.academic.date_of_certificate
                    }
                ],
                types: [
                    {
                        text: i18n.student.student,
                        value: 'student'
                    },
                    {
                        text: i18n.employee.employee,
                        value: 'employee'
                    }
                ],
                certificate_templates: [],
                selected_certificate_templates: null,
                showFilterPanel: false,
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('list-certificate')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getCertificates();
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getEmployeeName(employee){
                return helper.getEmployeeName(employee);
            },
            getEmployeeDesignationOnDate(employee, date){
                return helper.getEmployeeDesignationOnDate(employee, date);
            },
            getStudentName(student){
                return helper.getStudentName(student);
            },
            getStudentBatch(student_record){
                return student_record.batch.course.name+' '+student_record.batch.name;
            },
            getCertificates(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                this.filter.date_of_certificate_start_date = helper.toDate(this.filter.date_of_certificate_start_date);
                this.filter.date_of_certificate_end_date = helper.toDate(this.filter.date_of_certificate_end_date);
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/certificate?page=' + page + url)
                    .then(response => {
                        this.certificates = response.certificates;
                        this.certificate_templates = response.filters.certificate_templates;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editCertificate(certificate){
                this.$router.push('/academic/certificate/'+certificate.uuid+'/edit');
            },
            confirmDelete(certificate){
                return dialog => this.deleteCertificate(certificate);
            },
            deleteCertificate(certificate){
                let loader = this.$loading.show();
                axios.delete('/api/certificate/'+certificate.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        this.getCertificates();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getConfig(config) {
                return helper.getConfig(config)
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/certificate/print',{filter: this.filter})
                    .then(response => {
                        let print = window.open("/print");
                        loader.hide();
                        print.document.write(response);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            pdf(){
                let loader = this.$loading.show();
                axios.post('/api/certificate/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onCertificateTemplateSelect(selectedOption){
                this.filter.certificate_template_id.push(selectedOption.id);
            },
            onCertificateTemplateRemove(removedOption){
                this.filter.certificate_template_id.splice(this.filter.certificate_template_id.indexOf(removedOption.id), 1);
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
            'filter.sort_by': function(val){
                this.getCertificates();
            },
            'filter.order': function(val){
                this.getCertificates();
            },
            'filter.page_length': function(val){
                this.getCertificates();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>