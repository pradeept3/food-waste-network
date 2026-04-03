/**
 * Historical Food Waste Data Utility
 * Loads and processes historical waste data for charts and comparisons
 */

let historicalDataCache = null;

/**
 * Load historical waste data from JSON file
 */
export const loadHistoricalData = async () => {
  if (historicalDataCache) {
    return historicalDataCache;
  }

  try {
    const response = await fetch('/historical_waste_data.json');
    if (!response.ok) {
      throw new Error(`Failed to load historical data: ${response.statusText}`);
    }
    historicalDataCache = await response.json();
    return historicalDataCache;
  } catch (error) {
    console.error('Error loading historical data:', error);
    // Return empty structure if file not found
    return { historical_waste_data: {} };
  }
};

/**
 * Get global annual waste trend data for charts
 */
export const getGlobalWasteTrend = async () => {
  const data = await loadHistoricalData();
  return data.historical_waste_data?.global_annual_waste || [];
};

/**
 * Get US vs Global comparison data
 */
export const getUSGlobalComparison = async () => {
  const data = await loadHistoricalData();
  const waste = data.historical_waste_data?.global_annual_waste || [];
  
  return waste.map(item => ({
    year: item.year,
    global: item.total_waste_million_tons,
    us: item.us_waste_million_tons,
    percentage_of_supply: item.percent_of_food_supply
  }));
};

/**
 * Get waste breakdown by source
 */
export const getWasteBySource = async () => {
  const data = await loadHistoricalData();
  const source = data.historical_waste_data?.waste_by_source_us || {};
  
  return Object.entries(source).map(([key, value]) => ({
    name: key.replace(/_/g, ' ').toUpperCase(),
    percentage: value.percentage,
    amount: value.million_tons,
    growth: value.annual_growth
  }));
};

/**
 * Get waste breakdown by food type
 */
export const getWasteByFoodType = async () => {
  const data = await loadHistoricalData();
  const types = data.historical_waste_data?.waste_by_food_type || {};
  
  return Object.entries(types).map(([key, value]) => ({
    name: key.replace(/_/g, ' ').toUpperCase(),
    amount: value.million_tons,
    percentage: value.percentage,
    trend: value.trend
  }));
};

/**
 * Get waste breakdown by lifecycle stage
 */
export const getWasteByStage = async () => {
  const data = await loadHistoricalData();
  return data.historical_waste_data?.waste_by_stage || [];
};

/**
 * Get economic impact over time
 */
export const getEconomicImpact = async () => {
  const data = await loadHistoricalData();
  return data.historical_waste_data?.economic_impact?.annual || [];
};

/**
 * Get greenhouse gas emissions trend
 */
export const getEmissionsTrend = async () => {
  const data = await loadHistoricalData();
  const emissions = data.historical_waste_data?.environmental_impact?.greenhouse_gas_emissions || [];
  
  return emissions.map(item => ({
    year: item.year,
    co2_billion_tons: item.co2_equivalent_billion_tons,
    percentage_of_total: item.percentage_of_total_emissions
  }));
};

/**
 * Get water usage trend
 */
export const getWaterUsageTrend = async () => {
  const data = await loadHistoricalData();
  const water = data.historical_waste_data?.environmental_impact?.water_usage || [];
  
  return water.map(item => ({
    year: item.year,
    cubic_km: item.cubic_kilometers,
    percentage_of_freshwater: item.percentage_of_freshwater
  }));
};

/**
 * Get major waste recovery organizations
 */
export const getRecoveryOrganizations = async () => {
  const data = await loadHistoricalData();
  return data.historical_waste_data?.waste_recovery_organizations || [];
};

/**
 * Get digital solution platform impact
 */
export const getDigitalSolutionImpact = async () => {
  const data = await loadHistoricalData();
  return data.historical_waste_data?.digital_solution_impact?.platforms || [];
};

/**
 * Get digital solution impact summary
 */
export const getDigitalSolutionSummary = async () => {
  const data = await loadHistoricalData();
  return data.historical_waste_data?.digital_solution_impact?.impact_summary || {};
};

/**
 * Get waste reduction opportunity areas
 */
export const getReductionOpportunities = async () => {
  const data = await loadHistoricalData();
  return data.historical_waste_data?.reduction_opportunity_areas || [];
};

/**
 * Get sample organization baseline data (monthly trend)
 */
export const getSampleBaselineData = async () => {
  const data = await loadHistoricalData();
  return data.historical_waste_data?.sample_organization_baseline || {};
};

/**
 * Calculate benchmark comparison for user data
 * @param userWasteKg - User's monthly waste in kg
 * @param organizationType - Type of organization (household, restaurant, etc.)
 */
export const calculateBenchmark = async (userWasteKg, organizationType = 'household') => {
  const data = await loadHistoricalData();
  const baseline = data.historical_waste_data?.sample_organization_baseline?.monthly_trend_kg || [];
  
  if (baseline.length === 0) {
    return {
      comparison: 'no_data',
      message: 'Benchmark data not available'
    };
  }

  const avgBaselineWaste = baseline.reduce((sum, m) => sum + m.waste_kg, 0) / baseline.length;
  const avgUserWaste = userWasteKg;
  const percentileRank = ((avgBaselineWaste - avgUserWaste) / avgBaselineWaste * 100).toFixed(1);

  return {
    user_kg: avgUserWaste,
    baseline_kg: avgBaselineWaste,
    percentile_rank: percentileRank,
    better_than_average: avgUserWaste < avgBaselineWaste,
    reduction_potential: Math.max(0, ((avgBaselineWaste - avgUserWaste) / avgBaselineWaste * 100)).toFixed(1)
  };
};

/**
 * Get impact metrics for user data
 * @param wasteKg - Waste amount in kg
 */
export const getImpactMetrics = (wasteKg) => {
  // Based on average impact per kg of food waste diverted
  const co2_kg_per_food_kg = 0.5;
  const water_liters_per_food_kg = 0.75;
  const meals_per_food_kg = 0.77;
  const economic_value_per_food_kg = 0.83;
  const land_sqm_per_food_kg = 0.064;

  return {
    co2_saved_kg: (wasteKg * co2_kg_per_food_kg).toFixed(2),
    water_saved_liters: (wasteKg * water_liters_per_food_kg).toFixed(0),
    meals_provided: Math.floor(wasteKg * meals_per_food_kg),
    economic_value: (wasteKg * economic_value_per_food_kg).toFixed(2),
    land_saved_sqm: (wasteKg * land_sqm_per_food_kg).toFixed(0)
  };
};

/**
 * Get trend summary for dashboard
 */
export const getTrendSummary = async () => {
  const data = await loadHistoricalData();
  const globalWaste = data.historical_waste_data?.global_annual_waste || [];
  
  if (globalWaste.length < 2) {
    return null;
  }

  const latest = globalWaste[globalWaste.length - 1];
  const previous = globalWaste[globalWaste.length - 2];
  
  const wasteChange = ((latest.total_waste_million_tons - previous.total_waste_million_tons) / previous.total_waste_million_tons * 100).toFixed(1);
  const supplyChange = ((latest.percent_of_food_supply - previous.percent_of_food_supply) / previous.percent_of_food_supply * 100).toFixed(1);

  return {
    current_year: latest.year,
    global_waste_mt: latest.total_waste_million_tons,
    us_waste_mt: latest.us_waste_million_tons,
    percent_of_supply: latest.percent_of_food_supply,
    waste_change_percent: wasteChange,
    supply_change_percent: supplyChange,
    trend: wasteChange > 0 ? 'increasing' : 'decreasing'
  };
};

export default {
  loadHistoricalData,
  getGlobalWasteTrend,
  getUSGlobalComparison,
  getWasteBySource,
  getWasteByFoodType,
  getWasteByStage,
  getEconomicImpact,
  getEmissionsTrend,
  getWaterUsageTrend,
  getRecoveryOrganizations,
  getDigitalSolutionImpact,
  getDigitalSolutionSummary,
  getReductionOpportunities,
  getSampleBaselineData,
  calculateBenchmark,
  getImpactMetrics,
  getTrendSummary
};
