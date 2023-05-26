@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('academic.class_timing').' '.trans('general.total_result_count',['count' => count($class_timings)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
            	<th>{{trans('academic.class_timing_name')}}</th>
                <th>{{trans('academic.class_timing_session')}}</th>
                <th>{{trans('academic.class_timing_duration')}}</th>
                <th>{{trans('academic.class_timing_description')}}</th>
                <th>{{trans('general.updated_at')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($class_timings as $class_timing)
        		<tr>
        			<td>{{$class_timing->name}}</td>
                    <td>
                        {{$class_timing->session.' '.trans('academic.class_timing_session')}}
                        @if($class_timing->break)
                            + {{$class_timing->break.' '.trans('academic.class_timing_break')}}
                        @endif
                    </td>
                    <td>
                        @if(!$filter['show_session'])
                        {{showTime($class_timing->ClassTimingSessions->first()->start).' '.trans('general.to').' '.showTime($class_timing->ClassTimingSessions->last()->end)}}
                        @else
                            <ul style="list-style:none;padding:0;margin:0;">
                                @foreach($class_timing->ClassTimingSessions as $session)
                                    <li>
                                        {{$session->name}} {{showTime($session->start).' '.trans('general.to').' '.showTime($session->end)}}
                                    </li>
                                @endforeach
                            </ul>
                        @endif
                    </td>
                    <td>{{$class_timing->description}}</td>
                    <td>{{showDateTime($class_timing->updated_at)}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')