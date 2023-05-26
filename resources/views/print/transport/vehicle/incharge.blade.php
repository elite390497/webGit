@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('transport.vehicle_incharge').' '.trans('general.as_on').' '.showDate(date('Y-m-d'))}}</h2>

    <table class="fancy-detail">
        <thead>
            <tr>
                <th style="width: 30%;">{{trans('transport.vehicle')}}</th>
                <th style="width: 30%;">{{trans('transport.current_vehicle_incharge')}}</th>
                @if($filter['show_history'])
                    <th style="width: 40%;">{{trans('transport.vehicle_incharge_history')}}</th>
                @endif
            </tr>
        </thead>
        <tbody>
            @foreach($vehicles as $vehicle)
                <tr>
                    <td>{{$vehicle->name.' '.$vehicle->registration_number}}</td>
                    <td>{{getCurrentVehicleIncharge($vehicle, $vehicles->firstWhere('id',$vehicle->id)->VehicleIncharges)}}</td>
                    @if($filter['show_history'])
                        <td>
                            @foreach($vehicles->firstWhere('id',$vehicle->id)->VehicleIncharges as $vehicle_incharge)
                                {{$vehicle_incharge->Employee->name_with_code}} {{trans('general.from')}} {{showDate($vehicle_incharge->date_effective)}}
                                <br />
                            @endforeach
                        </td>
                    @endif
                </tr>
            @endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')