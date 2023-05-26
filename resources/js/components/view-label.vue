<template>
	<div class="form-group">
        <label class="view-label">{{label}}</label>
		<template v-if="! value">
			<div>-</div>
		</template>
		<template v-else>
			<template v-if="type === 'date'">
				<div>{{value | moment}}</div>
			</template>
			<template v-else>
				<div v-if="toUppercaseWord">{{ucword(value)}}</div>
				<div v-else>{{value}}</div>
			</template>
		</template>
	</div>
</template>

<script>
	export default {
		name: 'ViewLabel',
		props: {
			label: {
				type: String,
				default: 'Label'
			},
			type: {
				type: String,
				default: 'string'
			},
			value: {
				default: ''
			},
			toUppercaseWord: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			ucword(word) {
				return helper.ucword(word)
			}
		}, 
        filters: {
          moment(date) {
            return helper.formatDate(date);
          },
          momentDateTime(date) {
            return helper.formatDateTime(date);
          }
        }
	}
</script>