<?php

namespace App\Http\Requests;

use App\Enums\ArticleStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class ArticleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'min:3', 'max:255'],
            'teaser' => ['required', 'string', 'min:3', 'max:255'],
            'content' => ['required', 'string', 'min:3'],
            'category_id' => ['required', 'exists:categories,id'],
            'tags' => ['array', 'required'],
            'tags.*' => ['exists:tags,id'],
            'thumbnail' => ['nullable', 'image', 'max:2048'],
            'status' => ['nullable', new Enum(ArticleStatus::class)],
        ];
    }
}
