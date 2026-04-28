/**
 * Server-renderable converter for PayloadCMS Lexical JSON.
 * Supports the feature set we configured in payload.config.ts:
 * heading, paragraph, list, listitem, quote, horizontalrule, link, text (formats), upload.
 */
import Image from 'next/image'
import React from 'react'

type LexicalNode = {
  type: string
  version?: number
  children?: LexicalNode[]
  text?: string
  format?: number | string
  tag?: string
  listType?: string
  start?: number
  value?: number
  fields?: { url?: string; linkType?: string; newTab?: boolean }
  // upload feature node
  relationTo?: string
  value_?: { url?: string; alt?: string; width?: number; height?: number }
}

const FORMAT_BOLD = 1
const FORMAT_ITALIC = 2
const FORMAT_STRIKE = 4
const FORMAT_UNDERLINE = 8
const FORMAT_CODE = 16
const FORMAT_SUB = 32
const FORMAT_SUP = 64

function renderText(node: LexicalNode, key: string | number): React.ReactNode {
  let element: React.ReactNode = node.text ?? ''
  const f = typeof node.format === 'number' ? node.format : 0
  if (f & FORMAT_CODE) element = <code className="font-[family-name:var(--font-plex-mono)] text-[0.92em] bg-[var(--color-burgundy)]/[0.06] px-1.5 py-0.5 rounded">{element}</code>
  if (f & FORMAT_BOLD) element = <strong>{element}</strong>
  if (f & FORMAT_ITALIC) element = <em>{element}</em>
  if (f & FORMAT_UNDERLINE) element = <u>{element}</u>
  if (f & FORMAT_STRIKE) element = <s>{element}</s>
  if (f & FORMAT_SUB) element = <sub>{element}</sub>
  if (f & FORMAT_SUP) element = <sup>{element}</sup>
  return <React.Fragment key={key}>{element}</React.Fragment>
}

function renderChildren(children?: LexicalNode[]): React.ReactNode {
  if (!children?.length) return null
  return children.map((c, i) => renderNode(c, i))
}

function renderNode(node: LexicalNode, key: string | number): React.ReactNode {
  switch (node.type) {
    case 'text':
      return renderText(node, key)
    case 'linebreak':
      return <br key={key} />
    case 'paragraph': {
      const isLead = (node as { __lead?: boolean }).__lead === true
      const cls = isLead
        ? 'lead-paragraph my-6 font-[family-name:var(--font-lora)] text-[var(--color-charcoal)]'
        : 'leading-[1.85] my-6 text-[17.5px] md:text-[18.5px] font-[family-name:var(--font-lora)] text-[var(--color-charcoal)]'
      return (
        <p key={key} className={cls}>
          {renderChildren(node.children)}
        </p>
      )
    }
    case 'heading': {
      const Tag = (node.tag as 'h1' | 'h2' | 'h3' | 'h4') || 'h2'
      const sizeClass = {
        h1: 'text-4xl md:text-5xl mt-16 mb-6',
        h2: 'text-3xl md:text-4xl mt-14 mb-5',
        h3: 'text-2xl md:text-3xl mt-10 mb-4',
        h4: 'text-xl md:text-2xl mt-8 mb-3',
      }[Tag]
      return (
        <Tag
          key={key}
          className={`font-[family-name:var(--font-cormorant)] ${sizeClass} text-[var(--color-ink)] tracking-tight leading-tight`}
        >
          {renderChildren(node.children)}
        </Tag>
      )
    }
    case 'quote':
      return (
        <blockquote
          key={key}
          className="my-10 border-l-2 border-[var(--color-gold)] bg-[var(--color-burgundy-light)]/40 px-6 py-5 italic font-[family-name:var(--font-cormorant)] text-xl text-[var(--color-burgundy)] leading-snug"
        >
          {renderChildren(node.children)}
        </blockquote>
      )
    case 'list': {
      const Tag = node.tag === 'ol' ? 'ol' : 'ul'
      const cls =
        Tag === 'ol'
          ? 'list-decimal pl-6 my-6 space-y-2 marker:text-[var(--color-burgundy)] marker:font-[family-name:var(--font-cormorant)]'
          : 'pl-6 my-6 space-y-2'
      return (
        <Tag key={key} className={cls}>
          {renderChildren(node.children)}
        </Tag>
      )
    }
    case 'listitem': {
      const isUl = !node.value && node.value !== 0
      return (
        <li
          key={key}
          className="leading-[1.7] text-[17px] font-[family-name:var(--font-lora)] text-[var(--color-charcoal)] flex gap-3 items-start"
        >
          {isUl ? null : null}
          <span className="flex-1">{renderChildren(node.children)}</span>
        </li>
      )
    }
    case 'horizontalrule':
      return (
        <hr
          key={key}
          className="my-14 border-0 h-px bg-gradient-to-r from-transparent via-[var(--color-rule)] to-transparent"
        />
      )
    case 'link': {
      const href = node.fields?.url ?? '#'
      const newTab = node.fields?.newTab
      return (
        <a
          key={key}
          href={href}
          target={newTab ? '_blank' : undefined}
          rel={newTab ? 'noopener noreferrer' : undefined}
          className="text-[var(--color-burgundy)] underline-offset-[4px] decoration-[var(--color-gold)] decoration-[1.5px] underline hover:decoration-[var(--color-burgundy)] transition-colors"
        >
          {renderChildren(node.children)}
        </a>
      )
    }
    case 'upload': {
      const v = (node as unknown as { value?: { url?: string; alt?: string; width?: number; height?: number } }).value
      if (!v?.url) return null
      return (
        <figure key={key} className="my-10">
          <Image
            src={v.url}
            alt={v.alt || ''}
            width={v.width || 1600}
            height={v.height || 900}
            sizes="(min-width:1024px) 720px, 100vw"
            className="w-full h-auto"
          />
          {v.alt ? (
            <figcaption className="mt-3 text-sm italic text-[var(--color-ink-muted)] font-[family-name:var(--font-lora)]">
              {v.alt}
            </figcaption>
          ) : null}
        </figure>
      )
    }
    default:
      // Unknown nodes: render children if present
      if (node.children) return <React.Fragment key={key}>{renderChildren(node.children)}</React.Fragment>
      return null
  }
}

type LexicalRoot = { root: LexicalNode } | null | undefined

export default function LexicalContent({ data }: { data: LexicalRoot }) {
  if (!data?.root?.children?.length) {
    return null
  }
  // Tag the first top-level paragraph so it renders with .lead-paragraph (drop-cap).
  // Walks until it finds a paragraph (skipping headings, hr, etc.).
  const children = [...data.root.children] as LexicalNode[]
  for (let i = 0; i < children.length; i++) {
    if (children[i]?.type === 'paragraph') {
      children[i] = { ...children[i], __lead: true } as LexicalNode
      break
    }
    if (children[i]?.type === 'heading' || children[i]?.type === 'horizontalrule') continue
    // Stop at any block that isn't a heading/hr but also isn't a paragraph (unlikely, but safe).
    break
  }
  return <>{renderChildren(children)}</>
}
