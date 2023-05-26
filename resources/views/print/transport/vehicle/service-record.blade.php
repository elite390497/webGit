@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('transport.vehicle_service_record').' '.trans('general.total_result_count',['count' => count($vehicle_service_records)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('transport.vehicle')}}</th>
                <th>{{trans('transport.vehicle_service_center_only')}}</th>
                <th>{{trans('transport.vehicle_service_record_amount')}}</th>
                <th>{{trans('transport.date_of_service')}}</th>
                <th>{{trans('transport.vehicle_log_log')}}</th>
                <th>{{trans('transport.vehicle_service_record_next_due_date')}}</th>
                <th>{{trans('transport.vehicle_service_record_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($vehicle_service_records as $vehicle_service_record)
        		<tr>
        			<td>{{$vehicle_service_record->Vehicle->detail}}</td>
                    <td>{{optional($vehicle_service_record->vehicleServiceCenter)->name}}</td>
                    <td>{{currency($vehicle_service_record->amount,1)}}</td>
                    <td>{{showDate($vehicle_service_record->date_of_service)}}</td>
                    <td>{{$vehicle_service_record->log}}</td>
                    <td>
                        @if($vehicle_service_record->next_due_date)
                            {{showDate($vehicle_service_record->next_due_date)}}
                        @endif
                    </td>
                    <td>{{$vehicle_service_record->description}}</td>
        		</tr>
                <?php
                    $total_amount += $vehicle_service_record->amount;
                ?>
        	@endforeach
        </tbody>
        <tfoot>
            <tr>
                <td colspan="2">{{trans('general.total')}}</td>
                <td>{{currency($total_amount,1)}}</td>
                <td colspan="4"></td>
            </tr>
        </tfoot>
    </table>
@include('print.print-layout.footer')