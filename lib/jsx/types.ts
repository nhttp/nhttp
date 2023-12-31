// Credit : https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts
/// <reference lib="dom" />
// deno-lint-ignore no-explicit-any
type TAny = any;
type Bool = boolean | "true" | "false";
// deno-lint-ignore ban-types
type EObject = {};
type AnyStr = string & EObject;
type BoolStr = "true" | "false";
type HxSwap =
  | "innerHTML"
  | "outerHTML"
  | "beforebegin"
  | "afterbegin"
  | "beforeend"
  | "afterend"
  | "delete"
  | "none"
  | "morph"
  | "morphdom";
type HxTarget = "this" | "closest " | "find " | "next " | "previous ";
type HxSync =
  | ":drop"
  | ":abort"
  | ":replace"
  | ":queue"
  | ":queue first"
  | ":queue last"
  | ":queue all";
type HxTriggerModifier =
  | " once"
  | " changed"
  | " delay:"
  | " throttle:"
  | " from:"
  | " target:"
  | " consume"
  | " queue:first"
  | " queue:last"
  | " queue:all"
  | " queue:none";
// deno-lint-ignore no-namespace
export namespace NJSX {
  export interface HTMXAttributes {
    /**
     * Hyperscript.
     * @see https://hyperscript.org/
     */
    _?: string;
    /**
     * Issues a `GET` to the specified URL.
     * @see https://htmx.org/attributes/hx-get/
     */
    "hx-get"?: string;
    /**
     * Issues a `POST` to the specified URL.
     * @see https://htmx.org/attributes/hx-post/
     */
    "hx-post"?: string;
    /**
     * Issues a `PUT` to the specified URL.
     * @see https://htmx.org/attributes/hx-put/
     */
    "hx-put"?: string;
    /**
     * Issues a `DELETE` to the specified URL.
     * @see https://htmx.org/attributes/hx-delete/
     */
    "hx-delete"?: string;
    /**
     * Issues a `PATCH` to the specified URL.
     * @see https://htmx.org/attributes/hx-patch/
     */
    "hx-patch"?: string;
    /**
     * Add or remove [progressive enhancement] for links and forms.
     * @see https://htmx.org/attributes/hx-boost/
     *
     * [progressive enhancement]: https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement
     */
    "hx-boost"?: BoolStr;
    /**
     * Handle any event with a script inline.
     * @see https://htmx.org/attributes/hx-on/
     * @remarks Event listeners on htmx-specific events need to be specified with a spread attribute, and
     * 			 		are otherwise not supported in vanilla JSX.
     * ```jsx
     * <div {...{'hx-on::before-request': '...'}} />
     * ```
     * @since 1.9.3
     */
    "hx-on:"?: string;
    /**
     * Handle any event with a script inline. Each listener is specified on a separate line.
     * @see https://htmx.org/attributes/hx-on/
     * @remarks Superseded by `hx-on:$event`, unless IE11 support is required.
     * @since 1.9.0
     */
    "hx-on"?: string;
    /**
     * Pushes the URL into the browser location bar, creating a new history entry.
     * @see https://htmx.org/attributes/hx-push-url/
     */
    "hx-push-url"?: BoolStr | AnyStr;
    /**
     * Select content to swap in from a response.
     * @see https://htmx.org/attributes/hx-select/
     */
    "hx-select"?: string;
    /**
     * Select content to swap in from a response, out of band (somewhere other than the target).
     * @see https://htmx.org/attributes/hx-select-oob/
     */
    "hx-select-oob"?: string;
    /**
     * Controls how content is swapped in (`outerHTML`, `beforeend`, `afterend`, …).
     * @see https://htmx.org/attributes/hx-swap/
     * @see {@linkcode InsertPosition} which is used in [{@linkcode Element.insertAdjacentHTML}](https://developer.mozilla.org/docs/Web/API/Element/insertAdjacentHTML)
     * @remarks
     * - `morph` swaps are part of the {@linkcode HtmxBuiltinExtensions.idiomorph idiomorph} extension.
     * - `morphdom` swaps are part of the {@linkcode HtmxBuiltinExtensions.morphdom morphdom} extension.
     */
    "hx-swap"?: HxSwap | AnyStr;
    /**
     * Marks content in a response to be out of band (should swap in somewhere other than the target).
     * @see https://htmx.org/attributes/hx-swap-oob/
     */
    "hx-swap-oob"?: "true" | HxSwap | AnyStr;
    /**
     * Specifies the target element to be swapped.
     * @see https://htmx.org/attributes/hx-target/
     */
    "hx-target"?: HxTarget | AnyStr;
    /**
     * Specifies the event that triggers the request.
     * @see https://htmx.org/attributes/hx-trigger/
     */
    "hx-trigger"?: "every " | HxTriggerModifier | AnyStr;
    /**
     * Adds values to the parameters to submit with the request (JSON-formatted).
     * @see https://htmx.org/attributes/hx-params/
     */
    "hx-vals"?: AnyStr | "javascript:" | "js:" | Record<PropertyKey, unknown>;
    /**
     * Shows a `confirm()` dialog before issuing a request.
     * @see https://htmx.org/attributes/hx-confirm/
     */
    "hx-confirm"?: string;
    /**
     * Disables htmx processing for the given node and any children nodes.
     * @see https://htmx.org/attributes/hx-disable/
     */
    "hx-disable"?: boolean;
    /**
     * Control and disable automatic attribute inheritance for child nodes.
     * @see https://htmx.org/attributes/hx-disinherit/
     */
    "hx-disinherit"?: "*" | AnyStr;
    /**
     * Changes the request encoding type.
     * @see https://htmx.org/attributes/hx-encoding/
     */
    "hx-encoding"?: "multipart/form-data";
    /**
     * Extensions to use for this element.
     * @see https://htmx.org/attributes/hx-ext/
     * @see {@linkcode HtmxBuiltinExtensions} for how to declare extensions in JSX.
     */
    "hx-ext"?:
      | "ignore:"
      | AnyStr;
    /**
     * Adds to the headers that will be submitted with the request.
     * @see https://htmx.org/attributes/hx-headers/
     */
    "hx-headers"?:
      | AnyStr
      | "javascript:"
      | "js:"
      | Record<PropertyKey, unknown>;
    /**
     * Prevent sensitive data being saved to the history cache.
     * @see https://htmx.org/attributes/hx-history/
     */
    "hx-history"?: "false";
    /**
     * The element to snapshot and restore during history navigation.
     * @see https://htmx.org/attributes/hx-history-elt/
     */
    "hx-history-elt"?: boolean;
    /**
     * Include additional data in requests.
     * @see https://htmx.org/attributes/hx-include/
     */
    "hx-include"?: string;
    /**
     * The element to put the `htmx-request` class on during the request.
     * @see https://htmx.org/attributes/hx-indicator/
     */
    "hx-indicator"?: string;
    /**
     * Filters the parameters that will be submitted with a request.
     * @see https://htmx.org/attributes/hx-params/
     */
    "hx-params"?: "*" | "none" | "not " | AnyStr;
    /**
     * Specifies elements to keep unchanged between requests.
     * @see https://htmx.org/attributes/hx-preserve/
     * @remarks `true` is only observed by the `head-support` extension,
     * 			 		where it prevents an element from being removed from the `<head>`.
     */
    "hx-preserve"?: boolean | "true";
    /**
     * Shows a `prompt()` before submitting a request.
     * @see https://htmx.org/attributes/hx-prompt/
     */
    "hx-prompt"?: string;
    /**
     * Replace the URL in the browser location bar.
     * @see https://htmx.org/attributes/hx-replace-url/
     */
    "hx-replace-url"?: BoolStr | AnyStr;
    /**
     * Configures various aspects of the request.
     * @see https://htmx.org/attributes/hx-request/
     */
    "hx-request"?:
      | '"timeout":'
      | '"credentials":'
      | '"noHeaders":'
      | "javascript:"
      | "js:"
      | AnyStr;
    /**
     * Control how requests made by different elements are synchronized.
     * @see https://htmx.org/attributes/hx-sync/
     */
    "hx-sync"?: HxSync | AnyStr;
    /**
     * Force elements to validate themselves before a request.
     * @see https://htmx.org/attributes/hx-validate/
     */
    "hx-validate"?: boolean;
    /**
     * Adds values dynamically to the parameters to submit with the request.
     * @deprecated superseded by `hx-vals`
     */
    "hx-vars"?: AnyStr;
    /**
     * The URL of the SSE server.
     * @see https://htmx.org/extensions/server-sent-events/
     */
    "sse-connect"?: string;
    /**
     * The name of the message to swap into the DOM.
     * @see https://htmx.org/extensions/server-sent-events/
     */
    "sse-swap"?: string;
    /**
     * A URL to establish a WebSocket connection against.
     * @see https://htmx.org/extensions/web-sockets/
     */
    "ws-connect"?: string;
    /**
     * Sends a message to the nearest websocket based on the trigger value for the element.
     * @see https://htmx.org/extensions/web-sockets/
     */
    "ws-send"?: boolean;
    /**
     * Apply class transitions on this element.
     * @see https://htmx.org/extensions/class-tools/
     */
    "classes"?: "add " | "remove " | "toggle " | AnyStr;
    /**
     * The element or elements to disable during requests.
     * Accepts CSS selectors.
     * @see https://htmx.org/extensions/disable-element/
     */
    "hx-disable-element"?: "self" | AnyStr;
    /**
     * The strategy for merging new head content.
     * @see https://htmx.org/extensions/head-support/
     */
    "hx-head"?: "merge" | "append" | "re-eval";
  }
  export interface AriaAttributes {
    /** Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application. */
    "aria-activedescendant"?: string | undefined;
    /** Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute. */
    "aria-atomic"?: Bool | undefined;
    /**
     * Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be
     * presented if they are made.
     */
    "aria-autocomplete"?: "none" | "inline" | "list" | "both" | undefined;
    /** Indicates an element is being modified and that assistive technologies MAY want to wait until the modifications are complete before exposing them to the user. */
    /**
     * Defines a string value that labels the current element, which is intended to be converted into Braille.
     * @see aria-label.
     */
    "aria-braillelabel"?: string | undefined;
    /**
     * Defines a human-readable, author-localized abbreviated description for the role of an element, which is intended to be converted into Braille.
     * @see aria-roledescription.
     */
    "aria-brailleroledescription"?: string | undefined;
    "aria-busy"?: Bool | undefined;
    /**
     * Indicates the current "checked" state of checkboxes, radio buttons, and other widgets.
     * @see aria-pressed @see aria-selected.
     */
    "aria-checked"?: boolean | "false" | "mixed" | "true" | undefined;
    /**
     * Defines the total number of columns in a table, grid, or treegrid.
     * @see aria-colindex.
     */
    "aria-colcount"?: number | undefined;
    /**
     * Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid.
     * @see aria-colcount @see aria-colspan.
     */
    "aria-colindex"?: number | undefined;
    /**
     * Defines a human readable text alternative of aria-colindex.
     * @see aria-rowindextext.
     */
    "aria-colindextext"?: string | undefined;
    /**
     * Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid.
     * @see aria-colindex @see aria-rowspan.
     */
    "aria-colspan"?: number | undefined;
    /**
     * Identifies the element (or elements) whose contents or presence are controlled by the current element.
     * @see aria-owns.
     */
    "aria-controls"?: string | undefined;
    /** Indicates the element that represents the current item within a container or set of related elements. */
    "aria-current"?:
      | boolean
      | "false"
      | "true"
      | "page"
      | "step"
      | "location"
      | "date"
      | "time"
      | undefined;
    /**
     * Identifies the element (or elements) that describes the object.
     * @see aria-labelledby
     */
    "aria-describedby"?: string | undefined;
    /**
     * Defines a string value that describes or annotates the current element.
     * @see related aria-describedby.
     */
    "aria-description"?: string | undefined;
    /**
     * Identifies the element that provides a detailed, extended description for the object.
     * @see aria-describedby.
     */
    "aria-details"?: string | undefined;
    /**
     * Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.
     * @see aria-hidden @see aria-readonly.
     */
    "aria-disabled"?: Bool | undefined;
    /**
     * Indicates what functions can be performed when a dragged object is released on the drop target.
     * @deprecated in ARIA 1.1
     */
    "aria-dropeffect"?:
      | "none"
      | "copy"
      | "execute"
      | "link"
      | "move"
      | "popup"
      | undefined;
    /**
     * Identifies the element that provides an error message for the object.
     * @see aria-invalid @see aria-describedby.
     */
    "aria-errormessage"?: string | undefined;
    /** Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed. */
    "aria-expanded"?: Bool | undefined;
    /**
     * Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion,
     * allows assistive technology to override the general default of reading in document source order.
     */
    "aria-flowto"?: string | undefined;
    /**
     * Indicates an element's "grabbed" state in a drag-and-drop operation.
     * @deprecated in ARIA 1.1
     */
    "aria-grabbed"?: Bool | undefined;
    /** Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element. */
    "aria-haspopup"?:
      | boolean
      | "false"
      | "true"
      | "menu"
      | "listbox"
      | "tree"
      | "grid"
      | "dialog"
      | undefined;
    /**
     * Indicates whether the element is exposed to an accessibility API.
     * @see aria-disabled.
     */
    "aria-hidden"?: Bool | undefined;
    /**
     * Indicates the entered value does not conform to the format expected by the application.
     * @see aria-errormessage.
     */
    "aria-invalid"?:
      | boolean
      | "false"
      | "true"
      | "grammar"
      | "spelling"
      | undefined;
    /** Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element. */
    "aria-keyshortcuts"?: string | undefined;
    /**
     * Defines a string value that labels the current element.
     * @see aria-labelledby.
     */
    "aria-label"?: string | undefined;
    /**
     * Identifies the element (or elements) that labels the current element.
     * @see aria-describedby.
     */
    "aria-labelledby"?: string | undefined;
    /** Defines the hierarchical level of an element within a structure. */
    "aria-level"?: number | undefined;
    /** Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region. */
    "aria-live"?: "off" | "assertive" | "polite" | undefined;
    /** Indicates whether an element is modal when displayed. */
    "aria-modal"?: Bool | undefined;
    /** Indicates whether a text box accepts multiple lines of input or only a single line. */
    "aria-multiline"?: Bool | undefined;
    /** Indicates that the user may select more than one item from the current selectable descendants. */
    "aria-multiselectable"?: Bool | undefined;
    /** Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous. */
    "aria-orientation"?: "horizontal" | "vertical" | undefined;
    /**
     * Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship
     * between DOM elements where the DOM hierarchy cannot be used to represent the relationship.
     * @see aria-controls.
     */
    "aria-owns"?: string | undefined;
    /**
     * Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value.
     * A hint could be a sample value or a brief description of the expected format.
     */
    "aria-placeholder"?: string | undefined;
    /**
     * Defines an element's number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
     * @see aria-setsize.
     */
    "aria-posinset"?: number | undefined;
    /**
     * Indicates the current "pressed" state of toggle buttons.
     * @see aria-checked @see aria-selected.
     */
    "aria-pressed"?: boolean | "false" | "mixed" | "true" | undefined;
    /**
     * Indicates that the element is not editable, but is otherwise operable.
     * @see aria-disabled.
     */
    "aria-readonly"?: Bool | undefined;
    /**
     * Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified.
     * @see aria-atomic.
     */
    "aria-relevant"?:
      | "additions"
      | "additions removals"
      | "additions text"
      | "all"
      | "removals"
      | "removals additions"
      | "removals text"
      | "text"
      | "text additions"
      | "text removals"
      | undefined;
    /** Indicates that user input is required on the element before a form may be submitted. */
    "aria-required"?: Bool | undefined;
    /** Defines a human-readable, author-localized description for the role of an element. */
    "aria-roledescription"?: string | undefined;
    /**
     * Defines the total number of rows in a table, grid, or treegrid.
     * @see aria-rowindex.
     */
    "aria-rowcount"?: number | undefined;
    /**
     * Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid.
     * @see aria-rowcount @see aria-rowspan.
     */
    "aria-rowindex"?: number | undefined;
    /**
     * Defines a human readable text alternative of aria-rowindex.
     * @see aria-colindextext.
     */
    "aria-rowindextext"?: string | undefined;
    /**
     * Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid.
     * @see aria-rowindex @see aria-colspan.
     */
    "aria-rowspan"?: number | undefined;
    /**
     * Indicates the current "selected" state of various widgets.
     * @see aria-checked @see aria-pressed.
     */
    "aria-selected"?: Bool | undefined;
    /**
     * Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
     * @see aria-posinset.
     */
    "aria-setsize"?: number | undefined;
    /** Indicates if items in a table or grid are sorted in ascending or descending order. */
    "aria-sort"?: "none" | "ascending" | "descending" | "other" | undefined;
    /** Defines the maximum allowed value for a range widget. */
    "aria-valuemax"?: number | undefined;
    /** Defines the minimum allowed value for a range widget. */
    "aria-valuemin"?: number | undefined;
    /**
     * Defines the current value for a range widget.
     * @see aria-valuetext.
     */
    "aria-valuenow"?: number | undefined;
    /** Defines the human readable text alternative of aria-valuenow for a range widget. */
    "aria-valuetext"?: string | undefined;
  }

  // All the WAI-ARIA 1.1 role attribute values from https://www.w3.org/TR/wai-aria-1.1/#role_definitions
  type AriaRole =
    | "alert"
    | "alertdialog"
    | "application"
    | "article"
    | "banner"
    | "button"
    | "cell"
    | "checkbox"
    | "columnheader"
    | "combobox"
    | "complementary"
    | "contentinfo"
    | "definition"
    | "dialog"
    | "directory"
    | "document"
    | "feed"
    | "figure"
    | "form"
    | "grid"
    | "gridcell"
    | "group"
    | "heading"
    | "img"
    | "link"
    | "list"
    | "listbox"
    | "listitem"
    | "log"
    | "main"
    | "marquee"
    | "math"
    | "menu"
    | "menubar"
    | "menuitem"
    | "menuitemcheckbox"
    | "menuitemradio"
    | "navigation"
    | "none"
    | "note"
    | "option"
    | "presentation"
    | "progressbar"
    | "radio"
    | "radiogroup"
    | "region"
    | "row"
    | "rowgroup"
    | "rowheader"
    | "scrollbar"
    | "search"
    | "searchbox"
    | "separator"
    | "slider"
    | "spinbutton"
    | "status"
    | "switch"
    | "tab"
    | "table"
    | "tablist"
    | "tabpanel"
    | "term"
    | "textbox"
    | "timer"
    | "toolbar"
    | "tooltip"
    | "tree"
    | "treegrid"
    | "treeitem"
    // deno-lint-ignore ban-types
    | (string & {});
  type DOMCSSProperties = {
    [
      key in keyof Omit<
        CSSStyleDeclaration,
        | "item"
        | "setProperty"
        | "removeProperty"
        | "getPropertyValue"
        | "getPropertyPriority"
      >
    ]?: string | number | null | undefined;
  };
  type AllCSSProperties = {
    [key: string]: string | number | null | undefined;
  };
  export interface CSSProperties extends AllCSSProperties, DOMCSSProperties {}
  export interface HTMLAttributes extends AriaAttributes, HTMXAttributes {
    style?: CSSProperties;
    dangerouslySetInnerHTML?: { __html: string };
    accessKey?: string;
    autoFocus?: boolean;
    disabled?: boolean;
    class?: string;
    className?: string;
    contentEditable?: boolean | "inherit";
    contextMenu?: string;
    dir?: string;
    draggable?: boolean;
    hidden?: boolean;
    id?: string;
    lang?: string;
    nonce?: string;
    placeholder?: string;
    slot?: string;
    spellCheck?: boolean;
    tabIndex?: number;
    title?: string;
    translate?: "yes" | "no";
    type?: string;
    name?: string;
    radioGroup?: string | undefined;
    role?: AriaRole | undefined;
    // RDFa Attributes
    about?: string | undefined;
    content?: string | undefined;
    datatype?: string | undefined;
    inlist?: TAny;
    prefix?: string | undefined;
    property?: string | undefined;
    rel?: string | undefined;
    resource?: string | undefined;
    rev?: string | undefined;
    typeof?: string | undefined;
    vocab?: string | undefined;
    // Non-standard Attributes
    autoCapitalize?: string | undefined;
    autoCorrect?: string | undefined;
    autoSave?: string | undefined;
    color?: string | undefined;
    itemProp?: string | undefined;
    itemScope?: boolean | undefined;
    itemType?: string | undefined;
    itemID?: string | undefined;
    itemRef?: string | undefined;
    results?: number | undefined;
    security?: string | undefined;
    unselectable?: "on" | "off" | undefined;
    inputMode?:
      | "none"
      | "text"
      | "tel"
      | "url"
      | "email"
      | "numeric"
      | "decimal"
      | "search"
      | undefined;
    is?: string | undefined;
    [k: string]: unknown;
  }
  type HTMLAttributeReferrerPolicy =
    | ""
    | "no-referrer"
    | "no-referrer-when-downgrade"
    | "origin"
    | "origin-when-cross-origin"
    | "same-origin"
    | "strict-origin"
    | "strict-origin-when-cross-origin"
    | "unsafe-url";

  type HTMLAttributeAnchorTarget =
    | "_self"
    | "_blank"
    | "_parent"
    | "_top"
    | (string & EObject);
  export interface AnchorHTMLAttributes extends HTMLAttributes {
    download?: TAny;
    href?: string | undefined;
    hrefLang?: string | undefined;
    media?: string | undefined;
    ping?: string | undefined;
    target?: HTMLAttributeAnchorTarget | undefined;
    type?: string | undefined;
    referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
  }
  // deno-lint-ignore no-empty-interface
  export interface AudioHTMLAttributes extends MediaHTMLAttributes {}

  export interface AreaHTMLAttributes extends HTMLAttributes {
    alt?: string | undefined;
    coords?: string | undefined;
    download?: TAny;
    href?: string | undefined;
    hrefLang?: string | undefined;
    media?: string | undefined;
    referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
    shape?: string | undefined;
    target?: string | undefined;
  }

  export interface BaseHTMLAttributes extends HTMLAttributes {
    href?: string | undefined;
    target?: string | undefined;
  }

  export interface BlockquoteHTMLAttributes extends HTMLAttributes {
    cite?: string | undefined;
  }

  export interface ButtonHTMLAttributes extends HTMLAttributes {
    disabled?: boolean | undefined;
    form?: string | undefined;
    formAction?:
      | string
      | EObject[
        keyof EObject
      ]
      | undefined;
    formEncType?: string | undefined;
    formMethod?: string | undefined;
    formNoValidate?: boolean | undefined;
    formTarget?: string | undefined;
    name?: string | undefined;
    type?: "submit" | "reset" | "button" | undefined;
    value?: string | readonly string[] | number | undefined;
  }

  export interface CanvasHTMLAttributes extends HTMLAttributes {
    height?: number | string | undefined;
    width?: number | string | undefined;
  }

  export interface ColHTMLAttributes extends HTMLAttributes {
    span?: number | undefined;
    width?: number | string | undefined;
  }

  export interface ColgroupHTMLAttributes extends HTMLAttributes {
    span?: number | undefined;
  }

  export interface DataHTMLAttributes extends HTMLAttributes {
    value?: string | readonly string[] | number | undefined;
  }

  export interface DetailsHTMLAttributes extends HTMLAttributes {
    open?: boolean | undefined;
  }

  export interface DelHTMLAttributes extends HTMLAttributes {
    cite?: string | undefined;
    dateTime?: string | undefined;
  }

  export interface DialogHTMLAttributes extends HTMLAttributes {
    open?: boolean | undefined;
  }

  export interface EmbedHTMLAttributes extends HTMLAttributes {
    height?: number | string | undefined;
    src?: string | undefined;
    type?: string | undefined;
    width?: number | string | undefined;
  }

  export interface FieldsetHTMLAttributes extends HTMLAttributes {
    disabled?: boolean | undefined;
    form?: string | undefined;
    name?: string | undefined;
  }

  export interface FormHTMLAttributes extends HTMLAttributes {
    acceptCharset?: string | undefined;
    action?:
      | string
      | undefined
      | EObject[
        keyof EObject
      ];
    autoComplete?: string | undefined;
    encType?: string | undefined;
    method?: string | undefined;
    name?: string | undefined;
    noValidate?: boolean | undefined;
    target?: string | undefined;
  }

  export interface HtmlHTMLAttributes extends HTMLAttributes {
    manifest?: string | undefined;
  }

  export interface IframeHTMLAttributes extends HTMLAttributes {
    allow?: string | undefined;
    allowFullScreen?: boolean | undefined;
    allowTransparency?: boolean | undefined;
    /** @deprecated */
    frameBorder?: number | string | undefined;
    height?: number | string | undefined;
    loading?: "eager" | "lazy" | undefined;
    /** @deprecated */
    marginHeight?: number | undefined;
    /** @deprecated */
    marginWidth?: number | undefined;
    name?: string | undefined;
    referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
    sandbox?: string | undefined;
    /** @deprecated */
    scrolling?: string | undefined;
    seamless?: boolean | undefined;
    src?: string | undefined;
    srcDoc?: string | undefined;
    width?: number | string | undefined;
  }
  type CrossOrigin = "anonymous" | "use-credentials" | "" | undefined;
  export interface ImgHTMLAttributes extends HTMLAttributes {
    alt?: string | undefined;
    crossOrigin?: CrossOrigin;
    decoding?: "async" | "auto" | "sync" | undefined;
    height?: number | string | undefined;
    loading?: "eager" | "lazy" | undefined;
    referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
    sizes?: string | undefined;
    src?: string | undefined;
    srcSet?: string | undefined;
    useMap?: string | undefined;
    width?: number | string | undefined;
  }

  export interface InsHTMLAttributes extends HTMLAttributes {
    cite?: string | undefined;
    dateTime?: string | undefined;
  }

  type HTMLInputTypeAttribute =
    | "button"
    | "checkbox"
    | "color"
    | "date"
    | "datetime-local"
    | "email"
    | "file"
    | "hidden"
    | "image"
    | "month"
    | "number"
    | "password"
    | "radio"
    | "range"
    | "reset"
    | "search"
    | "submit"
    | "tel"
    | "text"
    | "time"
    | "url"
    | "week"
    | (string & EObject);

  export interface InputHTMLAttributes extends HTMLAttributes {
    accept?: string | undefined;
    alt?: string | undefined;
    autoComplete?: string | undefined;
    capture?: boolean | "user" | "environment" | undefined; // https://www.w3.org/TR/html-media-capture/#the-capture-attribute
    checked?: boolean | undefined;
    disabled?: boolean | undefined;
    enterKeyHint?:
      | "enter"
      | "done"
      | "go"
      | "next"
      | "previous"
      | "search"
      | "send"
      | undefined;
    form?: string | undefined;
    formAction?:
      | string
      | EObject[
        keyof EObject
      ]
      | undefined;
    formEncType?: string | undefined;
    formMethod?: string | undefined;
    formNoValidate?: boolean | undefined;
    formTarget?: string | undefined;
    height?: number | string | undefined;
    list?: string | undefined;
    max?: number | string | undefined;
    maxLength?: number | undefined;
    min?: number | string | undefined;
    minLength?: number | undefined;
    multiple?: boolean | undefined;
    name?: string | undefined;
    pattern?: string | undefined;
    placeholder?: string | undefined;
    readOnly?: boolean | undefined;
    required?: boolean | undefined;
    size?: number | undefined;
    src?: string | undefined;
    step?: number | string | undefined;
    type?: HTMLInputTypeAttribute | undefined;
    value?: string | readonly string[] | number | undefined;
    width?: number | string | undefined;
  }

  export interface KeygenHTMLAttributes extends HTMLAttributes {
    challenge?: string | undefined;
    disabled?: boolean | undefined;
    form?: string | undefined;
    keyType?: string | undefined;
    keyParams?: string | undefined;
    name?: string | undefined;
  }

  export interface LabelHTMLAttributes extends HTMLAttributes {
    form?: string | undefined;
    htmlFor?: string | undefined;
    for?: string | undefined;
  }

  export interface LiHTMLAttributes extends HTMLAttributes {
    value?: string | readonly string[] | number | undefined;
  }

  export interface LinkHTMLAttributes extends HTMLAttributes {
    as?: string | undefined;
    crossOrigin?: CrossOrigin;
    fetchPriority?: "high" | "low" | "auto";
    href?: string | undefined;
    hrefLang?: string | undefined;
    integrity?: string | undefined;
    media?: string | undefined;
    imageSrcSet?: string | undefined;
    imageSizes?: string | undefined;
    referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
    sizes?: string | undefined;
    type?: string | undefined;
    charSet?: string | undefined;
  }

  export interface MapHTMLAttributes extends HTMLAttributes {
    name?: string | undefined;
  }

  export interface MenuHTMLAttributes extends HTMLAttributes {
    type?: string | undefined;
  }

  export interface MediaHTMLAttributes extends HTMLAttributes {
    autoPlay?: boolean | undefined;
    controls?: boolean | undefined;
    controlsList?: string | undefined;
    crossOrigin?: CrossOrigin;
    loop?: boolean | undefined;
    mediaGroup?: string | undefined;
    muted?: boolean | undefined;
    playsInline?: boolean | undefined;
    preload?: string | undefined;
    src?: string | undefined;
  }

  export interface MetaHTMLAttributes extends HTMLAttributes {
    charSet?: string | undefined;
    httpEquiv?: string | undefined;
    name?: string | undefined;
    media?: string | undefined;
    content?: string | undefined;
  }

  export interface MeterHTMLAttributes extends HTMLAttributes {
    form?: string | undefined;
    high?: number | undefined;
    low?: number | undefined;
    max?: number | string | undefined;
    min?: number | string | undefined;
    optimum?: number | undefined;
    value?: string | readonly string[] | number | undefined;
  }

  export interface QuoteHTMLAttributes extends HTMLAttributes {
    cite?: string | undefined;
  }

  export interface ObjectHTMLAttributes extends HTMLAttributes {
    classID?: string | undefined;
    data?: string | undefined;
    form?: string | undefined;
    height?: number | string | undefined;
    name?: string | undefined;
    type?: string | undefined;
    useMap?: string | undefined;
    width?: number | string | undefined;
    wmode?: string | undefined;
  }

  export interface OlHTMLAttributes extends HTMLAttributes {
    reversed?: boolean | undefined;
    start?: number | undefined;
    type?: "1" | "a" | "A" | "i" | "I" | undefined;
  }

  export interface OptgroupHTMLAttributes extends HTMLAttributes {
    disabled?: boolean | undefined;
    label?: string | undefined;
  }

  export interface OptionHTMLAttributes extends HTMLAttributes {
    disabled?: boolean | undefined;
    label?: string | undefined;
    selected?: boolean | undefined;
    value?: string | readonly string[] | number | undefined;
  }

  export interface OutputHTMLAttributes extends HTMLAttributes {
    form?: string | undefined;
    htmlFor?: string | undefined;
    for?: string | undefined;
    name?: string | undefined;
  }

  export interface ParamHTMLAttributes extends HTMLAttributes {
    name?: string | undefined;
    value?: string | readonly string[] | number | undefined;
  }

  export interface ProgressHTMLAttributes extends HTMLAttributes {
    max?: number | string | undefined;
    value?: string | readonly string[] | number | undefined;
  }

  export interface SlotHTMLAttributes extends HTMLAttributes {
    name?: string | undefined;
  }

  export interface ScriptHTMLAttributes extends HTMLAttributes {
    async?: boolean | undefined;
    /** @deprecated */
    charSet?: string | undefined;
    crossOrigin?: CrossOrigin;
    defer?: boolean | undefined;
    integrity?: string | undefined;
    noModule?: boolean | undefined;
    referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
    src?: string | undefined;
    type?: string | undefined;
  }

  export interface SelectHTMLAttributes extends HTMLAttributes {
    autoComplete?: string | undefined;
    disabled?: boolean | undefined;
    form?: string | undefined;
    multiple?: boolean | undefined;
    name?: string | undefined;
    required?: boolean | undefined;
    size?: number | undefined;
    value?: string | readonly string[] | number | undefined;
  }

  export interface SourceHTMLAttributes extends HTMLAttributes {
    height?: number | string | undefined;
    media?: string | undefined;
    sizes?: string | undefined;
    src?: string | undefined;
    srcSet?: string | undefined;
    type?: string | undefined;
    width?: number | string | undefined;
  }

  export interface StyleHTMLAttributes extends HTMLAttributes {
    media?: string | undefined;
    scoped?: boolean | undefined;
    type?: string | undefined;
  }

  export interface TableHTMLAttributes extends HTMLAttributes {
    align?: "left" | "center" | "right" | undefined;
    bgcolor?: string | undefined;
    border?: number | undefined;
    cellPadding?: number | string | undefined;
    cellSpacing?: number | string | undefined;
    frame?: boolean | undefined;
    rules?: "none" | "groups" | "rows" | "columns" | "all" | undefined;
    summary?: string | undefined;
    width?: number | string | undefined;
  }

  export interface TextareaHTMLAttributes extends HTMLAttributes {
    autoComplete?: string | undefined;
    cols?: number | undefined;
    dirName?: string | undefined;
    disabled?: boolean | undefined;
    form?: string | undefined;
    maxLength?: number | undefined;
    minLength?: number | undefined;
    name?: string | undefined;
    placeholder?: string | undefined;
    readOnly?: boolean | undefined;
    required?: boolean | undefined;
    rows?: number | undefined;
    value?: string | readonly string[] | number | undefined;
    wrap?: string | undefined;
  }

  export interface TdHTMLAttributes extends HTMLAttributes {
    align?: "left" | "center" | "right" | "justify" | "char" | undefined;
    colSpan?: number | undefined;
    headers?: string | undefined;
    rowSpan?: number | undefined;
    scope?: string | undefined;
    abbr?: string | undefined;
    height?: number | string | undefined;
    width?: number | string | undefined;
    valign?: "top" | "middle" | "bottom" | "baseline" | undefined;
  }

  export interface ThHTMLAttributes extends HTMLAttributes {
    align?: "left" | "center" | "right" | "justify" | "char" | undefined;
    colSpan?: number | undefined;
    headers?: string | undefined;
    rowSpan?: number | undefined;
    scope?: string | undefined;
    abbr?: string | undefined;
  }

  export interface TimeHTMLAttributes extends HTMLAttributes {
    dateTime?: string | undefined;
  }

  export interface TrackHTMLAttributes extends HTMLAttributes {
    default?: boolean | undefined;
    kind?: string | undefined;
    label?: string | undefined;
    src?: string | undefined;
    srcLang?: string | undefined;
  }

  export interface VideoHTMLAttributes extends MediaHTMLAttributes {
    height?: number | string | undefined;
    playsInline?: boolean | undefined;
    poster?: string | undefined;
    width?: number | string | undefined;
    disablePictureInPicture?: boolean | undefined;
    disableRemotePlayback?: boolean | undefined;
  }

  export interface WebViewHTMLAttributes extends HTMLAttributes {
    allowFullScreen?: boolean | undefined;
    allowpopups?: boolean | undefined;
    autosize?: boolean | undefined;
    blinkfeatures?: string | undefined;
    disableblinkfeatures?: string | undefined;
    disableguestresize?: boolean | undefined;
    disablewebsecurity?: boolean | undefined;
    guestinstance?: string | undefined;
    httpreferrer?: string | undefined;
    nodeintegration?: boolean | undefined;
    partition?: string | undefined;
    plugins?: boolean | undefined;
    preload?: string | undefined;
    src?: string | undefined;
    useragent?: string | undefined;
    webpreferences?: string | undefined;
  }

  export interface IntrinsicElements {
    a: AnchorHTMLAttributes;
    abbr: HTMLAttributes;
    address: HTMLAttributes;
    area: AreaHTMLAttributes;
    article: HTMLAttributes;
    aside: HTMLAttributes;
    audio: AudioHTMLAttributes;
    b: HTMLAttributes;
    base: BaseHTMLAttributes;
    bdi: HTMLAttributes;
    bdo: HTMLAttributes;
    big: HTMLAttributes;
    blockquote: BlockquoteHTMLAttributes;
    body: HTMLAttributes;
    br: HTMLAttributes;
    button: ButtonHTMLAttributes;
    canvas: CanvasHTMLAttributes;
    caption: HTMLAttributes;
    center: HTMLAttributes;
    cite: HTMLAttributes;
    code: HTMLAttributes;
    col: ColHTMLAttributes;
    colgroup: ColgroupHTMLAttributes;
    data: DataHTMLAttributes;
    datalist: HTMLAttributes;
    dd: HTMLAttributes;
    del: DelHTMLAttributes;
    details: DetailsHTMLAttributes;
    dfn: HTMLAttributes;
    dialog: DialogHTMLAttributes;
    div: HTMLAttributes;
    dl: HTMLAttributes;
    dt: HTMLAttributes;
    em: HTMLAttributes;
    embed: EmbedHTMLAttributes;
    fieldset: FieldsetHTMLAttributes;
    figcaption: HTMLAttributes;
    figure: HTMLAttributes;
    footer: HTMLAttributes;
    form: FormHTMLAttributes;
    h1: HTMLAttributes;
    h2: HTMLAttributes;
    h3: HTMLAttributes;
    h4: HTMLAttributes;
    h5: HTMLAttributes;
    h6: HTMLAttributes;
    head: HTMLAttributes;
    header: HTMLAttributes;
    hgroup: HTMLAttributes;
    hr: HTMLAttributes;
    html: HtmlHTMLAttributes;
    i: HTMLAttributes;
    iframe: IframeHTMLAttributes;
    img: ImgHTMLAttributes;
    input: InputHTMLAttributes;
    ins: InsHTMLAttributes;
    kbd: HTMLAttributes;
    keygen: KeygenHTMLAttributes;
    label: LabelHTMLAttributes;
    legend: HTMLAttributes;
    li: LiHTMLAttributes;
    link: LinkHTMLAttributes;
    main: HTMLAttributes;
    map: MapHTMLAttributes;
    mark: HTMLAttributes;
    menu: MenuHTMLAttributes;
    menuitem: HTMLAttributes;
    meta: MetaHTMLAttributes;
    meter: MeterHTMLAttributes;
    nav: HTMLAttributes;
    noindex: HTMLAttributes;
    noscript: HTMLAttributes;
    object: ObjectHTMLAttributes;
    ol: OlHTMLAttributes;
    optgroup: OptgroupHTMLAttributes;
    option: OptionHTMLAttributes;
    output: OutputHTMLAttributes;
    p: HTMLAttributes;
    param: ParamHTMLAttributes;
    picture: HTMLAttributes;
    pre: HTMLAttributes;
    progress: ProgressHTMLAttributes;
    q: QuoteHTMLAttributes;
    rp: HTMLAttributes;
    rt: HTMLAttributes;
    ruby: HTMLAttributes;
    s: HTMLAttributes;
    samp: HTMLAttributes;
    search: HTMLAttributes;
    slot: SlotHTMLAttributes;
    script: ScriptHTMLAttributes;
    section: HTMLAttributes;
    select: SelectHTMLAttributes;
    small: HTMLAttributes;
    source: SourceHTMLAttributes;
    span: HTMLAttributes;
    strong: HTMLAttributes;
    style: StyleHTMLAttributes;
    sub: HTMLAttributes;
    summary: HTMLAttributes;
    sup: HTMLAttributes;
    table: TableHTMLAttributes;
    template: HTMLAttributes;
    tbody: HTMLAttributes;
    td: TdHTMLAttributes;
    textarea: TextareaHTMLAttributes;
    tfoot: HTMLAttributes;
    th: ThHTMLAttributes;
    thead: HTMLAttributes;
    time: TimeHTMLAttributes;
    title: HTMLAttributes;
    tr: HTMLAttributes;
    track: TrackHTMLAttributes;
    u: HTMLAttributes;
    ul: HTMLAttributes;
    "var": HTMLAttributes;
    video: VideoHTMLAttributes;
    wbr: HTMLAttributes;
    webview: WebViewHTMLAttributes;
  }
}
