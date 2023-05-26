@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('library.book_language').' '.trans('general.total_result_count',['count' => count($book_languages)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
            	<th>{{trans('library.book_language_name')}}</th>
                <th>{{trans('library.book_language_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($book_languages as $book_language)
        		<tr>
        			<td>{{$book_language->name}}</td>
                    <td>{{$book_language->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')