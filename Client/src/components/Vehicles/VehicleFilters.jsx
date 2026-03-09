const VehicleFilters = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const handleReset = () => {
    setFilters({
      search: '',
      type: 'all',
      minPrice: '',
      maxPrice: ''
    })
  }

  const vehicleTypes = [
    { value: 'all', label: '🚘 All types' },
    { value: 'scooter', label: '🛵 Scooter' },
    { value: 'motorcycle', label: '🏍️ Motorcycle' },
    { value: 'hatchback', label: '🚗 Hatchback' },
    { value: 'sedan', label: '🚘 Sedan' },
    { value: 'suv', label: '🚙 SUV' },
    { value: 'auto', label: '🛺 Auto rickshaw' },
    { value: 'van', label: '🚐 Van' }
  ]

  return (
    <div className="bg-white/95 backdrop-blur p-5 rounded-3xl shadow-2xl w-full lg:w-auto min-w-[320px] border-4 border-primary-200">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <i className="fas fa-search absolute left-4 top-3.5 text-primary-500"></i>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Hyundai, Toyota, Bajaj ..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-primary-300 focus:border-primary-500 outline-none text-gray-700 bg-white/90"
          />
        </div>
        <div className="flex gap-2">
          <select
            name="type"
            value={filters.type}
            onChange={handleChange}
            className="filter-select px-5 py-3 rounded-xl border-2 border-primary-300 bg-white text-gray-700 focus:border-primary-500 outline-none font-medium"
          >
            {vehicleTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          <button
            onClick={handleReset}
            className="px-5 py-3 bg-primary-200 text-primary-800 rounded-xl hover:bg-primary-300 transition border-2 border-transparent font-bold flex items-center gap-1"
          >
            <i className="fas fa-undo-alt"></i> Reset
          </button>
        </div>
      </div>
    </div>
  )
}

export default VehicleFilters