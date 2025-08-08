from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import os
from datetime import datetime
import json

app = Flask(__name__)
app.secret_key = 'disktools_secret_key_2024'

# Database initialization
def init_db():
    conn = sqlite3.connect('disktools.db')
    c = conn.cursor()
    
    # Users table
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  username TEXT UNIQUE NOT NULL,
                  email TEXT UNIQUE NOT NULL,
                  password_hash TEXT NOT NULL,
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  last_login TIMESTAMP,
                  preferences TEXT DEFAULT '{}')''')
    
    # Tools usage table
    c.execute('''CREATE TABLE IF NOT EXISTS tools_usage
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  user_id INTEGER,
                  tool_name TEXT NOT NULL,
                  usage_count INTEGER DEFAULT 1,
                  last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  settings_json TEXT DEFAULT '{}',
                  FOREIGN KEY (user_id) REFERENCES users (id))''')
    
    # User data table
    c.execute('''CREATE TABLE IF NOT EXISTS user_data
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  user_id INTEGER,
                  tool_type TEXT NOT NULL,
                  data_content TEXT,
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  FOREIGN KEY (user_id) REFERENCES users (id))''')
    
    conn.commit()
    conn.close()

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/tools/word-counter')
def word_counter():
    return render_template('tools/word-counter.html')

@app.route('/tools/password-manager')
def password_manager():
    return render_template('tools/password-manager.html')

@app.route('/tools/flashcard-maker')
def flashcard_maker():
    return render_template('tools/flashcard-maker.html')

@app.route('/tools/note-taking')
def note_taking():
    return render_template('tools/note-taking.html')

@app.route('/sw.js')
def service_worker():
    return app.send_static_file('sw.js')

@app.route('/tools/<tool_name>')
def tool_page(tool_name):
    # List of available tools
    available_tools = [
        'gpa-calculator', 'study-planner', 'assignment-tracker', 'grade-tracker',
        'timetable-generator', 'exam-countdown', 'course-credit-calculator',
        'pomodoro-timer', 'habit-tracker', 'goal-setter', 'daily-planner',
        'focus-mode', 'mind-map-creator', 'pdf-toolkit', 'image-editor',
        'qr-code-generator', 'password-manager', 'unit-converter', 'file-organizer',
        'citation-generator', 'plagiarism-detector', 'word-counter', 'grammar-checker',
        'bibliography-manager', 'research-organizer'
    ]
    
    if tool_name in available_tools:
        return render_template(f'tools/{tool_name}.html', tool_name=tool_name)
    else:
        return redirect(url_for('index'))

@app.route('/api/tools/<tool_name>', methods=['POST'])
def api_tool(tool_name):
    data = request.get_json()
    
    # Handle different tool APIs
    if tool_name == 'gpa-calculator':
        return calculate_gpa(data)
    elif tool_name == 'pomodoro-timer':
        return handle_pomodoro(data)
    elif tool_name == 'unit-converter':
        return convert_units(data)
    # Add more tool handlers as needed
    
    return jsonify({'error': 'Tool not found'}), 404

def calculate_gpa(data):
    """Calculate GPA based on grades and credit hours"""
    try:
        courses = data.get('courses', [])
        total_points = 0
        total_credits = 0
        
        grade_points = {
            'A+': 4.0, 'A': 4.0, 'A-': 3.7,
            'B+': 3.3, 'B': 3.0, 'B-': 2.7,
            'C+': 2.3, 'C': 2.0, 'C-': 1.7,
            'D+': 1.3, 'D': 1.0, 'F': 0.0
        }
        
        for course in courses:
            grade = course.get('grade', '').upper()
            credits = float(course.get('credits', 0))
            
            if grade in grade_points:
                total_points += grade_points[grade] * credits
                total_credits += credits
        
        gpa = total_points / total_credits if total_credits > 0 else 0
        
        return jsonify({
            'gpa': round(gpa, 2),
            'total_credits': total_credits,
            'total_points': round(total_points, 2)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

def handle_pomodoro(data):
    """Handle Pomodoro timer operations"""
    action = data.get('action')
    
    if action == 'start':
        duration = data.get('duration', 25)  # Default 25 minutes
        return jsonify({
            'status': 'started',
            'duration': duration,
            'start_time': datetime.now().isoformat()
        })
    elif action == 'pause':
        return jsonify({'status': 'paused'})
    elif action == 'reset':
        return jsonify({'status': 'reset'})
    
    return jsonify({'error': 'Invalid action'}), 400

def convert_units(data):
    """Handle unit conversions"""
    from_unit = data.get('from_unit')
    to_unit = data.get('to_unit')
    value = float(data.get('value', 0))
    category = data.get('category')
    
    # Length conversions
    length_conversions = {
        'mm': 1, 'cm': 10, 'm': 1000, 'km': 1000000,
        'in': 25.4, 'ft': 304.8, 'yd': 914.4, 'mi': 1609344
    }
    
    # Weight conversions
    weight_conversions = {
        'mg': 1, 'g': 1000, 'kg': 1000000,
        'oz': 28349.5, 'lb': 453592
    }
    
    conversions = {
        'length': length_conversions,
        'weight': weight_conversions
    }
    
    if category in conversions:
        conv_table = conversions[category]
        if from_unit in conv_table and to_unit in conv_table:
            # Convert to base unit, then to target unit
            base_value = value * conv_table[from_unit]
            result = base_value / conv_table[to_unit]
            
            return jsonify({
                'result': round(result, 6),
                'from_unit': from_unit,
                'to_unit': to_unit,
                'original_value': value
            })
    
    return jsonify({'error': 'Conversion not supported'}), 400

if __name__ == '__main__':
    init_db()
    app.run(debug=True, host='0.0.0.0', port=5000)
