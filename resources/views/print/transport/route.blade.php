@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('transport.route').' '.trans('general.total_result_count',['count' => count($routes)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('transport.route_name')}}</th>
                <th>{{trans('transport.route_description')}}</th>
                <th>{{trans('general.created_at')}}</th>
                <th>{{trans('general.updated_at')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($routes as $route)
        		<tr>
        			<td>{{$route->name}}</td>
                    <td>{{$route->description}}</td>
                    <td>{{showDateTime($route->created_at)}}</td>
                    <td>{{showDateTime($route->updated_at)}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')