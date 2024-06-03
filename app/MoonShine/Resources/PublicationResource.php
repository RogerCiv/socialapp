<?php

declare(strict_types=1);

namespace App\MoonShine\Resources;

use Illuminate\Database\Eloquent\Model;
use App\Models\Publication;

use MoonShine\Fields\Image;
use MoonShine\Resources\ModelResource;
use MoonShine\Decorations\Block;
use MoonShine\Fields\ID;
use MoonShine\Fields\Field;
use MoonShine\Fields\Text;
use MoonShine\Components\MoonShineComponent;

/**
 * @extends ModelResource<Publication>
 */
class PublicationResource extends ModelResource
{
    protected string $model = Publication::class;

    protected string $title = 'Publications';

    protected  bool $createInModal = true;
    protected  bool $editInModal = true;
    protected  bool $detailInModal = false;

    /**
     * @return list<MoonShineComponent|Field>
     */
    public function fields(): array
    {
        return [
            Block::make([
                ID::make()->sortable(),
                Text::make('Content'),
                Image::make('Image'),
                //likes, user_id
                ID::make('User', 'user_id')->sortable(),
                Text::make('Likes', 'likes')->sortable(),
            ]),
        ];
    }

    /**
     * @param Publication $item
     *
     * @return array<string, string[]|string>
     * @see https://laravel.com/docs/validation#available-validation-rules
     */
    public function rules(Model $item): array
    {
        return [];
    }
}
