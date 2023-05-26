@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('post.leave_request').' '.trans('general.total_result_count',['count' => count($leave_requests)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('employee.name')}}</th>
                <th>{{trans('employee.designation')}}</th>
                <th>{{trans('employee.leave_type')}}</th>
                <th>{{trans('employee.leave_request_period')}}</th>
                <th>{{trans('employee.leave_request_count')}}</th>
                <th>{{trans('employee.leave_request_status')}}</th>
                <th>{{trans('employee.leave_requested_by')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($leave_requests as $leave_request)
        		<tr>
                    <td>{{$leave_request->Employee->name_with_code}}</td>
                    <td>{{getEmployeeDesignationName($leave_request->Employee, $leave_request->end_date)}}</td>
                    <td>{{$leave_request->LeaveType->name}}</td>
        			<td>{{showDate($leave_request->start_date).' '.trans('general.to').' '.showDate($leave_request->end_date)}}</td>
                    <td>{{getLeaveRequestCount($leave_request)}}</td>
                    <td>
                        @if($leave_request->status) 
                            {{trans('employee.leave_request_status_'.$leave_request->status)}}
                        @endif
                    </td>
                    <td>{{$leave_request->RequesterUser->Employee->name_with_code}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')