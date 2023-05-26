@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('post.leave_allocation').' '.trans('general.total_result_count',['count' => count($leave_allocations)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('employee.name')}}</th>
                <th>{{trans('employee.designation')}}</th>
                <th>{{trans('employee.leave_allocation_period')}}</th>
                <th>{{trans('employee.leave_allotted')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($leave_allocations as $leave_allocation)
        		<tr>
                    <td>{{$leave_allocation->Employee->name_with_code}}</td>
                    <td>{{getEmployeeDesignationName($leave_allocation->Employee, $leave_allocation->end_date)}}</td>
        			<td>{{showDate($leave_allocation->start_date).' '.trans('general.to').' '.showDate($leave_allocation->end_date)}}</td>
                    <td>
                        @foreach($leave_allocation->LeaveAllocationDetails as $leave_allocation_detail)
                        {{$leave_allocation_detail->LeaveType->name.': '.$leave_allocation_detail->used.'/'.$leave_allocation_detail->allotted}} <br />
                        @endforeach
                    </td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')