<?php

namespace App\Models;

use App\Traits\HasLabelValue;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tag extends Model
{
    use HasFactory;
    use HasLabelValue;
    use SoftDeletes;

    public function articles(): MorphToMany
    {
        return $this->morphedByMany(Article::class, 'taggable');
    }

    // public static function toSelectArray(): array
    // {
    //     return self::query()->select('id', 'name')->get()->map(fn ($item) => [
    //         'value' => $item->id,
    //         'label' => $item->name,
    //     ]);
    // }
}
