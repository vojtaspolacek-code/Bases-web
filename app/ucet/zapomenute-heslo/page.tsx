import { redirect } from 'next/navigation'

// Zpětná kompatibilita — stará URL přesměruje na novou
export default function ZapomenuteHesloPage() {
  redirect('/ucet/reset')
}
