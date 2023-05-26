<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container modal-lg">
                    <div class="modal-header">
                        <slot name="header">
                            {{trans('student.search_parent')}}
                            <span class="float-right pointer" @click="$emit('close')">x</span>
                        </slot>
                    </div>
                    <div class="modal-body m-t-0">
                        <slot name="body">
                            <div class="card card-form">
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-12">
                                            <div class="form-group">
                                                <label for="">{{trans('student.parent_search_by_father_mother_name')}}</label>
                                                <input class="form-control" type="text" v-model="searchForm.query" name="query" :placeholder="trans('general.search_query')">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-footer text-right">
                                        <button type="button" @click="search" class="btn btn-info waves-effect waves-light">{{trans('general.search')}}</button>
                                    </div>
                                </div>
                            </div>

                            <div class="search-results m-t-30" style="max-height: 100px" v-if="parents.total">
                                <h4 class="text-themecolor p-b-10 m-b-20 border-bottom">{{trans('student.parent_search_result')}} 
                                    <span class="card-subtitle d-none d-sm-inline">{{trans('general.total_result_found',{count : parents.total, from: parents.from, to: parents.to})}}</span>
                                </h4>
                                <div class="table-responsive">
                                    <table class="table table-sm">
                                        <thead>
                                            <tr>
                                                <th>{{trans('student.father_name')}}</th>
                                                <th>{{trans('student.mother_name')}}</th>
                                                <th class="table-option">{{trans('general.action')}}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="parent in parents.data">
                                                <td v-text="parent.father_name"></td>
                                                <td v-text="parent.mother_name"></td>
                                                <td class="table-option">
                                                    <div class="btn-group">
                                                        <button class="btn btn-info btn-sm" :key="parent.id" v-confirm="{ok: confirm(parent)}" v-tooltip="trans('student.add_parent')"><i class="fas fa-user-plus"></i></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <pagination-record :page-length.sync="searchForm.page_length" :records="parents" @updateRecords="search"></pagination-record>
                            </div>
					        <div class="clearfix"></div>
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
        props: [],
        data() {
        	return {
        		parents: {
        			data: [],
        			total: 0
        		},
        		searchForm: {
        			query: '',
                    page_length: helper.getConfig('page_length')
        		}
        	}
        },
        methods: {
            search(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.searchForm);
    			axios.get('/api/student/parent/search?page=' + page + url)
    				.then(response => {
    					this.parents = response;
                        loader.hide();
    				})
    				.catch(error => {
                        loader.hide();
    					helper.showErrorMsg(error);
    				})
            },
            confirm(parent){
                return dialog => this.addParent(parent);
            },
            addParent(parent){
                let loader = this.$loading.show();
                this.$emit('completed',parent);
                loader.hide();
            }
        }
    }
</script>

<style>
.loading-overlay{
	z-index: 1060;
}
</style>