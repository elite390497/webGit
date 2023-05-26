@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('academic.session').' '.trans('general.total_result_count',['count' => count($academic_sessions)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
            	<th>{{trans('academic.session_name')}}</th>
                <th>{{trans('academic.session_start_date')}}</th>
                <th>{{trans('academic.session_end_date')}}</th>
                <th>{{trans('academic.session_default')}}</th>
                <th>{{trans('academic.session_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($academic_sessions as $academic_session)
        		<tr>
        			<td>{{$academic_session->name}}</td>
        			<td>{{showDate($academic_session->start_date)}}</td>
        			<td>{{showDate($academic_session->end_date)}}</td>
        			<td>{{$academic_session->is_default ? trans('academic.session_default') : ''}}</td>
        			<td>{{$academic_session->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')