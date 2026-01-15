import { Label } from './ui/label'
import { Shield, ShieldOff } from 'lucide-react'

export function PrivacyToggle({ value, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          {value === 'public' ? (
            <Shield className="h-4 w-4 text-primary-600" />
          ) : (
            <ShieldOff className="h-4 w-4 text-muted-foreground" />
          )}
          <Label htmlFor="privacy-toggle" className="font-semibold">
            {label}
          </Label>
        </div>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      <select
        id="privacy-toggle"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="public">Public</option>
        <option value="private">Private</option>
      </select>
    </div>
  )
}

