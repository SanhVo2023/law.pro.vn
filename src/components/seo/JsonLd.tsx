import type { Thing, WithContext } from 'schema-dts'

type Props = {
  data: WithContext<Thing> | WithContext<Thing>[]
}

export default function JsonLd({ data }: Props) {
  const payload = Array.isArray(data) ? data : [data]
  return (
    <>
      {payload.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  )
}
