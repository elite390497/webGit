@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('reception.gate_pass').' '.trans('general.total_result_count',['count' => count($gate_passes)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>#</th>
                <th>{{trans('reception.gate_pass_detail')}}</th>
                <th>{{trans('reception.gate_pass_date')}}</th>
                <th>{{trans('reception.gate_pass_time')}}</th>
                <th>{{trans('reception.gate_pass_reason')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($gate_passes as $gate_pass)
        		<tr>
                    <td>{{$gate_pass->id}}</td>
                    <td>
                        @if($gate_pass->type == 'student')
                            {{trans('student.name').': '.$gate_pass->Student->name}} <br />
                            {{trans('student.first_guardian_name').': '.$gate_pass->Student->Parent->first_guardian_name}} <br />
                            {{trans('student.mother_name').': '.$gate_pass->Student->Parent->mother_name}} <br />
                            {{trans('student.contact_number').': '.$gate_pass->Student->contact_number}} <br />
                        @else
                            {{$gate_pass->Employee->name}} <br />
                            {{getEmployeeDesignationName($gate_pass->Employee)}}
                        @endif
                    </td>
                    <td>{{showDate($gate_pass->date)}}</td>
                    <td>{{showTime($gate_pass->time)}}</td>
                    <td>{{$gate_pass->reason}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')