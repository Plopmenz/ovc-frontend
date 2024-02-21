"use client"

import sanitizeHtml from "sanitize-html"

import { RichTextArea } from "./rich-textarea"

const allowedClasses = ["ql-indent-*", "ql-font-*", "ql-size-*"]

const defaultOptions = {
  ...sanitizeHtml.defaults,
  allowedTags: [...sanitizeHtml.defaults.allowedTags, "img"],
  allowedClasses: {
    p: allowedClasses,
    span: allowedClasses,
    a: allowedClasses,
    h1: allowedClasses,
    h2: allowedClasses,

    strong: allowedClasses,
    em: allowedClasses,
    s: allowedClasses,
    u: allowedClasses,

    blockquote: allowedClasses,
    ol: allowedClasses,
    ul: allowedClasses,
    li: allowedClasses,
  },
  allowedSchemes: [...sanitizeHtml.defaults.allowedSchemes, "data"],
  disallowedTagsMode: "recursiveEscape",
} as sanitizeHtml.IOptions

const sanitize = (dirty: string, options?: sanitizeHtml.IOptions) =>
  sanitizeHtml(dirty, { ...defaultOptions, ...options })

const SanitizeHTML = ({
  html,
  options,
}: {
  html: string
  options?: sanitizeHtml.IOptions
}) => (
  <RichTextArea
    value={sanitize(html, options)}
    readOnly={true}
    modules={{ toolbar: false }}
  />
)

export { SanitizeHTML }
