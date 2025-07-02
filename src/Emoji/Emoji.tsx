export type EmojiProps = {
  symbol: string
  size?: number | string
  label?: string
  className?: string
  style?: React.CSSProperties
}

const Emoji = ({ symbol, label = "", className = "", style = {}, size = 24 }: EmojiProps) => (
  <span
    role="img"
    aria-label={label || undefined}
    aria-hidden={label ? "false" : "true"}
    className={className}
    style={{
      fontSize: typeof size === "number" ? `${size}px` : size,
      lineHeight: 1,
      ...style,
    }}
  >
    {symbol}
  </span>
)

export default Emoji