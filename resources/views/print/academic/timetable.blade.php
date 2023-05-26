@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('academic.timetable').' '.trans('general.total_result_count',['count' => count($timetables)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
            	<th>{{trans('academic.batch')}}</th>
                <th>{{trans('academic.date_effective')}}</th>
                <th>{{trans('academic.timetable_status')}}</th>
                <th>{{trans('academic.timetable_description')}}</th>
                <th>{{trans('general.updated_at')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($timetables as $timetable)
        		<tr>
        			<td>{{$timetable->batch->batch_with_course}}</td>
                    <td>{{showDate($timetable->date_effective)}}</td>
                    <td>
                        {{getTimetableStatus($timetable)}}
                    </td>
                    <td>{{$timetable->description}}</td>
                    <td>{{showDateTime($timetable->updated_at)}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')