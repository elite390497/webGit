@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('asset.building').' '.trans('general.total_result_count',['count' => count($buildings)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
            	<th>{{trans('asset.building_name')}}</th>
                <th>{{trans('asset.building_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($buildings as $building)
        		<tr>
        			<td>{{$building->name}}</td>
                    <td>{{$building->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')