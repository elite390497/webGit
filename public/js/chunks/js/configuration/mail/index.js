(self.webpackChunkInstiKit=self.webpackChunkInstiKit||[]).push([[7123],{26369:(o,t,r)=>{"use strict";r.d(t,{Z:()=>a});const s={props:{setupWizard:{default:!1},configurations:{required:!1}},components:{},data:function(){return{configForm:new Form({driver:"",from_name:"",from_address:"",smtp_host:"",smtp_port:"",smtp_username:"",smtp_password:"",smtp_encryption:"",mailgun_host:"",mailgun_port:"",mailgun_username:"",mailgun_password:"",mailgun_encryption:"",mailgun_domain:"",mailgun_secret:"",mandrill_secret:"",config_type:""},!1),mail_drivers:[],encryptions:[{text:"SSL",value:"ssl"},{text:"TLS",value:"tls"}]}},mounted:function(){helper.hasPermission("access-configuration")||(helper.notAccessibleMsg(),this.$router.push("/dashboard")),this.getPreRequisite(),this.setupWizard||this.getConfiguration()},methods:{getPreRequisite:function(){var o=this,t=this.$loading.show();axios.get("/api/configuration/variable?type=mail").then((function(r){o.mail_drivers=r.mail_drivers,t.hide()})).catch((function(o){t.hide(),helper.showErrorMsg(o)}))},getConfiguration:function(){var o=this,t=this.$loading.show();axios.get("/api/configuration").then((function(r){o.configForm=helper.formAssign(o.configForm,r),t.hide()})).catch((function(o){t.hide(),helper.showErrorMsg(o)}))},submit:function(){var o=this,t=this.$loading.show();return this.configForm.config_type="mail",this.configForm.post("/api/configuration").then((function(r){return o.$store.dispatch("setConfig",{loaded:!1}),toastr.success(r.message),t.hide(),!0})).catch((function(o){return t.hide(),helper.showErrorMsg(o),!1}))}},watch:{configurations:function(o){o&&helper.formAssign(this.configForm,o)}}};const a=(0,r(51900).Z)(s,(function(){var o=this,t=o.$createElement,r=o._self._c||t;return r("div",{staticClass:"row"},[r("div",{staticClass:"col-12"},[r("div",{staticClass:"card"},[r("div",{staticClass:"card-body p-4"},[r("form",{on:{submit:function(t){return t.preventDefault(),o.submit.apply(null,arguments)},keydown:function(t){return o.configForm.errors.clear(t.target.name)}}},[r("div",{staticClass:"row"},[r("div",{staticClass:"col-12 col-sm-4"},[r("div",{staticClass:"form-group"},[r("label",{attrs:{for:""}},[o._v(o._s(o.trans("configuration.mail_driver")))]),o._v(" "),r("select",{directives:[{name:"model",rawName:"v-model",value:o.configForm.driver,expression:"configForm.driver"}],staticClass:"custom-select col-12",attrs:{name:"driver"},on:{change:[function(t){var r=Array.prototype.filter.call(t.target.options,(function(o){return o.selected})).map((function(o){return"_value"in o?o._value:o.value}));o.$set(o.configForm,"driver",t.target.multiple?r:r[0])},function(t){return o.configForm.errors.clear("driver")}]}},o._l(o.mail_drivers,(function(t){return r("option",{domProps:{value:t.value}},[o._v("\n                                    "+o._s(t.text)+"\n                                  ")])})),0),o._v(" "),r("show-error",{attrs:{"form-name":o.configForm,"prop-name":"driver"}})],1),o._v(" "),r("div",{staticClass:"row"},[r("div",{staticClass:"col-12 col-sm-6"},[r("div",{staticClass:"form-group"},[r("label",{attrs:{for:""}},[o._v(o._s(o.trans("configuration.mail_from_name")))]),o._v(" "),r("input",{directives:[{name:"model",rawName:"v-model",value:o.configForm.from_name,expression:"configForm.from_name"}],staticClass:"form-control",attrs:{type:"text",name:"from_name",placeholder:o.trans("configuration.mail_from_name")},domProps:{value:o.configForm.from_name},on:{input:function(t){t.target.composing||o.$set(o.configForm,"from_name",t.target.value)}}}),o._v(" "),r("show-error",{attrs:{"form-name":o.configForm,"prop-name":"from_name"}})],1)]),o._v(" "),r("div",{staticClass:"col-12 col-sm-6"},[r("div",{staticClass:"form-group"},[r("label",{attrs:{for:""}},[o._v(o._s(o.trans("configuration.mail_from_address")))]),o._v(" "),r("input",{directives:[{name:"model",rawName:"v-model",value:o.configForm.from_address,expression:"configForm.from_address"}],staticClass:"form-control",attrs:{type:"text",name:"from_address",placeholder:o.trans("configuration.mail_from_address")},domProps:{value:o.configForm.from_address},on:{input:function(t){t.target.composing||o.$set(o.configForm,"from_address",t.target.value)}}}),o._v(" "),r("show-error",{attrs:{"form-name":o.configForm,"prop-name":"from_address"}})],1)])]),o._v(" "),o.setupWizard?o._e():r("button",{staticClass:"btn btn-info waves-effect waves-light m-t-10",attrs:{type:"submit"}},[o._v(o._s(o.trans("general.save")))])]),o._v(" "),r("div",{staticClass:"col-12 col-sm-8"},["mailgun"===o.configForm.driver?r("div",[r("div",{staticClass:"row"},[r("div",{staticClass:"col-12 col-sm-6"},[r("div",{staticClass:"form-group"},[r("label",{attrs:{for:""}},[o._v(o._s(o.trans("configuration.mailgun_domain")))]),o._v(" "),r("input",{directives:[{name:"model",rawName:"v-model",value:o.configForm.mailgun_domain,expression:"configForm.mailgun_domain"}],staticClass:"form-control",attrs:{type:"text",name:"mailgun_domain",placeholder:o.trans("configuration.mailgun_domain")},domProps:{value:o.configForm.mailgun_domain},on:{input:function(t){t.target.composing||o.$set(o.configForm,"mailgun_domain",t.target.value)}}}),o._v(" "),r("show-error",{attrs:{"form-name":o.configForm,"prop-name":"mailgun_domain"}})],1)]),o._v(" "),r("div",{staticClass:"col-12 col-sm-6"},[r("div",{staticClass:"form-group"},[r("label",{attrs:{for:""}},[o._v(o._s(o.trans("configuration.mailgun_secret")))]),o._v(" "),r("input",{directives:[{name:"model",rawName:"v-model",value:o.configForm.mailgun_secret,expression:"configForm.mailgun_secret"}],staticClass:"form-control",attrs:{type:"text",name:"mailgun_secret",placeholder:o.trans("configuration.mailgun_secret")},domProps:{value:o.configForm.mailgun_secret},on:{input:function(t){t.target.composing||o.$set(o.configForm,"mailgun_secret",t.target.value)}}}),o._v(" "),r("show-error",{attrs:{"form-name":o.configForm,"prop-name":"mailgun_secret"}})],1)])])]):o._e(),o._v(" "),"mandrill"===o.configForm.driver?r("div",[r("div",{staticClass:"row"},[r("div",{staticClass:"col-12 col-sm-6"},[r("div",{staticClass:"form-group"},[r("label",{attrs:{for:""}},[o._v(o._s(o.trans("configuration.mandrill_secret")))]),o._v(" "),r("input",{directives:[{name:"model",rawName:"v-model",value:o.configForm.mandrill_secret,expression:"configForm.mandrill_secret"}],staticClass:"form-control",attrs:{type:"text",name:"mandrill_secret",placeholder:o.trans("configuration.mandrill_secret")},domProps:{value:o.configForm.mandrill_secret},on:{input:function(t){t.target.composing||o.$set(o.configForm,"mandrill_secret",t.target.value)}}}),o._v(" "),r("show-error",{attrs:{"form-name":o.configForm,"prop-name":"mandrill_secret"}})],1)])])]):o._e(),o._v(" "),"smtp"===o.configForm.driver?r("div",[r("div",{staticClass:"row"},[r("div",{staticClass:"col-12 col-sm-6"},[r("div",{staticClass:"form-group"},[r("label",{attrs:{for:""}},[o._v(o._s(o.trans("configuration.smtp_host")))]),o._v(" "),r("input",{directives:[{name:"model",rawName:"v-model",value:o.configForm.smtp_host,expression:"configForm.smtp_host"}],staticClass:"form-control",attrs:{type:"text",name:"smtp_host",placeholder:o.trans("configuration.smtp_host")},domProps:{value:o.configForm.smtp_host},on:{input:function(t){t.target.composing||o.$set(o.configForm,"smtp_host",t.target.value)}}}),o._v(" "),r("show-error",{attrs:{"form-name":o.configForm,"prop-name":"smtp_host"}})],1)]),o._v(" "),r("div",{staticClass:"col-12 col-sm-6"},[r("div",{staticClass:"form-group"},[r("label",{attrs:{for:""}},[o._v(o._s(o.trans("configuration.smtp_port")))]),o._v(" "),r("input",{directives:[{name:"model",rawName:"v-model",value:o.configForm.smtp_port,expression:"configForm.smtp_port"}],staticClass:"form-control",attrs:{type:"text",name:"smtp_port",placeholder:o.trans("configuration.smtp_port")},domProps:{value:o.configForm.smtp_port},on:{input:function(t){t.target.composing||o.$set(o.configForm,"smtp_port",t.target.value)}}}),o._v(" "),r("show-error",{attrs:{"form-name":o.configForm,"prop-name":"smtp_port"}})],1)]),o._v(" "),r("div",{staticClass:"col-12 col-sm-6"},[r("div",{staticClass:"form-group"},[r("label",{attrs:{for:""}},[o._v(o._s(o.trans("configuration.smtp_username")))]),o._v(" "),r("input",{directives:[{name:"model",rawName:"v-model",value:o.configForm.smtp_username,expression:"configForm.smtp_username"}],staticClass:"form-control",attrs:{type:"text",name:"smtp_username",placeholder:o.trans("configuration.smtp_username")},domProps:{value:o.configForm.smtp_username},on:{input:function(t){t.target.composing||o.$set(o.configForm,"smtp_username",t.target.value)}}}),o._v(" "),r("show-error",{attrs:{"form-name":o.configForm,"prop-name":"smtp_username"}})],1)]),o._v(" "),r("div",{staticClass:"col-12 col-sm-6"},[r("div",{staticClass:"form-group"},[r("label",{attrs:{for:""}},[o._v(o._s(o.trans("configuration.smtp_password")))]),o._v(" "),r("input",{directives:[{name:"model",rawName:"v-model",value:o.configForm.smtp_password,expression:"configForm.smtp_password"}],staticClass:"form-control",attrs:{type:"text",name:"smtp_password",placeholder:o.trans("configuration.smtp_password")},domProps:{value:o.configForm.smtp_password},on:{input:function(t){t.target.composing||o.$set(o.configForm,"smtp_password",t.target.value)}}}),o._v(" "),r("show-error",{attrs:{"form-name":o.configForm,"prop-name":"smtp_password"}})],1)]),o._v(" "),r("div",{staticClass:"col-12 col-sm-6"},[r("div",{staticClass:"form-group"},[r("label",{attrs:{for:""}},[o._v(o._s(o.trans("configuration.smtp_encryption")))]),o._v(" "),r("select",{directives:[{name:"model",rawName:"v-model",value:o.configForm.smtp_encryption,expression:"configForm.smtp_encryption"}],staticClass:"custom-select col-12",attrs:{name:"smtp_encryption"},on:{change:[function(t){var r=Array.prototype.filter.call(t.target.options,(function(o){return o.selected})).map((function(o){return"_value"in o?o._value:o.value}));o.$set(o.configForm,"smtp_encryption",t.target.multiple?r:r[0])},function(t){return o.configForm.errors.clear("smtp_encryption")}]}},[r("option",{attrs:{value:"null",selected:""}},[o._v(o._s(o.trans("general.select_one")))]),o._v(" "),o._l(o.encryptions,(function(t){return r("option",{domProps:{value:t.value}},[o._v("\n                                                "+o._s(t.text)+"\n                                              ")])}))],2),o._v(" "),r("show-error",{attrs:{"form-name":o.configForm,"prop-name":"smtp_encryption"}})],1)])])]):o._e(),o._v(" "),"mailgun"===o.configForm.driver?r("div",[r("div",{staticClass:"row"},[r("div",{staticClass:"col-12 col-sm-6"},[r("div",{staticClass:"form-group"},[r("label",{attrs:{for:""}},[o._v(o._s(o.trans("configuration.mailgun_host")))]),o._v(" "),r("input",{directives:[{name:"model",rawName:"v-model",value:o.configForm.mailgun_host,expression:"configForm.mailgun_host"}],staticClass:"form-control",attrs:{type:"text",name:"mailgun_host",placeholder:o.trans("configuration.mailgun_host")},domProps:{value:o.configForm.mailgun_host},on:{input:function(t){t.target.composing||o.$set(o.configForm,"mailgun_host",t.target.value)}}}),o._v(" "),r("show-error",{attrs:{"form-name":o.configForm,"prop-name":"mailgun_host"}})],1)]),o._v(" "),r("div",{staticClass:"col-12 col-sm-6"},[r("div",{staticClass:"form-group"},[r("label",{attrs:{for:""}},[o._v(o._s(o.trans("configuration.mailgun_port")))]),o._v(" "),r("input",{directives:[{name:"model",rawName:"v-model",value:o.configForm.mailgun_port,expression:"configForm.mailgun_port"}],staticClass:"form-control",attrs:{type:"text",name:"mailgun_port",placeholder:o.trans("configuration.mailgun_port")},domProps:{value:o.configForm.mailgun_port},on:{input:function(t){t.target.composing||o.$set(o.configForm,"mailgun_port",t.target.value)}}}),o._v(" "),r("show-error",{attrs:{"form-name":o.configForm,"prop-name":"mailgun_port"}})],1)]),o._v(" "),r("div",{staticClass:"col-12 col-sm-6"},[r("div",{staticClass:"form-group"},[r("label",{attrs:{for:""}},[o._v(o._s(o.trans("configuration.mailgun_username")))]),o._v(" "),r("input",{directives:[{name:"model",rawName:"v-model",value:o.configForm.mailgun_username,expression:"configForm.mailgun_username"}],staticClass:"form-control",attrs:{type:"text",name:"mailgun_username",placeholder:o.trans("configuration.mailgun_username")},domProps:{value:o.configForm.mailgun_username},on:{input:function(t){t.target.composing||o.$set(o.configForm,"mailgun_username",t.target.value)}}}),o._v(" "),r("show-error",{attrs:{"form-name":o.configForm,"prop-name":"mailgun_username"}})],1)]),o._v(" "),r("div",{staticClass:"col-12 col-sm-6"},[r("div",{staticClass:"form-group"},[r("label",{attrs:{for:""}},[o._v(o._s(o.trans("configuration.mailgun_password")))]),o._v(" "),r("input",{directives:[{name:"model",rawName:"v-model",value:o.configForm.mailgun_password,expression:"configForm.mailgun_password"}],staticClass:"form-control",attrs:{type:"text",name:"mailgun_password",placeholder:o.trans("configuration.mailgun_password")},domProps:{value:o.configForm.mailgun_password},on:{input:function(t){t.target.composing||o.$set(o.configForm,"mailgun_password",t.target.value)}}}),o._v(" "),r("show-error",{attrs:{"form-name":o.configForm,"prop-name":"mailgun_password"}})],1)]),o._v(" "),r("div",{staticClass:"col-12 col-sm-6"},[r("div",{staticClass:"form-group"},[r("label",{attrs:{for:""}},[o._v(o._s(o.trans("configuration.mailgun_encryption")))]),o._v(" "),r("select",{directives:[{name:"model",rawName:"v-model",value:o.configForm.smtp_encryption,expression:"configForm.smtp_encryption"}],staticClass:"custom-select col-12",attrs:{name:"smtp_encryption"},on:{change:[function(t){var r=Array.prototype.filter.call(t.target.options,(function(o){return o.selected})).map((function(o){return"_value"in o?o._value:o.value}));o.$set(o.configForm,"smtp_encryption",t.target.multiple?r:r[0])},function(t){return o.configForm.errors.clear("smtp_encryption")}]}},[r("option",{attrs:{value:"null",selected:""}},[o._v(o._s(o.trans("general.select_one")))]),o._v(" "),o._l(o.encryptions,(function(t){return r("option",{domProps:{value:t.value}},[o._v("\n                                                "+o._s(t.text)+"\n                                              ")])}))],2),o._v(" "),r("show-error",{attrs:{"form-name":o.configForm,"prop-name":"mailgun_encryption"}})],1)])])]):o._e()])])])])])])])}),[],!1,null,null,null).exports},2486:(o,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>a});const s={components:{mailForm:r(26369).Z},data:function(){return{help_topic:""}}};const a=(0,r(51900).Z)(s,(function(){var o=this,t=o.$createElement,r=o._self._c||t;return r("div",[r("div",{staticClass:"page-titles"},[r("div",{staticClass:"row"},[r("div",{staticClass:"col-12 col-sm-6"},[r("h3",{staticClass:"text-themecolor"},[o._v(o._s(o.trans("configuration.mail_configuration")))])]),o._v(" "),r("div",{staticClass:"col-12 col-sm-6"},[r("div",{staticClass:"action-buttons pull-right"},[r("button",{staticClass:"btn btn-info btn-sm",on:{click:function(t){return o.$router.push("/dashboard")}}},[r("i",{staticClass:"fas fa-home"}),o._v(" "),r("span",{staticClass:"d-none d-sm-inline"},[o._v(o._s(o.trans("general.home")))])]),o._v(" "),r("help-button",{on:{clicked:function(t){o.help_topic="configuration.mail"}}})],1)])])]),o._v(" "),r("div",{staticClass:"container-fluid"},[r("mail-form")],1),o._v(" "),r("right-panel",{attrs:{topic:o.help_topic}})],1)}),[],!1,null,null,null).exports}}]);
//# sourceMappingURL=index.js.map?id=2f7c7aebe9db5a7aa45f