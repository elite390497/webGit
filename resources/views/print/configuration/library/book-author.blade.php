@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('library.book_author').' '.trans('general.total_result_count',['count' => count($book_authors)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
            	<th>{{trans('library.book_author_name')}}</th>
                <th>{{trans('library.book_author_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($book_authors as $book_author)
        		<tr>
        			<td>{{$book_author->name}}</td>
                    <td>{{$book_author->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')