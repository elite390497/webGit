@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('misc.category').' '.trans('general.total_result_count',['count' => count($categories)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
            	<th>{{trans('misc.category_name')}}</th>
                <th>{{trans('misc.category_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($categories as $category)
        		<tr>
        			<td>{{$category->name}}</td>
                    <td>{{$category->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')