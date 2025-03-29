export const TEST_DATA = {
    validUser: {
        username: process.env.DEMOBLAZE_USERNAME || 'testuser',
        password: process.env.DEMOBLAZE_PASSWORD || 'test123'
      },
      invalidUser: {
        username: process.env.DEMOBLAZE_INVALID_USERNAME || 'nonexistentuser',
        password: process.env.DEMOBLAZE_INVALID_PASSWORD || 'wrongpassword'
      },
    products: {
      phone: {
        name: 'Samsung galaxy s6',
        category: 'Phones'
      },
      laptop: {
        name: 'Sony vaio i5',
        category: 'Laptops'
      },
      monitor: {
        name: 'Apple monitor 24',
        category: 'Monitors'
      }
    }
  };
  