/**
 * Server-renderable converter for PayloadCMS Lexical JSON.
 * Supports the feature set we configured in payload.config.ts:
 * heading, paragraph, list, listitem, quote, horizontalrule, link, text (formats), upload.
 */
import Image from 'next/image'
import React from 'react'
import {
  normalizeLexicalChildren,
  type LexNode,
  type MdTableNode,
} from '@/lib/lexical-normalize'

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
        ? 'lead-paragraph my-6 font-[family-name:var(--font-lora)] text-[var(--color-body)]'
        : 'leading-[1.85] my-6 text-[17.5px] md:text-[18.5px] font-[family-name:var(--font-lora)] text-[var(--color-body)]'
      return (
        <p key={key} className={cls}>
          {renderChildren(node.children)}
        </p>
      )
    }
    case 'heading': {
      // The page's <h1> belongs to ArticleHero / page title. Body content
      // never owns the page heading — demote any `h1` the editor emits to
      // `h2` so we keep exactly one <h1> per page (UI audit CX-2 / a11y).
      const rawTag = (node.tag as 'h1' | 'h2' | 'h3' | 'h4') || 'h2'
      const Tag = rawTag === 'h1' ? 'h2' : rawTag
      const sizeClass = {
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
      // QA-LPRO-041/085: list items used to render as flex rows (span.flex-1),
      // which suppresses ::marker — ordered lists showed no numbers and
      // unordered lists no bullets. Native list rendering restored.
      const Tag = node.tag === 'ol' ? 'ol' : 'ul'
      const cls =
        Tag === 'ol'
          ? 'list-decimal pl-6 my-6 space-y-2 marker:text-[var(--color-burgundy)] marker:font-[family-name:var(--font-cormorant)]'
          : 'list-disc pl-6 my-6 space-y-2 marker:text-[var(--color-gold)]'
      return (
        <Tag key={key} className={cls}>
          {renderChildren(node.children)}
        </Tag>
      )
    }
    case 'listitem': {
      return (
        <li
          key={key}
          className="leading-[1.7] text-[17px] font-[family-name:var(--font-lora)] text-[var(--color-body)] pl-1"
        >
          {renderChildren(node.children)}
        </li>
      )
    }
    case 'md-table': {
      // Table recovered from a space-joined markdown pipe table (QA-LPRO-026/030).
      const t = node as unknown as MdTableNode
      const th =
        'border border-[var(--color-line)] bg-[var(--color-parchment)] px-4 py-2.5 text-left font-[family-name:var(--font-inter)] text-[12px] uppercase tracking-[0.08em] text-[var(--color-burgundy)]'
      const td =
        'border border-[var(--color-line)] px-4 py-2.5 align-top font-[family-name:var(--font-lora)] text-[16px] text-[var(--color-body)]'
      return (
        <div key={key} className="my-8 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr>
                {t.header.map((c, i) => (
                  <th key={i} scope="col" className={th}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {t.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((c, ci) => (
                    <td key={ci} className={td}>
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

export default function LexicalContent({ data, title }: { data: LexicalRoot; title?: string }) {
  if (!data?.root?.children?.length) {
    return null
  }
  // Recover block structure the original markdown import flattened (literal
  // "###" headings, " - " list runs, pipe tables, stray backticks) and drop a
  // leading heading that duplicates the page title. See lib/lexical-normalize.
  const children = normalizeLexicalChildren(
    data.root.children as LexNode[],
    { title },
  ) as LexicalNode[]
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
