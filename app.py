"""
Maintenance Request Management System - Flask Backend with DynamoDB
Cloud DevOpsSec Project
"""

import os
import json
import logging
from datetime import datetime
from uuid import uuid4
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import boto3
from botocore.exceptions import ClientError
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

AWS_REGION = os.getenv('AWS_REGION', 'eu-north-1')
AWS_ACCESS_KEY = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')

# Initialize DynamoDB client
dynamodb = boto3.resource(
    'dynamodb',
    region_name=AWS_REGION,
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY
)

TABLE_NAME = 'maintenance_requests'
table = dynamodb.Table(TABLE_NAME)

# Routes

@app.route('/')
def index():
    """Serve the main page"""
    return render_template('index.html')

@app.route('/admin')
def admin():
    """Serve the admin dashboard page"""
    return render_template('admin.html')

@app.route('/api/requests', methods=['GET'])
def get_requests():
    """Retrieve all maintenance requests from DynamoDB"""
    try:
        logger.info("[v0] Fetching all requests from DynamoDB")
        response = table.scan()
        requests_data = response.get('Items', [])
        
        # Sort by created_at descending
        requests_data.sort(key=lambda x: x.get('created_at', ''), reverse=True)
        
        logger.info(f"[v0] Retrieved {len(requests_data)} requests")
        return jsonify(requests_data), 200
    except ClientError as e:
        logger.error(f"DynamoDB error fetching requests: {e}")
        return jsonify({'error': 'Failed to fetch requests'}), 500
    except Exception as e:
        logger.error(f"Error fetching requests: {e}")
        return jsonify({'error': 'Failed to fetch requests'}), 500

@app.route('/api/requests', methods=['POST'])
def create_request():
    """Create a new maintenance request in DynamoDB"""
    try:
        data = request.get_json()
        
        # Input validation
        if not data.get('title') or not data.get('description'):
            return jsonify({'error': 'Title and description are required'}), 400
        
        title = data.get('title', '').strip()
        description = data.get('description', '').strip()
        priority = data.get('priority', 'Medium')
        created_by = data.get('created_by', 'User').strip()
        
        # Validate input lengths
        if len(title) > 255 or len(title) < 3:
            return jsonify({'error': 'Title must be between 3 and 255 characters'}), 400
        if len(description) < 10:
            return jsonify({'error': 'Description must be at least 10 characters'}), 400
        
        # Validate priority
        valid_priorities = ['Low', 'Medium', 'High', 'Critical']
        if priority not in valid_priorities:
            return jsonify({'error': f'Invalid priority. Must be one of: {", ".join(valid_priorities)}'}), 400
        
        # Create new request
        request_id = str(uuid4())
        timestamp = datetime.utcnow().isoformat() + 'Z'
        
        new_request = {
            'id': request_id,
            'title': title,
            'description': description,
            'priority': priority,
            'status': 'Pending',
            'created_by': created_by,
            'created_at': timestamp,
            'updated_at': timestamp
        }
        
        # Put item in DynamoDB
        table.put_item(Item=new_request)
        
        logger.info(f"[v0] Created maintenance request ID: {request_id}")
        
        return jsonify(new_request), 201
    except ClientError as e:
        logger.error(f"DynamoDB error creating request: {e}")
        return jsonify({'error': 'Failed to create request'}), 500
    except Exception as e:
        logger.error(f"Error creating request: {e}")
        return jsonify({'error': 'Failed to create request'}), 500

@app.route('/api/requests/<request_id>', methods=['GET'])
def get_request(request_id):
    """Retrieve a specific maintenance request from DynamoDB"""
    try:
        logger.info(f"[v0] Fetching request ID: {request_id}")
        response = table.get_item(Key={'id': request_id})
        
        if 'Item' not in response:
            return jsonify({'error': 'Request not found'}), 404
        
        return jsonify(response['Item']), 200
    except ClientError as e:
        logger.error(f"DynamoDB error fetching request: {e}")
        return jsonify({'error': 'Failed to fetch request'}), 500
    except Exception as e:
        logger.error(f"Error fetching request: {e}")
        return jsonify({'error': 'Failed to fetch request'}), 500

@app.route('/api/requests/<request_id>', methods=['PUT'])
def update_request(request_id):
    """Update a maintenance request in DynamoDB"""
    try:
        data = request.get_json()
        
        logger.info(f"[v0] Updating request ID: {request_id}")
        
        # Check if request exists
        response = table.get_item(Key={'id': request_id})
        if 'Item' not in response:
            return jsonify({'error': 'Request not found'}), 404
        
        # Build update expression
        update_expressions = []
        expression_values = {}
        expression_names = {}

        # Title
        if 'title' in data:
            title = data['title'].strip()
            if len(title) < 3 or len(title) > 255:
                return jsonify({'error': 'Title must be between 3 and 255 characters'}), 400
            update_expressions.append('#title = :title')
            expression_names['#title'] = 'title'
            expression_values[':title'] = title
        
        # Description
        if 'description' in data:
            description = data['description'].strip()
            if len(description) < 10:
                return jsonify({'error': 'Description must be at least 10 characters'}), 400
            update_expressions.append('#description = :description')
            expression_names['#description'] = 'description'
            expression_values[':description'] = description
        
        # Status
        if 'status' in data:
            status = data['status'].strip()
            valid_statuses = ['Pending', 'In Progress', 'Resolved', 'Closed']
            if status not in valid_statuses:
                return jsonify({'error': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'}), 400
            update_expressions.append('#status = :status')
            expression_names['#status'] = 'status'
            expression_values[':status'] = status
        
        # Priority
        if 'priority' in data:
            priority = data['priority'].strip()
            valid_priorities = ['Low', 'Medium', 'High', 'Critical']
            if priority not in valid_priorities:
                return jsonify({'error': f'Invalid priority. Must be one of: {", ".join(valid_priorities)}'}), 400
            update_expressions.append('#priority = :priority')
            expression_names['#priority'] = 'priority'
            expression_values[':priority'] = priority
        
        if not update_expressions:
            return jsonify({'error': 'No fields to update'}), 400
        
        # Add updated_at timestamp
        update_expressions.append('#updated_at = :updated_at')
        expression_names['#updated_at'] = 'updated_at'
        expression_values[':updated_at'] = datetime.utcnow().isoformat() + 'Z'
        
        # Final update expression
        update_expression = "SET " + ", ".join(update_expressions)
        
        # Update item
        table.update_item(
            Key={'id': request_id},
            UpdateExpression=update_expression,
            ExpressionAttributeNames=expression_names,
            ExpressionAttributeValues=expression_values
        )
        
        logger.info(f"[v0] Updated request ID: {request_id}")
        return jsonify({'message': 'Request updated successfully'}), 200
    except ClientError as e:
        logger.error(f"DynamoDB error updating request: {e}")
        return jsonify({'error': 'Failed to update request'}), 500
    except Exception as e:
        logger.error(f"Error updating request: {e}")
        return jsonify({'error': 'Failed to update request'}), 500


@app.route('/api/requests/<request_id>', methods=['DELETE'])
def delete_request(request_id):
    """Delete a maintenance request from DynamoDB"""
    try:
        logger.info(f"[v0] Deleting request ID: {request_id}")
        
        # Check if request exists
        response = table.get_item(Key={'id': request_id})
        if 'Item' not in response:
            return jsonify({'error': 'Request not found'}), 404
        
        # Delete the item
        table.delete_item(Key={'id': request_id})
        
        logger.info(f"[v0] Deleted request ID: {request_id}")
        return jsonify({'message': 'Request deleted successfully'}), 200
    except ClientError as e:
        logger.error(f"DynamoDB error deleting request: {e}")
        return jsonify({'error': 'Failed to delete request'}), 500
    except Exception as e:
        logger.error(f"Error deleting request: {e}")
        return jsonify({'error': 'Failed to delete request'}), 500

@app.route('/api/admin/stats', methods=['GET'])
def get_stats():
    """Retrieve statistics about all maintenance requests"""
    try:
        logger.info("[v0] Fetching admin statistics")
        response = table.scan()
        requests_data = response.get('Items', [])
        
        # Calculate statistics
        total = len(requests_data)
        pending = len([r for r in requests_data if r.get('status') == 'Pending'])
        in_progress = len([r for r in requests_data if r.get('status') == 'In Progress'])
        resolved = len([r for r in requests_data if r.get('status') == 'Resolved'])
        closed = len([r for r in requests_data if r.get('status') == 'Closed'])
        
        # Count by priority
        critical = len([r for r in requests_data if r.get('priority') == 'Critical'])
        high = len([r for r in requests_data if r.get('priority') == 'High'])
        medium = len([r for r in requests_data if r.get('priority') == 'Medium'])
        low = len([r for r in requests_data if r.get('priority') == 'Low'])
        
        stats = {
            'total': total,
            'pending': pending,
            'in_progress': in_progress,
            'resolved': resolved,
            'closed': closed,
            'critical': critical,
            'high': high,
            'medium': medium,
            'low': low
        }
        
        logger.info(f"[v0] Statistics calculated: {stats}")
        return jsonify(stats), 200
    except Exception as e:
        logger.error(f"Error fetching statistics: {e}")
        return jsonify({'error': 'Failed to fetch statistics'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint for monitoring"""
    try:
        logger.info("[v0] Health check endpoint called")
        # Test DynamoDB connection
        table.table_status
        return jsonify({
            'status': 'healthy',
            'timestamp': datetime.utcnow().isoformat() + 'Z',
            'database': 'DynamoDB',
            'region': AWS_REGION
        }), 200
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return jsonify({'status': 'unhealthy', 'error': str(e)}), 500

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    logger.error(f"Internal server error: {error}")
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    logger.info(f"[v0] Starting Flask app with DynamoDB in region: {AWS_REGION}")
    # Run Flask app
    debug_mode = os.getenv('FLASK_ENV', 'production') == 'development'
    app.run(host='0.0.0.0', port=5000, debug=debug_mode)
