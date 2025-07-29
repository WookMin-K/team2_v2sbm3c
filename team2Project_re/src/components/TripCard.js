function TripCard({ trip, onClick }) {
  return (
    <div className="trip-card" onClick={() => onClick(trip)}>
      <img src={trip.image} alt={trip.tname} />
      <h3>{trip.tname.toUpperCase()}</h3>
      <p>{trip.intro_short}</p>
    </div>
  );
}
