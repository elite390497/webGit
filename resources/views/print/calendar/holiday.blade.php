@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('calendar.holiday').' '.trans('general.total_result_count',['count' => count($holidays)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
            	<th>{{trans('calendar.holiday_date')}}</th>
                <th>{{trans('calendar.holiday_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($holidays as $holiday)
        		<tr>
        			<td>{{showDate($holiday->date)}}</td>
                    <td>{{$holiday->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')