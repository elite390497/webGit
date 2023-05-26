@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('reception.call_log').' '.trans('general.total_result_count',['count' => count($call_logs)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>#</th>
                <th>{{trans('reception.calling_purpose')}}</th>
                <th>{{trans('reception.call_detail')}}</th>
                <th>{{trans('reception.date_of_call')}}</th>
                <th>{{trans('reception.call_log_name')}}</th>
                <th>{{trans('reception.start_time')}}</th>
                <th>{{trans('reception.end_time')}}</th>
                <th>{{trans('reception.call_log_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($call_logs as $call_log)
        		<tr>
                    <td>{{$call_log->id}}</td>
                    <td>{{$call_log->CallingPurpose->name}}</td>
                    <td>
                        {{$call_log->outgoing_number}} {{trans('general.to')}} {{$call_log->incoming_number}}
                    </td>
                    <td>{{showDate($call_log->date)}}</td>
                    <td>{{$call_log->name}}</td>
                    <td>{{showTime($call_log->start_time)}}</td>
                    <td>{{showTime($call_log->end_time)}}</td>
                    <td>{{$call_log->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')