<template>
	<div>
		<book-log :title="trans('library.issue')" return-status=""></book-log>
	</div>
</template>

<script>
	import bookLog from './list'
	
	export default {
		components: {bookLog}
	}
</script>