@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('inventory.stock_transfer').' '.trans('general.total_result_count',['count' => count($stock_transfers)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('inventory.stock_transfer_detail')}}</th>
                <th>{{trans('inventory.stock_transfer_date')}}</th>
                <th>{{trans('inventory.stock_transfer_return_date')}}</th>
                <th>{{trans('inventory.stock_transfer_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($stock_transfers as $stock_transfer)
        		<tr>
        			<td>
                        @if($stock_transfer->type == 'room')
                            {{trans('asset.room')}}: {{$stock_transfer->room->name}}
                        @elseif($stock_transfer->type == 'student')
                            {{trans('student.student_name').': '.$stock_transfer->Student->name}} <br />
                            {{trans('student.first_guardian_name').': '.$stock_transfer->Student->Parent->first_guardian_name}} <br />
                            {{trans('student.contact_number').': '.$stock_transfer->Student->contact_number}}
                        @else
                            {{trans('employee.employee_name').': '.$stock_transfer->Employee->name}} <br />
                            {{getEmployeeDesignationName($stock_transfer->Employee)}}
                        @endif
                    </td>
                    <td>{{showDate($stock_transfer->date)}}</td>
                    <td>{{showDate($stock_transfer->return_date)}}</td>
                    <td>{{$stock_transfer->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')