<?php
namespace App\Repositories;

use App\Models\Tag;
use App\Models\Taggable;
use App\Http\Resources\TagCollection;
use Illuminate\Validation\ValidationException;

class TagRepository
{
    protected $tag;
    protected $taggable;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        Tag $tag,
        Taggable $taggable
    ) {
        $this->tag = $tag;
        $this->taggable = $taggable;
    }

    /**
     * Get all tags
     *
     * @param  array  $options
     * @return Array
     */
    public function getAll($options = array())
    {
        $tags = $this->tag->filterByType(array_get($options, 'type'))->orderBy('name','asc')->get();
        return new TagCollection($tags);
    }

    /**
     * Create new tags
     * @param  string  $type
     * @param  array  $tags
     * @return void
     */
    public function create($type, $tags = array()) {
        $all_tags = $this->tag->filterByType($type)->get()->pluck('slug')->all();
        $new_tags = array_diff(array_values(array_unique($tags)), $all_tags);

        foreach ($tags as $tag) {
            $new_tag = $this->tag->firstOrNew(['slug' => $tag, 'type' => $type]);
            $new_tag->name = toWord($tag);
            $new_tag->save();
        }

        return $this->getAll(['type' => $type]);
    }


    /**
     * Delete taggable
     * @param  string  $type
     * @param  array  $taggable_ids
     * @return void
     */
    public function delete($type, $taggable_ids = array()) {
        $this->taggable->where('taggable_type', $type)->whereIn('taggable_id', $taggable_ids)->delete();
    }
}