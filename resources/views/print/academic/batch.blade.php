@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('academic.batch').' '.trans('general.total_result_count',['count' => count($batches)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
            	<th>{{trans('academic.batch_name')}}</th>
                <th>{{trans('academic.course')}}</th>
                <th>{{trans('academic.max_strength')}}</th>
                <th>{{trans('academic.current_strength')}}</th>
                <th>{{trans('academic.roll_number_prefix')}}</th>
                <th>{{trans('academic.batch_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($batches as $batch)
        		<tr>
        			<td>{{$batch->name}}</td>
                    <td>{{$batch->Course->name}}</td>
                    <td>{{ $batch->options ? $batch->getOption('max_strength') : config('config.default_max_strength_per_batch')}}</td>
                    <td>{{$batch->student_records_count}}</td>
                    <td>{{ $batch->options ? $batch->getOption('roll_number_prefix') : config('config.default_roll_number_prefix')}}</td>
                    <td>{{$batch->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')