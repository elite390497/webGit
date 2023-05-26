@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('transport.route_wise_report').' '.trans('general.total_result_count',['count' => count($transport_route_students)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('student.admission_number')}}</th>
                <th>{{trans('student.name')}}</th>
                <th>{{trans('academic.course')}}</th>
                <th>{{trans('academic.batch')}}</th>
                <th>{{trans('transport.stoppage')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($transport_route_students as $transport_route_student)
        		<tr>
                    <td>{{$transport_route_student->studentRecord->admission->admission_number}}</td>
                    <td>{{$transport_route_student->studentRecord->student->name}}</td>
                    <td>{{$transport_route_student->studentRecord->batch->course->name}}</td>
                    <td>{{$transport_route_student->studentRecord->batch->name}}</td>
        			<td>{{$transport_route_student->transportRouteDetail->transportStoppage->name}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')