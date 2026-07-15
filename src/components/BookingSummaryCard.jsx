function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
}

function BookingSummaryCard({ booking, onDismiss }) {
  if (!booking) {
    return null
  }

  return (
    <section className="soft-card rounded-[2rem] p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="eyebrow">Booking confirmed</p>
          <h3 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
            Flight booked
          </h3>
          <p className="mt-2 text-sm text-slate-500">Booking #{booking.id}</p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-600 transition hover:text-slate-950"
        >
          Dismiss
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-[1.5rem] bg-slate-50 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Flight</p>
          <p className="mt-2 text-xl font-black text-slate-950">#{booking.flightId}</p>
        </div>
        <div className="rounded-[1.5rem] bg-slate-50 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Seats</p>
          <p className="mt-2 text-xl font-black text-slate-950">{booking.noOfSeats}</p>
        </div>
        <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Paid</p>
          <p className="mt-2 text-xl font-black">{formatCurrency(booking.totalCost)}</p>
        </div>
      </div>
    </section>
  )
}

export default BookingSummaryCard
