import React, { useEffect, useMemo, useRef, useState } from 'react';

const carPricing = {
  Sedan: { seats: 4, pricePerKm: 12 },
  SUV: { seats: 6, pricePerKm: 16 },
  Mini: { seats: 8, pricePerKm: 20 },
  Luxury: { seats: 4, pricePerKm: 35 },
};

const BookingForm = ({ currentUser, onPaymentSuccess }) => {
  const formRef = useRef(null);
  const [form, setForm] = useState({
    pickup: '',
    destination: '',
    carType: 'Sedan',
    seats: carPricing['Sedan'].seats,
    distance: '',
    pricePerKm: carPricing['Sedan'].pricePerKm,
    email: '',
    name: '',
  });
  const [totalFare, setTotalFare] = useState(0);
  const [advance, setAdvance] = useState(0);
  const [errors, setErrors] = useState({});

  // Autofill user
  useEffect(() => {
    if (currentUser) {
      setForm((f) => ({ ...f, email: currentUser.email, name: currentUser.name }));
    }
  }, [currentUser]);

  // Update seats and price when car type changes
  useEffect(() => {
    const cfg = carPricing[form.carType];
    setForm((f) => ({ ...f, seats: cfg.seats, pricePerKm: cfg.pricePerKm }));
  }, [form.carType]);

  useEffect(() => {
    const dist = parseFloat(form.distance) || 0;
    const total = dist * (parseFloat(form.pricePerKm) || 0);
    setTotalFare(total);
    setAdvance(Math.round(total * 0.3));
  }, [form.distance, form.pricePerKm]);

  const validate = () => {
    const e = {};
    if (!form.pickup) e.pickup = 'Pickup is required';
    if (!form.destination) e.destination = 'Destination is required';
    if (!form.distance || Number(form.distance) <= 0) e.distance = 'Enter a valid distance';
    if (!form.email) e.email = 'Email is required';
    if (!form.name) e.name = 'Name is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCalc = (e) => {
    e.preventDefault();
    validate();
  };

  const handlePay = (e) => {
    e.preventDefault();
    if (!validate()) return;
    // Mock payment flow
    setTimeout(() => {
      const booking = {
        id: 'BK' + Math.random().toString(36).slice(2, 8).toUpperCase(),
        ...form,
        totalFare,
        advance,
        createdAt: new Date().toISOString(),
      };

      // Persist booking for user if logged in
      try {
        const users = JSON.parse(localStorage.getItem('carease_users') || '{}');
        const session = JSON.parse(localStorage.getItem('carease_session') || 'null');
        if (session && users[session.email]) {
          const u = users[session.email];
          u.bookings = Array.isArray(u.bookings) ? [...u.bookings, booking] : [booking];
          users[session.email] = u;
          localStorage.setItem('carease_users', JSON.stringify(users));
        }
      } catch {}

      // Save last booking for confirmation page
      localStorage.setItem('carease_last_booking', JSON.stringify(booking));
      onPaymentSuccess(booking);
    }, 800);
  };

  return (
    <section ref={formRef} className="relative py-16 bg-gradient-to-b from-white to-blue-50" id="booking">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          <div className="rounded-2xl bg-white p-6 md:p-8 shadow-lg border border-slate-100">
            <h2 className="text-2xl font-semibold text-slate-900">Plan your ride</h2>
            <p className="text-slate-600 mt-1">We’ll calculate your fare instantly.</p>

            <form className="mt-6 grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm text-slate-600 mb-1">Pickup Location</label>
                <input
                  type="text"
                  className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.pickup ? 'border-red-400' : 'border-slate-300'}`}
                  value={form.pickup}
                  onChange={(e) => setForm({ ...form, pickup: e.target.value })}
                />
                {errors.pickup && <p className="text-xs text-red-600 mt-1">{errors.pickup}</p>}
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">Destination</label>
                <input
                  type="text"
                  className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.destination ? 'border-red-400' : 'border-slate-300'}`}
                  value={form.destination}
                  onChange={(e) => setForm({ ...form, destination: e.target.value })}
                />
                {errors.destination && <p className="text-xs text-red-600 mt-1">{errors.destination}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Car Type</label>
                  <select
                    className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    value={form.carType}
                    onChange={(e) => setForm({ ...form, carType: e.target.value })}
                  >
                    {Object.keys(carPricing).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Seats</label>
                  <input
                    type="number"
                    readOnly
                    className="w-full rounded-md border border-slate-300 px-3 py-2 bg-slate-50"
                    value={form.seats}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Distance (km)</label>
                  <input
                    type="number"
                    min="1"
                    className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.distance ? 'border-red-400' : 'border-slate-300'}`}
                    value={form.distance}
                    onChange={(e) => setForm({ ...form, distance: e.target.value })}
                  />
                  {errors.distance && <p className="text-xs text-red-600 mt-1">{errors.distance}</p>}
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Price per km</label>
                  <input
                    type="number"
                    readOnly
                    className="w-full rounded-md border border-slate-300 px-3 py-2 bg-slate-50"
                    value={form.pricePerKm}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Your Name</label>
                  <input
                    type="text"
                    className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-400' : 'border-slate-300'}`}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Email</label>
                  <input
                    type="email"
                    className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-400' : 'border-slate-300'}`}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                  {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button onClick={handleCalc} className="px-4 py-2 rounded-md border border-slate-300 hover:bg-slate-50">Calculate Fare</button>
                <div className="text-slate-700">
                  Total Fare: <span className="font-semibold">₹{totalFare}</span>
                </div>
              </div>
              <div className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-md p-3">
                <div className="text-slate-700">Advance (30%): <span className="font-semibold">₹{advance}</span></div>
                <button onClick={handlePay} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow">Pay Now</button>
              </div>
            </form>
          </div>

          <div className="rounded-2xl bg-white p-6 md:p-8 shadow-lg border border-slate-100 flex flex-col justify-center">
            <h3 className="text-xl font-semibold text-slate-900">Fare details</h3>
            <p className="text-slate-600 mt-2">We multiply the distance with the car’s price per km to get your total. You pay only 30% now and the rest to the driver.</p>
            <ul className="mt-6 space-y-3 text-slate-700">
              {Object.entries(carPricing).map(([type, cfg]) => (
                <li key={type} className="flex items-center justify-between border-b pb-2">
                  <span>{type} • {cfg.seats} seats</span>
                  <span className="font-medium">₹{cfg.pricePerKm}/km</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 text-sm text-slate-500">This is a demo payment flow for testing purposes.</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;
