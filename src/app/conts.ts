export const menuItems =
  [
    { icon: 'pi pi-home', label: 'side_bar.dashboard', route: '/dashboard' },
    { icon: 'pi pi-users', label: 'side_bar.clients', route: '/clients' },
    { icon: 'pi pi-users', label: 'side_bar.technicals', route: '/technicals' },
    { icon: 'pi pi-truck', label: 'side_bar.orders', route: '/orders' },
    { icon: 'pi pi-car', label: 'side_bar.special_orders', route: '/special-order' },
    { icon: 'pi pi-server', label: 'side_bar.services', route: '/services' },
    { icon: 'pi pi-folder', label: 'side_bar.contract', route: '/contract-type' },
    { icon: 'pi pi-shopping-bag', label: 'side_bar.pkg', route: '/package' },
    { icon: 'pi pi-clock', label: 'side_bar.working_hours', route: '/working_hours' },
    { icon: 'pi pi-globe', label: 'side_bar.country', route: '/country' },
    { icon: 'pi pi-building', label: 'side_bar.city', route: '/city' },
    { icon: 'pi pi-times', label: 'side_bar.reason', route: '/cancel-reason' },
    { icon: 'pi pi-book', label: 'side_bar.complaint', route: '/complaint' },
    { icon: 'pi pi-qrcode', label: 'side_bar.copone', route: '/copone' },
    { icon: 'pi pi-credit-card', label: 'side_bar.payment', route: '/paymentWay' },
    { icon: 'pi pi-trophy', label: 'side_bar.technical_sp', route: '/technical-specialist' },
    { icon: 'pi pi-phone', label: 'side_bar.contact', route: '/contact-us' },
    { icon: 'pi pi-database', label: 'side_bar.about', route: '/about-us' }
  ]

export const sliderViewType = [
  {
    name: 'AdminTool',
    code: 1
  },
  {
    name: 'FrontEnd',
    code: 2
  },
  {
    name: 'Both',
    code: 3
  }
]

export const userType = [
  {
    name: 'SuperAdmin',
    code: 1
  },
  {
    name: 'Admin',
    code: 2
  },
  {
    name: 'Technical',
    code: 3
  },
  {
    name: 'Assistant',
    code: 4
  },
  {
    name: 'Client',
    code: 5
  }
]

export const coponeTypeList = [
  {
    name: 'Percentage',
    code: 1
  },
  {
    name: 'Amount',
    code: 2
  }
]

export const coponeOfferTypeList  = [
  {
    name: 'Gift',
    code: 1
  },
  {
    name: 'Offer',
    code: 2
  }
]

export const PackageTypeList = [
  {
    name: 'Daily',
    code: 1
  },
  {
    name: 'Monthly',
    code: 2
  },
  {
    name: 'Qurater',
    code: 3
  },
  {
    name: 'Biannual',
    code: 4
  },
  {
    name: 'Yearly',
    code: 5
  },
  {
    name: 'Weekly',
    code: 6
  }
]

export const packageHourVistList = [
  {
    name: '4',
    code: 4
  },
  {
    name: '8',
    code: 8
  }
]

export const gender = [
  {
    name: 'Male',
    code: 1
  },
  {
    name: 'Female',
    code: 2
  }
]

export const order_status = [
  { name: 'Pending', id: 0, code: 0, color: '#c1cd6a' },
  { name: 'Paid', id: 1, code: 1, color: '#c1cd6a' },
  { name: 'AssignedToProvider', id: 2, code: 2, color: '#b16acd' },
  { name: 'InTheWay', id: 3, code: 3, color: '#ccc053' },
  { name: 'TryingSolveProblem', id: 4, code: 4, color: '#9b9d9c' },
  { name: 'Solved', id: 5, code: 5, color: '#49e97c' },
  { name: 'ClientConfirmation', id: 6, code: 6, color: '#49e97c' },
  { name: 'Completed', id: 7, code: 7, color: '#49e97c' },
  { name: 'Canceled', id: 8, code: 8, color: '#e94949' }
]
export const special_order_status = [
  { name: 'Pending', id: 1, code: 1, color: '#c1cd6a' },
  { name: 'Completed', id: 2, code: 2, color: '#3fac4e' },
  { name: 'Canceled', id: 3, code: 3, color: '#c32722' }
]

export const special_order_enum = [
  {
    name: 'Emergency',
    code: 1
  },
  {
    name: 'Special',
    code: 2
  }
]


