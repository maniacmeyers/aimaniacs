// 600-Mile Contractors Dashboard JavaScript

const contractorsData = [
    { id: 1, name: "John's Trucking LLC", miles: 1500, status: "Active" },
    { id: 2, name: "Rapid Delivery Services", miles: 2200, status: "Active" },
    { id: 3, name: "Express Logistics", miles: 3400, status: "Active" },
    { id: 4, name: "Swift Transport", miles: 2900, status: "Active" },
    { id: 5, name: "Metro Cargo", miles: 1800, status: "Active" }
];

function updateDashboard() {
    const totalContractors = contractorsData.length;
    const totalMiles = contractorsData.reduce((sum, contractor) => sum + contractor.miles, 0);
    const jobsCount = Math.floor(totalMiles/100);
    
    document.getElementById('active-count').textContent = totalContractors;
    document.getElementById('jobs-count').textContent = jobsCount;
    document.getElementById('miles-count').textContent = totalMiles.toLocaleString();
}

document.addEventListener('DOMContentLoaded', updateDashboard);