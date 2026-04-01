// Mock budget data for demonstration
const budgetData = {
  year: '2025-2026',
  totalBudget: 275000000,
  departments: [
    {
      id: 1,
      name: 'Roads',
      allocated: 55000000,
      spent: 35200000,
      remaining: 19800000,
      percentage: 64,
      color: '#3b82f6',
      projects: [
        { name: 'Highway Repairs', cost: 15000000, status: 'ongoing', completion: 45 },
        { name: 'Street Lighting', cost: 8000000, status: 'completed', completion: 100 },
        { name: 'Bridge Maintenance', cost: 9000000, status: 'planned', completion: 0 },
        { name: 'Footpath Construction', cost: 12000000, status: 'ongoing', completion: 30 }
      ]
    },
    {
      id: 2,
      name: 'Water Supply',
      allocated: 48000000,
      spent: 22560000,
      remaining: 25440000,
      percentage: 47,
      color: '#06b6d4',
      projects: [
        { name: 'Pipeline Replacement', cost: 18000000, status: 'ongoing', completion: 35 },
        { name: 'Water Treatment Plant', cost: 15000000, status: 'planned', completion: 0 },
        { name: 'Storage Tanks', cost: 8000000, status: 'ongoing', completion: 20 },
        { name: 'Quality Testing', cost: 7000000, status: 'completed', completion: 100 }
      ]
    },
    {
      id: 3,
      name: 'Sanitation',
      allocated: 32000000,
      spent: 26880000,
      remaining: 5120000,
      percentage: 84,
      color: '#10b981',
      projects: [
        { name: 'Waste Management', cost: 12000000, status: 'ongoing', completion: 70 },
        { name: 'Public Toilets', cost: 8000000, status: 'completed', completion: 100 },
        { name: 'Sewage Treatment', cost: 12000000, status: 'ongoing', completion: 55 }
      ]
    },
    {
      id: 4,
      name: 'Electricity',
      allocated: 65000000,
      spent: 19500000,
      remaining: 45500000,
      percentage: 30,
      color: '#f59e0b',
      projects: [
        { name: 'Smart Meters', cost: 25000000, status: 'ongoing', completion: 40 },
        { name: 'Solar Panels', cost: 20000000, status: 'planned', completion: 0 },
        { name: 'Grid Modernization', cost: 20000000, status: 'ongoing', completion: 25 }
      ]
    },
    {
      id: 5,
      name: 'Health',
      allocated: 45000000,
      spent: 31500000,
      remaining: 13500000,
      percentage: 70,
      color: '#ef4444',
      projects: [
        { name: 'Hospital Upgrades', cost: 20000000, status: 'ongoing', completion: 60 },
        { name: 'Ambulance Services', cost: 10000000, status: 'completed', completion: 100 },
        { name: 'Clinic Expansion', cost: 15000000, status: 'ongoing', completion: 45 }
      ]
    },
    {
      id: 6,
      name: 'Education',
      allocated: 35000000,
      spent: 31150000,
      remaining: 3850000,
      percentage: 89,
      color: '#8b5cf6',
      projects: [
        { name: 'School Renovation', cost: 15000000, status: 'completed', completion: 100 },
        { name: 'Smart Classrooms', cost: 12000000, status: 'ongoing', completion: 75 },
        { name: 'Digital Labs', cost: 8000000, status: 'ongoing', completion: 50 }
      ]
    }
  ],
  lastUpdated: new Date().toISOString()
};

module.exports = async (req, res) => {
  const { method, query } = req;
  const path = req.path.split('/');
  
  try {
    // GET all budget data
    if (method === 'GET' && !path[1]) {
      res.json(budgetData);
    }
    
    // GET department budget
    else if (method === 'GET' && path[1] === 'department') {
      const departmentName = decodeURIComponent(path[2]);
      const department = budgetData.departments.find(
        d => d.name.toLowerCase() === departmentName.toLowerCase()
      );
      
      if (!department) {
        return res.status(404).json({ error: 'Department not found' });
      }
      
      res.json(department);
    }
    
    // GET summary
    else if (method === 'GET' && path[1] === 'summary') {
      const totalAllocated = budgetData.departments.reduce((sum, d) => sum + d.allocated, 0);
      const totalSpent = budgetData.departments.reduce((sum, d) => sum + d.spent, 0);
      const overallPercentage = (totalSpent / totalAllocated) * 100;
      
      res.json({
        totalAllocated,
        totalSpent,
        overallPercentage: overallPercentage.toFixed(1),
        departmentsCount: budgetData.departments.length,
        year: budgetData.year
      });
    }
    
    // GET funding gap analysis
    else if (method === 'GET' && path[1] === 'analysis') {
      const analysis = budgetData.departments.map(dept => ({
        name: dept.name,
        allocated: dept.allocated,
        spent: dept.spent,
        percentage: dept.percentage,
        status: dept.percentage < 50 ? 'Underutilized' : dept.percentage > 80 ? 'On Track' : 'Moderate',
        recommendation: dept.percentage < 50 
          ? 'Increase spending to meet targets' 
          : dept.percentage > 80 
            ? 'Well utilized, consider additional allocation' 
            : 'On track with spending'
      }));
      
      res.json(analysis);
    }
    
    else {
      res.status(404).json({ error: 'Not found' });
    }
  } catch (error) {
    console.error('Budget error:', error);
    res.status(500).json({ error: error.message });
  }
};