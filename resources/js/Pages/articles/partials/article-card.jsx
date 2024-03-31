import { Link } from '@inertiajs/react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { limitChars } from '@/lib/utils';

export function ArticleCard({ article }) {
    return (
        <article className="space-y-4">
            <Link
                className="block overflow-hidden rounded-lg border bg-background duration-200 hover:border-foreground/20"
                href={route('articles.show', [article])}
            >
                <AspectRatio ratio={1.91}>
                    <img
                        className="grid h-full w-full place-content-center object-cover object-center text-center font-mono text-xs"
                        src={article.thumbnail}
                        alt={limitChars(article.title)}
                        width={1200}
                        height={630}
                    />
                </AspectRatio>
            </Link>

            <Link className="inline-block" href={`/categories/${article.category.slug}`}>
                <Badge className="outline">{article.category.name}</Badge>
            </Link>

            <Link className="block font-semibold" href={route('articles.show', [article])}>
                {article.title}
            </Link>
            <p className="text-sm text-muted-foreground">{article.teaser}</p>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <Link href={`/${article.user.id}`} className="hover:text-foreground">
                    {article.user.name}
                </Link>
                <time>{article.published_at}</time>
            </div>
        </article>
    );
}
