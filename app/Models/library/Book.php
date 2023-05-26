<?php

namespace App\Models\Library;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class Book extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'title',
                            'isbn_number',
                            'book_author_id',
                            'book_language_id',
                            'book_topic_id',
                            'book_publisher_id',
                            'edition',
                            'type',
                            'page',
                            'price',
                            'summary',
                            'description',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'books';
    protected static $logName = 'book';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function bookAuthor()
    {
        return $this->belongsTo('App\Models\Configuration\Library\BookAuthor');
    }
    
    public function bookLanguage()
    {
        return $this->belongsTo('App\Models\Configuration\Library\BookLanguage');
    }
    
    public function bookTopic()
    {
        return $this->belongsTo('App\Models\Configuration\Library\BookTopic');
    }
    
    public function bookPublisher()
    {
        return $this->belongsTo('App\Models\Configuration\Library\BookPublisher');
    }
    
    public function bookPosts()
    {
        return $this->hasMany('App\Models\Library\BookPost');
    }

    public function bookPostDetails()
    {
        return $this->hasManyThrough('App\Models\Library\BookPostDetail', 'App\Models\Library\BookPost');
    }

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function scopeInfo($q)
    {
        return $q->with('bookAuthor', 'bookLanguage', 'bookTopic', 'bookPublisher', 'bookPosts', 'bookPosts.bookPostDetails', 'bookPosts.bookPostDetails.bookCondition');
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
    
    public function scopeFilterByBookAuthorId($q, $book_author_id)
    {
        if (! $book_author_id) {
            return $q;
        }

        return $q->where('book_author_id', '=', $book_author_id);
    }
    
    public function scopeFilterByBookLanguageId($q, $book_language_id)
    {
        if (! $book_language_id) {
            return $q;
        }

        return $q->where('book_language_id', '=', $book_language_id);
    }
    
    public function scopeFilterByBookTopicId($q, $book_topic_id)
    {
        if (! $book_topic_id) {
            return $q;
        }

        return $q->where('book_topic_id', '=', $book_topic_id);
    }
    
    public function scopeFilterByBookPublisherId($q, $book_publisher_id)
    {
        if (! $book_publisher_id) {
            return $q;
        }

        return $q->where('book_publisher_id', '=', $book_publisher_id);
    }

    public function scopeFilterByTitle($q, $title, $s = 0)
    {
        if (! $title) {
            return $q;
        }

        return $s ? $q->where('title', '=', $title) : $q->where('title', 'like', '%'.$title.'%');
    }
}
