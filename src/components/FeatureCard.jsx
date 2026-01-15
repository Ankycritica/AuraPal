import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

export function FeatureCard({ icon: Icon, title, description }) {
  return (
    <Card
      className="h-full transition-shadow hover:shadow-lg"
      style={{
        background: 'var(--surface)',
        borderColor: 'rgba(255,255,255,0.04)',
      }}
    >
      <CardHeader>
        <div
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg"
          style={{ background: 'rgba(109,40,217,0.10)' }}
        >
          {Icon ? <Icon className="h-6 w-6" style={{ color: 'var(--brand-start)' }} /> : null}
        </div>
        <CardTitle style={{ color: 'var(--text)' }}>{title}</CardTitle>
        <CardDescription style={{ color: 'var(--muted)' }}>{description}</CardDescription>
      </CardHeader>
      <CardContent />
    </Card>
  )
}