<?php

namespace App\Models\Post;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class Article extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'title',
                            'date_of_article',
                            'is_public',
                            'description',
                            'options',
                            'user_id'
                        ];
    protected $casts = ['options' => 'array', 'date_of_article' => 'date'];
    protected $primaryKey = 'id';
    protected $table = 'articles';
    protected static $logName = 'article';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    protected $appends = ['excerpt'];

    public function articleType()
    {
        return $this->belongsTo('App\Models\Configuration\Post\ArticleType');
    }

    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public function getExcerptAttribute()
    {
        return createExcerpt($this->description, 70);
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function scopeInfo($q)
    {
        return $q->with('user', 'user.employee', 'user.employee.employeeDesignations', 'user.employee.employeeDesignations.designation', 'user.employee.employeeDesignations.designation.employeeCategory', 'articleType');
    }

    public function scopeFilterById($q, $id)
    {
        if (! $id) {
            return $q;
        }

        return $q->where('id', '=', $id);
    }

    public function scopeFilterByUuid($q, $uuid)
    {
        if (! $uuid) {
            return $q;
        }

        return $q->where('uuid', '=', $uuid);
    }

    public function scopeFilterByArticleTypeId($q, $article_type_id)
    {
        if (! $article_type_id) {
            return $q;
        }

        return $q->where('article_type_id', '=', $article_type_id);
    }

    public function scopeFilterbyPublic($q)
    {
        return $q->where('is_public',1);
    }

    public function scopeFilterByDateOfArticle($q, $date_of_article)
    {
        if (! $date_of_article) {
            return $q;
        }

        return $q->where('date_of_article', '=', $date_of_article);
    }

    public function scopeFilterBySession($q)
    {
        return $q->where('date_of_article', '>=', getStartOfDate(config('config.default_academic_session.start_date')))->where('date_of_article', '<=', getEndOfDate(config('config.default_academic_session.end_date')));
    }

    public function scopeFilterByTitle($q, $title, $s = 0)
    {
        if (! $title) {
            return $q;
        }

        return ($s) ? $q->where('title', '=', $title) : $q->where('title', 'like', '%'.$title.'%');
    }

    public function scopeFilterByKeyword($q, $keyword)
    {
        if (! $keyword) {
            return $q;
        }

        return $q->where(function ($q1) use ($keyword) {
            $q1->where('title', 'like', '%'.$keyword.'%')->orWhere('description', 'like', '%'.$keyword.'%');
        });
    }

    public function scopeDateOfArticleBetween($q, $dates)
    {
        if ((! $dates['start_date'] || ! $dates['end_date']) && $dates['start_date'] <= $dates['end_date']) {
            return $q;
        }

        return $q->where('date_of_article', '>=', getStartOfDate($dates['start_date']))->where('date_of_article', '<=', getEndOfDate($dates['end_date']));
    }
}
