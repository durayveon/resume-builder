export function Logo(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 200 40" {...props}>
      <text
        x="0"
        y="30"
        fontFamily="Lexend, sans-serif"
        fontSize="28"
        fontWeight="bold"
        fill="#0F172A"
      >
        SmartResume<tspan fill="#4F46E5">.ai</tspan>
      </text>
    </svg>
  )
}
