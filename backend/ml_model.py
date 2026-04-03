import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler
from datetime import datetime, timedelta
import pickle
import json

class SurplusPredictionModel:
    """
    AI Model to predict food surplus in restaurants, stores, and farms
    """
    
    def __init__(self):
        self.model = GradientBoostingRegressor(
            n_estimators=100,
            learning_rate=0.1,
            max_depth=5,
            random_state=42
        )
        self.scaler = StandardScaler()
        self.is_trained = False
        
    def prepare_features(self, data):
        """
        Prepare features for prediction
        
        Features include:
        - Day of week
        - Month
        - Historical sales
        - Weather data
        - Local events
        - Inventory levels
        - Seasonal patterns
        """
        features = []
        
        for record in data:
            feature_vector = [
                record.get('day_of_week', 0),
                record.get('month', 0),
                record.get('avg_daily_sales', 0),
                record.get('current_inventory', 0),
                record.get('temperature', 20),
                record.get('is_weekend', 0),
                record.get('is_holiday', 0),
                record.get('local_event_score', 0),
                record.get('previous_waste', 0),
                record.get('days_until_expiry', 0)
            ]
            features.append(feature_vector)
        
        return np.array(features)
    
    def train(self, historical_data, surplus_labels):
        """
        Train the model on historical data
        
        Args:
            historical_data: List of dicts with features
            surplus_labels: Actual surplus amounts
        """
        X = self.prepare_features(historical_data)
        y = np.array(surplus_labels)
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        # Train model
        self.model.fit(X_scaled, y)
        self.is_trained = True
        
        return {
            'status': 'success',
            'samples_trained': len(X),
            'feature_importance': self.model.feature_importances_.tolist()
        }
    
    def predict_surplus(self, current_data):
        """
        Predict surplus food for upcoming days
        
        Args:
            current_data: Current business data
            
        Returns:
            Prediction with confidence score
        """
        if not self.is_trained:
            # Return mock prediction if not trained
            return self._generate_mock_prediction(current_data)
        
        X = self.prepare_features([current_data])
        X_scaled = self.scaler.transform(X)
        
        prediction = self.model.predict(X_scaled)[0]
        
        # Calculate confidence based on feature values
        confidence = self._calculate_confidence(current_data, prediction)
        
        return {
            'predicted_surplus_kg': max(0, prediction),
            'confidence_score': confidence,
            'prediction_date': datetime.now() + timedelta(days=1),
            'recommendations': self._generate_recommendations(prediction, current_data)
        }
    
    def predict_multiple_days(self, current_data, days=7):
        """
        Predict surplus for multiple upcoming days
        """
        predictions = []
        
        for day in range(1, days + 1):
            data = current_data.copy()
            data['days_ahead'] = day
            
            pred = self.predict_surplus(data)
            pred['day_offset'] = day
            pred['date'] = datetime.now() + timedelta(days=day)
            
            predictions.append(pred)
        
        return predictions
    
    def _calculate_confidence(self, data, prediction):
        """Calculate confidence score based on data quality and patterns"""
        confidence = 0.7  # Base confidence
        
        # Increase confidence if we have good historical data
        if data.get('historical_records', 0) > 30:
            confidence += 0.15
        
        # Increase confidence for consistent patterns
        if data.get('pattern_consistency', 0) > 0.8:
            confidence += 0.1
        
        # Decrease confidence for unusual conditions
        if data.get('is_holiday', 0) == 1:
            confidence -= 0.1
        
        return min(0.95, max(0.5, confidence))
    
    def _generate_recommendations(self, predicted_surplus, data):
        """Generate actionable recommendations based on prediction"""
        recommendations = []
        
        if predicted_surplus > 10:
            recommendations.append({
                'action': 'reduce_production',
                'priority': 'high',
                'description': f'Consider reducing production by {int(predicted_surplus * 0.7)}kg',
                'potential_savings': predicted_surplus * 5  # $5 per kg
            })
            
            recommendations.append({
                'action': 'contact_ngos',
                'priority': 'high',
                'description': 'Schedule pickup with local food banks',
                'estimated_impact': f'{int(predicted_surplus * 3)} meals'
            })
        
        if predicted_surplus > 5:
            recommendations.append({
                'action': 'discount_pricing',
                'priority': 'medium',
                'description': 'Offer 30-50% discount on items nearing expiry',
                'potential_revenue': predicted_surplus * 2.5
            })
        
        return recommendations
    
    def _generate_mock_prediction(self, data):
        """Generate mock prediction for demo purposes"""
        base_surplus = np.random.uniform(5, 25)
        
        return {
            'predicted_surplus_kg': base_surplus,
            'confidence_score': 0.82,
            'prediction_date': datetime.now() + timedelta(days=1),
            'recommendations': self._generate_recommendations(base_surplus, data),
            'breakdown_by_category': {
                'vegetables': base_surplus * 0.3,
                'dairy': base_surplus * 0.25,
                'bakery': base_surplus * 0.25,
                'prepared_food': base_surplus * 0.2
            }
        }
    
    def analyze_waste_patterns(self, historical_transactions):
        """
        Analyze historical waste patterns to identify trends
        """
        df = pd.DataFrame(historical_transactions)
        
        if df.empty:
            return self._mock_analysis()
        
        analysis = {
            'total_waste_kg': df['quantity'].sum(),
            'avg_daily_waste': df['quantity'].mean(),
            'waste_by_day': df.groupby('day_of_week')['quantity'].sum().to_dict(),
            'waste_by_category': df.groupby('category')['quantity'].sum().to_dict(),
            'trend': 'decreasing' if df['quantity'].iloc[-7:].mean() < df['quantity'].mean() else 'increasing',
            'peak_waste_days': df.groupby('day_of_week')['quantity'].mean().nlargest(3).index.tolist(),
            'estimated_cost': df['quantity'].sum() * 5,  # $5 per kg average
        }
        
        return analysis
    
    def _mock_analysis(self):
        """Mock analysis for demo"""
        return {
            'total_waste_kg': 245.5,
            'avg_daily_waste': 8.2,
            'waste_by_day': {
                'Monday': 45.2,
                'Tuesday': 32.1,
                'Wednesday': 28.5,
                'Thursday': 35.8,
                'Friday': 42.3,
                'Saturday': 38.6,
                'Sunday': 23.0
            },
            'waste_by_category': {
                'vegetables': 75.3,
                'dairy': 45.2,
                'bakery': 85.0,
                'prepared_food': 40.0
            },
            'trend': 'decreasing',
            'peak_waste_days': ['Monday', 'Friday', 'Saturday'],
            'estimated_cost': 1227.50
        }
    
    def optimize_inventory(self, current_inventory, predicted_demand, lead_time_days=3):
        """
        Optimize inventory levels to minimize waste
        """
        safety_stock = predicted_demand * 0.2  # 20% buffer
        reorder_point = (predicted_demand * lead_time_days) + safety_stock
        
        optimization = {
            'current_inventory': current_inventory,
            'predicted_demand': predicted_demand,
            'optimal_stock_level': predicted_demand * (lead_time_days + 1),
            'reorder_point': reorder_point,
            'reorder_quantity': max(0, reorder_point - current_inventory),
            'days_of_inventory': current_inventory / predicted_demand if predicted_demand > 0 else 0,
            'recommendations': []
        }
        
        if current_inventory > optimization['optimal_stock_level'] * 1.5:
            optimization['recommendations'].append({
                'action': 'Excess inventory detected',
                'suggestion': 'Consider promotional pricing or donation'
            })
        
        if current_inventory < reorder_point:
            optimization['recommendations'].append({
                'action': 'Reorder needed',
                'suggestion': f'Order {optimization["reorder_quantity"]:.1f} units'
            })
        
        return optimization
    
    def save_model(self, filepath='models/surplus_model.pkl'):
        """Save trained model to disk"""
        model_data = {
            'model': self.model,
            'scaler': self.scaler,
            'is_trained': self.is_trained
        }
        with open(filepath, 'wb') as f:
            pickle.dump(model_data, f)
        return {'status': 'success', 'filepath': filepath}
    
    def load_model(self, filepath='models/surplus_model.pkl'):
        """Load trained model from disk"""
        try:
            with open(filepath, 'rb') as f:
                model_data = pickle.load(f)
            self.model = model_data['model']
            self.scaler = model_data['scaler']
            self.is_trained = model_data['is_trained']
            return {'status': 'success'}
        except FileNotFoundError:
            return {'status': 'error', 'message': 'Model file not found'}


class FoodMatchingEngine:
    """
    AI Engine to match surplus food with recipients
    """
    
    def __init__(self):
        pass
    
    def find_best_matches(self, food_item, potential_recipients, max_distance_km=25):
        """
        Find best matching recipients for a food item
        
        Considers:
        - Distance
        - Recipient capacity
        - Food preferences
        - Historical success rate
        - Urgency (expiry time)
        """
        matches = []
        
        for recipient in potential_recipients:
            score = self._calculate_match_score(food_item, recipient, max_distance_km)
            
            if score > 0.3:  # Minimum threshold
                matches.append({
                    'recipient_id': recipient['id'],
                    'recipient_name': recipient['name'],
                    'recipient_type': recipient['type'],
                    'match_score': score,
                    'distance_km': recipient.get('distance', 0),
                    'estimated_pickup_time': self._estimate_pickup_time(recipient),
                    'capacity_available': recipient.get('capacity', 100),
                    'priority': self._calculate_priority(food_item, recipient)
                })
        
        # Sort by match score
        matches.sort(key=lambda x: x['match_score'], reverse=True)
        
        return matches[:10]  # Return top 10 matches
    
    def _calculate_match_score(self, food_item, recipient, max_distance_km):
        """Calculate compatibility score between food and recipient"""
        score = 1.0
        
        # Distance factor (closer is better)
        distance = recipient.get('distance', 0)
        if distance > max_distance_km:
            return 0
        score *= (1 - distance / max_distance_km) * 0.4
        
        # Capacity factor
        if recipient.get('capacity', 0) >= food_item.get('quantity', 0):
            score += 0.3
        else:
            score += 0.1
        
        # Food category preference
        if food_item.get('category') in recipient.get('preferred_categories', []):
            score += 0.2
        
        # Historical success rate
        score += recipient.get('success_rate', 0.5) * 0.1
        
        return min(1.0, score)
    
    def _estimate_pickup_time(self, recipient):
        """Estimate pickup time based on location and availability"""
        base_time = datetime.now() + timedelta(hours=2)
        return base_time.isoformat()
    
    def _calculate_priority(self, food_item, recipient):
        """Calculate urgency priority"""
        hours_until_expiry = (food_item.get('expiry_date', datetime.now() + timedelta(days=1)) - datetime.now()).total_seconds() / 3600
        
        if hours_until_expiry < 6:
            return 'urgent'
        elif hours_until_expiry < 24:
            return 'high'
        else:
            return 'normal'


# Example usage
if __name__ == "__main__":
    # Initialize model
    model = SurplusPredictionModel()
    
    # Example prediction
    current_data = {
        'day_of_week': 1,
        'month': 1,
        'avg_daily_sales': 150,
        'current_inventory': 200,
        'temperature': 22,
        'is_weekend': 0,
        'is_holiday': 0,
        'local_event_score': 0.3,
        'previous_waste': 12,
        'days_until_expiry': 2
    }
    
    prediction = model.predict_surplus(current_data)
    print("Surplus Prediction:", json.dumps(prediction, indent=2, default=str))