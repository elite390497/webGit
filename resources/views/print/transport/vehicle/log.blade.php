@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('transport.vehicle_log').' '.trans('general.total_result_count',['count' => count($vehicle_logs)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('transport.vehicle')}}</th>
                <th>{{trans('transport.vehicle_log_date_of_log')}}</th>
                <th>{{trans('transport.vehicle_log_log')}}</th>
                <th>{{trans('transport.vehicle_log_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($vehicle_logs as $vehicle_log)
        		<tr>
        			<td>{{$vehicle_log->Vehicle->detail}}</td>
                    <td>{{showDate($vehicle_log->date_of_log)}}</td>
                    <td>{{$vehicle_log->log}}</td>
                    <td>{{$vehicle_log->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')