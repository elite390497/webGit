@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('transport.vehicle_fuel').' '.trans('general.total_result_count',['count' => count($vehicle_fuels)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('transport.vehicle')}}</th>
                <th>{{trans('transport.vehicle_fuel_type')}}</th>
                <th>{{trans('transport.vehicle_fuel_quantity')}}</th>
                <th>{{trans('transport.vehicle_fuel_price_per_unit')}}</th>
                <th>{{trans('general.total')}}</th>
                <th>{{trans('transport.date_of_fueling')}}</th>
                <th>{{trans('transport.vehicle_fuel_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($vehicle_fuels as $vehicle_fuel)
        		<tr>
        			<td>{{$vehicle_fuel->Vehicle->detail}}</td>
                    <td>{{$vehicle_fuel->VehicleFuelType->name}}</td>
                    <td>{{formatNumber($vehicle_fuel->quantity, config('config.vehicle_fuel_quantity_decimal_place'))}}</td>
                    <td>{{currency($vehicle_fuel->price_per_unit)}}</td>
                    <td>{{currency($vehicle_fuel->quantity * $vehicle_fuel->price_per_unit)}}</td>
                    <td>{{showDate($vehicle_fuel->date_of_fueling)}}</td>
                    <td>{{$vehicle_fuel->description}}</td>
        		</tr>
                <?php
                    $total_price += ($vehicle_fuel->quantity * $vehicle_fuel->price_per_unit);
                    $total_quantity += $vehicle_fuel->quantity;
                    $total_price_per_unit += $vehicle_fuel->price_per_unit;
                ?>
        	@endforeach
        </tbody>
        <tfoot>
            <tr>
                <td colspan="2">{{trans('general.total')}}</td>
                <td>{{formatNumber($total_quantity, config('config.vehicle_fuel_quantity_decimal_place'))}}</td>
                <td>{{currency($total_price_per_unit / $vehicle_fuels->count())}}</td>
                <td>{{currency($total_price)}}</td>
                <td colspan="2"></td>
            </tr>
        </tfoot>
    </table>
@include('print.print-layout.footer')