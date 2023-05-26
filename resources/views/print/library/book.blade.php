@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('library.book').' '.trans('general.total_result_count',['count' => count($books)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('library.book_title')}}</th>
                <th>{{trans('library.book_author')}}</th>
                <th>{{trans('library.book_language')}}</th>
                <th>{{trans('library.book_topic')}}</th>
                <th>{{trans('library.book_publisher')}}</th>
                <th>{{trans('library.book_isbn_number')}}</th>
                <th>{{trans('library.book_price')}}</th>
                <th>{{trans('library.book_page')}}</th>
                <th>{{trans('library.book_quantity')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($books as $book)
        		<tr>
        			<td>{{$book->title}}</td>
                    <td>{{$book->BookAuthor->name}}</td>
                    <td>{{$book->BookLanguage->name}}</td>
                    <td>{{$book->BookTopic->name}}</td>
                    <td>{{$book->BookPublisher->name}}</td>
        			<td>{{$book->isbn_number}}</td>
                    <td>{{currency($book->price,1)}}</td>
                    <td>{{$book->page}}</td>
                    <td>{{$book->book_post_details_count}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')