const getOffers = () => [
  {
    type: 'taxi',
    offers: [
      {
        id: 'b4c3e4e6-9053-42ce-b747-e281314baa31_taxi_1',
        title: 'Upgrade to a business class',
        price: 120
      }
    ]
  },
  {
    type: 'flight',
    offers: [
      {
        id: 'b4c3e4e6-9053-42ce-b747-e281314baa31_flight_1',
        title: 'Add luggage',
        price: 50
      },
      {
        id: 'b4c3e4e6-9053-42ce-b747-e281314baa31_flight_2',
        title: 'Switch to comfort',
        price: 80
      },
    ]
  },
  {
    type: 'drive',
    offers: [
      {
        id: 'b4c3e4e6-9053-42ce-b747-e281314baa31_drive_1',
        title: 'Rent a car',
        price: 200
      }
    ]
  },
  {
    type: 'check-in',
    offers: [
      {
        id: 'b4c3e4e6-9053-42ce-b747-e281314baa31_check-in_1',
        title: 'Add breakfast',
        price: 50
      }
    ]
  },
  {
    type: 'sightseeing',
    offers: [
      {
        id: 'b4c3e4e6-9053-42ce-b747-e281314baa31_sightseeing_1',
        title: 'Book tickets',
        price: 40
      },
      {
        id: 'b4c3e4e6-9053-42ce-b747-e281314baa31_sightseeing_2',
        title: 'Lunch in city',
        price: 30
      },
    ]
  },
];

export { getOffers };
