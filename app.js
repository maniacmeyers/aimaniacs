// 600-Mile Contractors Dashboard JavaScript

// Enhanced contractor data with more fields for filtering
const contractorsData = [
    { id: 1, name: "John's Trucking LLC", city: "Los Angeles", state: "CA", miles: 1500, status: "Active", tier: 1, serviceType: "trucking", reviews: 25, distance: 120 },
    { id: 2, name: "Rapid Delivery Services", city: "Houston", state: "TX", miles: 2200, status: "Active", tier: 2, serviceType: "delivery", reviews: 18, distance: 85 },
    { id: 3, name: "Express Logistics", city: "Miami", state: "FL", miles: 3400, status: "Active", tier: 1, serviceType: "logistics", reviews: 32, distance: 150 },
    { id: 4, name: "Swift Transport", city: "New York", state: "NY", miles: 2900, status: "Active", tier: 3, serviceType: "transport", reviews: 14, distance: 95 },
    { id: 5, name: "Metro Cargo", city: "Chicago", state: "IL", miles: 1800, status: "Active", tier: 2, serviceType: "cargo", reviews: 22, distance: 200 },
    { id: 6, name: "Pacific Freight", city: "San Diego", state: "CA", miles: 2650, status: "Active", tier: 1, serviceType: "trucking", reviews: 28, distance: 110 },
    { id: 7, name: "Southern Express", city: "Atlanta", state: "GA", miles: 1950, status: "Active", tier: 2, serviceType: "delivery", reviews: 16, distance: 180 },
    { id: 8, name: "Mountain Logistics", city: "Denver", state: "CO", miles: 2100, status: "Active", tier: 3, serviceType: "logistics", reviews: 19, distance: 250 }
];

// Filter state
let currentFilters = {
    search: '',
    tier: 'all',
    state: 'all',
    serviceType: 'all',
    maxDistance: 600,
    minReviews: 0
};

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// URL parameter management
function updateURLParams() {
    const url = new URL(window.location);
    Object.keys(currentFilters).forEach(key => {
        if (currentFilters[key] !== getDefaultFilterValue(key)) {
            url.searchParams.set(key, currentFilters[key]);
        } else {
            url.searchParams.delete(key);
        }
    });
    window.history.replaceState({}, '', url);
}

function loadFiltersFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    Object.keys(currentFilters).forEach(key => {
        if (urlParams.has(key)) {
            const value = urlParams.get(key);
            currentFilters[key] = isNaN(value) ? value : Number(value);
        }
    });
}

function getDefaultFilterValue(key) {
    const defaults = {
        search: '',
        tier: 'all',
        state: 'all',
        serviceType: 'all',
        maxDistance: 600,
        minReviews: 0
    };
    return defaults[key];
}

// Filter contractors based on current filters
function filterContractors() {
    return contractorsData.filter(contractor => {
        // Search filter
        if (currentFilters.search) {
            const searchTerm = currentFilters.search.toLowerCase();
            const matchesSearch = contractor.name.toLowerCase().includes(searchTerm) ||
                                contractor.city.toLowerCase().includes(searchTerm);
            if (!matchesSearch) return false;
        }
        
        // Tier filter
        if (currentFilters.tier !== 'all' && contractor.tier !== Number(currentFilters.tier)) {
            return false;
        }
        
        // State filter
        if (currentFilters.state !== 'all' && contractor.state !== currentFilters.state) {
            return false;
        }
        
        // Service type filter
        if (currentFilters.serviceType !== 'all' && contractor.serviceType !== currentFilters.serviceType) {
            return false;
        }
        
        // Distance filter
        if (contractor.distance > currentFilters.maxDistance) {
            return false;
        }
        
        // Reviews filter
        if (contractor.reviews < currentFilters.minReviews) {
            return false;
        }
        
        return true;
    });
}

// Update dashboard with filtered data
function updateDashboard(filteredData = contractorsData) {
    const totalContractors = filteredData.length;
    const totalMiles = filteredData.reduce((sum, contractor) => sum + contractor.miles, 0);
    const jobsCount = Math.floor(totalMiles / 100);
    
    document.getElementById('active-count').textContent = totalContractors;
    document.getElementById('jobs-count').textContent = jobsCount;
    document.getElementById('miles-count').textContent = totalMiles.toLocaleString();
}

// Render contractors table
function renderContractorsTable(contractors) {
    const table = document.getElementById('contractors-table');
    
    // Clear existing content
    table.innerHTML = '';
    
    // Add headers
    const headers = ['Company', 'Location', 'Miles', 'Status'];
    headers.forEach(header => {
        const headerDiv = document.createElement('div');
        headerDiv.className = 'contractor-header';
        headerDiv.textContent = header;
        table.appendChild(headerDiv);
    });
    
    // Add contractor rows
    contractors.forEach(contractor => {
        const cells = [
            contractor.name,
            `${contractor.city}, ${contractor.state}`,
            contractor.miles.toLocaleString(),
            contractor.status
        ];
        
        cells.forEach(cell => {
            const cellDiv = document.createElement('div');
            cellDiv.className = 'contractor-row';
            cellDiv.textContent = cell;
            table.appendChild(cellDiv);
        });
    });
}

// Apply all filters and update display
function applyFilters() {
    const filteredContractors = filterContractors();
    updateDashboard(filteredContractors);
    renderContractorsTable(filteredContractors);
    updateURLParams();
}

// Debounced version for search input
const debouncedApplyFilters = debounce(applyFilters, 300);

// Update slider bubble position
function updateSliderBubble(slider, bubble) {
    const value = slider.value;
    const percent = (value - slider.min) / (slider.max - slider.min);
    const offset = percent * (slider.offsetWidth - 20); // 20 is thumb width
    bubble.style.left = `${offset + 10}px`; // 10 is half thumb width
    bubble.textContent = value;
}

// Initialize searchable select dropdowns
function initSearchableSelects() {
    document.querySelectorAll('.searchable-select').forEach(select => {
        const input = select.querySelector('.select-input');
        const dropdown = select.querySelector('.select-dropdown');
        const searchBox = select.querySelector('.search-box');
        const options = select.querySelectorAll('.option');
        
        // Toggle dropdown
        input.addEventListener('click', (e) => {
            e.stopPropagation();
            select.classList.toggle('open');
        });
        
        // Search functionality
        searchBox.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            options.forEach(option => {
                const text = option.textContent.toLowerCase();
                option.style.display = text.includes(searchTerm) ? 'block' : 'none';
            });
        });
        
        // Option selection
        options.forEach(option => {
            option.addEventListener('click', () => {
                const value = option.dataset.value;
                const text = option.textContent;
                
                input.value = text;
                select.classList.remove('open');
                
                // Update filter based on select ID
                if (select.id === 'state-filter') {
                    currentFilters.state = value;
                } else if (select.id === 'service-filter') {
                    currentFilters.serviceType = value;
                }
                
                applyFilters();
            });
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        document.querySelectorAll('.searchable-select').forEach(select => {
            select.classList.remove('open');
        });
    });
}

// Initialize all event listeners
function initEventListeners() {
    // Search input
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
        currentFilters.search = e.target.value;
        debouncedApplyFilters();
    });
    
    // Tier badges
    document.querySelectorAll('.tier-badge').forEach(badge => {
        badge.addEventListener('click', () => {
            // Remove active class from all badges
            document.querySelectorAll('.tier-badge').forEach(b => b.classList.remove('active'));
            // Add active class to clicked badge
            badge.classList.add('active');
            
            currentFilters.tier = badge.dataset.tier;
            applyFilters();
        });
    });
    
    // Distance slider
    const distanceSlider = document.getElementById('distance-slider');
    const distanceBubble = document.getElementById('distance-bubble');
    
    distanceSlider.addEventListener('input', () => {
        currentFilters.maxDistance = Number(distanceSlider.value);
        updateSliderBubble(distanceSlider, distanceBubble);
        debouncedApplyFilters();
    });
    
    // Distance presets
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const value = btn.dataset.value;
            distanceSlider.value = value;
            currentFilters.maxDistance = Number(value);
            updateSliderBubble(distanceSlider, distanceBubble);
            applyFilters();
        });
    });
    
    // Reviews slider
    const reviewsSlider = document.getElementById('reviews-slider');
    const reviewsBubble = document.getElementById('reviews-bubble');
    
    reviewsSlider.addEventListener('input', () => {
        currentFilters.minReviews = Number(reviewsSlider.value);
        updateSliderBubble(reviewsSlider, reviewsBubble);
        debouncedApplyFilters();
    });
    
    // Clear filters button
    document.getElementById('clear-filters').addEventListener('click', () => {
        // Reset all filters to defaults
        currentFilters = {
            search: '',
            tier: 'all',
            state: 'all',
            serviceType: 'all',
            maxDistance: 600,
            minReviews: 0
        };
        
        // Reset UI elements
        searchInput.value = '';
        document.querySelectorAll('.tier-badge').forEach(b => b.classList.remove('active'));
        document.querySelector('[data-tier="all"]').classList.add('active');
        
        document.querySelectorAll('.select-input').forEach(input => {
            if (input.closest('#state-filter')) input.value = 'All States';
            if (input.closest('#service-filter')) input.value = 'All Services';
        });
        
        distanceSlider.value = 600;
        reviewsSlider.value = 0;
        updateSliderBubble(distanceSlider, distanceBubble);
        updateSliderBubble(reviewsSlider, reviewsBubble);
        
        applyFilters();
    });
    
    // Apply filters button (mainly for mobile UX)
    document.getElementById('apply-filters').addEventListener('click', () => {
        applyFilters();
    });
}

// Initialize filters from URL and set up UI
function initializeFilters() {
    loadFiltersFromURL();
    
    // Set UI elements based on loaded filters
    document.getElementById('search-input').value = currentFilters.search;
    
    // Set active tier badge
    document.querySelectorAll('.tier-badge').forEach(b => b.classList.remove('active'));
    document.querySelector(`[data-tier="${currentFilters.tier}"]`).classList.add('active');
    
    // Set dropdown values
    const stateInput = document.querySelector('#state-filter .select-input');
    const serviceInput = document.querySelector('#service-filter .select-input');
    
    if (currentFilters.state === 'all') {
        stateInput.value = 'All States';
    } else {
        const stateOption = document.querySelector(`#state-filter .option[data-value="${currentFilters.state}"]`);
        if (stateOption) stateInput.value = stateOption.textContent;
    }
    
    if (currentFilters.serviceType === 'all') {
        serviceInput.value = 'All Services';
    } else {
        const serviceOption = document.querySelector(`#service-filter .option[data-value="${currentFilters.serviceType}"]`);
        if (serviceOption) serviceInput.value = serviceOption.textContent;
    }
    
    // Set slider values
    const distanceSlider = document.getElementById('distance-slider');
    const reviewsSlider = document.getElementById('reviews-slider');
    const distanceBubble = document.getElementById('distance-bubble');
    const reviewsBubble = document.getElementById('reviews-bubble');
    
    distanceSlider.value = currentFilters.maxDistance;
    reviewsSlider.value = currentFilters.minReviews;
    
    updateSliderBubble(distanceSlider, distanceBubble);
    updateSliderBubble(reviewsSlider, reviewsBubble);
}

// Initialize everything on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeFilters();
    initEventListeners();
    initSearchableSelects();
    applyFilters(); // Initial render
});
