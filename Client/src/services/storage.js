const STORAGE_KEYS = {
  USERS: 'vehicle_rental_users',
  CURRENT_USER: 'vehicle_rental_current_user',
  VEHICLES: 'vehicle_rental_vehicles',
  BOOKINGS: 'vehicle_rental_bookings'
}

export const storage = {
  // Users
  getUsers: () => {
    const users = localStorage.getItem(STORAGE_KEYS.USERS)
    return users ? JSON.parse(users) : []
  },
  
  saveUser: (user) => {
    const users = storage.getUsers()
    users.push(user)
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
    return user ? JSON.parse(user) : null
  },
  
  setCurrentUser: (user) => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
  },
  
  removeCurrentUser: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
  },
  
  // Vehicles
  getVehicles: () => {
    const vehicles = localStorage.getItem(STORAGE_KEYS.VEHICLES)
    return vehicles ? JSON.parse(vehicles) : []
  },
  
  saveVehicles: (vehicles) => {
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles))
  },
  
  // Bookings
  getBookings: () => {
    const bookings = localStorage.getItem(STORAGE_KEYS.BOOKINGS)
    return bookings ? JSON.parse(bookings) : []
  },
  
  saveBookings: (bookings) => {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings))
  }
}