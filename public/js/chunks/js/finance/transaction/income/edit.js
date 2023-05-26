(self.webpackChunkInstiKit=self.webpackChunkInstiKit||[]).push([[4634],{89035:(t,e,n)=>{"use strict";n.d(e,{Z:()=>i});var a=n(94015),o=n.n(a),r=n(23645),s=n.n(r)()(o());s.push([t.id,".loading-overlay.is-full-page{z-index:1060}","",{version:3,sources:["webpack://./resources/js/views/configuration/finance/transaction/category/form.vue"],names:[],mappings:"AA0HA,8BACA,YACA",sourcesContent:['<template>\n    <form @submit.prevent="proceed" @keydown="transactionCategoryForm.errors.clear($event.target.name)">\n        <div class="row">\n            <div class="col-12 col-sm-4">\n                <div class="form-group">\n                    <label for="">{{trans(\'finance.transaction_category_name\')}}</label>\n                    <input class="form-control" type="text" v-model="transactionCategoryForm.name" name="name" :placeholder="trans(\'finance.transaction_category_name\')">\n                    <show-error :form-name="transactionCategoryForm" prop-name="name"></show-error>\n                </div>\n            </div>\n            <div class="col-12 col-sm-4">\n                <div class="form-group">\n                    <label for="">{{trans(\'finance.transaction_category_type\')}}</label>\n                    <select v-model="transactionCategoryForm.type" class="col-12 custom-select" @change="transactionCategoryForm.errors.clear(\'type\')" name="type">\n                      <option value=null selected>{{trans(\'general.select_one\')}}</option>\n                      <option v-for="type in types" v-bind:value="type.value">\n                        {{ type.text }}\n                      </option>\n                    </select>\n                    <show-error :form-name="transactionCategoryForm" prop-name="type"></show-error>\n                </div>\n            </div>\n            <div class="col-12 col-sm-4">\n                <div class="form-group">\n                    <label for="">{{trans(\'finance.transaction_category_description\')}}</label>\n                    <input class="form-control" type="text" v-model="transactionCategoryForm.description" name="description" :placeholder="trans(\'finance.transaction_category_description\')">\n                    <show-error :form-name="transactionCategoryForm" prop-name="description"></show-error>\n                </div>\n            </div>\n        </div>\n\n        <div class="card-footer text-right">\n            <button v-if="!id" type="button" class="btn btn-danger waves-effect waves-light " @click="$emit(\'cancel\')">{{trans(\'general.cancel\')}}</button>\n            <router-link to="/configuration/finance/transaction/category" class="btn btn-danger waves-effect waves-light " v-show="id">{{trans(\'general.cancel\')}}</router-link>\n            <button type="submit" class="btn btn-info waves-effect waves-light">\n                <span v-if="id">{{trans(\'general.update\')}}</span>\n                <span v-else>{{trans(\'general.save\')}}</span>\n            </button>\n        </div>\n    </form>\n</template>\n\n\n<script>\n    export default {\n        data() {\n            return {\n                transactionCategoryForm: new Form({\n                    name : \'\',\n                    type: \'\',\n                    description : \'\'\n                }),\n                types: [\n                    {\n                        text: i18n.finance.income,\n                        value: \'income\'\n                    },\n                    {\n                        text: i18n.finance.expense,\n                        value: \'expense\'\n                    }\n                ]\n            };\n        },\n        props: [\'id\'],\n        mounted() {\n            if(this.id)\n                this.get();\n        },\n        methods: {\n            proceed(){\n                if(this.id)\n                    this.update();\n                else\n                    this.store();\n            },\n            store(){\n                let loader = this.$loading.show();\n                this.transactionCategoryForm.post(\'/api/finance/transaction/category\')\n                    .then(response => {\n                        toastr.success(response.message);\n                        this.$emit(\'completed\');\n                        loader.hide();\n                    })\n                    .catch(error => {\n                        loader.hide();\n                        helper.showErrorMsg(error);\n                    });\n            },\n            get(){\n                let loader = this.$loading.show();\n                axios.get(\'/api/finance/transaction/category/\'+this.id)\n                    .then(response => {\n                        this.transactionCategoryForm.name = response.name;\n                        this.transactionCategoryForm.type = response.type;\n                        this.transactionCategoryForm.description = response.description;\n                        loader.hide();\n                    })\n                    .catch(error => {\n                        loader.hide();\n                        helper.showErrorMsg(error);\n                        this.$router.push(\'/configuration/finance/transaction/category\');\n                    });\n            },\n            update(){\n                let loader = this.$loading.show();\n                this.transactionCategoryForm.patch(\'/api/finance/transaction/category/\'+this.id)\n                    .then(response => {\n                        toastr.success(response.message);\n                        loader.hide();\n                        this.$router.push(\'/configuration/finance/transaction/category\');\n                    })\n                    .catch(error => {\n                        loader.hide();\n                        helper.showErrorMsg(error);\n                    });\n            }\n        }\n    }\n<\/script>\n\n<style>\n.loading-overlay.is-full-page{\n    z-index: 1060;\n}\n</style>\n'],sourceRoot:""}]);const i=s},14518:(t,e,n)=>{"use strict";n.d(e,{Z:()=>c});const a={data:function(){return{transactionCategoryForm:new Form({name:"",type:"",description:""}),types:[{text:i18n.finance.income,value:"income"},{text:i18n.finance.expense,value:"expense"}]}},props:["id"],mounted:function(){this.id&&this.get()},methods:{proceed:function(){this.id?this.update():this.store()},store:function(){var t=this,e=this.$loading.show();this.transactionCategoryForm.post("/api/finance/transaction/category").then((function(n){toastr.success(n.message),t.$emit("completed"),e.hide()})).catch((function(t){e.hide(),helper.showErrorMsg(t)}))},get:function(){var t=this,e=this.$loading.show();axios.get("/api/finance/transaction/category/"+this.id).then((function(n){t.transactionCategoryForm.name=n.name,t.transactionCategoryForm.type=n.type,t.transactionCategoryForm.description=n.description,e.hide()})).catch((function(n){e.hide(),helper.showErrorMsg(n),t.$router.push("/configuration/finance/transaction/category")}))},update:function(){var t=this,e=this.$loading.show();this.transactionCategoryForm.patch("/api/finance/transaction/category/"+this.id).then((function(n){toastr.success(n.message),e.hide(),t.$router.push("/configuration/finance/transaction/category")})).catch((function(t){e.hide(),helper.showErrorMsg(t)}))}}};var o=n(93379),r=n.n(o),s=n(89035),i={insert:"head",singleton:!1};r()(s.Z,i);s.Z.locals;const c=(0,n(51900).Z)(a,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("form",{on:{submit:function(e){return e.preventDefault(),t.proceed.apply(null,arguments)},keydown:function(e){return t.transactionCategoryForm.errors.clear(e.target.name)}}},[n("div",{staticClass:"row"},[n("div",{staticClass:"col-12 col-sm-4"},[n("div",{staticClass:"form-group"},[n("label",{attrs:{for:""}},[t._v(t._s(t.trans("finance.transaction_category_name")))]),t._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:t.transactionCategoryForm.name,expression:"transactionCategoryForm.name"}],staticClass:"form-control",attrs:{type:"text",name:"name",placeholder:t.trans("finance.transaction_category_name")},domProps:{value:t.transactionCategoryForm.name},on:{input:function(e){e.target.composing||t.$set(t.transactionCategoryForm,"name",e.target.value)}}}),t._v(" "),n("show-error",{attrs:{"form-name":t.transactionCategoryForm,"prop-name":"name"}})],1)]),t._v(" "),n("div",{staticClass:"col-12 col-sm-4"},[n("div",{staticClass:"form-group"},[n("label",{attrs:{for:""}},[t._v(t._s(t.trans("finance.transaction_category_type")))]),t._v(" "),n("select",{directives:[{name:"model",rawName:"v-model",value:t.transactionCategoryForm.type,expression:"transactionCategoryForm.type"}],staticClass:"col-12 custom-select",attrs:{name:"type"},on:{change:[function(e){var n=Array.prototype.filter.call(e.target.options,(function(t){return t.selected})).map((function(t){return"_value"in t?t._value:t.value}));t.$set(t.transactionCategoryForm,"type",e.target.multiple?n:n[0])},function(e){return t.transactionCategoryForm.errors.clear("type")}]}},[n("option",{attrs:{value:"null",selected:""}},[t._v(t._s(t.trans("general.select_one")))]),t._v(" "),t._l(t.types,(function(e){return n("option",{domProps:{value:e.value}},[t._v("\n                    "+t._s(e.text)+"\n                  ")])}))],2),t._v(" "),n("show-error",{attrs:{"form-name":t.transactionCategoryForm,"prop-name":"type"}})],1)]),t._v(" "),n("div",{staticClass:"col-12 col-sm-4"},[n("div",{staticClass:"form-group"},[n("label",{attrs:{for:""}},[t._v(t._s(t.trans("finance.transaction_category_description")))]),t._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:t.transactionCategoryForm.description,expression:"transactionCategoryForm.description"}],staticClass:"form-control",attrs:{type:"text",name:"description",placeholder:t.trans("finance.transaction_category_description")},domProps:{value:t.transactionCategoryForm.description},on:{input:function(e){e.target.composing||t.$set(t.transactionCategoryForm,"description",e.target.value)}}}),t._v(" "),n("show-error",{attrs:{"form-name":t.transactionCategoryForm,"prop-name":"description"}})],1)])]),t._v(" "),n("div",{staticClass:"card-footer text-right"},[t.id?t._e():n("button",{staticClass:"btn btn-danger waves-effect waves-light ",attrs:{type:"button"},on:{click:function(e){return t.$emit("cancel")}}},[t._v(t._s(t.trans("general.cancel")))]),t._v(" "),n("router-link",{directives:[{name:"show",rawName:"v-show",value:t.id,expression:"id"}],staticClass:"btn btn-danger waves-effect waves-light ",attrs:{to:"/configuration/finance/transaction/category"}},[t._v(t._s(t.trans("general.cancel")))]),t._v(" "),n("button",{staticClass:"btn btn-info waves-effect waves-light",attrs:{type:"submit"}},[t.id?n("span",[t._v(t._s(t.trans("general.update")))]):n("span",[t._v(t._s(t.trans("general.save")))])])],1)])}),[],!1,null,null,null).exports},38728:(t,e,n)=>{"use strict";n.r(e),n.d(e,{default:()=>o});const a={components:{incomeForm:n(81738).Z},data:function(){return{uuid:this.$route.params.uuid}},mounted:function(){helper.hasPermission("edit-income")||(helper.notAccessibleMsg(),this.$router.push("/dashboard"))}};const o=(0,n(51900).Z)(a,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("div",{staticClass:"page-titles"},[n("div",{staticClass:"row"},[n("div",{staticClass:"col-12 col-sm-6"},[n("h3",{staticClass:"text-themecolor"},[t._v(t._s(t.trans("finance.edit_income")))])]),t._v(" "),n("div",{staticClass:"col-12 col-sm-6"},[n("div",{staticClass:"action-buttons pull-right"},[n("button",{staticClass:"btn btn-info btn-sm",on:{click:function(e){return t.$router.push("/finance/transaction/income")}}},[n("i",{staticClass:"fas fa-list"}),t._v(" "),n("span",{staticClass:"d-none d-sm-inline"},[t._v(t._s(t.trans("finance.income")))])])])])])]),t._v(" "),n("div",{staticClass:"container-fluid"},[n("div",{staticClass:"card card-form"},[n("div",{staticClass:"card-body p-t-20"},[n("income-form",{attrs:{uuid:t.uuid}})],1)])])])}),[],!1,null,null,null).exports},81738:(t,e,n)=>{"use strict";n.d(e,{Z:()=>o});const a={components:{transactionCategoryForm:n(14518).Z},data:function(){return{incomeForm:new Form({transaction_category_id:"",account_id:"",payment_method_id:"",instrument_number:"",instrument_date:"",instrument_clearing_date:"",instrument_bank_detail:"",reference_number:"",amount:"",date_of_income:"",description:"",upload_token:""}),transaction_categories:[],selected_transaction_category:null,accounts:[],selected_account:null,payment_methods:[],selected_payment_method:null,payment_method_details:[],payment_method_detail:{},module_id:"",clearAttachment:!0,showTransactionCategoryModal:!1,default_currency:helper.getConfig("default_currency")}},props:["uuid"],mounted:function(){helper.hasPermission("create-income")||helper.hasPermission("edit-income")||(helper.notAccessibleMsg(),this.$router.push("/dashboard")),this.uuid?this.get():this.incomeForm.upload_token=this.$uuid.v4(),this.getPreRequisite()},methods:{hasPermission:function(t){return helper.hasPermission(t)},getPreRequisite:function(){var t=this,e=this.$loading.show();this.showTransactionCategoryModal=!1,axios.get("/api/income/pre-requisite").then((function(n){t.transaction_categories=n.transaction_categories,t.accounts=n.accounts,t.payment_methods=n.payment_methods,t.payment_method_details=n.payment_method_details,e.hide()})).catch((function(t){e.hide(),helper.showErrorMsg(t)}))},proceed:function(){this.uuid?this.update():this.store()},store:function(){var t=this,e=this.$loading.show();this.incomeForm.post("/api/income").then((function(n){toastr.success(n.message),t.clearAttachment=!t.clearAttachment,t.incomeForm.upload_token=t.$uuid.v4(),t.selected_transaction_category=null,t.selected_account=null,t.selected_payment_method=null,t.payment_method_detail=null,t.$emit("completed"),e.hide()})).catch((function(t){e.hide(),helper.showErrorMsg(t)}))},get:function(){var t=this,e=this.$loading.show();axios.get("/api/income/"+this.uuid).then((function(n){t.incomeForm.amount=t.formatNumber(n.income.amount),t.incomeForm.date_of_income=n.income.date_of_income,t.incomeForm.description=n.income.description,t.incomeForm.transaction_category_id=n.income.transaction_category_id,t.selected_transaction_category=n.income.transaction_category_id?{id:n.income.transaction_category_id,name:n.income.transaction_category.name}:null,t.incomeForm.account_id=n.income.transaction.account_id,t.selected_account=n.income.transaction.account_id?{id:n.income.transaction.account_id,name:n.income.transaction.account.name}:null,t.incomeForm.payment_method_id=n.income.transaction.payment_method_id,t.selected_payment_method=n.income.transaction.payment_method_id?{id:n.income.transaction.payment_method_id,name:n.income.transaction.payment_method.name}:null,t.incomeForm.instrument_number=n.income.transaction.instrument_number,t.incomeForm.instrument_date=n.income.transaction.instrument_date,t.incomeForm.instrument_clearing_date=n.income.transaction.instrument_clearing_date,t.incomeForm.instrument_bank_detail=n.income.transaction.instrument_bank_detail,t.incomeForm.reference_number=n.income.transaction.reference_number,t.incomeForm.upload_token=n.income.upload_token,t.module_id=n.income.id,e.hide()})).catch((function(n){e.hide(),helper.showErrorMsg(n),t.$router.push("/finance/transaction/income")}))},update:function(){var t=this,e=this.$loading.show();this.incomeForm.patch("/api/income/"+this.uuid).then((function(n){toastr.success(n.message),e.hide(),t.$router.push("/finance/transaction/income")})).catch((function(t){e.hide(),helper.showErrorMsg(t)}))},onTransactionCategorySelect:function(t){this.incomeForm.transaction_category_id=t.id},onAccountSelect:function(t){this.incomeForm.account_id=t.id},onPaymentMethodSelect:function(t){this.incomeForm.payment_method_id=t.id,this.payment_method_detail=this.payment_method_details.find((function(e){return e.id==t.id}))},formatCurrency:function(t){return helper.formatCurrency(t)},formatNumber:function(t){return helper.formatNumber(t,this.default_currency.decimal_place)},getPaymentMethodDetail:function(t){return helper.getPaymentMethodDetail(this.payment_method_detail,t)}}};const o=(0,n(51900).Z)(a,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("form",{on:{submit:function(e){return e.preventDefault(),t.proceed.apply(null,arguments)},keydown:function(e){return t.incomeForm.errors.clear(e.target.name)}}},[n("div",{staticClass:"row"},[n("div",{staticClass:"col-12 col-sm-3"},[n("div",{staticClass:"form-group"},[n("label",{attrs:{for:""}},[t._v(t._s(t.trans("finance.transaction_category"))+" ")]),t._v(" "),t.hasPermission("access-configuration")?n("button",{staticClass:"btn btn-xs btn-info pull-right",attrs:{type:"button"},on:{click:function(e){t.showTransactionCategoryModal=!0}}},[t._v(t._s(t.trans("general.add_new")))]):t._e(),t._v(" "),n("v-select",{attrs:{label:"name",name:"transaction_category_id",id:"transaction_category_id",options:t.transaction_categories,placeholder:t.trans("finance.select_transaction_category")},on:{select:t.onTransactionCategorySelect,close:function(e){return t.incomeForm.errors.clear("transaction_category_id")},remove:function(e){t.incomeForm.transaction_category_id=""}},model:{value:t.selected_transaction_category,callback:function(e){t.selected_transaction_category=e},expression:"selected_transaction_category"}},[t.transaction_categories.length?t._e():n("div",{staticClass:"multiselect__option",attrs:{slot:"afterList"},slot:"afterList"},[t._v("\n                                "+t._s(t.trans("general.no_option_found"))+"\n                            ")])]),t._v(" "),n("show-error",{attrs:{"form-name":t.incomeForm,"prop-name":"transaction_category_id"}})],1)]),t._v(" "),n("div",{staticClass:"col-12 col-sm-3"},[n("div",{staticClass:"form-group"},[n("label",{attrs:{for:""}},[t._v(t._s(t.trans("finance.account"))+" ")]),t._v(" "),n("v-select",{attrs:{label:"name",name:"account_id",id:"account_id",options:t.accounts,placeholder:t.trans("finance.select_account"),disabled:!!t.uuid},on:{select:t.onAccountSelect,close:function(e){return t.incomeForm.errors.clear("account_id")},remove:function(e){t.incomeForm.account_id=""}},model:{value:t.selected_account,callback:function(e){t.selected_account=e},expression:"selected_account"}},[t.accounts.length?t._e():n("div",{staticClass:"multiselect__option",attrs:{slot:"afterList"},slot:"afterList"},[t._v("\n                                "+t._s(t.trans("general.no_option_found"))+"\n                            ")])]),t._v(" "),n("show-error",{attrs:{"form-name":t.incomeForm,"prop-name":"account_id"}})],1)]),t._v(" "),n("div",{staticClass:"col-12 col-sm-3"},[n("div",{staticClass:"form-group"},[n("label",{attrs:{for:""}},[t._v(t._s(t.trans("finance.amount")))]),t._v(" "),n("currency-input",{attrs:{position:t.default_currency.position,symbol:t.default_currency.symbol,name:"amount",placeholder:t.trans("finance.amount")},nativeOn:{input:function(e){return t.incomeForm.errors.clear("amount")}},model:{value:t.incomeForm.amount,callback:function(e){t.$set(t.incomeForm,"amount",e)},expression:"incomeForm.amount"}}),t._v(" "),n("show-error",{attrs:{"form-name":t.incomeForm,"prop-name":"amount"}})],1)]),t._v(" "),n("div",{staticClass:"col-12 col-sm-3"},[n("div",{staticClass:"form-group"},[n("label",{attrs:{for:""}},[t._v(t._s(t.trans("finance.date_of_income")))]),t._v(" "),n("datepicker",{attrs:{bootstrapStyling:!0,placeholder:t.trans("finance.date_of_income")},on:{selected:function(e){return t.incomeForm.errors.clear("date_of_income")}},model:{value:t.incomeForm.date_of_income,callback:function(e){t.$set(t.incomeForm,"date_of_income",e)},expression:"incomeForm.date_of_income"}}),t._v(" "),n("show-error",{attrs:{"form-name":t.incomeForm,"prop-name":"date_of_income"}})],1)]),t._v(" "),n("div",{staticClass:"col-12 col-sm-3"},[n("div",{staticClass:"form-group"},[n("label",{attrs:{for:""}},[t._v(t._s(t.trans("finance.payment_method"))+" ")]),t._v(" "),n("v-select",{attrs:{label:"name",name:"payment_method_id",id:"payment_method_id",options:t.payment_methods,placeholder:t.trans("finance.select_payment_method")},on:{select:t.onPaymentMethodSelect,close:function(e){return t.incomeForm.errors.clear("payment_method_id")},remove:function(e){t.incomeForm.payment_method_id=""}},model:{value:t.selected_payment_method,callback:function(e){t.selected_payment_method=e},expression:"selected_payment_method"}},[t.payment_methods.length?t._e():n("div",{staticClass:"multiselect__option",attrs:{slot:"afterList"},slot:"afterList"},[t._v("\n                                "+t._s(t.trans("general.no_option_found"))+"\n                            ")])]),t._v(" "),n("show-error",{attrs:{"form-name":t.incomeForm,"prop-name":"payment_method_id"}})],1)]),t._v(" "),t.getPaymentMethodDetail("instrument_number")?n("div",{staticClass:"col-12 col-sm-3"},[n("div",{staticClass:"form-group"},[n("label",{attrs:{for:""}},[t._v(t._s(t.trans("finance.instrument_number")))]),t._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:t.incomeForm.instrument_number,expression:"incomeForm.instrument_number"}],staticClass:"form-control",attrs:{type:"text",name:"instrument_number",placeholder:t.trans("finance.instrument_number")},domProps:{value:t.incomeForm.instrument_number},on:{input:function(e){e.target.composing||t.$set(t.incomeForm,"instrument_number",e.target.value)}}}),t._v(" "),n("show-error",{attrs:{"form-name":t.incomeForm,"prop-name":"instrument_number"}})],1)]):t._e(),t._v(" "),t.getPaymentMethodDetail("instrument_date")?n("div",{staticClass:"col-12 col-sm-3"},[n("div",{staticClass:"form-group"},[n("label",{attrs:{for:""}},[t._v(t._s(t.trans("finance.instrument_date")))]),t._v(" "),n("datepicker",{attrs:{bootstrapStyling:!0,placeholder:t.trans("finance.instrument_date")},on:{selected:function(e){return t.incomeForm.errors.clear("instrument_date")}},model:{value:t.incomeForm.instrument_date,callback:function(e){t.$set(t.incomeForm,"instrument_date",e)},expression:"incomeForm.instrument_date"}}),t._v(" "),n("show-error",{attrs:{"form-name":t.incomeForm,"prop-name":"instrument_date"}})],1)]):t._e(),t._v(" "),t.getPaymentMethodDetail("instrument_bank_detail")?n("div",{staticClass:"col-12 col-sm-3"},[n("div",{staticClass:"form-group"},[n("label",{attrs:{for:""}},[t._v(t._s(t.trans("finance.instrument_bank_detail")))]),t._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:t.incomeForm.instrument_bank_detail,expression:"incomeForm.instrument_bank_detail"}],staticClass:"form-control",attrs:{type:"text",name:"instrument_bank_detail",placeholder:t.trans("finance.instrument_bank_detail")},domProps:{value:t.incomeForm.instrument_bank_detail},on:{input:function(e){e.target.composing||t.$set(t.incomeForm,"instrument_bank_detail",e.target.value)}}}),t._v(" "),n("show-error",{attrs:{"form-name":t.incomeForm,"prop-name":"instrument_bank_detail"}})],1)]):t._e(),t._v(" "),t.getPaymentMethodDetail("instrument_clearing_date")?n("div",{staticClass:"col-12 col-sm-3"},[n("div",{staticClass:"form-group"},[n("label",{attrs:{for:""}},[t._v(t._s(t.trans("finance.instrument_clearing_date")))]),t._v(" "),n("datepicker",{attrs:{bootstrapStyling:!0,placeholder:t.trans("finance.instrument_clearing_date")},on:{selected:function(e){return t.incomeForm.errors.clear("instrument_clearing_date")}},model:{value:t.incomeForm.instrument_clearing_date,callback:function(e){t.$set(t.incomeForm,"instrument_clearing_date",e)},expression:"incomeForm.instrument_clearing_date"}}),t._v(" "),n("show-error",{attrs:{"form-name":t.incomeForm,"prop-name":"instrument_clearing_date"}})],1)]):t._e(),t._v(" "),t.getPaymentMethodDetail("reference_number")?n("div",{staticClass:"col-12 col-sm-3"},[n("div",{staticClass:"form-group"},[n("label",{attrs:{for:""}},[t._v(t._s(t.trans("finance.reference_number")))]),t._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:t.incomeForm.reference_number,expression:"incomeForm.reference_number"}],staticClass:"form-control",attrs:{type:"text",name:"reference_number",placeholder:t.trans("finance.reference_number")},domProps:{value:t.incomeForm.reference_number},on:{input:function(e){e.target.composing||t.$set(t.incomeForm,"reference_number",e.target.value)}}}),t._v(" "),n("show-error",{attrs:{"form-name":t.incomeForm,"prop-name":"reference_number"}})],1)]):t._e(),t._v(" "),n("div",{staticClass:"col-12 col-sm-9"},[n("div",{staticClass:"form-group"},[n("label",{attrs:{for:""}},[t._v(t._s(t.trans("finance.income_description")))]),t._v(" "),n("autosize-textarea",{attrs:{rows:"1",name:"description",placeholder:t.trans("finance.income_description")},model:{value:t.incomeForm.description,callback:function(e){t.$set(t.incomeForm,"description",e)},expression:"incomeForm.description"}}),t._v(" "),n("show-error",{attrs:{"form-name":t.incomeForm,"prop-name":"description"}})],1)]),t._v(" "),n("div",{staticClass:"col-12"},[n("div",{staticClass:"form-group"},[n("file-upload-input",{attrs:{"button-text":t.trans("general.upload_document"),token:t.incomeForm.upload_token,module:"income","clear-file":t.clearAttachment,"module-id":t.module_id}})],1)])]),t._v(" "),n("div",{staticClass:"card-footer text-right"},[n("router-link",{directives:[{name:"show",rawName:"v-show",value:t.uuid,expression:"uuid"}],staticClass:"btn btn-danger waves-effect waves-light ",attrs:{to:"/finance/transaction/income"}},[t._v(t._s(t.trans("general.cancel")))]),t._v(" "),t.uuid?t._e():n("button",{staticClass:"btn btn-danger waves-effect waves-light ",attrs:{type:"button"},on:{click:function(e){return t.$emit("cancel")}}},[t._v(t._s(t.trans("general.cancel")))]),t._v(" "),n("button",{staticClass:"btn btn-info waves-effect waves-light",attrs:{type:"submit"}},[t.uuid?n("span",[t._v(t._s(t.trans("general.update")))]):n("span",[t._v(t._s(t.trans("general.save")))])])],1)]),t._v(" "),t.showTransactionCategoryModal?n("transition",{attrs:{name:"modal"}},[n("div",{staticClass:"modal-mask"},[n("div",{staticClass:"modal-wrapper"},[n("div",{staticClass:"modal-container modal-lg"},[n("div",{staticClass:"modal-header"},[t._t("header",(function(){return[t._v("\n                                "+t._s(t.trans("finance.add_new_transaction_category"))+"\n                                "),n("span",{staticClass:"float-right pointer",on:{click:function(e){t.showTransactionCategoryModal=!1}}},[t._v("x")])]}))],2),t._v(" "),n("div",{staticClass:"modal-body"},[t._t("body",(function(){return[n("transaction-category-form",{on:{completed:t.getPreRequisite,cancel:function(e){t.showTransactionCategoryModal=!1}}}),t._v(" "),n("div",{staticClass:"clearfix"})]}))],2)])])])]):t._e()],1)}),[],!1,null,null,null).exports}}]);
//# sourceMappingURL=edit.js.map?id=6e1e81a654e7ed46bdd0