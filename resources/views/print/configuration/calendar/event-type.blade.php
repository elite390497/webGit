@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('calendar.event_type').' '.trans('general.total_result_count',['count' => count($event_types)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('calendar.event_type_name')}}</th>
                <th>{{trans('calendar.event_type_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($event_types as $event_type)
        		<tr>
        			<td>{{$event_type->name}}</td>
                    <td>{{$event_type->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')