<template>
	<div>
		<book-log :title="trans('library.return_due')" return-status="due"></book-log>
	</div>
</template>

<script>
	import bookLog from './list'
	
	export default {
		components: {bookLog}
	}
</script>