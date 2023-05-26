(self.webpackChunkInstiKit=self.webpackChunkInstiKit||[]).push([[2884],{93849:(t,e,o)=>{"use strict";o.d(e,{Z:()=>a});const s={components:{},props:["id"],data:function(){return{stockCategoryForm:new Form({name:"",description:""})}},mounted:function(){this.id&&this.getStockCategory()},methods:{proceed:function(){this.id?this.updateStockCategory():this.storeStockCategory()},storeStockCategory:function(){var t=this,e=this.$loading.show();this.stockCategoryForm.post("/api/stock/category").then((function(o){toastr.success(o.message),t.$emit("completed"),e.hide()})).catch((function(t){e.hide(),helper.showErrorMsg(t)}))},getStockCategory:function(){var t=this,e=this.$loading.show();axios.get("/api/stock/category/"+this.id).then((function(o){t.stockCategoryForm.name=o.name,t.stockCategoryForm.description=o.description,e.hide()})).catch((function(o){e.hide(),t.$router.push("/inventory/stock/category")}))},updateStockCategory:function(){var t=this,e=this.$loading.show();this.stockCategoryForm.patch("/api/stock/category/"+this.id).then((function(o){toastr.success(o.message),t.$emit("completed"),e.hide(),t.$router.push("/inventory/stock/category")})).catch((function(t){e.hide(),helper.showErrorMsg(t)}))}}};const a=(0,o(51900).Z)(s,(function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",[o("form",{on:{submit:function(e){return e.preventDefault(),t.proceed.apply(null,arguments)},keydown:function(e){return t.stockCategoryForm.errors.clear(e.target.name)}}},[o("div",{staticClass:"row"},[o("div",{staticClass:"col-12 col-sm-6"},[o("div",{staticClass:"form-group"},[o("label",{attrs:{for:""}},[t._v(t._s(t.trans("inventory.stock_category_name")))]),t._v(" "),o("input",{directives:[{name:"model",rawName:"v-model",value:t.stockCategoryForm.name,expression:"stockCategoryForm.name"}],staticClass:"form-control",attrs:{type:"text",name:"name",placeholder:t.trans("inventory.stock_category_name")},domProps:{value:t.stockCategoryForm.name},on:{input:function(e){e.target.composing||t.$set(t.stockCategoryForm,"name",e.target.value)}}}),t._v(" "),o("show-error",{attrs:{"form-name":t.stockCategoryForm,"prop-name":"name"}})],1)]),t._v(" "),o("div",{staticClass:"col-12 col-sm-6"},[o("div",{staticClass:"form-group"},[o("label",{attrs:{for:""}},[t._v(t._s(t.trans("inventory.stock_category_description")))]),t._v(" "),o("autosize-textarea",{attrs:{rows:"2",name:"description",placeholder:t.trans("stock.stock_category_description")},model:{value:t.stockCategoryForm.description,callback:function(e){t.$set(t.stockCategoryForm,"description",e)},expression:"stockCategoryForm.description"}}),t._v(" "),o("show-error",{attrs:{"form-name":t.stockCategoryForm,"prop-name":"description"}})],1)])]),t._v(" "),o("div",{staticClass:"card-footer text-right"},[o("router-link",{directives:[{name:"show",rawName:"v-show",value:t.id,expression:"id"}],staticClass:"btn btn-danger waves-effect waves-light ",attrs:{to:"/inventory/stock/category"}},[t._v(t._s(t.trans("general.cancel")))]),t._v(" "),t.id?t._e():o("button",{staticClass:"btn btn-danger waves-effect waves-light ",attrs:{type:"button"},on:{click:function(e){return t.$emit("cancel")}}},[t._v(t._s(t.trans("general.cancel")))]),t._v(" "),o("button",{staticClass:"btn btn-info waves-effect waves-light",attrs:{type:"submit"}},[t.id?o("span",[t._v(t._s(t.trans("general.update")))]):o("span",[t._v(t._s(t.trans("general.save")))])])],1)])])}),[],!1,null,null,null).exports},80065:(t,e,o)=>{"use strict";o.r(e),o.d(e,{default:()=>a});const s={components:{stockCategoryForm:o(93849).Z},data:function(){return{stock_categories:{total:0,data:[]},filter:{sort_by:"name",order:"desc",page_length:helper.getConfig("page_length")},orderByOptions:[{value:"name",translation:i18n.inventory.stock_category_name},{value:"created_at",translation:i18n.general.created_at}],showFilterPanel:!1,showCreatePanel:!1,help_topic:""}},mounted:function(){helper.hasPermission("list-stock-category")&&helper.hasPermission("create-stock-category")||(helper.notAccessibleMsg(),this.$router.push("/dashboard")),helper.hasPermission("list-stock-category")&&this.getStockCategories(),helper.showDemoNotification(["inventory"])},methods:{getConfig:function(t){return helper.getConfig(t)},hasPermission:function(t){return helper.hasPermission(t)},getStockCategories:function(t){var e=this,o=this.$loading.show();"number"!=typeof t&&(t=1);var s=helper.getFilterURL(this.filter);axios.get("/api/stock/category?page="+t+s).then((function(t){e.stock_categories=t,o.hide()})).catch((function(t){o.hide(),helper.showErrorMsg(t)}))},editStockCategory:function(t){this.$router.push("/inventory/stock/category/"+t.id+"/edit")},confirmDelete:function(t){var e=this;return function(o){return e.deleteStockCategory(t)}},deleteStockCategory:function(t){var e=this,o=this.$loading.show();axios.delete("/api/stock/category/"+t.id).then((function(t){toastr.success(t.message),e.getStockCategories(),o.hide()})).catch((function(t){o.hide(),helper.showErrorMsg(t)}))},print:function(){var t=this.$loading.show();axios.post("/api/stock/category/print",{filter:this.filter}).then((function(e){var o=window.open("/print");t.hide(),o.document.write(e)})).catch((function(e){t.hide(),helper.showErrorMsg(e)}))},pdf:function(){var t=this,e=this.$loading.show();axios.post("/api/stock/category/pdf",{filter:this.filter}).then((function(o){e.hide(),window.open("/download/report/"+o+"?token="+t.authToken)})).catch((function(t){e.hide(),helper.showErrorMsg(t)}))}},filters:{moment:function(t){return helper.formatDate(t)},momentDateTime:function(t){return helper.formatDateTime(t)}},watch:{"filter.sort_by":function(t){this.getStockCategories()},"filter.order":function(t){this.getStockCategories()},"filter.page_length":function(t){this.getStockCategories()}},computed:{authToken:function(){return helper.getAuthToken()}}};const a=(0,o(51900).Z)(s,(function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",[o("div",{staticClass:"page-titles"},[o("div",{staticClass:"row"},[o("div",{staticClass:"col-12 col-sm-6"},[o("h3",{staticClass:"text-themecolor"},[t._v(t._s(t.trans("inventory.stock_category"))+" \n                    "),t.stock_categories.total?o("span",{staticClass:"card-subtitle d-none d-sm-inline"},[t._v(t._s(t.trans("general.total_result_found",{count:t.stock_categories.total,from:t.stock_categories.from,to:t.stock_categories.to})))]):o("span",{staticClass:"card-subtitle d-none d-sm-inline"},[t._v(t._s(t.trans("general.no_result_found")))])])]),t._v(" "),o("div",{staticClass:"col-12 col-sm-6"},[o("div",{staticClass:"action-buttons pull-right"},[t.stock_categories.total&&!t.showCreatePanel&&t.hasPermission("create-stock-category")?o("button",{directives:[{name:"tooltip",rawName:"v-tooltip",value:t.trans("general.add_new"),expression:"trans('general.add_new')"}],staticClass:"btn btn-info btn-sm",on:{click:function(e){t.showCreatePanel=!t.showCreatePanel}}},[o("i",{staticClass:"fas fa-plus"}),t._v(" "),o("span",{staticClass:"d-none d-sm-inline"},[t._v(t._s(t.trans("inventory.add_new_stock_category")))])]):t._e(),t._v(" "),t.showFilterPanel?t._e():o("button",{staticClass:"btn btn-info btn-sm",on:{click:function(e){t.showFilterPanel=!t.showFilterPanel}}},[o("i",{staticClass:"fas fa-filter"}),t._v(" "),o("span",{staticClass:"d-none d-sm-inline"},[t._v(t._s(t.trans("general.filter")))])]),t._v(" "),o("sort-by",{attrs:{"order-by-options":t.orderByOptions,"sort-by":t.filter.sort_by,order:t.filter.order},on:{updateSortBy:function(e){t.filter.sort_by=e},updateOrder:function(e){t.filter.order=e}}}),t._v(" "),o("div",{staticClass:"btn-group"},[o("button",{directives:[{name:"tooltip",rawName:"v-tooltip",value:t.trans("general.more_option"),expression:"trans('general.more_option')"}],staticClass:"btn btn-info btn-sm dropdown-toggle no-caret ",attrs:{type:"button",role:"menu",id:"moreOption","data-toggle":"dropdown","aria-haspopup":"true","aria-expanded":"false"}},[o("i",{staticClass:"fas fa-ellipsis-h"}),t._v(" "),o("span",{staticClass:"d-none d-sm-inline"})]),t._v(" "),o("div",{class:["dropdown-menu","ltr"==t.getConfig("direction")?"dropdown-menu-right":""],attrs:{"aria-labelledby":"moreOption"}},[o("button",{staticClass:"dropdown-item custom-dropdown",on:{click:t.print}},[o("i",{staticClass:"fas fa-print"}),t._v(" "+t._s(t.trans("general.print")))]),t._v(" "),o("button",{staticClass:"dropdown-item custom-dropdown",on:{click:t.pdf}},[o("i",{staticClass:"fas fa-file-pdf"}),t._v(" "+t._s(t.trans("general.generate_pdf")))])])]),t._v(" "),o("help-button",{on:{clicked:function(e){t.help_topic="inventory.stock.category"}}})],1)])])]),t._v(" "),o("div",{staticClass:"container-fluid"},[o("transition",{attrs:{name:"fade"}},[t.showFilterPanel?o("div",{staticClass:"card card-form"},[o("div",{staticClass:"card-body"},[o("h4",{staticClass:"card-title"},[t._v(t._s(t.trans("general.filter")))]),t._v(" "),o("div",{staticClass:"row"},[o("div",{staticClass:"col-12 col-sm-2"},[o("div",{staticClass:"form-group"},[o("label",{attrs:{for:""}},[t._v(t._s(t.trans("inventory.stock_category_name")))]),t._v(" "),o("input",{directives:[{name:"model",rawName:"v-model",value:t.filter.name,expression:"filter.name"}],staticClass:"form-control",attrs:{name:"name"},domProps:{value:t.filter.name},on:{input:function(e){e.target.composing||t.$set(t.filter,"name",e.target.value)}}})])])]),t._v(" "),o("div",{staticClass:"card-footer text-right"},[o("button",{staticClass:"btn btn-danger",attrs:{type:"button"},on:{click:function(e){t.showFilterPanel=!1}}},[t._v(t._s(t.trans("general.cancel")))]),t._v(" "),o("button",{staticClass:"btn btn-info waves-effect waves-light",attrs:{type:"button"},on:{click:t.getStockCategories}},[t._v(t._s(t.trans("general.filter")))])])])]):t._e()]),t._v(" "),t.hasPermission("create-stock-category")?o("transition",{attrs:{name:"fade"}},[t.showCreatePanel?o("div",{staticClass:"card card-form"},[o("div",{staticClass:"card-body"},[o("h4",{staticClass:"card-title"},[t._v(t._s(t.trans("inventory.add_new_stock_category")))]),t._v(" "),o("stock-category-form",{on:{completed:t.getStockCategories,cancel:function(e){t.showCreatePanel=!t.showCreatePanel}}})],1)]):t._e()]):t._e(),t._v(" "),o("div",{staticClass:"card"},[o("div",{staticClass:"card-body"},[t.stock_categories.total?o("div",{staticClass:"table-responsive"},[o("table",{staticClass:"table table-sm"},[o("thead",[o("tr",[o("th",[t._v(t._s(t.trans("inventory.stock_category_name")))]),t._v(" "),o("th",[t._v(t._s(t.trans("inventory.stock_category_description")))]),t._v(" "),o("th",{staticClass:"table-option"},[t._v(t._s(t.trans("general.action")))])])]),t._v(" "),o("tbody",t._l(t.stock_categories.data,(function(e){return o("tr",[o("td",[t._v(t._s(e.name))]),t._v(" "),o("td",[t._v(t._s(e.description))]),t._v(" "),o("td",{staticClass:"table-option"},[o("div",{staticClass:"btn-group"},[o("button",{directives:[{name:"tooltip",rawName:"v-tooltip",value:t.trans("inventory.edit_stock_category"),expression:"trans('inventory.edit_stock_category')"}],staticClass:"btn btn-info btn-sm",on:{click:function(o){return o.preventDefault(),t.editStockCategory(e)}}},[o("i",{staticClass:"fas fa-edit"})]),t._v(" "),o("button",{directives:[{name:"confirm",rawName:"v-confirm",value:{ok:t.confirmDelete(e)},expression:"{ok: confirmDelete(stock_category)}"},{name:"tooltip",rawName:"v-tooltip",value:t.trans("inventory.delete_stock_category"),expression:"trans('inventory.delete_stock_category')"}],key:e.id,staticClass:"btn btn-danger btn-sm"},[o("i",{staticClass:"fas fa-trash"})])])])])})),0)])]):t._e(),t._v(" "),t.stock_categories.total?t._e():o("module-info",{attrs:{module:"inventory",title:"stock_category_module_title",description:"stock_category_module_description",icon:"list"}},[o("div",{attrs:{slot:"btn"},slot:"btn"},[!t.showCreatePanel&&t.hasPermission("create-stock-category")?o("button",{staticClass:"btn btn-info btn-md",on:{click:function(e){t.showCreatePanel=!t.showCreatePanel}}},[o("i",{staticClass:"fas fa-plus"}),t._v(" "+t._s(t.trans("general.add_new")))]):t._e()])]),t._v(" "),o("pagination-record",{attrs:{"page-length":t.filter.page_length,records:t.stock_categories},on:{"update:pageLength":function(e){return t.$set(t.filter,"page_length",e)},"update:page-length":function(e){return t.$set(t.filter,"page_length",e)},updateRecords:t.getStockCategories}})],1)])],1),t._v(" "),o("right-panel",{attrs:{topic:t.help_topic}})],1)}),[],!1,null,null,null).exports}}]);
//# sourceMappingURL=index.js.map?id=26ffd1aa193adb0dcbb0