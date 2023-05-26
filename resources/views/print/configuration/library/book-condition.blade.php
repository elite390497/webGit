@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('library.book_condition').' '.trans('general.total_result_count',['count' => count($book_conditions)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
            	<th>{{trans('library.book_condition_name')}}</th>
                <th>{{trans('library.book_condition_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($book_conditions as $book_condition)
        		<tr>
        			<td>{{$book_condition->name}}</td>
                    <td>{{$book_condition->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')