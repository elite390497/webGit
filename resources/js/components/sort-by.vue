<template>
    <div class="btn-group">
      <button type="button" class="btn btn-info btn-sm dropdown-toggle no-caret" role="menu" id="sortByLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-tooltip="trans('general.sort_and_order')">
        <i class="fas fa-sort-alpha-down"></i> <span class="d-none d-sm-inline">{{trans('general.sort_by')}}</span>
      </button>

      <div :class="['dropdown-menu',getConfig('direction') == 'ltr' ? 'dropdown-menu-right' : '']" aria-labelledby="sortByLink">
        <button class="dropdown-item custom-dropdown" v-for="option in sortByOptions" @click="$emit('updateOrder',option.value)">
        	<i :class="['fas', 'fa-'+option.icon]"></i> {{option.translation}} <span v-if="option.value == order" class="pull-right"><i class="fas fa-check"></i></span> 
        </button>
        <div class="dropdown-divider"></div>
        <button class="dropdown-item custom-dropdown" v-for="option in orderByOptions" @click="$emit('updateSortBy',option.value)">
        	{{option.translation}} <span v-if="option.value == sortBy" class="pull-right"><i class="fas fa-check"></i></span> 
        </button>
      </div>
    </div>
</template>

<script>
	export default {
		props: {
			sortBy: {
				required: true,
				default: 'created_at'
			},
			order: {
				required: true,
				default: 'desc'
			},
			orderByOptions: {
				required: true,
				default: []
			}
		},
		data() {
			return {
				sortByOptions: [
					{
						value: 'asc',
						translation: i18n.general.ascending,
						icon: 'sort-alpha-down'
					},
					{
						value: 'desc',
						translation: i18n.general.descending,
						icon: 'sort-alpha-up'
					}
				]
			}
		},
		methods: {
			getConfig(config){
				return helper.getConfig(config);
			}
		}
	}
</script>