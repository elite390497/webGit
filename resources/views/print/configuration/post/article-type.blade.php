@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('post.article_type').' '.trans('general.total_result_count',['count' => count($article_types)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('post.article_type_name')}}</th>
                <th>{{trans('post.article_type_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($article_types as $article_type)
        		<tr>
        			<td>{{$article_type->name}}</td>
                    <td>{{$article_type->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')