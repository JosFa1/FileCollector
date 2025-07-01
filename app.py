from flask import Flask, render_template, request, jsonify
from file_scanner import collect_files
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/scan', methods=['POST'])
def scan():
    data = request.get_json()
    folder = data.get('folder')
    extensions = data.get('extensions')

    if not folder or not extensions:
        return jsonify({'error': 'Missing folder or extensions'}), 400
    if not os.path.isdir(folder):
        return jsonify({'error': 'Invalid folder path'}), 400

    result = collect_files(folder, extensions)

    if len(result) == 0:
        return jsonify({'error': 'No matching files found'}), 404
    if result.count('\n\n') + 1 > 1000:
        return jsonify({'warning': 'too_many_files', 'count': result.count('\n\n') + 1})

    return jsonify({'data': result})

if __name__ == '__main__':
    app.run(debug=True)
