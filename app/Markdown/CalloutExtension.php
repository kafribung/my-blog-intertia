<?php

namespace App\Markdown;

use League\CommonMark\Environment\EnvironmentBuilderInterface;
use League\CommonMark\Extension\CommonMark\Node\Block\BlockQuote;
use League\CommonMark\Extension\CommonMark\Node\Inline\Strong;
use League\CommonMark\Extension\ExtensionInterface;
use League\CommonMark\Node\Block\Paragraph;
use League\CommonMark\Node\Inline\Text;
use League\CommonMark\Node\Node;
use League\CommonMark\Renderer\ChildNodeRendererInterface;
use League\CommonMark\Renderer\NodeRendererInterface;
use League\CommonMark\Util\HtmlElement;

class CalloutExtension implements ExtensionInterface, NodeRendererInterface
{
    protected array $calloutTypes = [
        'note' => ['img' => '/callouts/info.svg'],
        'warning' => ['img' => '/callouts/warning.svg'],
    ];

    public function register(EnvironmentBuilderInterface $environment): void
    {
        $environment->addRenderer(BlockQuote::class, $this, 10);
    }

    public function render(Node $node, ChildNodeRendererInterface $childRenderer)
    {
        assert($node instanceof BlockQuote);
        $calloutTypeNode = $this->calloutTypeNode($node);
        if (! $calloutTypeNode) {
            return null;
        }
        $type = $this->calloutType($calloutTypeNode);
        if (! $type) {
            return null;
        }
        $calloutTypeNode->detach();

        return new HtmlElement(
            'div',
            ['class' => 'not-prose mb-6 p-5 max-w-3xl lg:flex border bg-secondary/70 rounded-lg lg:rounded-xl'],
            [
                new HtmlElement(
                    'div',
                    ['class' => 'rounded-full shrink-0 lg:mb-0'],
                    new HtmlElement(
                        'img',
                        [
                            'src' => $this->calloutTypes[$type]['img'],
                            'class' => 'size-8 md:size-7 ml-4 mb-4 md:ml-0 md:mb-0 !ring-0',
                        ],
                    )
                ),
                new HtmlElement(
                    'div',
                    ['class' => 'lg:ml-4 text-base prose-p:m-0'],
                    $childRenderer->renderNodes($node->children())
                ),
            ]
        );
    }

    protected function calloutTypeNode(BlockQuote $blockQuote): ?Strong
    {
        $child = $blockQuote->firstChild();
        if (! $child instanceof Paragraph) {
            return null;
        }
        $child = $child->firstChild();

        return $child instanceof Strong ? $child : null;
    }

    protected function calloutType(Strong $node): ?string
    {
        $child = $node->firstChild();
        if (! $child instanceof Text) {
            return null;
        }
        $type = strtolower($child->getLiteral());

        return in_array($type, array_keys($this->calloutTypes)) ? $type : null;
    }
}
