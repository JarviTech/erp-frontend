'use client';
import ProformaInvoice from '@/components/ProformaInvocie'
import { useUserRole } from '@/hooks/useUserRole'

function ProformaInvoicePage() {
  const { role, username } = useUserRole();

  return (
    <>
        <ProformaInvoice username={username} />
    </>
  )
}

export default ProformaInvoicePage