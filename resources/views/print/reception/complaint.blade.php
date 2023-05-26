@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('reception.complaint').' '.trans('general.total_result_count',['count' => count($complaints)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>#</th>
                <th>{{trans('reception.complaint_type')}}</th>
                <th>{{trans('reception.date_of_complaint')}}</th>
                <th>{{trans('reception.complainant')}}</th>
                <th>{{trans('reception.date_of_resolution')}}</th>
                <th>{{trans('reception.complaint_assign_to')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($complaints as $complaint)
        		<tr>
                    <td>{{$complaint->id}}</td>
                    <td>{{$complaint->complaintType->name}}</td>
                    <td>{{showDate($complaint->date_of_complaint)}}</td>
                    <td>
                        {{$complaint->complainant_name}} <br />
                        {{$complaint->complainant_contact_number}} <br />
                        {{$complaint->complainant_address}} <br />
                    </td>
                    <td>{{showDate($complaint->date_of_resolution)}}</td>
                    <td>
                        {{$complaint->Employee->name}} <br />
                        {{getEmployeeDesignationName($complaint->Employee)}}
                    </td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')