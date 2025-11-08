import React, { useRef, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BookingForm from './components/BookingForm';
import Footer from './components/Footer';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const bookingRef = useRef(null);

  const scrollToBooking = () => {
    const el = document.getElementById('booking');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePaymentSuccess = (booking) => {
    // Redirect to confirmation page with hash routing style
    window.location.hash = '#/confirmation';
    // Store to be read by confirmation screen
    localStorage.setItem('carease_last_booking', JSON.stringify(booking));
  };

  // Simple hash-based two-page view
  const [hash, setHash] = useState(window.location.hash);
  React.useEffect(() => {
    const onHash = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  if (hash.startsWith('#/confirmation')) {
    const booking = (() => {
      try { return JSON.parse(localStorage.getItem('carease_last_booking') || 'null'); } catch { return null; }
    })();
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} onScrollToBooking={scrollToBooking} />
        <main className="flex-1">
          <section className="max-w-3xl mx-auto px-4 py-16">
            <div className="rounded-2xl bg-white border border-slate-200 shadow p-8 text-center">
              <div className="text-2xl md:text-3xl font-semibold text-green-600">✅ Booking Confirmed! Your car is on the way.</div>
              {booking ? (
                <div className="mt-8 grid sm:grid-cols-2 gap-4 text-left">
                  <div className="bg-slate-50 rounded-lg p-4"><div className="text-slate-500 text-sm">Car Type</div><div className="font-medium">{booking.carType}</div></div>
                  <div className="bg-slate-50 rounded-lg p-4"><div className="text-slate-500 text-sm">Seats</div><div className="font-medium">{booking.seats}</div></div>
                  <div className="bg-slate-50 rounded-lg p-4"><div className="text-slate-500 text-sm">Distance</div><div className="font-medium">{booking.distance} km</div></div>
                  <div className="bg-slate-50 rounded-lg p-4"><div className="text-slate-500 text-sm">Total Fare</div><div className="font-medium">₹{booking.totalFare}</div></div>
                  <div className="bg-slate-50 rounded-lg p-4"><div className="text-slate-500 text-sm">Advance Paid</div><div className="font-medium">₹{booking.advance}</div></div>
                  <div className="bg-slate-50 rounded-lg p-4"><div className="text-slate-500 text-sm">Booking ID</div><div className="font-medium">{booking.id}</div></div>
                </div>
              ) : (
                <p className="mt-6 text-slate-600">No booking found.</p>
              )}
              <button
                onClick={() => { window.location.hash = ''; setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50); }}
                className="mt-10 inline-flex items-center rounded-md bg-blue-600 text-white px-6 py-3 font-medium hover:bg-blue-700"
              >
                Book Another Ride
              </button>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} onScrollToBooking={scrollToBooking} />
      <main className="flex-1">
        <Hero onBookNow={scrollToBooking} />
        <BookingForm currentUser={currentUser} onPaymentSuccess={handlePaymentSuccess} />
      </main>
      <Footer />
    </div>
  );
};

export default App;
