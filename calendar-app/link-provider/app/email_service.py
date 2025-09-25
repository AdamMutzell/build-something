# using flask_restful
from flask import Flask, jsonify, request
from flask_cors import CORS

from flask_restful import Resource, Api
import smtplib
from email.message import EmailMessage
import logging

# ...existing imports...
import os
import mysql.connector

# Helper to read Docker secrets
def get_secret(secret_path):
    try:
        with open(secret_path, 'r', encoding='utf-8') as f:
            return f.read().strip()
    except Exception as e:
        app.logger.error(f"Failed to read secret {secret_path}: {e}")
        return None

# Read secrets at startup
DB_USER = get_secret('/run/secrets/db_user')
DB_PASSWORD = get_secret('/run/secrets/db_password')
# creating the flask app
app = Flask(__name__)
CORS(app)
# Set up logging
logging.basicConfig(level=logging.INFO)
# creating an API object
api = Api(app)

class Hello(Resource):

    def get(self):
        app.logger.info("GET request received at Hello endpoint")
        return {'message': 'hello world'}

    def post(self):
        data = request.get_json()
        app.logger.info(f"POST request received at Hello endpoint with data: {data}")
        return {'data': data}, 201

class Square(Resource):
    def post(self):
        data = request.get_json()
        num = data.get('num', 0)
        app.logger.info(f"POST request received at Square endpoint with num: {num}")
        return jsonify({'square': num**2})

class Link(Resource):
    def get(self):
        return {'message': 'This is the Link endpoint'}
    
    def post(self):
        # Get a link to the page that displays the calendar events
        data = request.get_json()
        app.logger.info(f"POST request received at Link endpoint with data: {data}")
        return {'data': data}, 201


class FetchEvents(Resource):
    def __init__(self):
        self.conn = create_database_connection()
        self.cursor = self.conn.cursor()

    def get(self):
        return {'message': 'This is the FetchEvents endpoint'}
    
    def post(self):
        data = request.get_json()
        app.logger.info(f"GET request received at Database endpoint with data: {data}")
        get_event_query = "SELECT * FROM events WHERE creationId = %s"
        creation_id = data.get('creationId')
        self.cursor.execute(get_event_query, (creation_id,))
        events = self.cursor.fetchall()
        app.logger.info(f"Fetched events: {events}")
        formated_events = [self._format_db_items(event) for event in events]

        if formated_events:
            return {'data': str(formated_events)}, 200
        return {'error': 'Events not found'}, 404

    def _format_db_items(self, item):
        new_item = {
            'id': item[0],
            'title': item[1],
            'start': item[2].isoformat(),
            'end': item[3].isoformat(),
            'description': item[6],
            'creationId': item[4]
        }
        app.logger.info(f"Formatted DB item: {new_item}")
        return new_item 
            
class Database(Resource):
    def __init__(self):
        self.conn = create_database_connection()
        self.cursor = self.conn.cursor()
        self.base_url = os.getenv('EVENT_VIEW_URL', 'http://localhost:4200')
        
    def get(self):
        return {'message': 'This is the Database endpoint'}
    
    def post(self):
        # Add multiple calendar events to the database
        data = request.get_json()
        app.logger.info(f"\n POST request received at Database endpoint with data: {data}")
        
        if not isinstance(data, list):
            return {'error': 'Input data must be a list of events'}, 400
        
        add_event_query = ("INSERT INTO events "
                           "(title, start, end, description, creationId) "
                           "VALUES (%s, %s, %s, %s, %s)")
        
        creation_id = self._generate_unique_id()
        try:
            for event in data:
                add_event_data = (event['name'], event['start'], event['end'], event['description'], creation_id)
                app.logger.info(f"\n Adding event with creationId: {creation_id}")
                self.cursor.execute(add_event_query, add_event_data)
            
            self.conn.commit()
            app.logger.info("All events added to the database successfully")
            return {'message': 'Events added successfully', 'link': self._generate_link(creation_id)}, 201
        except mysql.connector.Error as err:
            app.logger.error(f"Error: {err}")
            self.conn.rollback()
            return {'error': str(err)}, 500
        
    def _generate_unique_id(self):
        self.cursor.execute("SELECT MAX(creationId) FROM events")
        max_id = self.cursor.fetchone()[0]
        return (max_id or 0) + 1

    def _generate_link(self, creation_id):
        base_url = self.base_url
        return f"{base_url}/{creation_id}"
    
# adding the defined resources along with their corresponding url
def create_database_connection():
    try:
        conn = mysql.connector.connect(
            host=os.getenv('DB_HOST'),
            user=DB_USER,
            database=os.getenv('DB_NAME'),
            password=DB_PASSWORD,
            port=os.getenv('DB_PORT')
        )
        if conn.is_connected():
            app.logger.info("Successfully connected to the database")
            return conn
        else:
            app.logger.error("Failed to connect to the database")
            return None
    except mysql.connector.Error as err:
        app.logger.error(f"Error: {err}")
        return None

def close_database_connection(conn):
    if conn and conn.is_connected():
        conn.close()
        app.logger.info("Database connection closed")

# driver function
if __name__ == '__main__':
    api.add_resource(Hello, '/')
    api.add_resource(Square, '/square/')
    api.add_resource(Link, '/link/')
    api.add_resource(Database, '/database/')
    api.add_resource(FetchEvents, '/fetch_events/')
    app.run(debug=True, host='0.0.0.0', port=31567)  # for link-provider