@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('post.article').' '.trans('general.total_result_count',['count' => count($articles)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('post.article_type')}}</th>
            	<th>{{trans('post.article_title')}}</th>
                <th>{{trans('post.date_of_article')}}</th>
                <th>{{trans('post.article_is_public')}}</th>
                <th>{{trans('post.article_posted_by')}}</th>
                <th>{{trans('general.created_at')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($articles as $article)
        		<tr>
                    <td>{{$article->ArticleType->name}}</td>
                    <td>{{$article->title}}</td>
        			<td>{{showDate($article->date_of_article)}}</td>
                    <td>
                        @if($article->is_public) {{trans('post.article_public')}} @endif
                    </td>
                    <td>{{$article->User->Employee->name}}</td>
                    <td>{{showDateTime($article->created_at)}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')