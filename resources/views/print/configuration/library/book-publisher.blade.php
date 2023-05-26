@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('library.book_publisher').' '.trans('general.total_result_count',['count' => count($book_publishers)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
            	<th>{{trans('library.book_publisher_name')}}</th>
                <th>{{trans('library.book_publisher_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($book_publishers as $book_publisher)
        		<tr>
        			<td>{{$book_publisher->name}}</td>
                    <td>{{$book_publisher->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')