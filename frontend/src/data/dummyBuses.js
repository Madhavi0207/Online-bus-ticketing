const dummyBuses = [
  {
    _id: "dummy-bus-ktm-pokhara",
    busNumber: "BA 2 PA 4567",
    departureTime: "06:30 AM",
    price: 1200,
    totalSeats: 40,
    route: {
      _id: "dummy-route-ktm-pokhara",
      from: "Kathmandu",
      to: "Pokhara",
      duration: "7h 30m",
    },
    isDummy: true,
  },
  {
    _id: "dummy-bus-ktm-chitwan",
    busNumber: "BA 1 KHA 9086",
    departureTime: "07:15 AM",
    price: 900,
    totalSeats: 36,
    route: {
      _id: "dummy-route-ktm-chitwan",
      from: "Kathmandu",
      to: "Chitwan",
      duration: "5h 45m",
    },
    isDummy: true,
  },
  {
    _id: "dummy-bus-ktm-lumbini",
    busNumber: "BA 3 CHA 2234",
    departureTime: "08:00 AM",
    price: 1400,
    totalSeats: 42,
    route: {
      _id: "dummy-route-ktm-lumbini",
      from: "Kathmandu",
      to: "Lumbini",
      duration: "8h 15m",
    },
    isDummy: true,
  },
  {
    _id: "dummy-bus-biratnagar-ktm",
    busNumber: "KO 1 PA 7744",
    departureTime: "05:45 AM",
    price: 1600,
    totalSeats: 40,
    route: {
      _id: "dummy-route-biratnagar-ktm",
      from: "Biratnagar",
      to: "Kathmandu",
      duration: "9h 30m",
    },
    isDummy: true,
  },
  {
    _id: "dummy-bus-nepalgunj-surkhet",
    busNumber: "BA 4 JHA 5190",
    departureTime: "09:20 AM",
    price: 1100,
    totalSeats: 32,
    route: {
      _id: "dummy-route-nepalgunj-surkhet",
      from: "Nepalgunj",
      to: "Surkhet",
      duration: "6h 10m",
    },
    isDummy: true,
  },
  {
    _id: "dummy-bus-dharan-illam",
    busNumber: "ME 2 PA 3398",
    departureTime: "07:50 AM",
    price: 750,
    totalSeats: 30,
    route: {
      _id: "dummy-route-dharan-illam",
      from: "Dharan",
      to: "Ilam",
      duration: "4h 20m",
    },
    isDummy: true,
  },
];

const getDummyBusById = (id) =>
  dummyBuses.find((bus) => bus._id === id) || null;

export { dummyBuses, getDummyBusById };
