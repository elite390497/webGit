@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('asset.room').' '.trans('general.total_result_count',['count' => count($rooms)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
            	<th>{{trans('asset.building')}}</th>
                <th>{{trans('asset.room_name')}}</th>
                <th>{{trans('asset.room_floor_number')}}</th>
                <th>{{trans('asset.room_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($rooms as $room)
        		<tr>
        			<td>{{$room->building->name}}</td>
                    <td>{{$room->name}}</td>
                    <td>{{$room->floor_number}}</td>
                    <td>{{$room->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')